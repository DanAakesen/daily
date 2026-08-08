---
name: "hone:broken-windows-hunt"
description: >-
  Detects entropy signals in a codebase: stale TODOs, disabled tests,
  lint suppressions, commented-out code, dead imports, empty catch
  blocks, and deprecated API usage. Designed for daily runs to catch
  quality erosion early. Do NOT use for feature work, refactoring
  planning, or security audits.
compatibility: >-
  Requires a local repository checkout with source files accessible on
  disk. Works with any programming language.
metadata:
  short-description: Detects entropy signals like stale TODOs and dead code
---

# Broken Windows Hunt

## What This Skill Does

Scans the codebase for signs of accumulated technical neglect -- the
"broken windows" that signal declining quality and invite further
shortcuts. Each finding is a small fix that prevents larger decay.

Detected signal categories:

- **Stale TODOs**: TODO/FIXME/HACK/XXX comments with no linked issue
  or with dates older than 90 days.
- **Disabled tests**: tests marked skip, pending, xfail, or
  commented out.
- **Lint suppressions**: inline ignores, nolint, eslint-disable,
  type: ignore, and similar markers.
- **Commented-out code**: blocks of commented code longer than 3
  lines that are clearly executable code, not documentation.
- **Dead imports**: imported symbols that are not referenced in the
  file.
- **Empty catch/except blocks**: error handlers that silently
  swallow exceptions.
- **Deprecated API usage**: calls to functions or methods marked
  deprecated via language-standard annotations or doc comments.

## When To Use

- Daily scheduled sweep to catch new entropy before it compounds.
- After a sprint or release to assess accumulated shortcuts.
- When joining a new codebase to gauge maintenance health.

## Do Not Use

- For feature development or refactoring planning (use other skills).
- For security vulnerability scanning (use a security tool).
- For style or formatting issues (use a linter).
- For deep architectural analysis (use intent-clarity-audit or
  naming-specificity-audit).

## Inputs To Confirm

1. **Scope** -- which directories or file patterns to scan
   (default: entire repo, excluding vendored/generated code).
2. **TODO age threshold** -- how old a TODO must be to count as stale
   (default: 90 days, inferred from git blame).
3. **Categories to include** -- which signal categories to check
   (default: all).

## Instructions

1. Identify the repository root and enumerate source files, excluding
   vendored directories (`vendor/`, `node_modules/`, `.git/`,
   `third_party/`), generated files, lock files, and binary assets.
2. **Stale TODOs**: search for TODO, FIXME, HACK, and XXX comments.
   For each, check:
   - Is there a linked issue number or URL? If yes, note it but
     still flag if the issue is closed or the comment is very old.
   - Use `git blame` on the line to determine age. Flag if older
     than the configured threshold.
   - Record the comment text, file path, line number, and age.
3. **Disabled tests**: search for test-disabling patterns across
   languages:
   - JavaScript/TypeScript: `it.skip`, `describe.skip`, `xit`,
     `xdescribe`, `test.skip`.
   - Python: `@pytest.mark.skip`, `@unittest.skip`, `@pytest.mark.xfail`.
   - Ruby: `skip`, `pending`, `xit`.
   - Go: `t.Skip()`.
   - Java: `@Disabled`, `@Ignore`.
   - Also detect fully commented-out test functions.
4. **Lint suppressions**: search for inline suppression markers:
   - `eslint-disable`, `@ts-ignore`, `@ts-expect-error`, `nolint`,
     `noqa`, `type: ignore`, `rubocop:disable`, `// noinspection`,
     `@SuppressWarnings`, `#pragma`, `NOLINT`.
   - Record the rule being suppressed if specified.
5. **Commented-out code**: identify blocks of 3+ consecutive
   commented lines that parse as valid code in the file's language.
   Exclude license headers, documentation blocks, and ASCII art.
6. **Dead imports**: for each file, extract import/require/use
   statements and check whether the imported symbol appears elsewhere
   in the file. Flag unused imports.
7. **Empty catch blocks**: find try/catch, try/except, rescue, or
   equivalent blocks where the error handler body is empty or
   contains only a comment.
8. **Deprecated API usage**: search for deprecation annotations
   (`@deprecated`, `@Deprecated`, `DeprecationWarning`,
   `[[deprecated]]`) in the codebase, then find call sites of those
   deprecated symbols.
9. For each finding, record:
   - Category (one of the seven above).
   - File path and line number.
   - The offending code snippet (1-3 lines).
   - Severity: `high` (disabled tests, empty catches),
     `medium` (stale TODOs, lint suppressions, deprecated usage),
     `low` (dead imports, short commented-out code).
   - Suggested fix (e.g., "remove dead import", "add error logging
     to catch block", "convert TODO to issue #N or delete").
10. Produce the output report.

## Output Requirements

Produce a Markdown report with:

- **Health summary**: a one-paragraph assessment of the codebase's
  entropy level with total finding count and breakdown by category.
- **Findings by category**: one section per category with a table of
  findings (file, line, snippet, severity, suggested fix).
- **Trend indicators**: if this is not the first run, note whether
  entropy is increasing, stable, or decreasing (based on finding
  count vs. previous run if available; otherwise note this is a
  baseline).
- **Quick wins**: the top 5 findings that can be fixed in under 5
  minutes each.

## Quality Bar

- Every finding must include a file path, line number, and code
  snippet.
- Stale TODO age must be derived from git blame, not guessed.
- Disabled tests must be distinguished from conditionally skipped
  tests (e.g., platform-specific skips with a reason are lower
  severity than bare `skip` calls).
- Commented-out code detection must not flag license headers or
  documentation blocks.
- The report must be actionable as a daily cleanup checklist.
