# Product register

When design SERVES the product: app UIs, admin dashboards, settings panels, data tables, tools, authenticated surfaces, anything where the user is in a task.

## The product slop test

Not "would someone say AI made this." Familiarity is often a feature here. The test is: would a user fluent in the category's best tools (Linear, Figma, Notion, Raycast, Stripe come to mind) sit down and trust this interface, or pause at every subtly-off component?

Product UI's failure mode isn't flatness, it's strangeness without purpose: over-decorated buttons, mismatched form controls, gratuitous motion, display fonts where labels should be, invented affordances for standard tasks. The bar is earned familiarity. The tool should disappear into the task.

Earned familiarity is not permission to ship a generic dashboard. A product screen still needs a strong workflow shape: the layout should make the user's task faster, clearer, or safer in a way that belongs to this product. If the screen can be described as "left nav, top bar, cards, table, chart" and nothing important is lost, the design is not finished.

## Typography

- **One family is often right.** Product UIs don't need display/body pairing. A well-tuned sans carries headings, buttons, labels, body, data.
- **Fixed rem scale, not fluid.** Clamp-sized headings don't serve product UI. Users view at consistent DPI, and a fluid h1 that shrinks in a sidebar looks worse, not better.
- **Tighter scale ratio.** 1.125–1.2 between steps is typical. More type elements here than on brand surfaces; exaggerated contrast creates noise.
- **Line length still applies for prose** (65–75ch). Data and compact UI can run denser; tables at 120ch+ are fine.
- Define reusable typography roles: page title, section title, panel title, subtitle/description, body, label, metadata, numeric/data, and mono/code. Equivalent text uses the same role across routes.

## Color

Product defaults to Restrained. A single surface can earn Committed (a dashboard where one category color carries a report, an onboarding flow with a drenched welcome screen), but Restrained is the floor.

- Product color systems must be tokenized by generic category and role: primitive palettes (`primary`, `secondary`, `neutral`, semantic states), semantic roles (`surface`, `text`, `border`, `action`, `state`, `focus`), then component tokens. Do not build product UI on app-specific variables like `--app-bg` / `--app-panel` as the main system.
- Do not use purple/violet/lila as the generated default primary palette. It is now a saturated AI product tell. Use it only when explicitly requested or strongly justified by the product/brand, and document the reason in `DESIGN.md`.
- State-rich semantic vocabulary: hover, focus, active, disabled, selected, loading, error, warning, success, info. Standardize these.
- Accent color used for primary actions, current selection, and state indicators only, not decoration.
- A second neutral layer for sidebars, toolbars, and panels (slightly cooler or warmer than the content surface).

## Layout

- Responsive behavior is structural (collapse sidebar, responsive table, breakpoint-driven columns), not fluid typography.
- App shell is a design decision, not boilerplate. Do not default to left navigation. Choose top navigation, tabs, command palettes, contextual drawers, inspector rails, split panes, or settings sidebars based on the workflow.
- Left navigation is only appropriate when persistent hierarchical navigation is genuinely needed, especially settings, admin, documentation, or deep management trees. For peer pages or small product suites, left nav usually wastes the prime content edge and reads as generic AI shell.
- Top navigation with many peers needs a designed overflow strategy: grouped routes, compact labels, styled local scroll with fade cue, overflow menu, command palette, or a different shell. Default browser scrollbars inside nav are unfinished UI.
- Avoid using panels/cards as the default answer for every grouping. Use split panes, inspectors, drawers, command surfaces, timelines, matrices, work queues, canvases, maps, ladders, diff views, or focused workspaces when those better match the task.
- Repeated panels must earn their repetition through different interaction roles. Four panels with different titles but the same structure are usually template filler.
- Dense product surfaces need a scan path: primary work area, supporting context, and action surface should be visually distinct without becoming separate mini-apps.
- Intentional scroll containers must look intentional. Style scrollbars or add fade/sticky/label affordances; unstyled horizontal scroll regions feel unfinished.

## Components

Every interactive component has: default, hover, focus, active, disabled, loading, error. Don't ship with half of these.

