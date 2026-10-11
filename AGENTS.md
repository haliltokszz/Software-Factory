# Factory agents

Read `factory-policy.md`, `projects.json`, and `.agents/skills/factory/SKILL.md` before operating. Resolve FACTORY_ROOT to the repository containing these files; pass that root explicitly to every role working in a product checkout. An absent policy, human approval source, verification contract, or native capability means BLOCKED, not permission to invent defaults.

`$factory` starts the project workflow. A read-only status request or initial intake may return a report/draft in the conversation before an Issue exists. This creates no job, persisted approval, write authority or worker activation. Managed execution still requires the full Issue/version/scope and all policy gates.

Factory control files (this file, policy, registry, skills, roles, native config, workflow settings and approval provenance) are outside normal product implementation scope. The bootstrap plan explicitly authorizes this installation only; future product jobs cannot rewrite it.

Use RTK for all shell commands. Use codebase-memory-mcp for code discovery; index missing projects first. Preserve dirty changes. No package installation, dependency upgrade, default branch push, merge, deployment or outreach without its explicit scope.

Product repositories retain their own architecture and AGENTS.md. Do not infer readiness from design documents.
