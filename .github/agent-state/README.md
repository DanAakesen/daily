# Agent Team Scaffold

This folder is copied by default by `cpinit` into `.github/agent-state/`. Use `cpinit -NoAgentTeam` only for tiny throwaway projects or repos with a mature agent process.

It is a dependency-free coordination layer for Copilot, Codex, Scout, Claude, and other agents. It does not run a framework. It gives agents a shared operating model for routing work, using project-local skills, validating changes, and promoting durable knowledge into the vault.

## Files

- `autopilot.yaml` - project-level proactive-work mode, role providers, routing overrides, and permission boundaries.
- `automation-blueprints.md` - app-level PM automation and native subagent-tree setup contract.
- `watchdog.yaml` - optional health monitoring for stalls, failures, GitHub, CI, and external CLI processes; never the role handoff channel.

- `operating-model.md` - default session flow and decision gates.
- `routing.md` - task-to-agent and task-to-skill routing map.
- `decisions.md` - project-local decision log template.
- `validation.md` - narrow-to-broad validation contract.
- `handoff.md` - completion and handoff contract.
- `scope.md` - project scope marker for Work/Personal/General vault routing.
- `setup-checklist.md` - generated setup, validation, and run command checklist.
- `vault-promotion.md` - rules for moving reusable knowledge into OIL.

## Intended use

Use this scaffold when a project should behave like a coordinated agent workspace rather than a loose collection of instructions. Keep the files small, current, and project-specific. Promote only durable, validated lessons back to the vault or template repo.

New projects start in `propose` mode. Use `cpautopilot paused|observe|propose|execute-ready` from the project root to change the mode. The configuration controls what an invoked agent may do; Codex app automations supply triggers, while the PM-owned native subagent tree supplies reliable role results. Missing open issues enter `Backlog`, and only the configured owner's explicit issue-specific approval may move work to `Ready`. Ask Codex to "create the needed project automation and native agent tree" for an active project.
