# Testing — Always-On Rules

These rules apply to ALL testing code. Never violate them.

---

## Naming

- **Tests read like behavior** — Name every leaf test as a sentence that states behavior, condition, and expected outcome
- **No cryptic or numbered tests** — Ban names like `test1`, `testParse2`, `foo_test`, or other numeric suffixes used to distinguish cases
- **No unreadable abbreviations** — Expand abbreviated test names unless the abbreviation is truly standard and obvious
- **Behavior over implementation** — Name tests for outcomes and scenarios, not internal calls like `usesCache` or `callsApi`
- **Too-short names fail** — A test name that does not clearly express scenario plus outcome is incomplete
- **Only flag leaf tests** — Don't flag `describe`/`context`/`suite` block names; only leaf test names matter
- **Framework-idiomatic naming is fine** — Go's `TestParseConfig_EmptyInput` pattern is acceptable if each segment adds meaning

---

## Coverage Priorities

- **Test the risky surface first** — Prioritize exposed, central, high-churn, recently changed, and bug-fixed paths
- **Cover branches and failures** — Prefer missing branch, error, boundary, and regression coverage over more happy-path tests
- **Weak tests still count as gaps** — Treat assertion-light, snapshot-only, duplicated happy-path, and hidden-shared-state tests as missing coverage
- **Strengthen before duplicating** — Augment the nearest existing test module before creating parallel coverage elsewhere
- **Never pad coverage with trivial assertions** — `expect(true).toBe(true)` or testing constants count for nothing
- **Leave a backlog, not blind spots** — When you cannot close every gap, rank the remaining opportunities explicitly

---

## Test Design

- **Assert behavior, not plumbing** — Verify outcomes, contracts, and user-visible behavior instead of incidental implementation details
- **One assertion concept per test** — A test can have multiple `expect` calls if they verify the same logical concept, but not mixed concerns
- **Use real collaborators when cheap** — Prefer real deterministic dependencies over mocks when they keep tests simple and trustworthy
- **Mock only true boundaries** — Use fakes, stubs, or mocks at external boundaries (network, DB, file system, clock) or where they clearly reduce brittleness
- **Do not over-mock internals** — If testing requires mocking internal modules or services, redesign the seam instead of freezing implementation details
- **Keep fixtures explicit and local** — Favor small readable fixtures, factories, and helpers over brittle global setup
- **Optimize for speed and repeatability** — Prefer fast deterministic tests and replace slow high-mock coverage with cheaper lower-seam coverage when possible
- **Snapshot tests are brittle** — Only use snapshots for stable, rarely-changing structures (serialized configs, API contracts). Never for UI components that change frequently
- **No logic in tests** — Tests should not contain conditionals, loops, or try/catch. If you need branching, you need separate test cases
- **Test names are documentation** — If a test fails, its name alone should tell the developer what broke

---

## Validation Strategy

- **Validate narrow to broad** — Run targeted tests for the touched surface first, then widen only when confidence is still missing
- **Never jump straight to the broadest suite** — Don't run the full E2E suite when a unit test can prove the fix
- **Respect a red baseline** — If the relevant baseline is already failing for unrelated reasons, do not claim a fully validated pass
- **State residual risk** — After validation, explicitly call out what remains unproven or untested
- **Prefer repository scripts over ad hoc** — Use existing `npm test`, `pytest`, `dotnet test` etc. from the repo. Don't invent custom test commands
- **Never introduce a new test framework unless explicitly asked** — Work with what the project already uses

---

## Test Discipline

- **Tests must be independent** — No test should depend on another test's execution or side effects
- **Clean up after yourself** — Tests that create files, DB records, or state must clean up, or use transactions/sandboxes
- **Flaky tests are bugs** — A test that sometimes passes and sometimes fails is broken. Fix the non-determinism or delete it
- **Test the contract, not the clock** — Time-dependent tests must use injectable clocks or frozen time, never `sleep()`/`delay()`
- **Boundary dates are risky surfaces** — If app behavior depends on today, streaks, expiry, scheduling, hydration, or persisted timestamps, add tests for the boundary path using a fixed clock.
- **Parameterize repetitive cases** — If you're writing the same test 5 times with different inputs, use parameterized/table-driven tests
