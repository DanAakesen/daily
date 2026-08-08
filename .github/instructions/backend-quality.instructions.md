# Backend Quality Rules (Always-On)

These rules apply to ALL backend code. Never violate them.

---

## API Design

- Every endpoint returns a consistent envelope: `{ data, error, meta }` or problem details (RFC 7807)
- Use HTTP status codes correctly — don't return 200 with an error body
- Validate all input at the boundary (controller/handler level) before it reaches domain logic
- Paginate list endpoints by default — never return unbounded collections
- Version APIs explicitly (URL prefix or header) from day one
- Use consistent naming: plural nouns for collections (`/users`), singular for actions (`/auth/login`)
- Return 201 + Location header for successful creation, not just 200
- Support partial responses (`?fields=id,name`) for large resource representations
- Rate limit all public endpoints — not just auth. Use 429 + Retry-After header
- CORS: whitelist specific origins, never `Access-Control-Allow-Origin: *` in production

---

## Data Access

- Never expose raw database entities in API responses — map to DTOs/view models
- Use parameterised queries or ORM — never string-concatenate SQL
- Keep database calls out of loops — batch or join instead
- Transactions should be as short as possible — do validation before opening one
- Index every column used in WHERE/JOIN/ORDER BY on tables above 10K rows
- Use connection pooling — never open/close connections per request
- Soft-delete for user-facing data (add `deleted_at`), hard-delete only for truly ephemeral data
- Migrations are forward-only in production — never edit a migration that has been applied
- Always set query timeouts — no query should run unbounded
- Use optimistic concurrency (etag/version column) for resources updated by multiple actors

---

## Error Handling

- Catch at boundaries, not everywhere — let exceptions bubble to a global handler
- Log the full exception (stack, context) server-side; return only safe messages to clients
- Distinguish between retryable (503 + Retry-After) and permanent (4xx) failures
- Never swallow exceptions silently — at minimum log at Warning level
- Include correlation IDs in error responses so users can reference them in support requests
- Use typed/domain exceptions for expected failures (NotFound, Conflict, ValidationFailed) — not generic Exception
- Circuit breaker for external service calls — fail fast when downstream is unhealthy
- Dead letter queues for failed async processing — never silently drop messages

---

## Architecture

- Dependencies point inward: Controllers → Services → Domain. Domain has zero external dependencies
- Configuration lives in environment/config files, never hardcoded — use IOptions/env vars
- One responsibility per service class — if the name includes "And", split it
- Async all the way — never block on async code (.Result, .Wait(), .GetAwaiter().GetResult())
- Use dependency injection — never `new` up services with dependencies inside other services
- Interfaces at boundaries — concrete classes internally, interfaces where you cross module/layer boundaries
- Background work belongs in background services (hosted services, queue workers), not in request handlers
- Cache deliberately — define TTL, invalidation strategy, and cache-aside pattern. No "cache everything and hope"
- Feature flags for risky deployments — trunk-based development + flags beats long-lived branches

---

## Observability

- Structured logging (key-value pairs) not string interpolation in log messages
- Every HTTP call and DB query should be traceable via correlation ID
- Add health check endpoints (/health, /ready) that verify downstream dependencies
- Emit metrics for: request duration, error rate, queue depth, cache hit ratio
- Log at appropriate levels: Error (needs action), Warning (degraded), Info (business events), Debug (troubleshooting)
- Include operation context in logs: user ID, tenant ID, request ID, operation name
- Distributed tracing spans around: HTTP calls, DB queries, cache operations, queue publish/consume
- Alert on error rate spikes and latency percentile degradation (p95/p99), not just averages

---

## Azure Functions / Serverless

- Keep handlers thin — extract logic into testable service classes
- Set appropriate timeouts and configure retry policies explicitly
- Use managed identity for service-to-service auth — never connection strings with keys in code
- Idempotency: design every trigger handler to be safe to re-execute
- Use poison message queues — after N retries, move to dead letter for investigation
- Cold start mitigation: minimize dependencies, use always-ready instances for critical paths
- Output bindings for simple writes; SDK clients for complex operations
- Durable Functions for orchestration — don't build state machines in regular functions

---

## Concurrency And Resilience

- Use cancellation tokens — pass them through the entire call chain and respect them
- Implement retry with exponential backoff + jitter for transient failures
- Set timeouts on ALL external calls (HTTP, DB, cache, queue) — never wait forever
- Use pessimistic locking only when optimistic concurrency isn't sufficient (rare)
- Bulkhead pattern: isolate resources per tenant/operation type to prevent cascade failures
- Graceful shutdown: drain in-flight requests, finish processing current messages, then stop
