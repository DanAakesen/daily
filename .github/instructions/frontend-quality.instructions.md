# Frontend Quality — Always-On Rules

These rules apply to ALL frontend code generation. Never violate them.

---

## The AI Slop Test

Before shipping any UI, ask: could a reviewer look at this and say "AI made that"? Could they guess the stack/category from the aesthetic alone? If yes, rework. The interface must have a point of view.

## Frontend Build Loop

Non-trivial frontend work must follow this loop:

```text
Frame -> Design Contract -> Build -> Browser Preview -> Screenshot Inspect -> Iterate -> Verify -> Handoff
```

- **Frame**: name the user, the job, and the success moment before selecting components.
- **Design Contract**: define or read the page contract: purpose, page type, interaction model, core layout, tokens, states, and anti-references.
- **Build**: implement the smallest complete version of the real workflow, not a decorative demo.
- **Browser Preview**: run the app or page in a browser for user-facing UI changes.
- **Screenshot Inspect**: inspect desktop and mobile screenshots or browser snapshots for hierarchy, density, rhythm, alignment, and slop tells. Code review alone is insufficient.
- **Iterate**: patch at least one concrete visual/interaction issue found in the browser inspection, unless the first pass is genuinely clean and you can name why.
- **Verify**: run relevant tests, lint, build, accessibility, or smoke checks.
- **Handoff**: report what was verified and any remaining risk. Do not claim visual quality without browser evidence.

If browser tooling is unavailable, state that limitation and perform the strongest available static/responsive review. Do not silently skip the visual loop.

## AI Slop Scoring Gate

Before final handoff, assign an internal **AI Slop Risk** score from 0-10. If the score is above 3, the UI is not done and must be redesigned or iterated before shipping.

Penalize heavily for:

- A page that can be summarized as "sidebar/topbar plus cards and tables"
- Cards, tables, badges, and pills forming nearly the entire visual language
- No signature workflow interaction or product-specific structural device
- Default fonts, default component-library styling, or category-obvious palette
- Dead controls, placeholder-only interactions, or fake product affordances
- Basic charts that do not support inspection, comparison, or stateful interaction
- No screenshot/browser inspection
- No documented design contract for greenfield UI

For greenfield UI, choose 2-3 references internally before building: one product/workflow reference, one interaction reference, and one visual-density reference. Do not copy them; use them to avoid designing from training-data averages.

## Design System Contract

Every non-trivial frontend app needs one canonical design-system CSS source and one root `DESIGN.md`.

- Use generic primitive palettes like `--color-primary-01` through `--color-primary-10`, `--color-secondary-*`, and `--color-neutral-*`.
- Map primitives into semantic roles like `--surface-default`, `--text-primary`, `--border-default`, `--action-primary`, `--state-danger`, and `--focus-ring`.
- Map semantic roles into component tokens like `--button-primary-bg`, `--input-border`, `--panel-bg`, and `--nav-item-active-bg`.
- Components should consume semantic or component tokens. Avoid app-specific primary tokens such as `--app-bg`, `--app-panel`, or feature-specific names as the main system.
- `DESIGN.md` must document the same categories and explain how to re-skin the UI by changing the primitive palette.

---

## App Shell Selection

Choose the app shell from the workflow; never default to a left-navigation shell.

Before implementing navigation, document the shell choice in `DESIGN.md`:

- **Workflow shape**: monitor, create/edit, compare, review, triage, analyze, publish, configure, or custom.
- **Primary navigation frequency**: how often users switch surfaces during the core task.
- **Content priority**: what must own the most screen space.
- **Best shell pattern**: top navigation, command bar, tab rail, segmented workspace switcher, bottom/mobile navigation, contextual drawer, inspector rail, palette-first navigation, or settings sidebar.

Left navigation is allowed only when it is specifically earned by the information architecture, such as settings pages, admin configuration, documentation trees, or deeply nested management surfaces. It is not a default app shell. If the shell can be described as "left nav + top bar + content," reject it and choose a more task-specific structure.

---

## Absolute Bans (Immediate Rewrite if Present)

