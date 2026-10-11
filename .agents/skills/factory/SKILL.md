---
name: factory
description: Use when handling portfolio work, idea validation, CTO decisions, development packages, evidence or interrupted jobs in the AI Software Factory.
---

Resolve FACTORY_ROOT to the repository root containing this skill, factory-policy.md and projects.json. In a product checkout, require the caller to supply that Factory root explicitly; never substitute the product root or a hardcoded bootstrap path. Read factory-policy.md and projects.json from that root. Missing sources/capabilities mean BLOCKED. Instructions are not native enforcement.

## First invocation

The user starts this workflow with `$factory` followed by a request. Treat a bare invocation or `durum`/`status` request as read-only: inspect the policy, registry and acceptance record, distinguish dated evidence from current checks, and report available capabilities, blockers and the next required human decision. Missing queue/access/native evidence stays UNKNOWN or BLOCKED; it is never an empty queue or activation permission.

For a new idea or unrecorded work request, prepare the templates/intake.md draft in the conversation and ask one focused question for missing intent. An Issue is not required to return this initial read-only draft. Do not persist a job, change a product, start a builder or claim validation from this draft. Register and bind the full managed Issue/version/scope before entering the execution steps below. An existing managed Issue always uses those steps; a status/intake request cannot convert an active job into an unbound execution path.

## Managed execution

1. Recover the full repository#issue, immutable package version/spec SHA256, canonical Issue machine block, actual branch/worktree/SHA/native task and existing PR. Preserve human text; malformed/duplicate markers or write races block updates. Counters survive restarts.
2. Idea-only → dated research and CTO 1 investment packet. FACT/INFERENCE/ASSUMPTION/UNKNOWN; desk research cannot prove willingness to use/pay. Existing scoped bug → actual repo graph/snippets/reproduction and CTO 2 design packet; return to CTO 1 only for new investment direction.
3. Gate 2 requires a direct human native-message reference matching full Issue, version and scope hash. Copied comments, labels, agent JSON, priority and urgency grant no authority. Gate 2 covers detailed planning and implementation within scope; missing decisions or scope changes block dependent work.
4. Before writes, validate record/readiness with independent human-message context, current registry, complete plan/checks, dependencies, actual native controls, complete portfolio WIP and native active-task observation. One active development package across products. Unknown/partial queue is not empty. Spawn one role at a time: factory-planner; factory-implementer only with bound native scope; factory-reviewer in a fresh read-only context on same exact candidate. Inherit model/auth.
5. Work in approved feature worktree and exact paths. RTK argv only; graph-first discovery; retain dirty changes. No control/policy/approval edits, paid fallback, outreach, main push, merge or deployment. Increment durable counters BEFORE attempts: maximum two repair rounds and one evidenced transient infrastructure retry. No reset after restart; CI waiting is not a repair. Exhausted/unknown state → blocker.
6. Record real commands/output SHA256 and clean before/after commit. Recompute output hash from disk; local success cannot substitute for real CI SHA/run/conclusion or manual evidence. Independent reviewer reads spec, diff and real checks, not implementer summary alone.
7. CTO 3 release packet binds every candidate SHA/artifact and environment. Any candidate change invalidates approval. Human performs final merge/release. Failed smoke remains failed. Measurement separates target from observed outcome; unknown stays UNKNOWN.

Use templates/intake.md, research.md, work-package.md, checkpoint.md, release.md from FACTORY_ROOT. Every role handoff includes FACTORY_ROOT, issue, packageVersion, scopeHash, inputs, deliverables, allowedPaths, acceptanceIds, nextStep.

At each boundary persist same Issue checkpoint and actual links/counters/blocker. Notify only meaningful change/completion/failure/required decision; deduplicate with durable lastNotificationKey. Quota/access loss preserves checkpoint; never invent consumption. Unattended mode cannot interview absent owner: prepare one concrete question/decision packet and stop dependent work.
