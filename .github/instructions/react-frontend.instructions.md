# React Frontend Project Instructions

> Drop this file into `.github/copilot-instructions.md` in any React frontend project.

## Stack defaults
- React 18+ with TypeScript (strict mode)
- Tailwind CSS for styling — no CSS modules, no styled-components
- Vite for build tooling (unless Next.js)
- Zustand for state management — not Redux, not Context for global state
- Prefer server components in Next.js projects; client components only when needed

## Code style
- Functional components only — no class components
- Named exports, not default exports (except pages/routes)
- Colocate files: component, hook, test, and types in the same folder
- One component per file — the file name IS the component name (PascalCase)
- Custom hooks go in a `hooks/` folder or colocated if single-use

## TypeScript
- Strict mode, no `any` — use `unknown` and narrow
- Prefer `interface` for object shapes, `type` for unions/intersections
- Props interfaces named `{ComponentName}Props`
- No enums — use `as const` objects or union types

## Tailwind
- Use utility classes directly — avoid @apply except for repeated multi-class patterns
- Use the canonical design-system CSS tokens or Tailwind theme tokens (colors, spacing, typography, radius, shadow, motion) — never magic numbers
- Prefer generic semantic/component token names (`--surface-default`, `--action-primary`, `--button-primary-bg`) over app-specific names (`--app-bg`, `--dashboard-panel`)
- Responsive: mobile-first (`sm:`, `md:`, `lg:`)
- Dark mode: use `dark:` variant, design for both

## Component patterns
- Prefer composition over prop drilling
- Error boundaries around feature boundaries
- Suspense for async — not loading state booleans
- Forms: use controlled inputs + Zod for validation
- Avoid useEffect for derived state — use useMemo or compute inline
- Hydration and persisted state must always settle. A failed localStorage/Zustand/IndexedDB hydration should render an explicit error state, not leave the app in a permanent skeleton/loading branch.
- Time-dependent UI must use an injectable clock or small date provider helper so streaks, schedules, and "today" labels can be tested deterministically.

## Testing
- Vitest + Testing Library for unit/integration
- Test behavior, not implementation — query by role/text, not data-testid
- No snapshot tests

## Anti-patterns (never do)
- No barrel files (index.ts re-exports) — they break tree-shaking
- No prop spreading (`{...props}`) without explicit typing
- No `// eslint-disable` without a comment explaining why
- No magic strings — extract to constants or config
- No inline styles — use Tailwind
