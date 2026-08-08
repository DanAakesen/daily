# .NET Backend Project Instructions

> Drop this file into `.github/copilot-instructions.md` in any .NET backend project.

## Architecture
- Clean Architecture: Domain → Application → Infrastructure → Api
- Domain layer has zero dependencies — no NuGet, no framework references
- Application layer uses MediatR (CQRS) — one handler per file
- Infrastructure implements interfaces defined in Application
- Api layer is thin — controllers delegate to MediatR, no business logic

## Code style
- C# 12+ features: primary constructors, collection expressions, raw string literals
- Nullable reference types enabled — no `null!` suppression without justification
- Prefer records for DTOs and value objects
- Sealed classes by default — unseal only when inheritance is needed
- File-scoped namespaces

## Naming
- Async methods suffixed with `Async`
- Interfaces prefixed with `I` (standard .NET convention)
- Private fields: `_camelCase`
- No abbreviations in public APIs — `cancellationToken` not `ct`

## Error handling
- Result pattern (not exceptions) for expected failures
- Exceptions only for truly exceptional/unrecoverable situations
- FluentValidation for input validation in Application layer
- ProblemDetails for API error responses

## Testing
- xUnit + FluentAssertions + NSubstitute
- One test class per handler/service
- Test naming: `MethodName_Scenario_ExpectedResult`
- Integration tests use WebApplicationFactory
- Contract tests for broker/external service boundaries

## Patterns
- Strongly-typed IDs (not raw Guid/int for entity identifiers)
- Domain events for cross-aggregate communication
- Repository pattern only for aggregates, not every entity
- Unit of Work via EF Core's DbContext — no custom UoW wrapper
- Options pattern for configuration — no static config access

## Anti-patterns (never do)
- No anemic domain models — behavior belongs on the entity
- No service locator — always constructor injection
- No `Task.Result` or `.Wait()` — async all the way
- No catching `Exception` base class — catch specific types
- No business logic in controllers or middleware