- **Side-stripe borders** — No `border-left/right` > 1px as colored accents on cards/alerts
- **Gradient text** — No `background-clip: text` with gradient backgrounds
- **Generic glassmorphism as default** — Decorative blur/glass cards are banned when used as AI filler. Apple Liquid Glass / iOS-style frosted material is allowed when the brief, brand, or product context calls for it, but it must have contrast, depth, and a solid fallback.
- **Hero-metric template** — No "big number + small label + stats trio" pattern with decorative numbers
- **Identical card grids** — No same-sized cards with icon + heading + text repeated 3+ times
- **Eyebrow spam** — Max 1 eyebrow per 3 sections. Tiny uppercase tracked label above every section = AI grammar
- **Numbered section markers (01 / 02 / 03)** — Only when the section IS a real sequence
- **Centered-everything** — Vary alignment. Don't center every element on every page
- **AI Purple/Blue glow** — No automatic purple button glows, no random neon gradients
- **Purple/violet generated default** — Do not use purple, violet, or lila as the default primary palette. Only use it when the user explicitly asks for it or the brand/context strongly justifies it, and document that reason in `DESIGN.md`.
- **Warm-beige + brass/clay premium palette** — Don't default to cream/brass/espresso for every premium brief
- **Zigzag alternation** — Max 2 sections of "left-image/right-text" alternation. 3rd is a fail
- **Split-header pattern** — No "left big headline + right small paragraph" as section header by default
- **Duplicate CTA intent** — "Get in touch" + "Contact us" + "Let's talk" on same page = pick ONE label
- **Div-based fake screenshots** — Never build product previews with styled divs. Use real images or skip
- **Basic chart filler** — Never use static generic charts as decoration. Charts must answer a real question and support inspection, comparison, or stateful interaction.
- **Placeholder-as-label** — Never. Always use visible `<label>` elements
- **Em-dash as design flourish** — Banned in decorative/kinetic usage

---

## Hero Section (Hard Rules)

- Hero MUST fit the initial viewport — headline max 2 lines desktop, subtext max 20 words, CTAs visible without scroll
- Hero font scale: default `text-4xl md:text-5xl lg:text-6xl`; use `text-7xl+` only for 3-5 word headlines
- Hero top padding max `pt-24` (~6rem) at desktop — more = layout bug, not breathing room
- Hero stack max 4 text elements: eyebrow OR none + headline + subtext + CTAs. No feature lists, no trust strips, no pricing teasers inside the hero
- "Used by" / "Trusted by" logo wall goes UNDER the hero, never inside it
- Never use `h-screen` for hero — always `min-h-[100dvh]` (iOS Safari address bar)

---

## Color

- **Contrast check mandatory** — Body text ≥ 4.5:1 against background; large text ≥ 3:1. Muted gray on tinted near-white is the #1 failure
- Gray text on colored background: use a darker shade of the background's hue, not generic gray
- Don't default to "safe SaaS blue" — colors should reflect the product's actual scene and mood
- Tinted neutrals: add 0.005–0.015 chroma toward the brand hue, not generic warm/cool
- Max 1 accent color. Saturation < 80% by default
- **Color consistency lock** — Once an accent is chosen, it's used on the WHOLE page. No random teal badge on a rose-accented page
- One palette per project — don't fluctuate between warm and cool grays
- When using shadows, tint them to the background hue — no pure-black drop shadows on light backgrounds

---

## Typography

- Cap body line length at 65–75ch
- Don't pair similar fonts (two geometric sans-serifs). Pair on contrast axis or use one family
- Define and reuse typography roles for page title, section title, card/panel title, subtitle/description, body, label, metadata, numeric/data, and mono/code text. Equivalent content uses the same role across pages.
- Hero heading max ≤ 6rem; letter-spacing ≥ -0.04em
- Use `text-wrap: balance` on h1–h3; `text-wrap: pretty` on long prose
- **Inter is discouraged as default** — prefer Geist, Outfit, Cabinet Grotesk, Satoshi
- **Serif is very discouraged as default** — only when brand brief explicitly names one or the aesthetic is genuinely editorial/luxury. Sans display is the default for the same reason black is the default in fashion
- Banned serif defaults: `Fraunces`, `Instrument_Serif`
- **Italic descender clearance** — italic display type with descenders (y, g, j, p, q) needs `leading-[1.1]` minimum + `pb-1` reserve