- Skeleton states for loading, not spinners in the middle of content.
- Empty states that teach the interface, not "nothing here."
- Consistent affordances across the surface. Same button shape. Same form-control vocabulary. Same icon style.
- Tables and charts are not automatically valuable. Tables need sorting, filtering, selection, inline context, keyboard path, or row-level actions when the workflow requires them. Charts need inspection, comparison, or stateful context, not just a static line in a box.
- Switches, segmented controls, icon actions, chart marks, and drag handles need 44×44px hit targets even when their visible shape is smaller.
- Maintain component anatomy across the product. Panels, forms, rows, buttons, badges, navigation items, and charts should use the same internal slots and type roles wherever they appear.

## Motion

- 150–250 ms on most transitions. Users are in flow; don't make them wait for choreography.
- Motion conveys state, not decoration. State change, feedback, loading, reveal: nothing else.
- Plan motion across page, region, component, and micro-interaction levels. A product UI can be mostly restrained and still have intentional transitions for route changes, panel entry/exit, selection continuity, optimistic updates, validation, loading, and success/error feedback.
- Plan interaction states across hover, focus-visible, active/pressed, selected, disabled, loading, success, error, and icon choreography. A product can feel alive through precise feedback even when large motion is restrained.
- No orchestrated page-load sequences. Product loads into a task; users don't want to watch it load.

## Product bans (on top of the shared absolute bans)

- Treating sidebar + topbar + cards + tables as the whole design concept.
- Left-navigation app shell as a default for peer pages or small product suites.
- Purple/violet as the default generated primary palette.
- Unstyled scrollbars or accidental local overflow in navigation, chart, table, or panel regions.
- Toggle, segmented, icon-only, or chart controls with hit targets below 44×44px.
- Using cards, pills, badges, and basic charts as the entire visual language.
- Generic metric tiles that do not drive a workflow decision.
- Panels that differ only by title and data.
- Dead toolbar buttons or fake controls that do not change state.
- Decorative motion that doesn't convey state.
- Hover, icon, or transition effects that do not communicate state, direction, affordance, or feedback.
- Inconsistent component vocabulary across screens. If the "save" button looks different in two places, one is wrong.
- Inconsistent typography roles, border radii, spacing, or component anatomy for equivalent UI across routes.
- Display fonts in UI labels, buttons, data.
- Reinventing standard affordances for flavor (custom scrollbars, weird form controls, non-standard modals).
- Heavy color or full-saturation accents on inactive states.
- Modal as first thought. Modals are usually laziness. Exhaust inline / progressive alternatives first.

## Advanced product quality

When a product UI is expected to feel especially polished, powerful, or high-end, add workflow ambition rather than decoration. Choose at least two patterns that genuinely fit the task:

- Command palette or keyboard-first action layer
- Resizable, dockable, or collapsible work panels
- Synchronized selection between list/table/chart/detail views
- Inspectable chart crosshair, brushing, zoom, or range selection
- Detail drawer or side inspector tied to the selected item
- Focus mode that removes secondary chrome for one task
- Drag-and-drop, reorder, grouping, or spatial organization
- Matrix, heatmap, timeline, queue, kanban, calendar, map, canvas, or ladder view when the data calls for it
- Virtualized large-list or large-table behavior
- Optimistic updates with reversible feedback for low-risk actions
- View-transition or shared-element transition where it clarifies object continuity

Do not add these as ornaments. Each advanced pattern must make the core workflow faster, more legible, safer, or more satisfying.

For reorder, staging, grouping, priority, kanban/board, and spatial workflows, drag-and-drop or direct manipulation must be considered. If a button/select-based interaction is chosen instead, document why it is better and provide keyboard-accessible operation.

## Product permissions

Product can afford things brand surfaces can't.

- System fonts and familiar sans defaults when they fit the product and do not conflict with project-specific font rules.
- Standard navigation patterns when earned by workflow: top bar, breadcrumbs, tabs, command palettes, contextual drawers, inspector rails, split panes, and settings sidebars.
- Density. Tables with many rows, panels with many labels, dense information when users need it.
- Consistency over surprise. The same visual vocabulary screen to screen is a virtue; delight is saved for moments, not pages.
