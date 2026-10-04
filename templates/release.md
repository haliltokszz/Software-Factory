# CTO 3 — Release candidate

Issue / package version / scope hash / exact environment:
Candidate set: every repoId, immutable SHA, artifactId (null means no verified artifact).
Local checks: real argv/cwd, exit, before/after SHA, clean status, timestamps, output path and SHA256 verified from disk.
CI: provider run/check URL, candidate SHA, real conclusion; absence is explicit. Manual: steps/results/artifact reference.
Independent review: separate context, source/diff/spec/evidence, findings and disposition.
Changes / residual risks / deploy trigger / rollback / smoke check and failure response:
Human decision: direct message bound to complete candidate set and environment. Any candidate change invalidates decision. Final merge/main push/deploy belongs to human; no automatic release.
Post-release: target metric, actual observation or UNKNOWN, next experiment. Merged PR alone does not establish product success.