---

## Layout

- Vary spacing for rhythm — don't use the same gap everywhere. Tight grouping (8-12px) for related elements, generous separation (48-96px) between sections
- Cards only when truly the best affordance. Nested cards are always wrong
- Flexbox for 1D, Grid for 2D. `repeat(auto-fit, minmax(280px, 1fr))` for responsive grids
- Build a semantic z-index scale (dropdown → sticky → modal → toast → tooltip)
- **Section-layout-repetition ban** — Once you use a layout family (3-col cards, full-width quote, split-text-image), it can appear at most ONCE on the page
- **Shape consistency lock** — Pick ONE corner-radius scale and stick to it. Mixed round buttons in a square layout = broken
- **Component anatomy consistency** — Equivalent components must share the same anatomy across routes: panel header/content/action/footer, form label/control/error/helper, row primary/secondary/meta/actions, button icon/label/loading/success, chart title/summary/plot/legend/detail.
- **Type role consistency** — Page titles, section titles, panel titles, subtitles, paragraphs, labels, metadata, and numeric values must use consistent text sizes/weights throughout the project.
- **Sibling region alignment** — In split layouts, cards, panels, and columns must align to a shared top edge or share equivalent header slots. Do not let one region start lower because it has a title/header while the adjacent region does not. Add a matching header, move the title outside the grid, or align panel contents intentionally.
- **Intentional scroll containers** — Any horizontal or vertical scroll container must be deliberate, bounded, and styled. Use visible affordance: styled scrollbar, fade edge, sticky header, or clear local scroll cue. Document-level accidental overflow is a blocker.
- Pick a spacing scale (4pt base: 4, 8, 12, 16, 24, 32, 48, 64, 96) and use only values from it
- Use `gap` for sibling spacing instead of margins
- Navigation must render on single line at desktop — two-line nav is broken. Max 80px height
- Top navigation with many peer routes must handle overflow by design: route grouping, compact labels, horizontal scroll with styled scrollbar/fade edge, overflow menu, command palette, or a different shell. Internal nav overflow with default scrollbars is not acceptable.
- Mobile collapse must be explicit per section — no "Tailwind handles it" assumptions
- **Container queries** for components, viewport queries for page layouts

---

## Motion

- Motion must be motivated — ask "what does this animation communicate?" Valid: hierarchy, storytelling, feedback, state transition. Invalid: "it looked cool"
- Consider motion at every level: page transition, region transition, component state, micro-interaction, feedback, and data/visualization change. Decide what should move and what should stay still before coding.
- Every page should have a motion plan, even if the plan is "static except focused control feedback" for a low-motion workflow.
- Ease out with exponential curves (quart/quint/expo). No bounce, no elastic
- `@media (prefers-reduced-motion: reduce)` is mandatory for every animation
- Max 1 marquee per page. Two scrolling marquees = lazy filler
- If motion dial is claimed, motion must be visible — static pages claiming rich motion are broken
- Spring physics (`type: "spring", stiffness: 100, damping: 20`) — no linear easing
- Never use `useState` for continuous values (mouse position, scroll progress) — use motion values outside React render cycle

---

## Interaction & States

Every interactive element needs 8 states designed: default, hover, focus, active, disabled, loading, error, success.

