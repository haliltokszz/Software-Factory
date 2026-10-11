import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { recordCheck } from './record-check.mjs';
function fixture(t){const cwd=mkdtempSync(join(tmpdir(),'factory-check-'));t.after(()=>rmSync(cwd,{recursive:true,force:true}));const git=(args)=>{const r=spawnSync('rtk',['proxy','git',...args],{cwd,encoding:'utf8',shell:false});assert.equal(r.status,0,r.stderr);return r.stdout;};git(['init']);writeFileSync(join(cwd,'.gitignore'),'runs/\n');writeFileSync(join(cwd,'app.txt'),'baseline');git(['add','.gitignore','app.txt']);git(['-c','user.name=Factory Fixture','-c','user.email=fixture@example.invalid','commit','-m','fixture']);return {cwd,git,input:{checkId:'test',issue:{repository:'owner/factory',number:1},packageVersion:'1',repository:'owner/app',cwd,args:['proxy','node','-e','console.log("verified")'],outputDirectory:join(cwd,'runs'),timeoutMs:10000}};}
test('captures actual exit output hash and commit',async t=>{const {input}=fixture(t),r=await recordCheck(input);assert.equal(r.exitCode,0);assert.equal(r.cleanBefore,true);assert.equal(r.cleanAfter,true);assert.equal(r.beforeSha,r.afterSha);const output=readFileSync(r.outputPath);assert.match(output.toString(),/verified/);assert.equal(r.outputSha256,createHash('sha256').update(output).digest('hex'));});
test('records a failing command instead of claiming pass',async t=>{const {input}=fixture(t);const r=await recordCheck({...input,args:['proxy','node','-e','process.exit(7)']});assert.equal(r.exitCode,7);});
test('records dirty checkout without discarding changes',async t=>{const {input,cwd}=fixture(t);writeFileSync(join(cwd,'app.txt'),'uncommitted');const r=await recordCheck(input);assert.equal(r.cleanBefore,false);assert.equal(readFileSync(join(cwd,'app.txt'),'utf8'),'uncommitted');});
test('detects a commit changed by verification command',async t=>{const {input}=fixture(t);const code='require("node:child_process").spawnSync("rtk",["proxy","git","-c","user.name=Fixture","-c","user.email=fixture@example.invalid","commit","--allow-empty","-m","during-check"],{shell:false})';const r=await recordCheck({...input,args:['proxy','node','-e',code]});assert.notEqual(r.beforeSha,r.afterSha);});
test('passes metacharacters literally without shell execution',async t=>{const {input}=fixture(t);const r=await recordCheck({...input,args:['proxy','node','-e','console.log(process.argv[1])','literal; $(ignored) & value']});assert.equal(r.exitCode,0);assert.match(readFileSync(r.outputPath,'utf8'),/literal; \$\(ignored\) & value/);});
