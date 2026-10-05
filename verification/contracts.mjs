import {readFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';

/** @typedef {{ok:boolean, errors:string[]}} Validation */
const stages = new Set(['intake','research','needs-investment','design','needs-design','ready','building','verifying','reviewing','needs-release','measuring','done','blocked','parked','stopped']);
const object = x => x !== null && typeof x === 'object' && !Array.isArray(x);
const text = x => typeof x === 'string' && x.trim().length > 0;
const nullableText = x => x === null || text(x);
const repoName = x => typeof x === 'string' && /^[\w.-]+\/[\w.-]+$/.test(x);
const hash = (x,n) => typeof x === 'string' && new RegExp('^[a-f0-9]{'+n+'}$').test(x);
const issueId = x => object(x) && repoName(x.repository) && Number.isInteger(x.number) && x.number > 0;
const sameIssue = (a,b) => issueId(a) && issueId(b) && a.repository === b.repository && a.number === b.number;
const strings = x => Array.isArray(x) && x.length > 0 && x.every(text);
const unique = x => new Set(x).size === x.length;
const relativePath = x => text(x) && !/^(?:[a-z]:|[\\/])|\0/i.test(x) && !x.split(/[\\/]/).includes('..') && !x.includes(':');
const argv = x => strings(x) && x[0] === 'proxy' && x.length > 1;
const result = errors => ({ok:errors.length === 0,errors});
const candidatesEqual = (a,b) => Array.isArray(a) && Array.isArray(b)
  && a.length === b.length && a.every(object) && b.every(object)
  && unique(a.map(x=>x.repoId)) && unique(b.map(x=>x.repoId))
  && a.every(x => b.some(y => x.repoId===y.repoId && x.sha===y.sha && x.artifactId===y.artifactId));

/** Onboarding is valid with null branch/project ids; it grants no Ready authority. */
export function validateRegistry(registry) {
  const errors=[];
  if (!object(registry)) return result(['registry must be an object']);
  if (registry.schemaVersion !== 1) errors.push('schemaVersion must be 1');
  const factory=registry.factory;
  if (!object(factory) || !text(factory.localPath) || !repoName(factory.repository) || !text(factory.remoteName) || !text(factory.defaultBranch) || !nullableText(factory.codexProjectId) || !nullableText(factory.projectUrl)) errors.push('factory registration is incomplete');
  if (!Array.isArray(registry.products)) return result([...errors,'products must be an array']);
  const productIds=[], repoIds=[];
  for (const product of registry.products) {
    if (!object(product) || !text(product.id) || !text(product.name) || !['existing','idea'].includes(product.entry) || !Array.isArray(product.repositories)) {errors.push('invalid product');continue;}
    productIds.push(product.id);
    if (product.entry==='existing' && product.repositories.length===0) errors.push('existing product needs a repository');
    if (product.entry==='idea' && !nullableText(product.briefRef)) errors.push('idea briefRef must be a reference or null');
    for (const repo of product.repositories) {
      if (!object(repo)) {errors.push('invalid repository');continue;}
      repoIds.push(repo.id);
      if (!text(repo.id) || !text(repo.localPath) || !repoName(repo.repository) || !text(repo.remoteName) || !nullableText(repo.defaultBranch) || !text(repo.stack) || !['unverified','verified','blocked'].includes(repo.access) || !['unknown','manual','main-push-deploy'].includes(repo.releaseTrigger)) errors.push('repository registration is incomplete');
      if (!Array.isArray(repo.verificationCommands)) {errors.push('verificationCommands must be an array');continue;}
      const ids=[];
      for (const check of repo.verificationCommands) {
        if (!object(check) || !text(check.id) || !relativePath(check.cwdRelative) || !argv(check.args) || typeof check.required!=='boolean' || !text(check.environmentNote) || !['unverified','verified','blocked'].includes(check.status)) errors.push('invalid verification command');
        ids.push(check?.id);
      }
      if (!unique(ids)) errors.push('duplicate verification command');
    }
  }
  if (!unique(productIds)) errors.push('duplicate product id');
  if (!unique(repoIds)) errors.push('duplicate repository id');
  return result(errors);
}

/** Structural integrity only. Human provenance is supplied independently to readiness. */
export function validateWorkRecord(record, registry) {
  const registryResult=validateRegistry(registry);
  if (!registryResult.ok) return registryResult;
  const errors=[];
  if (!object(record)) return result(['work record must be an object']);
  if (!issueId(record.issue) || !text(record.packageVersion) || !hash(record.scopeHash,64)) errors.push('invalid issue, package version or scope hash');
  if (!stages.has(record.stage) || ![0,1,2].includes(record.priority)) errors.push('invalid stage or priority');
  const product=registry.products.find(p=>p.id===record.productId);
  if (!product) errors.push('unregistered product');
  const repoIds=Array.isArray(record.repoIds)?record.repoIds:[];
  if (!Array.isArray(record.repoIds) || !unique(repoIds) || repoIds.some(id=>!product?.repositories.some(r=>r.id===id))) errors.push('invalid repository scope');
  if (!Array.isArray(record.dependsOn) || record.dependsOn.some(x=>!issueId(x))) errors.push('invalid dependency identity');
  if (!object(record.allowedPaths)) errors.push('allowedPaths must be an object');
  else {
    if (Object.keys(record.allowedPaths).some(id=>!repoIds.includes(id))) errors.push('path scope references another repository');
    for (const id of repoIds) if (!strings(record.allowedPaths[id]) || !record.allowedPaths[id].every(relativePath)) errors.push('invalid relative path scope');
  }
  if (!Array.isArray(record.checks)) errors.push('checks must be an array');
  else {
    const ids=[];
    for (const check of record.checks) {
      if (!object(check) || !text(check.id) || !repoIds.includes(check.repoId) || !argv(check.args) || !relativePath(check.cwdRelative) || !text(check.acceptanceId) || !['local','ci','manual'].includes(check.kind) || typeof check.required!=='boolean') errors.push('invalid package check');
      ids.push(check?.id);
    }
    if (!unique(ids)) errors.push('duplicate package check id');
  }
  const candidates=Array.isArray(record.candidates)?record.candidates:[];
  if (!Array.isArray(record.candidates)) errors.push('candidates must be an array');
  else {
    if (!unique(candidates.map(x=>x?.repoId))) errors.push('duplicate candidate repository');
    for (const c of candidates) if (!object(c) || !repoIds.includes(c.repoId) || !hash(c.sha,40) || !nullableText(c.artifactId)) errors.push('invalid candidate');
  }
  if (!Array.isArray(record.approvals)) errors.push('approvals must be an array');
  else for (const a of record.approvals) {
    if (!object(a) || ![1,2,3].includes(a.gate) || !sameIssue(a.issue,record.issue) || a.packageVersion!==record.packageVersion || a.scopeHash!==record.scopeHash || !text(a.humanMessageRef) || !Array.isArray(a.candidates)) {errors.push('stale or invalid approval');continue;}
    if (a.gate===3) {
      if (!text(a.environment) || !candidatesEqual(a.candidates,candidates) || candidates.length!==repoIds.length || candidates.length===0) errors.push('release approval does not match all current candidates');
    } else if (a.candidates.length!==0 || a.environment!==null) errors.push('gate 1/2 cannot approve release candidates');
  }
  const cp=record.checkpoint;
  if (!object(cp)) errors.push('checkpoint must be an object');
  else {
    for (const field of ['completedStep','nextStep','taskRef','blocker','lastNotificationKey']) if (!nullableText(cp[field])) errors.push('invalid checkpoint '+field);
    if (!Array.isArray(cp.prRefs) || cp.prRefs.some(x=>!text(x)) || !Array.isArray(cp.worktrees)) errors.push('invalid checkpoint references');
    else for (const wt of cp.worktrees) if (!object(wt) || !repoIds.includes(wt.repoId) || !text(wt.path) || !text(wt.branch) || !hash(wt.headSha,40)) errors.push('invalid worktree checkpoint');
    if (!Number.isInteger(cp.repairCount) || cp.repairCount<0 || cp.repairCount>2 || !Number.isInteger(cp.infraRetryCount) || cp.infraRetryCount<0 || cp.infraRetryCount>1) errors.push('invalid persistent attempt counters');
    if (record.stage==='blocked' && !text(cp.blocker)) errors.push('blocked stage requires a concrete blocker');
  }
  return result(errors);
}

/** Context comes from current native human messages and runtime observations, never Issue JSON. */
export function validateReadiness(record, context) {
  if (!object(context)) return result(['readiness context missing']);
  const structural=validateWorkRecord(record,context.registry);
  if (!structural.ok) return structural;
  const errors=[];
  if (!['ready','building','verifying','reviewing'].includes(record.stage)) errors.push('work is not in an executable stage');
  const approvals=Array.isArray(context.humanConfirmedApprovals)?context.humanConfirmedApprovals:[];
  const approved=record.approvals.some(a=>a.gate===2 && approvals.some(h=>object(h) && h.gate===2 && sameIssue(h.issue,a.issue) && h.packageVersion===a.packageVersion && h.scopeHash===a.scopeHash && h.humanMessageRef===a.humanMessageRef && candidatesEqual(h.candidates,a.candidates) && h.environment===null));
  if (!approved) errors.push('matching direct human gate 2 approval missing');
  for (const field of ['dependenciesComplete','planComplete','nativeControlsVerified']) if (context[field]!==true) errors.push(field+' is not verified');
  if (!Array.isArray(context.activePackages) || context.activePackages.some(x=>!sameIssue(x,record.issue)) || context.activePackages.length>1) errors.push('another package is active or WIP is unknown');
  if (!['begin','repair','infra-retry'].includes(context.requestedAction)) errors.push('invalid requested action');
  if (context.requestedAction==='repair' && record.checkpoint.repairCount>=2) errors.push('repair budget exhausted');
  if (context.requestedAction==='infra-retry' && record.checkpoint.infraRetryCount>=1) errors.push('infrastructure retry budget exhausted');
  const repos=context.registry.products.find(p=>p.id===record.productId).repositories;
  if (record.repoIds.length===0) errors.push('development needs a repository');
  for (const id of record.repoIds) {
    const repo=repos.find(r=>r.id===id);
    if (repo.access!=='verified' || !text(repo.defaultBranch)) errors.push(id+' onboarding incomplete');
    const required=record.checks.filter(c=>c.repoId===id && c.required);
    if (!required.length) errors.push(id+' needs a required check');
    for (const check of required.filter(c=>c.kind==='local')) if (!repo.verificationCommands.some(c=>c.id===check.id && c.status==='verified' && c.cwdRelative===check.cwdRelative && JSON.stringify(c.args)===JSON.stringify(check.args))) errors.push(id+' verification command is not verified');
  }
  return result(errors);
}

/** Pure comparison; callers verify output bytes/hash from disk, never from Issue text. */
export function validateEvidence(record, expected) {
  if (!object(record) || !object(expected)) return result(['evidence and expectation are required']);
  const errors=[];
  if (!text(record.checkId) || !sameIssue(record.issue,expected.issue) || !text(record.packageVersion) || record.packageVersion!==expected.packageVersion || !repoName(record.repository) || record.repository!==expected.repository) errors.push('evidence identity mismatch');
  if (!hash(expected.candidateSha,40) || record.beforeSha!==expected.candidateSha || record.afterSha!==expected.candidateSha) errors.push('evidence is not for the current candidate');
  if (record.exitCode!==0 || record.timedOut!==false || record.cleanBefore!==true || record.cleanAfter!==true) errors.push('check failed, timed out or checkout was dirty');
  if (!text(record.cwd) || !argv(record.commandArgs) || !text(record.outputPath) || !hash(record.outputSha256,64) || expected.outputHashMatches!==true) errors.push('real output or command evidence missing');
  const start=Date.parse(record.startedAt),end=Date.parse(record.endedAt);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end<start) errors.push('invalid check timestamps');
  return result(errors);
}

function main() {
  try {
    const args=process.argv.slice(2);
    if (args[0]!=='--registry' || !args[1] || ![2,4].includes(args.length) || (args.length===4 && args[2]!=='--work')) throw new Error('usage: --registry <json> [--work <json>]');
    const registry=JSON.parse(readFileSync(args[1],'utf8'));
    const validation=args.length===4 ? validateWorkRecord(JSON.parse(readFileSync(args[3],'utf8')),registry) : validateRegistry(registry);
    if (!validation.ok) {console.error(validation.errors.join('\n'));process.exitCode=1;return;}
    console.log(args.length===4?'work structurally valid; no execution authority granted':'registry valid');
  } catch (error) {console.error(error.message);process.exitCode=2;}
}
if (process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) main();
