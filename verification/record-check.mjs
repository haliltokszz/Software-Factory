import {spawn,spawnSync} from 'node:child_process';
import {mkdirSync,openSync,closeSync,appendFileSync,readFileSync,writeFileSync,realpathSync} from 'node:fs';
import {resolve,join,isAbsolute} from 'node:path';
import {randomUUID,createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';

function git(cwd,args) {
  const run=spawnSync('rtk',['proxy','git',...args],{cwd,encoding:'utf8',shell:false,windowsHide:true});
  if (run.error || run.status!==0) throw new Error('Git snapshot failed: '+(run.error?.message ?? run.stderr));
  return run.stdout.trim();
}

/** Records one already-authorized command. Does not select jobs or grant permissions. */
export async function recordCheck(input) {
  if (!input || !isAbsolute(input.cwd ?? '') || !isAbsolute(input.outputDirectory ?? '') || !Array.isArray(input.args) || input.args.length<2 || input.args[0]!=='proxy' || input.args.some(x=>typeof x!=='string' || x.includes('\0')) || !input.checkId || !input.issue || !input.packageVersion || !input.repository) throw new Error('invalid record-check input');
  const timeoutMs=input.timeoutMs ?? 600000;
  if (!Number.isInteger(timeoutMs) || timeoutMs<1) throw new Error('invalid timeoutMs');
  const cwd=realpathSync(input.cwd);
  mkdirSync(input.outputDirectory,{recursive:true});
  const outputPath=join(realpathSync(input.outputDirectory),randomUUID()+'.txt');
  const beforeSha=git(cwd,['rev-parse','HEAD']),cleanBefore=git(cwd,['status','--porcelain']).length===0;
  const startedAt=new Date().toISOString();
  const fd=openSync(outputPath,'wx');
  let timedOut=false;
  const exitCode=await new Promise(resolveExit=>{
    const child=spawn('rtk',input.args,{cwd,shell:false,stdio:['ignore',fd,fd],windowsHide:true});
    let error=null;
    const timer=setTimeout(()=>{
      timedOut=true;
      if (process.platform==='win32' && child.pid) {
        const killed=spawnSync('rtk',['proxy','taskkill','/PID',String(child.pid),'/T','/F'],{shell:false,encoding:'utf8',windowsHide:true});
        if (killed.status!==0) child.kill();
      } else child.kill('SIGKILL');
    },timeoutMs);
    child.once('error',value=>{error=value;});
    child.once('close',code=>{clearTimeout(timer);closeSync(fd);if(error) appendFileSync(outputPath,'\n'+error.message+'\n');resolveExit(code);});
  });
  const endedAt=new Date().toISOString();
  const afterSha=git(cwd,['rev-parse','HEAD']),cleanAfter=git(cwd,['status','--porcelain']).length===0;
  return {checkId:input.checkId,issue:input.issue,packageVersion:input.packageVersion,repository:input.repository,cwd,commandArgs:[...input.args],startedAt,endedAt,beforeSha,afterSha,cleanBefore,cleanAfter,exitCode,timedOut,outputPath,outputSha256:createHash('sha256').update(readFileSync(outputPath)).digest('hex')};
}

async function main() {
  try {
    if (process.argv.length!==4 || process.argv[2]!=='--input') throw new Error('usage: --input <json>');
    const input=JSON.parse(readFileSync(process.argv[3],'utf8'));
    const record=await recordCheck(input);
    const recordPath=resolve(input.outputDirectory,record.outputPath.split(/[\\/]/).at(-1).replace(/\.txt$/,'.json'));
    writeFileSync(recordPath,JSON.stringify(record,null,2)+'\n',{flag:'wx'});
    console.log(recordPath);
    process.exitCode=record.exitCode===0 && !record.timedOut ? 0 : 1;
  } catch (error) {console.error(error.message);process.exitCode=2;}
}
if (process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) await main();
