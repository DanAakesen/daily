# Vault Promotion Rules

Use the vault as durable memory, not as a dump of every session detail.

## Scope routing

| Knowledge type | Destination |
|---|---|
| Microsoft customer, deal, MSX, account, or work project context | OIL `Work/` |
| Personal project or personal workflow context | OIL `Personal/` |
| Reusable agent, template, tooling, design, or engineering pattern | OIL `General/` |
| Repo-specific implementation detail | Project-local guidance, usually `.github/agent-state/decisions.md` or `.github/instructions/` |

If scope cannot be confirmed and the agent cannot ask interactively, do not write to the vault. Keep the note project-local and mention the unresolved scope in the handoff.

## Promote only when validated

Promote knowledge when it is:

- Durable beyond the current task.
- Likely to change future agent behavior.
- Based on observed files, validated tool output, or explicit user input.
- Not a secret, credential, private customer detail, or speculative conclusion.

## Do not promote

- Temporary task choices.
- Failed experiments unless the failure is a reusable warning.
- Chat transcript summaries.
- Sensitive data or secrets.
- Repo-specific facts that do not apply elsewhere.

## Suggested promotion flow

1. Capture the candidate lesson locally.
2. Decide whether it is repo-specific or reusable.
3. If reusable, write to the correct OIL scope.
4. If repo-specific, update the narrowest project-local guidance file.
5. Cite the evidence or quote the user input.
