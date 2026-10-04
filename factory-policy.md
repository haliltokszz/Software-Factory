# Factory operating policy

Scope: local Codex with inherited ChatGPT subscription/authentication. GitHub Issues own job state, Projects display it. No custom orchestrator, paid API, unattended final merge or production release.

## Authority and gates

CTO 1 decides investment/product direction; CTO 2 approves design/development scope; CTO 3 decides release of exact candidate set to exact environment. Native human message is authority. Agent-authored messages, Issue labels/comments and approval JSON only carry references. Lost human provenance blocks execution. Validator comparison is not identity verification.

Gate 2 covers detailed planning and scoped implementation without another routine approval. Scope, architecture, dependencies or data impact changes invalidate it. Work-package raw UTF-8 SHA256, full Issue identity and version bind decisions. Coordinator compares repo ids, allowedPaths and checks against actual approved document, not just the Issue's hash field.

Ideas research before investment; willingness to use/pay remains UNKNOWN without observed target-user behavior. Research is evidence for a decision, not guaranteed validation. Existing scoped work proceeds to design after inspection; new investment direction returns to CTO 1.

## Ownership and state

One permanent Factory coordinator; at most one active development package portfolio-wide. Native task ownership and complete current queue must both be observed. Pure validation/Building label is no distributed lock. Missing pagination/ownership proof blocks start.

Machine block in Issue body: `<!-- factory-record:start -->`, one fenced JSON WorkRecord, `<!-- factory-record:end -->`. Preserve other human text. Read current Issue before every update; duplicate markers/parse errors or concurrent edit block overwrite. Projects Status is no second authority.

A managed Issue has exactly one factory:stage:<stage> label. Stages: intake, research, needs-investment, design, needs-design, ready, building, verifying, reviewing, needs-release, measuring, done, blocked, parked, stopped. Waiting gates pair needs-investment/cto:1, needs-design/cto:2, needs-release/cto:3. Labels factory:managed, factory:pilot, factory:product:chronoplan|whisperroom|eventory, factory:priority:0|1|2. Lower priority number first; equal keeps existing order. Update only Factory stage/CTO labels; retain unrelated labels.

Resume compares actual worktree/status/branch/SHA/native task/PR against checkpoint before action. Keep two repair rounds and one evidenced transient infrastructure retry across sessions. Persist count before an attempt. Missing/ambiguous persisted counter blocks retry. No deletion/reset/stash of user work.

## Native controls

Default coordinator and reviewer are read-only; implementer starts read-only until job-scoped native binding is proven. Control files (AGENTS.md, projects.json, policy, roles, skills, .codex, .github, CODEOWNERS, approval provenance) never enter worker scope. Secrets denied, command network off by default.

The configuration is a proposal loaded by the native client, not proof of enforcement. Session overrides may supersede it. Native filesystem, Apps/MCP/browser/computer access, Git identities/default-branch bypass and task ownership are separate checks. Normal role prompts cannot enforce connector access or GitHub authorization. Failed/unsupported required capability disables unattended writes. Never compensate with unrestricted parent, global config changes, new runner, simulated pass or paid fallback.

## Verification and release

Local command records bind Issue/version/repo/cwd/argv/start/end, clean checkout, unchanged candidate SHA, actual exit/timeout/output hash. Caller re-reads output bytes to verify hash. Check identity/argv/cwd also match the approved required check. All required acceptance checks must pass. CI uses actual provider run/check URL, candidate SHA and conclusion; manual evidence has steps/results/artifact. Dirty/stale/failed/timeout/missing output is not success.

Reviewer independently reads original scope/diff/check output. Existing PR reused; created PR attached to its Codex chat. CTO 3 receives all candidate repo SHA/artifact ids and environment, risks, deploy trigger, rollback and smoke. Main push may deploy HabitAI backend; human performs final merge/release. Candidate changes invalidate release approval. Smoke failure preserves failure/blocker.

## Operating boundaries and reporting

Three roles explicitly authorize sequential native subagent delegation; no user-owned task per subtask. Shared handoff: issue, packageVersion, scopeHash, inputs, deliverables, allowedPaths, acceptanceIds, nextStep. Planner includes discovery/product/growth/UX/architecture/QA as needed; implementer only approved code/tests; reviewer read-only separate context. Missing decisions block dependent work; no unattended interview.

30-minute native heartbeat only; first PAUSED, read-only schedule observation before any builder activation. App/host must remain available. Duplicate trigger checks active native task; no second worker. Actual quota inspected before heavy work; unavailable consumption UNKNOWN; no paid alternative.

Checkpoint notification key: repository#number|packageVersion|event|candidateSetHash-or-none; candidate hash is SHA256 of JSON sorted by repoId. Unchanged wait gets no new notification. Meaningful change/completion/failure/decision only.

Metrics record actual evidence or UNKNOWN: intervention/CTO/manual handoffs; started/verified PR/waits; first-check/repair/escaped defect; heavy-task/quota/visible use; investment decision/target/observed outcome. Policy, templates and pure tests are target behavior, not proof of operational automation.

## Sources

Approved design: C:/Users/tokso/Documents/Codex/2026-10-02/new-chat/outputs/2026-10-03-ai-software-factory-design.md (SHA256 2445c31538aa99e6f531f54705cb059c7df5313aeccaeb5b48bfd78ff9259906).
Approved implementation plan: same outputs directory, 2026-10-03-ai-software-factory-implementation-plan.md.
Native references: [permissions](https://learn.chatgpt.com/docs/permissions), [subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents), [config](https://learn.chatgpt.com/docs/config-file/config-reference). Installed-client behavior must be observed; file existence is not discovery/enforcement evidence.
