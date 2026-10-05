import {spawnSync} from 'node:child_process';
import {mkdirSync,writeFileSync,readFileSync,existsSync,realpathSync} from 'node:fs';
import {join,resolve,dirname,relative,isAbsolute} from 'node:path';
import {pathToFileURL} from 'node:url';
import {randomUUID} from 'node:crypto';

const canonical = value => {const path=realpathSync(value);return process.platform==='win32'?path.toLowerCase():path;};
const within = (base,path) => {const rel=relative(base,path);return rel==='' || (!isAbsolute(rel) && rel!=='..' && !rel.startsWith('..'+(process.platform==='win32'?'\\':'/')));};

function validateFixture(input) {
  if (!input || !isAbsolute(input.factoryRoot ?? '') || !isAbsolute(input.fixtureRoot ?? '') || !input.permissionProfile) throw new Error('fixture scope requires absolute roots and a permission profile');
  const factory=canonical(input.factoryRoot),fixture=canonical(input.fixtureRoot);
  const expected=resolve(factory,'work','permission-fixture');
  if (fixture!==expected || !within(factory,fixture)) throw new Error('fixture outside factory work scope');
  return {factory,fixture};
}

function safeTarget(base,path) {
  let parent=path;
  while(!existsSync(parent)) {
    const next=dirname(parent);
    if (next===parent) throw new Error('fixture scope cannot be resolved');
    parent=next;
  }
  if (!within(base,canonical(parent))) throw new Error('fixture target escapes canonical scope');
}

const protectedFiles=['app/blocked.txt','AGENTS.md','.codex/config.toml','.github/workflows/dummy.yml','CODEOWNERS','secrets/dummy.txt'];
const probes=[
  {id:'allowed-write',file:'app/allowed.txt',read:false,allow:true},
  ...protectedFiles.filter(p=>!p.startsWith('secrets')).map((file,i)=>({id:'protected-'+i,file,read:false,allow:false})),
  {id:'secret-read',file:'secrets/dummy.txt',read:true,allow:false},
  {id:'case-alias',file:'agents.md',read:false,allow:false},
  {id:'dotdot-alias',file:'app/../AGENTS.md',read:false,allow:false},
  {id:'outside-scope',file:'../outside.txt',read:false,allow:false}
];

/** Disposable filesystem probes only. Never starts workers, changes config or grants authority. */
export async function runNativeProbes(input) {
  const {factory,fixture}=validateFixture(input);
  const outputDirectory=join(factory,'verification','runs','native-controls');
  safeTarget(factory,outputDirectory);
  mkdirSync(outputDirectory,{recursive:true});
  const results={passed:[],failed:[],unsupported:[],records:[]};
  const files=['app/allowed.txt',...protectedFiles];
  // Validate all existing ancestors before any fixture writes.
  for(const file of files) safeTarget(fixture,join(fixture,file));
  safeTarget(factory,join(fixture,'../outside.txt'));
  for(const file of files) {
    const target=join(fixture,file);
    mkdirSync(dirname(target),{recursive:true});
    if (!existsSync(target)) writeFileSync(target,'factory dummy sentinel\n',{flag:'wx'});
  }
  const outside=join(fixture,'../outside.txt');
  if(!existsSync(outside)) writeFileSync(outside,'factory dummy outside\n',{flag:'wx'});
  for(const probe of probes) {
    if(probe.id==='case-alias' && process.platform!=='win32') {results.unsupported.push('case-alias: case-insensitive filesystem not observed');continue;}
    const target=join(fixture,probe.file);
    const before=existsSync(target)?readFileSync(target):null;
    const args=['proxy','codex','sandbox','-C',factory];
    if(input.configProfile) args.push('-p',input.configProfile);
    const payload='native probe '+randomUUID()+'\n';
    args.push('-P',input.permissionProfile,'rtk','proxy','node',join(factory,'verification','native-probes.mjs'),'--probe',probe.id,'--factory',factory,'--fixture',fixture,'--payload',payload);
    const run=spawnSync('rtk',args,{cwd:factory,shell:false,encoding:'utf8',timeout:60000,windowsHide:true});
    const output=(run.stdout??'')+(run.stderr??'')+(run.error?'\n'+run.error.message:'');
    const path=join(outputDirectory,probe.id+'.json');
    const after=existsSync(target)?readFileSync(target):null;
    const unchanged=before===null?after===null:after!==null && before.equals(after);
    let observed=null;
    try {observed=JSON.parse((run.stdout??'').trim().split(/\r?\n/).at(-1));} catch {}
    writeFileSync(path,JSON.stringify({id:probe.id,args,expected:probe.allow?'allow':'deny',exitCode:run.status,output,unchanged,observed},null,2)+'\n');
    results.records.push(path);
    if (!observed || observed.id!==probe.id || !['allowed','denied','error'].includes(observed.result)) {
      results.unsupported.push(probe.id+': native execution/enforcement unavailable');
      // Cannot infer a denial from a startup failure. Remaining probes are unobserved.
      for(const remaining of probes.slice(probes.indexOf(probe)+1)) results.unsupported.push(remaining.id+': not observed after native startup failure');
      break;
    }
    const pass=probe.allow ? observed.result==='allowed' && run.status===0 && after?.equals(Buffer.from(payload)) : observed.result==='denied' && run.status===3 && unchanged;
    (pass?results.passed:results.failed).push(probe.id);
  }
  // A command sandbox cannot prove the native agent's tool surface, ownership or job handoff.
  results.unsupported.push('native app/MCP/browser/tool allowlist not observed','two-job permission binding and native task ownership not observed','junction alias denial under native sandbox not observed','Git/default-branch remote boundary not observed');
  writeFileSync(join(outputDirectory,'summary.json'),JSON.stringify(results,null,2)+'\n');
  return results;
}

function child(args) {
  const id=args[args.indexOf('--probe')+1];
  const probe=probes.find(p=>p.id===id);
  const factoryRoot=args[args.indexOf('--factory')+1],fixtureRoot=args[args.indexOf('--fixture')+1];
  const {fixture}=validateFixture({factoryRoot,fixtureRoot,permissionProfile:'child'});
  if(!probe) throw new Error('unknown probe');
  const payload=args[args.indexOf('--payload')+1];
  if(!probe.read && (!args.includes('--payload') || typeof payload!=='string' || payload.length===0)) throw new Error('write probe payload missing');
  const target=join(fixture,probe.file);
  try {
    if(probe.read) readFileSync(target);else writeFileSync(target,payload);
    console.log(JSON.stringify({id,result:'allowed'}));process.exitCode=0;
  } catch(error) {
    const denied=['EACCES','EPERM'].includes(error.code);
    console.log(JSON.stringify({id,result:denied?'denied':'error',code:error.code}));
    process.exitCode=denied?3:4;
  }
}

async function main() {
  try {
    const args=process.argv.slice(2);
    if(args.includes('--probe')) {child(args);return;}
    if(args.length!==2 || args[0]!=='--input') throw new Error('usage: --input <json>');
    const results=await runNativeProbes(JSON.parse(readFileSync(args[1],'utf8')));
    console.log(JSON.stringify(results,null,2));
    process.exitCode=results.failed.length || results.unsupported.length ? 1 : 0;
  } catch(error) {console.error(error.message);process.exitCode=2;}
}
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) await main();
