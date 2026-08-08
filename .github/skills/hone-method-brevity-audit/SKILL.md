---
name: "hone:method-brevity-audit"
description: >-
  Scans a codebase for methods and functions that exceed configurable length
  thresholds. Reports a ranked list of the longest methods with file:line,
  language, and surrounding complexity signals. Designed for scheduled weekly
  runs. Do NOT use for style formatting, indentation, or naming concerns.
compatibility: >-
  Requires a local repository checkout with source files accessible on disk.
  Works with any programming language. No build step or runtime required.
metadata:
  short-description: Finds methods that have grown too long
---

# Method Brevity Audit

## What This Skill Does

Walks the source tree and identifies methods, functions, and closures whose
line count exceeds a configurable threshold. For each finding it reports the
fully qualified name, file path with line range, language, line count, and
optional complexity hints (nesting depth, number of branches, parameter count).
Findings are ranked longest-first so the worst offenders surface immediately.

## When To Use

- On a weekly schedule as a codebase health check.
- After a large merge or feature branch lands to catch method bloat.
- When onboarding to an unfamiliar codebase to find hot spots.
- When the user asks to "find long methods" or "audit method length".

## Do Not Use

- For style or formatting issues (indentation, whitespace, line wrapping).
- For naming quality — use `hone:intent-clarity-audit` instead.
- For test-specific naming — use `hone:test-naming-audit` instead.
- For duplication detection — use `hone:duplication-hunt` instead.
- To auto-refactor or split methods. This skill only reports findings.

## Inputs To Confirm

1. **Scope**: Which directories or file patterns to scan (default: entire repo,
   excluding vendored/generated code).
2. **Threshold**: Maximum acceptable method length in lines (default: 30 lines).
3. **Top-N**: How many findings to include in the report (default: 20).
4. **Exclusions**: Glob patterns for files or directories to skip (e.g.,
   `vendor/`, `generated/`, `node_modules/`).

## Instructions

1. **Identify scannable files.** Walk the repository tree. Exclude directories
   that match common vendored or generated patterns (`node_modules`, `vendor`,
   `dist`, `build`, `.git`, `__pycache__`) and any user-specified exclusions.

2. **Detect language per file.** Use file extension to determine the language.
   Support at minimum: TypeScript/JavaScript (`.ts`, `.tsx`, `.js`, `.jsx`),
   Python (`.py`), Ruby (`.rb`), Go (`.go`), Java (`.java`), Kotlin (`.kt`),
   Rust (`.rs`), Swift (`.swift`), C/C++ (`.c`, `.cpp`, `.h`), C# (`.cs`),
   PHP (`.php`), Shell (`.sh`, `.bash`).

3. **Parse method boundaries.** For each file, identify function and method
   definitions. Use language-appropriate heuristics:
   - Brace-delimited languages: match `function`, `def`, `fn`, `func`, method
     signatures, arrow functions assigned to variables, and class methods.
   - Indentation-delimited languages (Python, Ruby): track `def` blocks by
     indentation level changes.
   Count lines from the opening signature to the closing delimiter (inclusive).

4. **Measure each method.** Record:
   - Fully qualified name (class.method or module.function where detectable).
   - File path and start/end line numbers.
   - Total line count.
   - Language.
   - Nesting depth (deepest indent level relative to method body).
   - Branch count (if/else/switch/match/case/when occurrences).
   - Parameter count.

5. **Filter and rank.** Keep only methods exceeding the threshold. Sort by line
   count descending, breaking ties by nesting depth descending.

6. **Produce the report.** Output the top-N findings in the format specified
   under Output Requirements.

7. **Summarize.** After the findings table, include a summary with:
   - Total methods scanned.
   - Number exceeding threshold.
   - Distribution buckets (threshold-2x, 2x-3x, 3x+).
   - Top 3 files by total over-threshold method lines.

## Output Requirements

Produce a Markdown report with the following structure:

```markdown
# Method Brevity Audit

**Repo**: <repo name>
**Threshold**: <N> lines | **Scanned**: <count> methods | **Over threshold**: <count>

## Findings

| # | Method | File | Lines | Depth | Branches | Params | Lang |
|---|--------|------|-------|-------|----------|--------|------|
| 1 | ClassName.methodName | path/to/file.ts:42-118 | 76 | 5 | 12 | 4 | TypeScript |
| ... | | | | | | | |

## Summary

- **Distribution**: X methods 30-60 lines, Y methods 60-90 lines, Z methods 90+ lines
- **Hotspot files**: file1.ts (3 methods, 210 total excess lines), ...
- **Recommendation**: Consider extracting [specific suggestions based on findings]
```

Every finding must include a real file path and line range. Do not fabricate
paths or line numbers.

## Quality Bar

- Every reported method must exist at the stated file:line range.
- Line counts must be accurate to within 2 lines (to account for language
  ambiguity in closing delimiters).
- The report must not include methods from excluded directories.
- Methods below the threshold must not appear in findings.
- If no methods exceed the threshold, state that explicitly rather than
  producing an empty table.
- Do not suggest refactors unless the summary section calls for recommendations.
  Even then, keep suggestions brief and evidence-grounded.
