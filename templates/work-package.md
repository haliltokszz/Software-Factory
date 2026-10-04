# CTO 2 — Development scope

Issue: owner/repository#number
Product / repo ids: fill from projects.json
Package version: immutable version
Scope hash: SHA256 of this completed file's raw UTF-8 bytes

Problem, expected behavior, verifiable success, exclusions:

Compare 2–3 approaches; recommendation and reason:

Architecture / state ownership / data flow / errors / UX states:

Allowed repository-relative files/directories (no absolute paths or ..):

Acceptance table: id | behavior | exact RTK argv | cwdRelative | local/ci/manual | required | failure signal

Dependencies / access / release trigger / rollback constraints:

Human decision: direct native human message reference, full Issue identity, version and scope hash. Issue labels or copied comments are not approval. Gate 2 authorizes detailed planning and scoped implementation; no extra routine plan gate.

After approval, ordered tasks: intent | inspect | modify | change | exact verification | expected result | acceptance | commit checkpoint. Changes to scope/architecture/dependency/data impact invalidate approval.

WorkRecord: issue, productId, packageVersion, scopeHash, stage, priority, repoIds, dependsOn, approvals, allowedPaths, checks, candidates, checkpoint. See verification/contracts.test.mjs for an executable synthetic example; never copy its fake approval into a real job.
