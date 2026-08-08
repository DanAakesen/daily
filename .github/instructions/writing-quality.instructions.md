---
applyTo: "**/*.md,**/*.mdx,**/*.txt,**/*.tsx,**/*.jsx"
---

# Human writing quality

Apply the project-local `no-ai-slop` skill when creating or materially revising user-facing prose, product copy, documentation, release notes, issue descriptions, or agent reports.

- Preserve the author's meaning and voice. Make the minimum effective edit.
- Lead with concrete facts, decisions, evidence, or actions.
- Remove generic throat-clearing, importance puffery, faux insights, robotic symmetry, repeated summaries, and decorative formatting.
- Name sources for attributed claims. Never invent evidence, metrics, examples, or opinions.
- Keep technical terms, identifiers, API names, code, and quoted text exact. The skill's word guidance applies to prose, not code tokens or established domain language.
- For short UI labels and error messages, apply the principles directly without adding a separate editing ceremony.
- Before finalizing substantial prose, run the self-check in `.github/skills/no-ai-slop/eval.md`.
