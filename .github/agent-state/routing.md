# Agent Routing

Use this file to route work to the smallest useful agent, skill, or instruction set. Update it when the project adds new domains, tools, or workflows.

## Default routing map

| Work type                       | Primary route                                                     | Supporting route                                                          | Notes                                                                                                    |
| ------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| New project setup               | `cpinit` context                                                  | `swe-repo-introspection`                                                  | Check docs and existing agent context before coding.                                                     |
| Proactive project management    | `project-autopilot` with Codex Project Manager                    | GitHub Issues/Project, `autopilot.yaml`                                   | Add missing issues to `Backlog`; only owner-approved work enters `Ready`, with `needs-planning` removed. |
| Project automation setup        | `automation-blueprints.md`                                        | `autopilot.yaml`, optional `watchdog.yaml`                                | Attach the hourly heartbeat to the PM and initialize its native child tree.                              |
| Active-agent monitoring         | Native PM agent tree                                              | Optional Watchdog for health only                                         | Native results handle role delivery; monitoring only detects stalls/failures and external state.         |
| Autopilot architecture gate     | Up to two reusable native `architect` children                    | `architect.agent.md`, `architecture.instructions.md`                      | Conditional and read-only; skip for ordinary work using established patterns.                           |
| Autopilot engineering           | Up to three disposable native `engineer` children                 | Engineer labels and `project-autopilot`                                   | Each child owns one isolated scope with Codex or supervised Copilot CLI.                                 |
| Autopilot PR review and release | Disposable native `release_manager` per PR (`gpt-5.6-luna`, medium) | `pr-review.instructions.md`, deployment instructions, `project-autopilot` | No artificial review cap; trust green required CI and route findings to an Engineer.                    |
| Product/UI design               | `advanced-product-ui`, `interaction-design`, `visual-assets`      | `frontend-quality.instructions.md`, `design-system.instructions.md`       | Browser preview and screenshot inspection are required for non-trivial UI.                               |
| React frontend                  | `react-frontend.instructions.md`                                  | `advanced-product-ui`, `data-visualization` when charts exist             | Use project design tokens and visible labels.                                                            |
| Backend/API                     | `backend-quality.instructions.md`                                 | `node-backend.instructions.md` or `dotnet-backend.instructions.md`        | Validate input at boundaries and keep response/error contracts consistent.                               |
| Security-sensitive changes      | `swe-security-audit` or `security_auditor.agent.md`               | `security.instructions.md`                                                | Use evidence from manifests, lockfiles, code, and scanner output.                                        |
| PR or merge readiness           | `swe-pr-risk-review`                                              | `swe-change-validation-planner`                                           | Scope review to the actual diff and CI signals.                                                          |
| Test gaps                       | `swe-test-gap-hunt`                                               | `testing.instructions.md`                                                 | Prioritize risky behavior and failure branches.                                                          |
| Performance                     | `swe-performance-hunt` or `performance_engineer.agent.md`         | `architecture.instructions.md`                                            | Require a named surface and metric before optimizing.                                                    |
| Architecture decisions          | `architect.agent.md` or `architect_reviewer.agent.md`             | `architecture.instructions.md`                                            | Prefer bounded refactors and documented trade-offs.                                                      |
| Refactoring                     | `swe-refactor-opportunities` or `refactoring_specialist.agent.md` | `code-quality.instructions.md`                                            | Keep feature and refactor changes separate.                                                              |
| Repo knowledge capture          | `swe-capture-knowledge`                                           | `vault-promotion.md`                                                      | Draft before writing; promote durable lessons only after validation.                                     |
| Vault/customer/project context  | OIL search and vault skills                                       | `vault-promotion.md`                                                      | Vault scopes context; live systems validate current state.                                               |

## Routing rules

- Start with the user's requested outcome, not the most powerful available agent.
- Prefer a skill when the task is a known repeatable workflow.
- Prefer a custom agent when the task needs specialized review or extended reasoning.
- Prefer direct tool use for simple file reads, searches, or surgical edits.
- Do not run multiple agents on the same scope unless their roles are clearly different.
- If two routes conflict, choose the safer route and state the assumption.
