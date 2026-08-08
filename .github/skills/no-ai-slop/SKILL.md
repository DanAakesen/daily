---
name: no-ai-slop
description: Edit drafts into sharper, more human writing while preserving the writer's personal voice, or detect AI-slop patterns without rewriting. Use when the user wants a draft clearer, more direct, more opinionated, or less AI-sounding, or asks whether writing reads as AI.
---

# No AI slop

Preserve the writer's point and voice while making the writing clearer and more alive. Remove AI patterns without replacing distinctive writing with generic polished prose.

## Two jobs

**Edit (default).** Make the minimum effective edit and return the edited draft plus a short **What changed** section.

**Detect.** Name each pattern found, quote the line, and give the fix in a few words. Do not rewrite, score the draft, or guess whether AI wrote it.

## Editing principles

- Preserve vocabulary, cadence, bluntness, humor, uncertainty, digressions, and useful roughness.
- Make the minimum effective edit. Leave strong human sentences alone.
- Lead with the point when setup adds nothing, but keep stories or asides that add context or character.
- Keep the user's meaning. Never invent claims, examples, statistics, sources, quotes, or opinions.
- Keep substance and nuance while untangling jargon, abstract nouns, repetition, and hard-to-follow sentences.
- Prefer active voice, concrete facts, direct verbs, names, numbers, dates, mechanisms, and examples.
- Preserve strong opinions, humor, profanity, self-interruptions, and honest admissions when they fit the writer.
- Keep the structure unless it obstructs the piece.

## Words and phrases to cut

Cut these unless quoted or genuinely necessary:

- delve, foster, leverage, utilize, facilitate, empower, streamline, robust, cutting-edge
- paradigm shift, game changer, tapestry, realm, beacon, multifaceted, meticulous, intricate
- paramount, transformative, elevate, embark, supercharge, harness, ever-evolving
- it's worth noting, it's important to note, at the end of the day, when it comes to
- at its core, in today's world, the reality is, the truth is, going forward, let's dive in

Cut often-empty adverbs when they add nothing: just, literally, honestly, simply, actually, truly, fundamentally, importantly, crucially, inherently, inevitably.

## Patterns to cut

- **Binary contrasts:** “This is not X. It is Y.” State Y directly.
- **Throat-clearing:** “Here’s the thing,” “Let me be clear,” or “I’ll be honest.” Start with the point.
- **Faux insight:** “What everyone misses” or “What nobody tells you.” Make the claim stand on its own.
- **Colon reveals:** Avoid fake-dramatic “The best part: it learns.” Use a plain sentence.
- **Superficial analysis:** Replace trailing “highlighting,” “underscoring,” “reflecting,” or “showcasing” with the concrete effect.
- **Importance puffery:** Remove “pivotal moment,” “vital role,” “testament,” and similar claims. State the fact.
- **Weasel attribution:** Name the source behind “experts agree” or “studies show,” or remove the claim.
- **Fake-strong verbs:** Prefer clear “is” and “has” over “serves as” and similar inflation.
- **Synonym cycling:** Repeat the correct term instead of rotating agent, assistant, and tool.
- **Negative listing:** Replace “Not X. Not Y. Z.” with Z.
- **Dramatic fragmentation:** Avoid stacked fragments and mic-drop sentences.
- **Robotic rhythm:** Avoid repeated sentence shapes and mechanically symmetrical paragraphs.
- **Rhetorical setups:** Remove “What if I told you,” “Think about it,” “Plot twist,” and self-answered questions.
- **Fake-profound endings:** Delete the metaphor or aphorism and end on the clearest concrete point.
- **Summary endings:** Remove “In conclusion,” “Ultimately,” and paragraphs that merely repeat the piece.
- **Formatting slop:** Avoid emoji headings, decorative bold, unnecessary bullets, and headings over tiny sections.
- **Em-dash clusters:** Use none in short copy and at most one or two in longer writing when they improve clarity.

## Workflow

1. Read the full draft.
2. Identify the core point and three to five voice signals to preserve.
3. For detection, return named findings with quoted evidence and short fixes.
4. For editing, make the minimum effective changes.
5. Check the result against `eval.md`; fix every failure.
6. Return the full edited draft and a short **What changed** section.

## Attribution

Adapted from [petergyang/no-ai-slop](https://github.com/petergyang/no-ai-slop) at commit `61c21c351da4dcb40946a11fead978f2078a2c65`. MIT licensed; see `LICENSE`.
