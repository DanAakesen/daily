# Agent Decisions

This file captures project-local decisions that future agents must know. Keep it short. Remove stale entries instead of building a second README.

## Decision log

Add new entries at the top.

### 2026-08-08 - Run refreshes in GitHub Actions

**Status:** accepted

**Context:** ChatGPT cloud tasks cannot submit the normalized refresh payload, and Dan wants credentials stored as encrypted GitHub secrets rather than Azure Key Vault secrets.

**Decision:** Use a private `DanAakesen/daily` repository with GitHub Actions as the scheduled runtime. Keep the existing dashboard as the ingestion and storage backend. Reserve Azure resource group `rg-daily` for supporting resources only.

**Reason:** GitHub Actions can inject repository environment secrets directly into the scheduled process; an Azure runtime cannot read GitHub secret values after deployment.

**Evidence:** Dan confirmed the architecture on 2026-08-08.

### 2026-08-08 - Keep source refreshes read-only and isolated

**Status:** accepted

**Context:** The dashboard is informational and source applications remain authoritative.

**Decision:** Gmail, Google Calendar, and TickTick adapters only read data. Each source reports `ok` or `error` independently, and cloud cutover waits for manual parity plus two scheduled successes.

**Reason:** Preserve the existing safety and stale-snapshot contract.

**Evidence:** Existing Daily Overview ingestion contract and Dan's confirmed product boundary.

### 2026-07-19 - Pre-authorize PR creation and green merges

**Status:** accepted

**Context:** Waiting for separate human approval after automated implementation and Release Manager review stalls the Autopilot flow.

**Decision:** Engineers may open PRs without approval. The Release Manager automatically marks a PR ready and merges it after reviewing the exact current SHA and confirming required validation/checks are green, no findings or conflicts remain, and branch protection is satisfied. The deployment-approval portion of this decision was superseded by Fast Autopilot v2 below.

**Reason:** Preserve an automated quality gate while removing a redundant human handoff before merge.

**Evidence:** Owner instruction on 2026-07-19.

**Review date:** Revisit if automated merges cause quality or coordination problems.

### 2026-07-19 - Include safe repository hygiene in the PM heartbeat

**Status:** accepted

**Context:** Local engineering sessions leave ignored logs and temporary artifacts that make the repository folder noisy and can hide recurring tooling problems.

**Decision:** Each PM heartbeat performs a quick hygiene scan. It may remove stale ignored generated artifacts only when no process writes them and they have no diagnostic value. Tracked artifacts, dirty worktrees, and recurring generators are never deleted blindly; systemic causes enter maintenance recovery.

**Reason:** Keep the checkout clean without losing evidence or damaging active work.

**Evidence:** Owner instruction on 2026-07-19.

**Review date:** Revisit if cleanup removes useful diagnostics or becomes expensive.

### 2026-07-19 - Pre-authorize evidence-backed maintenance recovery

**Status:** accepted

**Context:** Engineers repeatedly encounter the same bugs, deployment failures, flaky tooling, and workarounds while delivering otherwise approved work.

**Decision:** In `execute-ready`, the PM scans active and recent Engineer evidence, deduplicates distinct root causes, and may create recovery work without Ready approval. Fast Autopilot v2 below supersedes the eager-spawn and deployment-approval portions.

**Reason:** Recurring delivery friction should be root-caused in parallel instead of repeatedly consuming Engineer time or waiting for another planning cycle.

**Evidence:** Owner instruction on 2026-07-19.

**Review date:** Revisit if the exception creates duplicate or speculative maintenance work.

### 2026-07-16 - Use role, phase, issue, and title in subagent task names

**Status:** accepted

**Context:** Generic native child names make it difficult to understand active PM work at a glance.

**Decision:** Name every assignment `<Engineer|Architect|Release Manager> <Plan|Implement> [#<issue>] — <title>`. Use the exact issue title when one exists; otherwise generate a concise title. Reusable children retitle themselves per assignment.

**Reason:** The task list should reveal the workflow phase, work item, role, and purpose without opening the child task.

**Evidence:** Owner instruction on 2026-07-16.

**Review date:** None.

### 2026-07-14 - Use a PM-owned native Codex subagent tree

**Status:** accepted

**Context:** Independent top-level role tasks did not reliably propagate Engineer completion to the Project Manager; a Watchdog was compensating for missed handoffs.

**Decision:** Keep the PM as the only persistent top-level Codex task. A native Engineer supervises Copilot CLI when selected. Native child results are the authoritative role transport; the Watchdog is optional health monitoring only. Fast Autopilot v2 below supersedes the reusable Release Manager topology.

### 2026-07-19 - Adopt Fast Autopilot v2

**Context:** Overlapping heartbeats, serialized PR review, repeated broad validation, and eager maintenance can make proactive delivery take hours.

**Decision:** Heartbeats are non-overlapping two-to-five-minute control ticks and do not wait for children. Allow up to three Engineers and two conditional Architects. Use a disposable Luna-medium Release Manager per PR with no artificial review cap. Engineers run targeted validation while required CI owns the full suite/build. Only blocking or P0/P1 maintenance starts immediately. Merge, deployment, and validated destructive/data-migration work are pre-authorized; `Ready`, secrets, and paid resources retain their explicit gates.

### 2026-07-22 - Require actionable whole-project loop briefs

**Context:** Task-only loop reports leave the owner without project health, active work, priorities, or a decision surface.

**Decision:** Every surfaced PM loop result must summarize whole-project status, changes, active work, up to three prioritized next PM actions, and the owner's exact action. Completion events are inputs to this brief, not standalone reports. Partial Project API data must be disclosed and supplemented with last-known Project state plus current issue/PR data.

### 2026-07-22 - Define Active from live workers and require issue titles

**Context:** A PM brief can list number-only issues as active based on stale Project fields even when no subagents are running, leaving work unmanaged and the report hard to understand.

**Decision:** Every user-facing issue reference includes its exact GitHub title. `Active` contains only work with verified running native or registered external workers. Before reporting, the PM reconciles Project states against agents, PRs, and CI; restarts eligible orphaned work when capacity exists; routes unreviewed PRs; and corrects or explains work that cannot resume.

### 2026-07-22 - Reserve In review for owner acceptance

**Context:** `In review` can be incorrectly treated as orphaned agent work even though it represents implementation that the owner must validate.

**Decision:** Keep issues `In progress` throughout Engineer work and automated review/merge/deployment. Move them to `In review` only after implementation and release validation complete. `In review` requires owner acceptance, not a live subagent, and appears under `Your action`. Requested changes return the issue to `In progress` and start an Engineer.

**Reason:** Codex natively collects subagent results in the parent task, eliminating prompt-only cross-task handoffs.

**Evidence:** Owner decision on 2026-07-14 and the Codex subagent execution model.

**Review date:** Revisit only if Codex adds guaranteed event delivery between independent top-level tasks.

### YYYY-MM-DD - Decision title

**Status:** proposed | accepted | superseded

**Context:** What problem or constraint caused this decision?

**Decision:** What should future agents do?

**Reason:** Why is this the chosen path?

**Evidence:** Link to files, docs, PRs, issues, tests, or user input.

**Review date:** When should this be revisited?

## Open questions

Track unresolved questions that should block or shape future work.

| Date       | Question         | Owner      | Status |
| ---------- | ---------------- | ---------- | ------ |
| YYYY-MM-DD | Example question | Unassigned | Open   |

## Superseded decisions

Move old decisions here when they are no longer active but still explain history.
