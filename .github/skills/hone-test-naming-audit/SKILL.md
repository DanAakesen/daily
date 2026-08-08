---
name: "hone:test-naming-audit"
description: >-
  Checks that test method and function names read as complete sentences
  describing behavior. Flags cryptic names like test1, testFoo, or abbreviated
  names that do not describe what is being tested. Designed to run on every PR.
  Do NOT use for test coverage, test structure, or non-test code.
compatibility: >-
  Requires a local repository checkout with test files accessible on disk.
  Works with any programming language and test framework.
metadata:
  short-description: Checks test names read as sentences
---

# Test Naming Audit

## What This Skill Does

Scans test files across the codebase and evaluates whether each test
method/function name communicates the behavior being verified. A good test name
reads as a complete sentence: it states what is being tested, under what
conditions, and what the expected outcome is.

Flags tests whose names are:

- **Cryptic**: `test1`, `test2`, `testA`, `testIt`, `foo_test`.
- **Too short**: Single-word names like `testParse`, `testLogin`, `testSave`
  that omit conditions and expectations.
- **Abbreviated**: `testUsrAuth`, `test_inv_req` where abbreviations hurt
  readability.
- **Implementation-focused**: Names that reference implementation details
  rather than behavior (`testCallsApi`, `testUsesCache`).
- **Numbered**: Names using numeric suffixes to distinguish cases
  (`testParse1`, `testParse2`).

Reports each finding with the test name, file:line, the issue category, and a
suggested improvement pattern.

## When To Use

- On every PR that touches test files.
- As a weekly sweep of the full test suite.
- When the user asks to "audit test names" or "check test naming".

## Do Not Use

- For test coverage analysis or missing tests.
- For test structure, assertions, or setup/teardown patterns.
- For non-test code naming — use `hone:intent-clarity-audit` or
  `hone:naming-specificity-audit` instead.
- To rename tests automatically. This skill reports findings only.

## Inputs To Confirm

1. **Scope**: Which directories or file patterns to scan for tests (default:
   auto-detect test directories and files matching common patterns like
   `*_test.*`, `*.test.*`, `*.spec.*`, `test_*.*`, `*Test.*`, `*Spec.*`).
2. **Exclusions**: Glob patterns for files to skip (e.g., test helpers,
   fixtures, generated tests).
3. **Strictness**: `standard` (flag clearly bad names) or `strict` (also flag
   names that are acceptable but could be more descriptive). Default: `standard`.

## Instructions

1. **Find test files.** Walk the repository tree and identify test files using
   common naming conventions:
   - Files: `*_test.go`, `*.test.ts`, `*.test.js`, `*.spec.ts`, `*.spec.js`,
     `test_*.py`, `*_test.py`, `*_test.rb`, `*Test.java`, `*Test.kt`,
     `*Spec.java`, `*Spec.kt`, `*_spec.rb`, `*Tests.swift`, `*_tests.rs`.
   - Directories: `test/`, `tests/`, `__tests__/`, `spec/`.
   Apply user exclusions.

2. **Extract test names.** For each test file, identify individual test
   definitions using language-appropriate patterns:
   - JavaScript/TypeScript: `it("...")`, `test("...")`, `describe("...")` blocks
     with `it`/`test` inside.
   - Python: `def test_*` methods, `@pytest.mark.parametrize` names.
   - Go: `func Test*(t *testing.T)`.
   - Java/Kotlin: `@Test` annotated methods, JUnit 5 `@DisplayName`.
   - Ruby: `it "..."`, `describe`, `context` blocks.
   - Rust: `#[test] fn test_*`.
   - Swift: `func test*()`.
   Record the test name and file:line.

3. **Evaluate each test name.** Apply these checks in order:

   a. **Cryptic check**: Flag if the name matches patterns like `test\d+`,
      `testA`, `testIt`, `test_it`, or is a single generic word after the test
      prefix.

   b. **Too-short check**: Flag if the name (excluding framework prefix/wrapper)
      contains fewer than 3 words (using camelCase, snake_case, or string
      splitting for `it("...")` style names).

   c. **Abbreviation check**: Flag if the name contains tokens of 3 or fewer
      characters that are not common words (`the`, `for`, `and`, `is`, `to`,
      `it`, `a`, `an`, `of`, `in`, `on`, `or`, `no`, `not`, `be`, `by`,
      `if`, `at`, `do`, `up`).

   d. **Implementation-focus check**: Flag if the name references
      implementation verbs (`calls`, `uses`, `invokes`, `creates`, `mocks`,
      `stubs`, `spies`) without describing the behavior.

   e. **Numbered check**: Flag if the name ends with a numeric suffix that
      distinguishes it from an otherwise identical sibling name.

   f. **Sentence check** (strict mode only): Flag if the name, when expanded
      from camelCase/snake_case, does not form a readable sentence with a
      subject, condition, and expectation pattern (e.g.,
      "returns error when input is empty").

4. **Classify severity.**
   - **High**: Cryptic or numbered names.
   - **Medium**: Too-short or implementation-focused names.
   - **Low**: Abbreviation issues, or strict-mode sentence failures.

5. **Suggest improvements.** For each finding, suggest a name pattern (not a
   specific rename) showing the expected structure:
   - `should <expected behavior> when <condition>`
   - `<method under test> returns <expected> when <condition>`
   - `<scenario> results in <outcome>`

6. **Produce the report** per Output Requirements.

## Output Requirements

Produce a Markdown report:

```markdown
# Test Naming Audit

**Repo**: <repo name>
**Scope**: <N> test files, <M> test cases | **Findings**: <count>

## Findings

| # | Test Name | File | Line | Issue | Severity | Suggested Pattern |
|---|-----------|------|------|-------|----------|-------------------|
| 1 | `test1` | tests/auth.test.ts | 14 | Cryptic name | High | `should reject expired tokens` |
| 2 | `testParse` | parser_test.go | 42 | Too short — missing conditions | Medium | `TestParse_ReturnsErrorForMalformedInput` |

## Summary

- **By issue**: 3 cryptic, 5 too-short, 2 numbered, 1 abbreviated
- **By severity**: 5 high, 3 medium, 3 low
- **Hotspot files**: auth.test.ts (4 findings), parser_test.go (3 findings)
- **Overall**: <X>% of test names meet the sentence-style standard
```

## Quality Bar

- Every finding must reference a real test name at the stated file:line.
- Do not flag `describe`/`context` block names — only leaf test cases.
- Do not flag test names that use `@DisplayName` or equivalent display-name
  annotations if the display name itself reads as a sentence.
- Framework-idiomatic patterns are acceptable: Go's `TestFoo_Bar_Baz` style
  is fine if each segment adds meaning.
- Suggested patterns must be relevant to the specific test, not generic.
- If all test names pass, state that explicitly with the total count checked.
