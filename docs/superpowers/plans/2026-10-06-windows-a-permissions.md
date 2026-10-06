# Windows A Permissions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans inline. Follow checkbox tasks; one fresh final review. The user explicitly approved option A in this chat. Routine plan execution does not reopen that approval.

**Goal:** Make the approved Windows A read policy load and enforce the existing narrow write scopes in the real native Factory profiles.

**Architecture:** Keep first-party elevated Windows sandbox and three existing roles. Coordinator supplies the shared root-read and explicit-denial policy; reviewer removes evidence writes; fixture worker inherits reviewer and adds only its exact application file and native-probe evidence directory. Persist only the primary-repository trust entry through the version-checked first-party config API.

**Tech Stack:** Codex CLI 0.160.1, native app-server JSON-RPC, TOML, existing Node.js/RTK probes; no new dependencies or services.

**Spec:** User-approved A row in `verification/acceptance.md`, plus immutable `C:/Users/tokso/Documents/Codex/2026-10-02/new-chat/outputs/2026-10-03-ai-software-factory-design.md` sections 6, 11, 12. A explicitly supersedes default-deny reads: other local files may be readable unless explicitly denied. It does not supersede the three CTO gates or activation prerequisites.

## Global Constraints

- Work only in `C:/Users/tokso/source/repos/AI-Software-Factory-bootstrap`, branch `factory/bootstrap-a-plus`; preserve primary checkout and product code.
- Keep `approval_policy = never`, command network disabled, existing write scopes and separate tool controls. No worker, merge, release, remote publication or active automation follows from A.
- Do not inspect actual secrets. Test only owned dummy files. Credential/personal denials are explicit paths, not a promise to discover every possible secret.
- Bound environment-file glob expansion to six directory levels in Factory and registered source roots. Future/deeper files require onboarding/re-expansion and remain an acceptance limitation.
- Exact protected paths remain unwritable; config/API startup errors never count as denied operations.

## Review Focus

1. Inherited permissions accidentally grant the fixture worker coordinator evidence writes or reviewer application writes.
2. Global trust mutation replaces other project entries or changes unrelated user settings.
3. Personal or credential directory denial breaks required runtime tools, or tests read actual secrets.
4. Environment files at root/nested/suffix paths remain readable because a glob did not expand.
5. Successful filesystem checks are presented as proof of MCP/browser/remote/ownership or unattended readiness.

### Task 1: Load native typed configuration and persist exact trust

**Files:** Modify `.codex/config.toml`; use ignored `verification/runs/native-controls/config-layers-client.cjs` and a scoped trust client. Create this plan and its ignored ledger only.

**Interfaces:** Existing native `config/read`, `config/value/write` with `{keyPath:"projects", value:{<primary-path>:{trust_level:"trusted"}}, mergeStrategy:"upsert", expectedVersion:<fresh-user-layer-version>}` and `skills/list`.

- [x] Reproduce `invalid transport in mcp_servers.cua_repl` with `rtk proxy node verification/runs/native-controls/config-layers-client.cjs trusted config-only`. Expected: typed configuration failure, not sandbox denial.
- [x] Remove the transport-less entry for absent `cua_repl`; retain valid disabled Node/Stitch overrides, computer-use/app denials and graph allowlist. Do not invent a transport.
- [x] Rerun typed config and local Factory skill discovery. Expected: enabled project layer, all three permission profiles and local Factory skill; failure: config validation/error or missing skill.
- [x] Using the current first-party protocol, read fresh user-layer version, apply one upsert and compare unrelated fields in memory without persisting their contents. Expected: primary trust becomes trusted and all unrelated settings/project entries remain equal.
- [x] Verify in a fresh process without invocation trust override. Acceptance: native project layer enabled and typed skill discovery succeeds. Commit: `fix: load native factory configuration and repository trust` (global trust is recorded, never committed).

### Task 2: Enforce approved A read policy and narrow writes

**Files:** Modify `.codex/config.toml`; extend `verification/native-probes.mjs` only with owned environment-file probes. Use ignored scripts/evidence for coordinator/reviewer/personal/outside/network checks.

**Interfaces:** `runNativeProbes({factoryRoot,fixtureRoot,permissionProfile})`; unchanged native result arrays with explicit unsupported tool/ownership/junction/remote checks.

- [x] Run actual unchanged trusted profile. Expected: mandatory root-read startup rejection. Record RED.
- [x] Add root-read baseline, explicit denials for `.codex`, `.ssh`, `.aws`, `.azure`, `.kube`, `.config/gcloud`, credential files, Microsoft UserSecrets and personal Documents/Desktop/Downloads/Pictures/Music/Videos/OneDrive. Do not deny all AppData or modify OS ACLs.
- [x] Add finite environment-file rules at Factory plus the five registered source roots, including `.env`, `*.env`, `.env.*`. Set `glob_scan_max_depth = 6`; fixture worker inherits reviewer so denials remain shared without broad evidence writes.
- [x] Create owned root/nested/suffix environment fixtures before sandbox startup and extend real native probes for their read denials. Expected: required reads denied with EPERM/EACCES; startup failures and ENOENT fail acceptance.
- [ ] Run actual fixture profile with persisted trust, then coordinator/reviewer positive reads, allowed coordinator evidence write, denied reviewer evidence/application write, denied worker broader evidence write, dummy personal read denial, dummy neutral outside read allow/write deny and network deny. Exact payload/unchanged bytes and actual process output required.
- [x] Run `rtk proxy node --test verification/contracts.test.mjs verification/record-check.test.mjs verification/native-probes.test.mjs`. Expected: all core tests pass; failure: any assertion, unexpected write, secret read or unavailable command. Commit: `fix: enforce approved Windows factory read and write boundaries`.

**Observed limit:** filesystem fixture13/13 and separate role filesystem24/24 pass; first-party full provisioning repairs external denial (3/3 EACCES). Loopback TCP denial fails (3/3 connect) even after provisioning. The preceding combined acceptance step remains unchecked; Task 2 is not fully accepted. A is applied; full network/tool/agent activation is closed. Native Windows RTK launch required resolving the installed executable path; this evidence-backed correction adds no permission grant.

### Task 3: Record acceptance and review

**Files:** Modify `README.md`, `verification/acceptance.md`; update this plan checkboxes and its ignored ledger.

- [x] Record current-version typed loading, persisted exact trust and per-profile behavioral results, distinguishing finite deny coverage from global root reads and all remaining activation prerequisites.
- [x] Run full core suite, `rtk proxy node verification/contracts.mjs --registry projects.json`, `rtk proxy git diff --check`, and verify clean primary checkout. Expected: passing tests, valid registry, no unrelated changes.
- [x] One fresh reviewer checks the addendum range against approved A, immutable design and Review Focus. Address Important/Critical findings in one verified fix pass; no remote publication.
- [x] Commit scoped docs/plan as `docs: record Windows A acceptance and remaining factory gates`. Acceptance: A results are concrete and reviewable; missing tool/ownership/remote/scheduler acceptance remains explicitly closed.

**Task 3 checkpoint:** commit `537508b` recorded the A results; the final documentation checkpoint adds completed post-provisioning filesystem evidence and the independent `40cb925..537508b` review. Core code is unchanged since the fresh 21/21 run. Registry and final diff checks pass; primary main remains clean. Task 2 network acceptance is still incomplete. Retain the ledger and bootstrap worktree for that required continuation; no merge/push or unattended activation.
