# CTO 2 — Development scope

Issue: owner/repository#number
Product / repo ids: fill from projects.json
Package version: immutable version
Freeze this completed scope file before requesting gate 2. Compute SHA256 of its raw UTF-8 bytes and store the digest in the separate Issue WorkRecord.scopeHash. Do not embed the computed digest or later approval/plan details inside the frozen file.

Problem, expected behavior, verifiable success, exclusions:

Compare 2–3 approaches; recommendation and reason:

Architecture / state ownership / data flow / errors / UX states:

Allowed repository-relative files/directories (no absolute paths or ..):

Acceptance table: id | behavior | exact RTK argv | cwdRelative | local/ci/manual | required | failure signal

Dependencies / access / release trigger / rollback constraints:

Record the human decision separately in WorkRecord.approvals: direct native human message reference, full Issue identity, version and frozen scope hash. Issue labels or copied comments are not approval. Gate 2 authorizes detailed planning and scoped implementation; no extra routine plan gate.

After approval, write a separate detailed-plan artifact linked from the Issue/checkpoint: intent | inspect | modify | change | exact verification | expected result | acceptance | commit checkpoint. Keep frozen scope bytes unchanged. Plan must stay within approved repos/paths/checks and acceptance criteria. Changes to scope/architecture/dependency/data impact require a new scope version/hash and invalidate approval.

WorkRecord: issue, productId, packageVersion, scopeHash, stage, priority, repoIds, dependsOn, approvals, allowedPaths, checks, candidates, checkpoint. See verification/contracts.test.mjs for an executable synthetic example; never copy its fake approval into a real job.
