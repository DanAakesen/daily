# Design System — Always-On Rules

These rules apply to ALL frontend projects. Never treat visual styling as one-off page CSS.

---

## Required Artifacts

Every non-trivial frontend project must have:

1. **One canonical design-system CSS source** imported once by the app, usually `src/index.css` or `src/styles/design-system.css`.
2. **One root `DESIGN.md`** describing the same system in human-readable form.

Do not scatter design tokens across component files, route files, or feature-specific CSS modules.

---

## Token Architecture

Use a three-layer token model:

```text
Primitive palettes -> Semantic roles -> Component tokens
```

### 1. Primitive palettes

Primitive tokens are raw reusable values. They are allowed to be changed to re-skin the whole product.

Use generic category names:

```css
:root {
  --color-primary-01: ...;
  --color-primary-02: ...;
  --color-primary-03: ...;
  --color-primary-04: ...;
  --color-primary-05: ...;
  --color-primary-06: ...;
  --color-primary-07: ...;
  --color-primary-08: ...;
  --color-primary-09: ...;
  --color-primary-10: ...;

  --color-secondary-01: ...;
  --color-secondary-02: ...;
  --color-secondary-03: ...;
  --color-secondary-04: ...;
  --color-secondary-05: ...;
  --color-secondary-06: ...;
  --color-secondary-07: ...;
  --color-secondary-08: ...;
  --color-secondary-09: ...;
  --color-secondary-10: ...;

  --color-neutral-01: ...;
  --color-neutral-02: ...;
  --color-neutral-03: ...;
  --color-neutral-04: ...;
  --color-neutral-05: ...;
  --color-neutral-06: ...;
  --color-neutral-07: ...;
  --color-neutral-08: ...;
  --color-neutral-09: ...;
  --color-neutral-10: ...;

  --color-success: ...;
  --color-warning: ...;
  --color-danger: ...;
  --color-info: ...;
}
```

Ten steps are not mandatory when the UI only needs fewer, but the scale must be systematic and expandable. Do not name primitives after the app domain (`--app-bg`, `--trading-panel`, `--research-blue`) or after a single component.

### 2. Semantic roles

Semantic tokens describe intent. Components should mostly consume these, not primitive palettes directly.

Minimum expected roles:

```css
:root {
  --surface-canvas: var(--color-neutral-01);
  --surface-default: var(--color-neutral-02);
  --surface-muted: var(--color-neutral-03);
  --surface-elevated: var(--color-neutral-01);

  --text-primary: var(--color-neutral-10);
  --text-secondary: var(--color-neutral-08);
  --text-muted: var(--color-neutral-06);
  --text-inverse: var(--color-neutral-01);

  --border-subtle: var(--color-neutral-03);
  --border-default: var(--color-neutral-04);
  --border-strong: var(--color-neutral-06);

  --action-primary: var(--color-primary-06);
  --action-primary-hover: var(--color-primary-07);
  --action-secondary: var(--color-secondary-06);
  --action-secondary-hover: var(--color-secondary-07);

  --state-success: var(--color-success);
  --state-warning: var(--color-warning);
  --state-danger: var(--color-danger);
  --state-info: var(--color-info);

  --focus-ring: var(--color-primary-06);
}
```

Add roles when needed, but keep names reusable across apps. Avoid one-off roles that encode a screen or feature name.

### 3. Component tokens

Component tokens map semantic roles to reusable components.

Examples:

```css
:root {
  --button-primary-bg: var(--action-primary);
  --button-primary-bg-hover: var(--action-primary-hover);
  --button-primary-text: var(--text-inverse);

  --input-bg: var(--surface-elevated);
  --input-border: var(--border-default);
  --input-text: var(--text-primary);

  --panel-bg: var(--surface-default);
  --panel-border: var(--border-subtle);
  --panel-shadow: var(--shadow-raised);
}
```

Component code should use semantic or component tokens. It should not hard-code raw OKLCH/hex values or app-specific token names.

---

## Typography, Spacing, Radius, Shadow, Motion

The same layered model applies beyond color:

```css
:root {
  --font-sans: ...;
  --font-mono: ...;

  --space-01: 4px;
  --space-02: 8px;
  --space-03: 12px;
  --space-04: 16px;
  --space-05: 24px;
  --space-06: 32px;
  --space-07: 48px;
  --space-08: 64px;

  --radius-sm: ...;
  --radius-md: ...;
  --radius-lg: ...;
  --radius-xl: ...;

  --shadow-raised: ...;
  --shadow-overlay: ...;

  --duration-fast: 120ms;
  --duration-base: 180ms;
  --duration-slow: 260ms;
  --ease-out: cubic-bezier(...);
}
```

