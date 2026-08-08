---
name: "hone:naming-specificity-audit"
description: >-
  Flags classes, modules, and functions with vague generic names like
  Manager, Handler, Processor, Helper, Utils, Service, Base, Common,
  and Misc. Suggests more specific alternatives based on what the code
  actually does. Use weekly to prevent naming drift. Do NOT use for
  variable-level naming or style enforcement.
compatibility: >-
  Requires a local repository checkout with source files accessible on
  disk. Works with any programming language that uses classes, modules,
  or named functions.
metadata:
  short-description: Flags vague names like Manager, Handler, Utils
---

# Naming Specificity Audit

## What This Skill Does

Scans classes, modules, functions, and exported symbols for names that
use vague generic suffixes or prefixes. These names hide intent and
make codebases harder to navigate. The skill identifies each vague
name, analyzes what the code actually does, and suggests a more
specific alternative.

Target patterns include but are not limited to: `Manager`, `Handler`,
`Processor`, `Helper`, `Utils`, `Utility`, `Service`, `Base`,
`Common`, `Misc`, `Impl`, `Core`, `Engine`, `Wrapper`, `Controller`
(when used generically outside MVC frameworks).

## When To Use

- Weekly scheduled audit of the full codebase.
- When reviewing a module that feels hard to navigate or understand.
- After a large refactor to catch names that no longer reflect the
  code's purpose.

## Do Not Use

- For local variable or parameter naming (too noisy, too subjective).
- For enforcing a specific naming convention or casing style (use a
  linter).
- For dead code detection (use the broken-windows-hunt skill).

## Inputs To Confirm

1. **Scope** -- which directories or file patterns to scan
   (default: entire repo, excluding vendored/generated code).
2. **Framework context** -- whether the project uses MVC or similar
   frameworks where `Controller` and `Service` are idiomatic
   (default: auto-detect from project structure).
3. **Severity threshold** -- whether to report all findings or only
   high-confidence ones (default: all).

## Instructions

1. Identify the repository root and enumerate source files, excluding
   vendored directories, generated files, and binary assets.
2. Detect the project's framework conventions by checking for known
   framework markers (e.g., Rails, Django, Spring, Express, Next.js).
   If a framework uses `Controller` or `Service` idiomatically, do
   not flag those patterns in framework-conventional locations.
3. For each source file, extract declarations of:
   - Classes and structs.
   - Modules and namespaces.
   - Top-level and exported functions.
   - Significant type aliases and interfaces.
4. Check each name against the vague-name pattern list. A name is
   flagged if it:
   - Ends with a vague suffix (`UserManager`, `DataHandler`).
   - Consists entirely of a vague word (`Utils`, `Helpers`, `Common`).
   - Uses a vague prefix with no specificity (`BaseProcessor`).
5. For each flagged name, analyze the implementation to determine what
   the code actually does:
   - Read the class/function body to identify its primary
     responsibility.
   - Check method names and call patterns for clues.
   - Note if the entity has a single clear responsibility or is doing
     too many things (which may indicate a design issue beyond naming).
6. Suggest a more specific name based on the actual behavior:
   - `UserManager` that only fetches users -> `UserRepository` or
     `UserFetcher`.
   - `DataProcessor` that validates input -> `InputValidator`.
   - `StringUtils` with only formatting methods -> `StringFormatter`.
7. Record each finding with:
   - File path and line number of the declaration.
   - Current name.
   - What the code actually does (one sentence).
   - Suggested replacement name.
   - Confidence: `high` (clear single responsibility, obvious better
     name), `medium` (reasonable suggestion, may need team input), or
     `low` (entity does too many things; renaming alone will not help).
8. Group findings by severity and produce the output report.

## Output Requirements

Produce a Markdown report with:

- **Summary**: total findings, breakdown by confidence level, and a
  note about any framework conventions detected and excluded.
- **Findings table**: one row per finding with columns for file, line,
  current name, what it does, suggested name, and confidence.
- **Design concerns**: a separate short section listing any entities
  flagged as `low` confidence because they do too many things --
  these are candidates for decomposition, not just renaming.
- **Recommended actions**: the top 5 highest-value renames to do
  first, considering how widely each name is referenced.

## Quality Bar

- Every finding must cite a file path and line number.
- Suggested names must be derived from what the code actually does,
  not from a generic lookup table.
- Framework-conventional names (e.g., Rails controllers) must not be
  flagged unless they deviate from the framework pattern.
- The report must distinguish naming problems from design problems
  (god objects flagged as low confidence).
- The output must be usable as a refactoring checklist.
