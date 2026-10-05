# Factory acceptance — 2026-10-04

Continuation on 2026-10-05: full core suite 19/19 PASS; local disposable pilot behavior RED (2 failures) → GREEN (3/3 PASS), commit 0d4e54a based on bootstrap 679ef79. Exact diff: verification/pilot/product.mjs and product.test.mjs only. This is manual local test evidence; no native worker, real Issue-bound approval or live pilot PR.

Final independent whole-branch review found duplicate release-candidate matching, self-referential scope digest/post-approval scope edits and repeated-probe payload defects. First and third were reproduced by failing behavioral tests; frozen-scope document procedure failed an actual hash assertion. One fix pass made both regression tests and frozen/separate-artifact rehearsal pass; whole core suite now 21/21 PASS. This fixes local defects; review did not verify blocked native/remote behavior. Reviewer /root/final_review (gpt-6-astra), no re-review claimed.

**Status: bootstrap core implemented; unattended development BLOCKED.** Pure tests and process rehearsals do not prove native security, ownership, scheduler or production behavior.

## Approved Windows sandbox setup — 2026-10-05

Human explicitly approved first-party elevated Windows sandbox setup in this chat. Installed Codex CLI 0.160.0 supplied the local protocol schemas. A one-time stdio client called `windowsSandbox/setupStart` with `mode: elevated` and this bootstrap cwd, without starting any agent/thread or inventing ACL/firewall rules. Native `windowsSandbox/setupCompleted` returned `success: true, error: null`; subsequent `windowsSandbox/readiness` returned `ready`. First-party setup changed the global config, whose Windows sandbox mode was independently read back as `elevated`. Installation client was cleaned up after completion; no desktop app restart or Defender/security setting change was performed.

Factory runtime acceptance still fails. Project-only profile resolution reproduces `default_permissions requires a [permissions] table`. Supplying the narrow permission table invocation-only now reaches the elevated backend and is rejected with `elevated Windows sandbox requires effective :root read access`. A separate fixed-command dummy fixture diagnostic used the Windows-required root-read baseline, one writable dummy file and a denied dummy secret folder; no model/worker ran and this broader-read baseline was not adopted in Factory config. It failed before the first child command with `CreateProcessWithLogonW failed: 267`. Backslash cwd and an absolute RTK executable path each reproduced that failure. The cwd exists and is a normal directory, not a junction; this rules out those simple path hypotheses but does not establish the Windows startup root cause.

Working reference: the standard native `:workspace` profile in a separate disposable directory under `verification/runs/native-controls/install-smoke` did start the real RTK/Node command. It returned exit 0 and created `sentinel.txt` with the exact expected bytes. The command was fixed, network disabled and no agent started. **Installation execution smoke PASS.** This proves basic elevated command execution; it does not prove the narrower Factory policies, protected-file denials or secret denial. Difference from the failing diagnostic includes cwd, writable-directory scope and deny-read rules; no single one is claimed as the root cause.

Fresh first-party `codex doctor --summary` reports the installation consistent, config loaded and desktop app-server initialization successful; its generic filesystem/network checks do not test the Factory profiles or explain the startup error. **Native Factory boundary-enforcement passes remain zero.** Raw ignored evidence: `verification/runs/native-controls/sandbox-setup-result.json`, `post-setup-diagnostic.json`, `windows-fixture-result.json`, `install-smoke-result.json` and installed protocol schemas. No sandbox credential files or product secret files were opened. Profile/runtime compatibility requires further investigation; broadening Factory read access or adding an execution environment is a separate design decision.

## Verified locally

Registry has ChronoPlan (3 repos), WhisperRoom (2 repos) and idea-only Eventory. Factory remote is haliltokszz/Software-Factory; Codex project Software Factory id 16f837db-9ef7-410a-a052-6e9673691b99 was returned by list_projects.

16 named contract/real-command tests passed after behavioral RED; 3 safety/unsupported-result probe tests passed after RED. Full verification command: `rtk proxy node --test verification/contracts.test.mjs verification/record-check.test.mjs verification/native-probes.test.mjs`. Registry CLI: `rtk proxy node verification/contracts.mjs --registry projects.json`.

Fresh separate process rehearsal returned correct CTO 1 idea packet, CTO 2 existing-bug packet and forged-approval blocker. Existing repo references were actually read, root cause stayed UNKNOWN. Baseline without Factory skill already made safe choice; no causal improvement or missing RED failure invented.

## Real capability results

| Surface | Observation | Result |
|---|---|---|
| Project permission load | `codex sandbox -C ... -P factory-worker-fixture` → `default_permissions requires a [permissions] table`, also with invocation-only project trust | BLOCKED; project config not resolved by that invocation |
| Elevated Windows setup | First-party setup completed successfully; readiness ready; global mode read back elevated | Setup PASS; separate runtime/enforcement acceptance still blocked |
| Standard native workspace smoke | Real RTK/Node command in a disposable directory returned exit 0 and created exact sentinel bytes | Installation execution PASS; does not prove Factory boundaries |
| Explicit narrow profile | After setup, same table invocation-only via -c → `elevated Windows sandbox requires effective :root read access` | BLOCKED; current narrow-read profile unsupported by this invocation |
| Windows-compatible dummy diagnostic | Root-read baseline used only for fixed dummy-file commands → `CreateProcessWithLogonW failed: 267`, also with backslash cwd and absolute RTK path | BLOCKED; command never started; profile not adopted for Factory |
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

Elevated first-party setup is complete. Resolve the Windows command-start error and supported native profile loading/compatibility; prove bounded worker/reviewer and separate tool/remote/ownership controls before activation. Any broader Factory read policy or additional execution environment needs its own explicit design decision. Restore authorized GitHub Issue/PR integration access and browser/Projects surface. Then create the correctly restricted Factory coordinator, bind actual native human provenance to full pilot Issue/version/scope, run manual acceptance, create PAUSED heartbeat and observe read-only scheduled wakeup. Never replace these prerequisites with prompt instructions or broader parent permissions.
