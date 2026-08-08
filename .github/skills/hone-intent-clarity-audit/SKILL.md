---
name: "hone:intent-clarity-audit"
description: >-
  Finds code that obscures its intent: unclear variable names, nested ternaries,
  boolean parameters without names, overly clever one-liners, and comments that
  restate code instead of explaining why. Focuses on recently changed files.
  Do NOT use for method length, duplication, or test naming concerns.
compatibility: >-
  Requires a local repository checkout. Works with any programming language.
  Optionally uses git history to focus on recently changed files.
metadata:
  short-description: Spots code that hides its intent
---

# Intent Clarity Audit

## What This Skill Does

Audits source code for patterns that make it harder to understand what the code
is doing and why. Focuses on five categories of intent obscurity:

1. **Unclear names**: Single-letter variables outside tiny loops, generic names
   (`data`, `temp`, `result`, `val`, `info`, `item`) in non-trivial scopes,
   abbreviated names that sacrifice readability.
2. **Nested ternaries**: Ternary or conditional expressions nested two or more
   levels deep.
3. **Unnamed boolean parameters**: Function calls passing bare `true`/`false`
   literals without a named parameter, comment, or object wrapper to explain
   the meaning.
4. **Overly clever one-liners**: Dense expressions that chain multiple
   operations, bitwise tricks used for non-bitwise purposes, regex used inline
   without explanation, or reduce/fold with complex accumulators.
5. **Restating comments**: Comments that describe what the next line does rather
   than why (e.g., `// increment counter` before `counter++`).

Reports findings with file:line, the offending snippet, the category, and a
brief explanation of why it harms clarity.

## When To Use

- On a weekly schedule to audit recently changed files.
- After a large feature branch merges.
- When reviewing code written by unfamiliar contributors.
- When the user asks to "find unclear code" or "audit code clarity".

## Do Not Use

- For method length — use `hone:method-brevity-audit` instead.
- For duplicated code — use `hone:duplication-hunt` instead.
- For test naming — use `hone:test-naming-audit` instead.
- For naming specificity (Manager, Handler, Utils) — use
  `hone:naming-specificity-audit` instead.
- To rewrite code. This skill reports findings only.

## Inputs To Confirm

1. **Scope**: Which directories or file patterns to scan (default: files changed
   in the last 14 days per git log, falling back to entire repo if no git
   history).
2. **Recency window**: Number of days to look back for changed files (default:
   14).
3. **Categories**: Which of the five categories to check (default: all).
4. **Exclusions**: Glob patterns for files or directories to skip.
5. **Top-N**: Maximum findings to report (default: 25).

## Instructions

1. **Determine file scope.** If git history is available, run
   `git log --since="<N> days ago" --diff-filter=ACMR --name-only` to get
   recently changed files. Deduplicate and filter to source files only. If git
   is unavailable, scan the full tree (respecting exclusions).

2. **Exclude non-source files.** Skip vendored directories, build output,
   generated files, lock files, binary files, and user-specified exclusions.

3. **Scan each file for all enabled categories.** For each source file:

   a. **Unclear names**: Identify variable, parameter, and function declarations.
      Flag single-character names outside `for`/`while` loop indices of 5 lines
      or fewer. Flag generic names (`data`, `temp`, `result`, `val`, `info`,
      `item`, `obj`, `thing`, `stuff`, `foo`, `bar`, `x`, `y` outside math)
      in scopes longer than 3 lines.

   b. **Nested ternaries**: Find ternary operators (`?:` in C-family,
      `if/else` inline in Python, etc.) where a ternary appears inside another
      ternary expression.

   c. **Unnamed booleans**: Find function/method calls with bare boolean
      literal arguments. Exclude well-known single-boolean APIs (e.g.,
      `setVisible(true)`, `Array.sort(reverse=true)` with keyword syntax).

   d. **Clever one-liners**: Flag lines that combine 3+ chained operations,
      use bitwise operators in non-bitwise contexts, contain inline regex
      longer than 40 characters without a comment, or use reduce/fold with
      accumulators longer than one line.

   e. **Restating comments**: Find comments directly above or inline with code
      where the comment merely describes the operation (e.g., "add 1 to x"
      above `x += 1`). Use simple heuristic: if the comment contains the same
      verbs/nouns as the code tokens, flag it.

4. **Classify severity.** For each finding assign a severity:
   - **High**: Nested ternaries 3+ deep, single-letter names in 20+ line
     scopes, boolean parameters in public API calls.
   - **Medium**: Two-level nested ternaries, generic names in 5-20 line scopes,
     clever one-liners.
   - **Low**: Restating comments, minor naming issues.

5. **Rank and truncate.** Sort by severity (high first), then by file path for
   grouping. Truncate to top-N.

6. **Produce the report** per Output Requirements.

## Output Requirements

Produce a Markdown report:

```markdown
# Intent Clarity Audit

**Repo**: <repo name>
**Scope**: <N> files changed in last <D> days | **Findings**: <count>

## Findings

### High Severity

| # | Category | File | Line | Snippet | Why |
|---|----------|------|------|---------|-----|
| 1 | Nested ternary | src/parser.ts | 142 | `a ? b ? c : d : e` | 2-level nested ternary obscures control flow |

### Medium Severity

| ... |

### Low Severity

| ... |

## Summary

- **By category**: 5 unclear names, 3 nested ternaries, 2 unnamed booleans, ...
- **Hotspot files**: file1.ts (7 findings), file2.py (4 findings)
- **Trend**: [if prior run data available, compare finding counts]
```

Every finding must reference a real file path and line number. Snippets must be
actual code from the file, truncated to fit a table cell (max 80 characters).

## Quality Bar

- Every finding must be verifiable at the stated file:line.
- Snippets must be real code, not fabricated examples.
- Severity assignments must follow the criteria defined in step 4.
- Do not flag idiomatic patterns that are universally understood in the
  language (e.g., `i` in a 3-line for loop, `_` for unused variables).
- Do not flag code in test fixtures or snapshot files.
- If no findings exist, state that explicitly.
- Keep the "Why" column concise (one sentence) and specific to the finding.
