# Architecture — Always-On Rules

These rules apply to ALL code. Never violate them.

---

## Design And Refactoring

- **Favor small bounded refactors** — Choose narrow, behavior-preserving refactors with clear write boundaries over broad redesigns
- **Never suggest giant rewrites** — "Rewrite the auth system" is not actionable. "Extract token validation into a dedicated class" is
- **Every suggestion must be independently executable** — If it requires 5 other changes first, it's too big
- **Extract repeated local logic** — Deduplicate validation, mapping, error handling, and other repeated local patterns into cohesive helpers
- **Remove dead or obsolete code** — Delete redundant branches, stale glue code, and obviously unused paths when the behavior is clear
- **Simplify awkward boundaries** — Tighten confusing conditionals and interface edges instead of layering more special cases on top
- **Do not speculate on architecture** — Base structural decisions on visible repo boundaries, entry points, configs, and validation paths
- **Separate refactoring from features** — A refactoring PR changes structure without changing behavior. A feature PR adds behavior. Don't mix them
- **One responsibility per change** — Each PR/commit should do one thing well, not combine cleanup + feature + performance fix

---

## Performance

- **Optimize a named metric on a named surface** — Scope performance work to one flow and one target metric before changing code
- **Measured evidence wins** — Prefer profiles, traces, benchmarks, query plans, bundle reports, and load tests over optimization folklore
- **Label inferences honestly** — If runtime data is missing, mark hotspots as inferred and propose the smallest measurement step first
- **Fix critical-path waste first** — Prioritize repeated work, N+1 calls, missing caches, unnecessary serialization or copying, oversized bundles, rerender churn, and lock contention on hot paths
- **Prefer the smallest validating fix** — Make the narrowest experiment or improvement that can prove or disprove the bottleneck
- **No premature optimization** — Don't add caching, pooling, lazy loading, or parallelism without evidence of a bottleneck
- **Profile before guessing** — "I think this is slow" is not a reason to refactor. Show the numbers

---

## Observability And Ownership

- **Instrument important workflows** — Critical request paths, jobs, state transitions, retries, and integrations need logs, metrics, and traces
- **Structured signal over vague signal** — Use structured logs with useful fields, metrics on success/latency/failure, and spans around major boundaries
- **Alert on what matters operationally** — Important services need alerts, dashboards, SLOs, deploy checks, or health signals tied to real failure modes
- **Treat weak telemetry as a gap** — If missing signal would slow detection or diagnosis, add observability before the next incident does it for you
- **Don't turn observability into monitoring-stack redesign** — Keep recommendations local and actionable, not "adopt OpenTelemetry across the org"
- **Reduce ownership risk proactively** — High-churn, low-test, unclear-owner surfaces need CODEOWNERS coverage, nearby validation, docs, or narrow decoupling
- **Never invent owners** — Separate observed ownership evidence (git blame, CODEOWNERS, PR history) from inference. Call out orphaned surfaces directly
- **Choose safe surfaces first** — Prefer local, well-bounded, easy-to-validate areas when making architectural follow-up changes

---

## Dependency And Coupling

- **Depend on abstractions, not implementations** — Interfaces/protocols at boundaries allow swapping implementations without cascading changes
- **No circular dependencies** — If A depends on B depends on A, extract the shared concept into C
- **Limit dependency fan-out** — A module that imports 15 other modules is too coupled. Extract a facade or split the module
- **Package boundaries are contracts** — Treat public APIs of internal packages as stable contracts. Breaking changes need migration paths
- **Prefer composition over inheritance** — Deep inheritance hierarchies are brittle. Compose behavior from focused, single-purpose pieces

---

## API and Interface Design

- **Design for the caller** — APIs should be obvious to use correctly and hard to use incorrectly
- **Fail fast on invalid input** — Validate at entry points, not deep in the call chain
- **Backward compatibility by default** — New fields are optional, removed fields are deprecated first, breaking changes are versioned
- **Idempotency for side effects** — Operations that can be retried (HTTP PUT, queue handlers, cron jobs) must produce the same result on re-execution
- **Document non-obvious contracts** — If a function has preconditions, postconditions, or side effects that aren't obvious from the signature, document them
