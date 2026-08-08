---
name: "hone:magic-number-hunt"
description: >-
  Surfaces magic numbers, unexplained string literals, hardcoded URLs,
  configuration values buried in code, and other "magical" values that
  should be named constants or config entries. Use when you want a
  weekly sweep for unnamed literals. Do NOT use for style or formatting
  audits.
compatibility: >-
  Requires a local repository checkout with source files accessible on
  disk. Works with any programming language.
metadata:
  short-description: Surfaces magic numbers and unexplained literals
---

# Magic Number Hunt

## What This Skill Does

Scans source files for literal values that lack explanatory names:
numeric magic numbers, unexplained string constants, hardcoded URLs,
embedded credentials patterns, timeout/retry values, threshold values,
and configuration buried inline. Produces a prioritized list of
findings with file paths, line numbers, the offending literal, and a
suggested named constant or config key.

## When To Use

- Weekly scheduled sweep of an entire repository or workspace.
- Before a release to catch newly introduced unnamed literals.
- When onboarding a new codebase to understand hidden configuration.

## Do Not Use

- For style, formatting, or linting issues (use a linter).
- For security credential scanning (use a secrets scanner).
- For type-checking or correctness analysis.
- As a replacement for a full code review.

## Inputs To Confirm

1. **Scope** -- which directories or file patterns to scan
   (default: entire repo, excluding vendored/generated code).
2. **Severity threshold** -- whether to report all findings or only
   high-confidence ones (default: all).
3. **Language hints** -- any languages to prioritize if the repo is
   polyglot (default: auto-detect).

## Instructions

1. Identify the repository root and enumerate source files, excluding
   vendored directories (`vendor/`, `node_modules/`, `.git/`,
   `third_party/`), generated files, and binary assets.
2. For each source file, scan for literal values that meet any of
   these criteria:
   - **Numeric literals** other than 0, 1, -1, 2, and common
     mathematical constants (pi, e) that appear outside of constant
     declarations or enum definitions.
   - **String literals** longer than 3 characters that look like URLs,
     file paths, hostnames, API endpoints, version strings, or
     configuration keys, and are not already in a constants file or
     config module.
   - **Timeout, retry, and threshold values** -- any number used as a
     duration, count, size limit, or boundary that is not assigned to
     a named constant.
   - **Hardcoded booleans in function calls** -- e.g., `foo(true, false)`
     where the meaning is unclear without a named parameter.
3. For each finding, record:
   - File path and line number.
   - The literal value.
   - The surrounding code context (2-3 lines).
   - A severity tag: `high` (likely config leak or unexplained
     threshold), `medium` (unnamed numeric/string constant), or `low`
     (borderline case, may be intentional).
   - A suggested constant name and placement (e.g., "extract to
     `MAX_RETRY_ATTEMPTS = 3` in config module").
4. Group findings by file, then sort by severity descending within
   each file.
5. Exclude known false positives:
   - Array indices and loop bounds of 0 or 1.
   - Test fixture data clearly scoped to test files.
   - String literals used only in log messages or error messages
     (unless they contain URLs or config).
   - Enum or constant definitions themselves.
6. Produce the output report.

## Output Requirements

Produce a Markdown report with:

- **Summary**: total findings count, breakdown by severity, top 3
  files by finding count.
- **Findings table**: one row per finding with columns for file, line,
  literal, severity, and suggested fix.
- **Recommended actions**: a numbered list of the highest-value
  extractions to do first, ordered by impact (e.g., "Extract the 5
  hardcoded timeout values in `src/http/client.ts` into a config
  object").

## Quality Bar

- Every finding must include a file path and line number.
- Every finding must include the actual literal value, not a
  paraphrase.
- Suggested constant names must be specific (not `MAGIC_NUMBER_1`).
- False positive rate must be visibly low -- when in doubt, tag as
  `low` severity rather than omitting or inflating.
- The report must be usable as a work ticket list without further
  research.
