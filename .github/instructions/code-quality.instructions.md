# Code Quality — Always-On Rules

These rules apply to ALL code. Never violate them.

---

## Naming And Clarity

- **Specific names only** — Name exported classes, modules, and functions for their real responsibility; avoid vague names like `Manager`, `Handler`, `Processor`, `Helper`, `Utils`, `Service`, `Base`, `Common`, `Misc`, `Core`, `Engine`, or `Wrapper`
- **No generic locals in real scopes** — Rename `data`, `temp`, `result`, `item`, `info`, `val`, `obj`, `thing`, `foo`, `bar`, `x`, and `y` when the scope is non-trivial
- **Single-letter names are rare** — Use single-letter identifiers only for tiny loop indices or idiomatic unused variables (`_`)
- **Derive names from behavior** — If unsure what to name something, look at what it actually does and name it for that outcome
- **Don't flag framework-idiomatic names** — Conventional names in conventional locations (Rails controllers, React hooks, Go test functions) are fine
- **Naming problem ≠ design problem** — If a name is vague because the thing does too many things, the fix is splitting responsibility, not renaming
- **No bare boolean arguments** — Do not pass raw `true` or `false` into non-obvious APIs; use named options, enums, wrappers, or constants instead
- **No nested ternaries** — Replace nested conditional expressions with clear branching or a well-named helper
- **No clever one-liners** — Expand dense expressions, long inline regexes, reduce/fold accumulators, and non-obvious bitwise tricks into readable steps
- **Comments explain why** — Delete comments that only restate what the next line of code already says
- **No misleading comments** — A comment that contradicts the code is worse than no comment. Update or delete

---

## Size, Duplication, And Literals

- **Keep methods short** — Split functions once they move past roughly 30 lines or accumulate deep nesting, many branches, or too many parameters
- **Three copies means extract** — Treat exact, renamed, and structural duplication as an extraction candidate by the third occurrence, sooner for obvious copy-paste
- **Don't flag intentional repetition** — License headers, tiny import blocks, trivial getters/setters, config fixtures, and migrations are not duplication bugs
- **Consolidate repeated patterns** — Repeated validation, mapping, error handling, and transformation logic should become a shared local helper
- **Extraction must be concrete** — When suggesting extraction, name the helper, show its signature, and identify exactly which instances it replaces
- **Name important literals** — Replace unexplained literals with named constants or configuration; inline numbers should usually be limited to `0`, `1`, `-1`, `2`, and obvious mathematical constants
- **Always include the literal value** — When flagging a magic number, cite the actual value, not just "there's a magic number on line X"
- **Suggest a specific constant name** — Don't say "extract to a constant"; say `MAX_RETRY_ATTEMPTS = 3` or `CACHE_TTL_SECONDS = 300`
- **Thresholds must be named** — Timeouts, retries, limits, boundaries, and thresholds must live in named constants or config, not inline logic
- **No hardcoded operational strings** — Do not bury URLs, hostnames, file paths, endpoints, version strings, or config keys inside business logic

---

## Fallback Logic

- **No silent fallbacks** — Never substitute default values, empty arrays, or cached data when an operation fails. Surface the error to the caller instead
- **Fail loudly, don't mask** — If a service call, config lookup, or data fetch fails, throw or return an error. Don't quietly return a "safe" alternative that hides the problem
- **No speculative recovery** — Don't add fallback branches "just in case." Handle the specific known failure modes; let unknown failures propagate
- **Defaults require intent** — Only use fallback/default values when the product explicitly requires graceful degradation (e.g., feature flags). Document why the fallback exists
- **Never invent data** — If the real data is unavailable, show an error state or empty state — never generate placeholder/mock data as a runtime fallback
- **No catch-all try/catch wrapping** — Don't wrap entire functions in try/catch that returns a default. Catch specific exceptions at specific points
- **Every lifecycle path settles** — Async initialization, storage hydration, auth checks, and feature bootstraps must always transition to success or error state. Optional chaining must not skip the only state update that clears loading.
- **ID generation must be explicit** — Prefer `crypto.randomUUID()` when available. If unavailable, either surface an unsupported-environment error or use a named, documented fallback path that tests the degraded behavior; never silently downgrade to `Date.now()` / `Math.random()`.

---

## Broken Windows

- **Fix entropy early** — Remove stale `TODO`/`FIXME`/`HACK` items, disabled tests, dead imports, commented-out code, and deprecated API usage instead of normalizing them
- **Remove starter scaffolding** — Generated apps must delete unused framework starter assets, logos, default README sections, starter CSS, and placeholder images before handoff
- **Distinguish disabled from conditional tests** — A test skipped by platform/feature-flag is not a broken window; a test commented out with no explanation is
- **Don't flag license headers as dead code** — Legal headers, doc comments, and structured metadata are not "commented-out code"
- **Suppressions are temporary** — Inline lint or type suppressions must be justified and removed quickly; never leave them as permanent wallpaper
- **No empty exception handlers** — Every `catch`/`except`/`rescue` block must log, translate, recover, or rethrow; never swallow failures silently
- **Automate repeated manual workflows** — If a workflow requires repeated manual deploy, setup, release, or validation steps, script it or enforce it in CI instead of documenting toil
- **Distinguish missing from incomplete automation** — "No CI" vs "CI exists but doesn't cover X" are different findings with different fixes
- **Check in required scaffolding** — Keep referenced env templates, tool configs, migrations, infrastructure definitions, and other required artifacts in source control

---

## Confidence And Honesty

- **When unsure, mark low severity** — Don't inflate uncertain findings. Label confidence explicitly
- **Cite file and line** — Every finding must reference a specific location, not vague "somewhere in the codebase"
- **Ground impact in evidence** — Don't claim "this will cause bugs" without showing the path to failure
- **No generic advice** — Every suggestion must be concrete enough to implement without further research
- **Red validation blocks completion** — If a requested or relevant test, lint, build, type-check, audit, or smoke check fails, the task is incomplete. Fix it or clearly report the blocker; never present red validation as done.
