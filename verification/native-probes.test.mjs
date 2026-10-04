import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,symlinkSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {runNativeProbes} from './native-probes.mjs';
function setup(t) {
  const root=mkdtempSync(join(tmpdir(),'factory-probes-'));
  t.after(()=>rmSync(root,{recursive:true,force:true}));
  const factoryRoot=join(root,'factory'),fixtureRoot=join(factoryRoot,'work','permission-fixture');
  mkdirSync(fixtureRoot,{recursive:true});
  return {root,factoryRoot,fixtureRoot,permissionProfile:'factory-nonexistent-profile-test',configProfile:null};
}
test('refuses fixture outside factory work directory',async t=>{
  const input=setup(t),outside=join(input.root,'outside');
  mkdirSync(outside);writeFileSync(join(outside,'sentinel.txt'),'preserve');
  await assert.rejects(runNativeProbes({...input,fixtureRoot:outside}),/fixture.*scope/i);
  assert.equal(readFileSync(join(outside,'sentinel.txt'),'utf8'),'preserve');
});
test('rejects junction escape',async t=>{
  const input=setup(t),outside=join(input.root,'outside'),alias=join(input.factoryRoot,'work','escape');
  mkdirSync(outside);writeFileSync(join(outside,'sentinel.txt'),'preserve');
  symlinkSync(outside,alias,process.platform==='win32'?'junction':'dir');
  await assert.rejects(runNativeProbes({...input,fixtureRoot:alias}),/fixture.*scope/i);
  assert.equal(readFileSync(join(outside,'sentinel.txt'),'utf8'),'preserve');
});
test('does not report unsupported enforcement as pass',async t=>{
  const input=setup(t),actual=await runNativeProbes(input);
  assert.deepEqual(actual.passed,[]);
  assert.ok(actual.unsupported.length>0);
  assert.ok(actual.records.length>0);
});
