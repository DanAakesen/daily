---
name: "hone:duplication-hunt"
description: >-
  Finds duplicated code patterns across the codebase including exact copies and
  structural duplication (same logic with different variable names). Ranks by
  frequency and suggests extraction candidates. Designed for weekly runs.
  Do NOT use for method length, naming, or style concerns.
compatibility: >-
  Requires a local repository checkout with source files accessible on disk.
  Works with any programming language. No build step or runtime required.
metadata:
  short-description: Finds duplicated patterns worth extracting
---

# Duplication Hunt

## What This Skill Does

Scans source code to find duplicated patterns that indicate extraction
opportunities. Goes beyond simple copy-paste detection to find three types of
duplication:

1. **Exact duplicates**: Identical code blocks (3+ lines) appearing in two or
   more locations.
2. **Renamed duplicates**: Structurally identical code where only variable
   names, string literals, or numeric constants differ.
3. **Structural duplicates**: Code blocks that follow the same control flow
   pattern (same sequence of operations, branches, and loops) with different
   specifics — the "same shape, different nouns" pattern.

Ranks findings by occurrence count and block size to surface the highest-value
extraction candidates first.

## When To Use

- On a weekly schedule as a codebase hygiene check.
- After a large feature merges to catch introduced duplication.
- When onboarding to a codebase to understand where abstractions are missing.
- When the user asks to "find duplicated code" or "hunt for duplication".

## Do Not Use

- For method length — use `hone:method-brevity-audit` instead.
- For naming quality — use `hone:intent-clarity-audit` instead.
- For test naming — use `hone:test-naming-audit` instead.
- For design-level duplication (repeated architectural patterns across
  services). This skill operates at the code block level.
- To auto-extract or refactor duplicates. This skill reports findings only.

## Inputs To Confirm

1. **Scope**: Which directories or file patterns to scan (default: entire repo,
   excluding vendored/generated code).
2. **Minimum block size**: Smallest code block to consider, in lines (default:
   4 lines).
3. **Minimum occurrences**: How many times a pattern must appear to be reported
   (default: 2 for exact, 3 for structural).
4. **Exclusions**: Glob patterns for files or directories to skip.
5. **Top-N**: Maximum findings to report (default: 15).

## Instructions

1. **Identify scannable files.** Walk the repository tree. Exclude vendored
   directories (`node_modules`, `vendor`, `dist`, `build`, `.git`,
   `__pycache__`), generated files, lock files, and user-specified exclusions.
   Include test files in the scan — test duplication is also worth finding.

2. **Normalize source code.** For each file, produce a normalized form by:
   - Removing comments and blank lines.
   - Collapsing whitespace and indentation differences.
   - Preserving statement structure and control flow keywords.
   This normalized form is used for comparison; original code is used for
   reporting.

3. **Detect exact duplicates.** Slide a window of `minimum_block_size` to 50
   lines across each normalized file. Hash each window. Group windows by hash.
   When the same hash appears in 2+ locations (across files or within the same
   file), record an exact duplicate finding. Merge overlapping windows into
   the largest contiguous block.

4. **Detect renamed duplicates.** For blocks that are not exact matches,
   replace all identifiers with a placeholder token and all literals with type
   placeholders (`<STR>`, `<NUM>`, `<BOOL>`). Re-hash. Group by this
   structural hash. Blocks that share a structural hash but differ in the
   original are renamed duplicates.

5. **Detect structural duplicates.** Reduce each block to its control flow
   skeleton: the sequence of keywords (`if`, `else`, `for`, `while`, `return`,
   `try`, `catch`, `switch`, `case`, `match`, function calls as `CALL`) and
   their nesting structure. Hash the skeleton. Group blocks with matching
   skeletons that span at least 6 lines. This catches the "same logic,
   different details" pattern.

6. **Score and rank.** For each finding, compute a value score:
   `score = occurrences * block_lines * type_weight`
   where `type_weight` is 3.0 for exact, 2.0 for renamed, 1.0 for structural.
   Sort by score descending.

7. **Suggest extraction targets.** For the top findings, note:
   - What a shared function/method might look like (parameters needed).
   - Which files would benefit from the extraction.
   - Whether the duplication is in production code, test code, or both.

8. **Produce the report** per Output Requirements.

## Output Requirements

Produce a Markdown report:

```markdown
# Duplication Hunt

**Repo**: <repo name>
**Scanned**: <N> files | **Duplicate groups found**: <count>

## Findings

### 1. <Brief description of the duplicated pattern>

- **Type**: Exact / Renamed / Structural
- **Occurrences**: N locations
- **Block size**: M lines
- **Score**: <value>

**Locations**:

| File | Lines | Preview |
|------|-------|---------|
| src/auth/login.ts | 24-38 | `const token = await fetch(...)` ... |
| src/auth/signup.ts | 31-45 | `const token = await fetch(...)` ... |

**Extraction suggestion**: Extract to a shared `authenticateUser(credentials)`
function in `src/auth/shared.ts`.

---

### 2. ...

## Summary

- **By type**: 5 exact, 3 renamed, 2 structural
- **Total duplicated lines**: ~320 lines across 10 groups
- **Highest-value extractions**: Group 1 (saves ~45 lines), Group 3 (saves ~30 lines)
- **Principle**: "Twice is a smell, three times is a pattern" — groups with 3+ occurrences are strong extraction candidates
```

Every finding must reference real file paths and line ranges. Previews must be
actual code snippets, not fabricated examples.

## Quality Bar

- Every reported duplicate must be verifiable at the stated file:line ranges.
- Exact duplicates must be genuinely identical (modulo whitespace).
- Renamed duplicates must have the same structure when identifiers are replaced.
- Do not flag boilerplate that is intentionally repeated (e.g., license
  headers, import blocks of 3 lines or fewer, trivial getters/setters).
- Do not flag configuration files, data fixtures, or migration files.
- Extraction suggestions must be concrete (name the function, list parameters)
  and plausible (not every duplicate merits extraction — note when the
  coupling cost may outweigh the deduplication benefit).
- If no duplication is found above the threshold, state that explicitly.
