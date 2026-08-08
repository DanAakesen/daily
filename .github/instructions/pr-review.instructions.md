# PR Review — Always-On Rules

These rules apply to ALL PR review code. Never violate them.

## Risk Review And Validation

- **Stay inside the scoped change** — Review only the actual PR, diff, commit range, or incident follow-up surface under discussion
- **Missing validation is a risk** — Treat absent tests, checks, or rollout evidence as first-class merge blockers when behavior changed
- **Validate narrow to broad** — Start with targeted checks for the touched surface and broaden only when earlier evidence is insufficient
- **Know what each check proves** — Every validation step must state what it verifies and what still remains unproven
- **Stop at the first useful confidence boundary** — Do not recommend broad slow suites once the requested confidence level is already met

## Merge Safety

- **Check rollout and rollback paths** — Review migrations, feature flags, compatibility, config defaults, backfills, and rollback assumptions before merge
- **Look for hidden coupling** — Treat cross-package, cross-service, serialization, and interface-boundary assumptions as explicit risk surfaces
- **Only escalate evidence-backed risks** — Separate strong findings from weak signals and make explicit no-action decisions on unproven suspicions
- **Recommend the smallest safe next action** — Prefer a targeted test, guard, shim, phased change, docs update, or migration-order check over broad redesigns

## Review Loop And CI

- **Handle every substantive comment** — Read each real review comment in context, resolve it, or explain why it should not change the code
- **Ask when feedback is ambiguous** — Do not guess reviewer intent; ask a concise clarifying question with concrete options
- **Disagree with evidence only** — If feedback is invalid, respond with file-, test-, contract-, or CI-backed reasoning and propose a smaller safe alternative
- **Never rerun CI blindly** — Inspect failing logs first, classify the failure, then patch, rerun, or escalate based on evidence
- **Do not call it ready early** — A PR is not merge-ready while CI is red, requested changes are unresolved, blockers remain, or explicit score gates are below max

## Documentation And Follow-Through

- **Update drifted docs with the change** — README, runbooks, setup, deploy, changelog, and workflow docs must match the new code, config, paths, flags, and examples
- **Require incident follow-through evidence** — After incident-driven changes, confirm tests, monitors, docs, ownership updates, tickets, and rollback learnings with proof
- **Track follow-up honestly** — Use done, partial, missing, and unknown; a ticket or postmortem mention is not completion
- **Confirm deployment before impact claims** — After merge, verify production deployment before attributing any metric change to the PR
- **Tie regressions to exact changes** — For recent-commit bug checks, cite exact SHAs, PRs, files, tests, and CI signals before proposing fixes
- **Capture reusable repo knowledge** — When a PR reveals repeated repo-specific conventions, draft small evidence-backed guidance updates instead of leaving them tribal