Do not invent random spacing, radius, shadow, or animation values inside components.

---

## Consistency Contract

The design system must define shared scales and roles for common UI anatomy. Use these consistently across every page.

### Typography roles

Define and reuse role tokens/classes for:

- page title
- section title
- card/panel title
- subtitle/description
- body paragraph
- label
- metadata
- numeric/data text
- code/mono text

Equivalent content must use the same role. A page title on one route should not randomly become a card title size on another route. A label should not sometimes look like metadata and sometimes like body copy.

### Shape and radius roles

Define one radius scale and map it to components:

- small controls
- inputs/selects
- buttons
- badges/chips
- panels/cards
- overlays/dialogs
- hero/media assets

Equivalent components must share radius treatment across the product. If buttons use `--radius-md`, all primary/secondary/destructive buttons use that unless there is a documented reason.

### Spacing roles

Use the shared spacing scale for:

- page padding
- section gap
- panel padding
- form field gap
- list/row gap
- control internal padding
- toolbar gap

Do not create local spacing rhythms per page.

### Component anatomy

Define anatomy for core components and keep it consistent:

- panel: header slot, description slot, action slot, content slot, footer slot
- form field: label, control, helper/error text
- list row: primary text, secondary text, metadata, actions, state
- button: icon slot, label, loading/success state
- navigation item: icon, label, optional metadata/current state
- chart: title, summary, plot area, legend/filter, detail/fallback

Changing content should not change component anatomy.

### Consistency audit

Before handoff, inspect at least two routes and verify:

- page titles use the same role
- section titles use the same role
- subtitles/descriptions use the same role
- body text uses the same role
- equivalent panels/cards share anatomy and radius
- equivalent controls share height, padding, focus, hover, active, disabled, loading, and error styling
- spacing between equivalent elements is consistent

If equivalent elements drift, refactor into tokens, shared classes, or shared components before shipping.

---

## Data Visualization Tokens

If the project includes charts or analytics views, add chart tokens to the same canonical design-system CSS source:

```css
:root {
  --chart-series-01: var(--color-primary-06);
  --chart-series-02: var(--color-secondary-06);
  --chart-series-03: var(--color-info);
  --chart-series-04: var(--color-warning);
  --chart-series-05: var(--color-success);
  --chart-series-06: var(--color-danger);

  --chart-axis: var(--border-default);
  --chart-grid: var(--border-subtle);
  --chart-label: var(--text-secondary);
  --chart-tooltip-bg: var(--surface-elevated);
  --chart-tooltip-border: var(--border-default);
  --chart-positive: var(--state-success);
  --chart-negative: var(--state-danger);
  --chart-warning: var(--state-warning);
}
```

Chart components should consume chart tokens. If a charting library requires inline colors, read CSS variables through a small helper instead of repeating raw color values.

---

## Visual Asset Tokens

If the project includes hero imagery, illustrations, screenshots, or generated images, define asset treatment tokens:

```css
:root {
  --asset-scrim: ...;
  --asset-border: var(--border-subtle);
  --asset-radius: var(--radius-xl);
  --asset-shadow: var(--shadow-raised);
}
```

Use real assets or generated assets when available. Do not use div-based fake screenshots or generic decorative placeholders as a substitute for missing imagery.

---

## DESIGN.md Requirements

`DESIGN.md` must explain:

- Product design intent and anti-references
- Primitive palette categories and how to change them
- Semantic roles and when to use them
- Component token mapping for buttons, inputs, panels, badges, navigation, forms, and states
- Chart token mapping and chart interaction standards when visualizations exist
- Visual asset treatment, generation/source notes, hero image rules, and fallback behavior when imagery exists
- Typography, spacing, radius, shadow, and motion scales
- Accessibility and contrast expectations
- Browser/screenshot iteration findings for generated UI
- AI Slop Risk score and what was changed to reduce it

The CSS token source and `DESIGN.md` must agree. If a token exists in CSS, `DESIGN.md` should either document it or explain why it is internal.

---

## Anti-Patterns

- App-specific token prefixes like `--app-bg`, `--dashboard-panel`, `--trading-accent` as the primary system
- Component files defining their own raw colors, spacing, radii, shadows, or motion values
- Multiple unrelated CSS files each defining design tokens
- DESIGN.md prose that describes a system not represented in CSS
- Tokens named by visual appearance only (`--blue`, `--gray-dark`) instead of role/category
- Components using primitive palette tokens directly when a semantic/component role exists
- Creating token aliases that are never used by components

If you discover any of these while building, refactor before handoff.
