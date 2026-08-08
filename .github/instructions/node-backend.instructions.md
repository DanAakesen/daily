# Node.js Backend Project Instructions

> Drop this file into `.github/copilot-instructions.md` in any Node.js backend project.

## Stack defaults
- TypeScript (strict mode) — never plain JS
- Azure Functions for serverless, or Express/Fastify for long-running services
- Zod for runtime validation of inputs (API params, env vars, external data)
- Prefer native fetch over axios

## Code style
- ESM modules (`import/export`) — no CommonJS require
- Async/await — no callbacks, no raw .then() chains except in one-liners
- Named exports — no default exports
- Functions over classes unless state/lifecycle justifies it
- Keep files under 200 lines — split when approaching

## TypeScript
- Strict mode, no `any`
- Zod schemas as single source of truth — derive types with `z.infer<>`
- Use discriminated unions for state machines / result types
- Prefer `unknown` for external data boundaries, validate immediately

## Error handling
- Result pattern for expected failures (not thrown errors)
- Thrown errors only for unexpected/programmer errors
- Custom error classes extending Error with `code` field
- Always log structured (JSON) — not console.log strings in production

## Azure Functions specific
- One function per file
- Input/output bindings over imperative SDK calls where possible
- Durable Functions for orchestration — not manual queue chaining
- Use managed identity — no connection strings in code

## Project structure
```
src/
├── functions/     → Azure Function triggers
├── services/      → Business logic (pure, testable)
├── models/        → Zod schemas + inferred types
├── clients/       → External API wrappers
├── utils/         → Pure helper functions
└── config/        → Environment + validated config
```

## Testing
- Vitest for unit + integration
- Test services in isolation — mock clients, not services
- Use dependency injection (function params) for testability
- No mocking internal modules — redesign for testability instead

## Anti-patterns (never do)
- No `any` type assertions to silence errors
- No mixing async patterns (callbacks + promises + async/await)
- No global mutable state
- No secrets in environment without validation on startup
- No nested try/catch — handle errors at the boundary
