# Checkpoint — same canonical Issue

Persist inside the single factory-record machine block, preserve surrounding human text.

```json
{
  "completedStep": null,
  "nextStep": null,
  "worktrees": [],
  "taskRef": null,
  "prRefs": [],
  "repairCount": 0,
  "infraRetryCount": 0,
  "blocker": null,
  "lastNotificationKey": null
}
```

worktrees: {repoId,path,branch,headSha}; prRefs: actual URLs. Resume compares these with current git status/SHA, native task and PR evidence. Never reset counters on wakeup/session restart. Before a repair increment durable repairCount (maximum 2); before an evidenced transient infrastructure retry increment infraRetryCount (maximum 1). Unknown persistence or write race means blocked.

Notification key: repository#number|packageVersion|event|candidateSetHash-or-none. Hash candidate JSON sorted by repoId. Preserve key between wakeups, do not repeatedly notify the same pending decision.

Metrics, each with evidence or UNKNOWN: CTO/outside-gate/manual-transfer counts; started/verified-PR timestamps and waits; first check/repairs/escaped defect; heavy tasks/quota interruption/visible consumption; research decision/product target/observed outcome.
