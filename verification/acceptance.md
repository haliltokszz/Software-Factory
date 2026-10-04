# Factory acceptance — 2026-10-04

**Status: bootstrap core implemented; unattended development BLOCKED.** Pure tests and process rehearsals do not prove native security, ownership, scheduler or production behavior.

## Verified locally

Registry has ChronoPlan (3 repos), WhisperRoom (2 repos) and idea-only Eventory. Factory remote is haliltokszz/Software-Factory; Codex project Software Factory id 16f837db-9ef7-410a-a052-6e9673691b99 was returned by list_projects.

16 named contract/real-command tests passed after behavioral RED; 3 safety/unsupported-result probe tests passed after RED. Full verification command: `rtk proxy node --test verification/contracts.test.mjs verification/record-check.test.mjs verification/native-probes.test.mjs`. Registry CLI: `rtk proxy node verification/contracts.mjs --registry projects.json`.

Fresh separate process rehearsal returned correct CTO 1 idea packet, CTO 2 existing-bug packet and forged-approval blocker. Existing repo references were actually read, root cause stayed UNKNOWN. Baseline without Factory skill already made safe choice; no causal improvement or missing RED failure invented.

## Real capability results

| Surface | Observation | Result |
|---|---|---|
| Project permission load | `codex sandbox -C ... -P factory-worker-fixture` → `default_permissions requires a [permissions] table`, also with invocation-only project trust | BLOCKED; project config not resolved by that invocation |
| Explicit narrow profile | Same permission table provided invocation-only via -c → `windows sandbox failed: Restricted read-only access requires the elevated Windows sandbox backend` | BLOCKED; no global config change or sandbox setup performed |
| Probe suite execution | allowed-write failed at native startup; zero enforcement passes; remaining probes unobserved | Unsupported, never counted as denial/pass |
| Custom role/skill discovery | Files authored and read explicitly by rehearsal agent | Native discovery PENDING |
| GitHub read metadata/search | get_repo reports admin/maintain/push/pull/triage; initial managed-Issue search returned empty | Read works; this is not complete queue/WIP or write proof |
| GitHub Issue create | Actual create_issue attempt returned HTTP403 `Resource not accessible by integration` | BLOCKED; no Issue created |
| GitHub default branch/actor | main, initial commit 544bd6563c7a29f5814e9f76bf12c209a6ee3c04; metadata permits admin | Bypass/default-branch protection unknown, no negative production write attempted |
| GitHub Projects/labels | No suitable connector tool; gh absent. Browser bootstrap: `failed to write kernel assets: Sistem belirtilen yolu bulamıyor. (os error 3)` | BLOCKED; no board or label configuration claimed |
| Native scheduler | Correctly restricted permanent Factory chat not established | PENDING; no active automation or worker |

Raw local probe evidence stays ignored under verification/runs/native-controls; fixture under work/permission-fixture. No real secret, product code or production deployment was used.

## Fourteen acceptance scenarios

| # | Scenario | Pure/process evidence | Real native/remote status |
|---|---|---|---|
| 1 | New idea | Synthetic rehearsal: dated UNKNOWN, five investment questions, CTO 1 only | Process PASS; real Eventory demand UNKNOWN |
| 2 | Existing work | Actual HabitAI graph/snippet/dependencies/workflow; CTO 2, root cause UNKNOWN | Process PASS; no product implementation |
| 3 | Unapproved package | Copied/stale/full-Issue approval rejected by tests and rehearsal | Native provenance binding PENDING |
| 4 | Approved package | Positive structural/readiness test is synthetic | Live worker/review/one pilot PR BLOCKED |
| 5 | Boundary violation | Outside/junction safety checks PASS; startup failure is unsupported | Native protected-file/secret/tool/alias enforcement BLOCKED |
| 6 | Duplicate trigger | Pure WIP rejection PASS | Native ownership/overlap PENDING |
| 7 | Interrupted resume | Real recorder preserves dirty checkout; rehearsal preserves counters | Native same worktree/task/PR resumption PENDING |
| 8 | Stale CI | Stale local SHA rejected; CI requirements specified separately | Actual provider CI candidate/run PENDING |
| 9 | Two repairs fail | Persistent limit tests and rehearsal stop at 2/1 | Across scheduled wakeups PENDING |
| 10 | Candidate changed | Stale gate 3 candidate rejected | Real release decision PENDING |
| 11 | CTO 3 wait | Release template; human merge/release policy | No merge/main push/deploy performed |
| 12 | Release/smoke failure | Failed local command is recorded as failed | Production smoke not executed; PENDING |
| 13 | Same decision wait | Durable notification key specified | Two real wakeup deduplication PENDING |
| 14 | Quota/access loss | Actual connector403 and native failures preserved as blockers | Scheduled quota/recovery PENDING; no paid fallback |

## Activation prerequisite

Resolve supported native profile loading and elevated Windows sandbox through the first-party client; prove bounded worker/reviewer and separate tool/remote/ownership controls before activation. Restore authorized GitHub Issue/PR integration access and browser/Projects surface. Then create the correctly restricted Factory coordinator, bind actual native human provenance to full pilot Issue/version/scope, run manual acceptance, create PAUSED heartbeat and observe read-only scheduled wakeup. Never replace these prerequisites with prompt instructions or broader parent permissions.