- Every non-trivial page/component needs an interaction plan across page, region, component, and micro layers.
- Hover, focus-visible, active, selected, disabled, loading, success, and error states should be visually distinct when applicable.
- Icons may animate or swap when they communicate state or direction: chevron rotates, arrow nudges, plus becomes check, save becomes success, refresh spins only while loading. Keep icon behavior consistent within the same action family.
- Never delete without undo toast (preferred) or confirmation dialog
- Forms: validate on blur, not every keystroke. Inline errors below fields with `aria-describedby`
- Provide both mouse and keyboard input methods (slider + number input, not slider alone)
- Dropdowns in `overflow: hidden` will clip — use portals, `position: fixed`, or Popover API
- **Focus rings** — Never `outline: none` without replacement. Use `:focus-visible` for keyboard users only. 2-3px, offset, high contrast
- **Button contrast check** — White text on white button, transparent button on photo background = banned. WCAG AA minimum
- **CTA button wrap ban** — Button text must fit one line at desktop. Max 3 words for primary CTAs
- **Touch targets** — 44×44px minimum even when visual element is smaller. Expand hit area with padding or pseudo-element
- Switches, toggles, segmented controls, icon buttons, chart marks, and drag handles must have a 44×44px minimum hit area even if the visible thumb/mark is smaller.
- Tactile feedback: on `:active`, use `-translate-y-[1px]` or `scale-[0.98]`
- Prevent double-submission — disable button while loading
- Reorder, staging, grouping, kanban/board, and spatial workflows must consider drag-and-drop or keyboard-accessible reordering/direct manipulation. If not implemented, document why buttons, selects, or another mechanism are better for the workflow.
- Success/error feedback should appear near the user’s action or in the active workflow region, not only as a distant generic toast.

---

## Content & Copy

- Default per section: short headline (≤ 8 words) + sub-paragraph (≤ 25 words) + one visual OR one CTA
- Quotes/testimonials: max 3 lines of body. Attribution: name + role + company
- **Copy self-audit** — Re-read every visible string before shipping. Flag grammatically broken text, unclear referents, AI hallucination wordplay, "LLM trying to sound thoughtful" prose. Replace with plain functional sentence
- Fake-precise numbers (92%, 4.1×, 48k) are banned unless from real data or explicitly labeled as mock
- One copy register per page — don't mix technical mono + editorial prose + marketing punch

---

## Hardening (Production Readiness)

- Test with extreme inputs: very long text, very short, special characters, emoji, RTL, CJK, large numbers
- Text overflow: use `clamp()` for fluid type, `min-width: 0` on flex/grid items, test at all breakpoints
- Add 30-40% space budget for translations. Use logical properties (`margin-inline-start`) not physical
- Handle every API error status: 400 (validation), 401 (redirect to login), 403 (permission), 404 (not found), 429 (rate limit), 500 (generic + support link)
- Large datasets: paginate or virtualize. Never load 10K items at once
- Clean up: cancel subscriptions, clear timers, abort pending requests on unmount
- Debounce search input (300ms), throttle scroll handlers (100ms)

---

## Component Patterns

- Empty states must guide the user toward action — not just "nothing here"
- Loading states required: use skeleton screens matching final layout shape, not generic spinners
- Error states required: what went wrong + how to recover
- Equivalent components across routes should use the same shared component or tokenized class. Do not restyle the same button, panel, input, badge, row, or chart anatomy per page.
- Accessible: all inputs need labels, aria-labels on interactive elements, focus rings visible, skip links for keyboard users
- Semantic HTML first — use `<dialog>` for modals, `popover` attribute for overlays, `<details>` for disclosure
- **NEVER use emoji as icons** — No 🔥📊🎯🏃📚 or any emoji for UI elements. They are not icons, they are unprofessional
- One icon family per project. Allowed: Lucide, Phosphor, Hugeicons, Radix Icons, Tabler. Never hand-roll SVG icons
- If no icon library is installed, install Lucide React (`lucide-react`) as default
- Product charts need title, text summary, labels/legend, empty/loading/error states, and color-independent meaning. Important charts should support hover/focus inspection, selection, brushing, zoom, or synchronized detail when useful.
- Hero and marketing visuals need real or generated assets, verified stock assets, or explicit asset slots. Do not fill missing imagery with decorative blobs, fake UI rectangles, or guessed image URLs.
- Remove unused scaffold artifacts from generated projects, including default Vite logos/assets, default README sections, and starter CSS/images not used by the product.

---

## Architecture Defaults

- Tailwind v4 with `@tailwindcss/postcss` or Vite plugin (not v3 `tailwindcss` plugin in postcss)
- Self-host fonts with `@font-face` + `font-display: swap`. Never `<link>` Google Fonts in production
- Check `package.json` before importing ANY library — if missing, output install command first
- One design system per project — never mix Fluent with Carbon with shadcn in the same tree
- If using shadcn/ui: never ship in default state — customize it
