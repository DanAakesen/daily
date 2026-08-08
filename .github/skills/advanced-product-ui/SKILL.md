---
name: advanced-product-ui
description: Use for high-end product interfaces, pro tools, data-heavy apps, dashboards, workstations, admin surfaces, analytics products, AI consoles, editors, command-heavy workflows, and any UI where the user expects a powerful working product rather than a marketing page. Focuses on workflow shape, interaction depth, visual hierarchy, browser-verified iteration, and avoiding generic cards/tables/pills slop.
---

# Advanced Product UI

Build product interfaces that feel powerful because the workflow is better, not because the surface is louder.

This skill is for app UI, dashboards, workstations, editors, analytics surfaces, internal tools, pro tools, and command-heavy experiences. It is not a landing-page taste layer. Use it when design serves repeated work, scanning, comparison, decision-making, editing, monitoring, or control.

## Non-negotiable workflow

Every non-trivial product UI task follows:

```text
Frame -> Contract -> Shape -> Build -> Browser Inspect -> Iterate -> Verify
```

1. **Frame**: Name the user, the job, and the success moment.
2. **Contract**: Define the page type, core workflow, density, primary action, secondary context, states, and anti-references.
3. **Shape**: Choose the structural pattern before coding. Do not default to cards.
4. **Build**: Implement the real working surface, not a static dashboard poster.
5. **Browser Inspect**: Run the UI, inspect desktop and mobile, check console, and capture/inspect screenshots or snapshots.
6. **Iterate**: Patch concrete visual/interaction issues found in the browser.
7. **Verify**: Run tests/lint/build and report any remaining risk.

If the browser cannot be used, say so and perform the strongest available static review. Do not silently skip visual inspection.

Record the contract and inspection evidence in `DESIGN.md`:

- Design shape chosen and why
- App shell pattern chosen and why left navigation was rejected or specifically justified
- Motion plan across page, region, component, and micro-interaction levels
- Interaction plan for hover, focus, active, selected, disabled, loading, success, error, icon choreography, and drag/drop/direct manipulation where relevant
- References considered internally
- Generic pattern rejected
- AI Slop Risk score
- Browser/screenshot findings
- Concrete iteration made after inspection

## Product UI slop test

Before shipping, ask:

> Could this be summarized as "sidebar/topbar plus cards and tables"?

If yes, redesign. That structure can be part of the interface, but it cannot be the whole design idea.

Also reject:

- Cards, tables, pills, and basic charts as the entire visual language
- Four panels with identical structure and different headings
- Generic metric tiles that do not drive decisions
- Dead toolbar buttons or placeholder-only controls
- Basic charts with no inspection, comparison, or stateful relationship to nearby data
- A navigation shell that consumes visual attention but does not improve workflow
- Default left navigation or "left nav + top bar + content" as the whole shell
- Purple/violet primary palette chosen by default rather than by explicit brand/context need
- Unstyled local scroll containers or cramped navigation that overflows internally
- Density without scan path
- Decoration pretending to be advanced interaction

## Advanced means workflow power

Choose advanced patterns because they improve the task. Good options include:

| Pattern | Use when |
|---|---|
| Command palette | The product has many actions, filters, or navigation targets |
| Dockable/collapsible panels | Users switch between context and focus |
| Resizable split panes | Users compare, inspect, or edit side by side |
| Detail inspector | Selecting an item should reveal context without losing place |
| Synchronized chart/table/list selection | Data views describe the same objects from different angles |
| Crosshair, brushing, zoom, range selection | Charts need real inspection |
| Heatmap, matrix, timeline, queue, map, canvas, ladder | The data has a spatial, temporal, priority, or relational shape |
| Virtualized list/table | The product implies large data volumes |
| Keyboard shortcuts | Power users repeat the workflow many times |
| Focus mode | One task needs reduced chrome and high concentration |
| Drag-and-drop, reorder, grouping, or spatial organization | The workflow involves ordering, staging, grouping, priority, assignment, or spatial placement |
| Optimistic reversible updates | Low-risk actions should feel immediate |
| Shared-element or view transition | It clarifies object continuity between states |

Use at least two fitting patterns for high-ambition product UI. Do not add patterns that do not fit the data or task.

## App shell selection

Do not default to left navigation. Choose a shell pattern that serves the workflow:

| Shell pattern | Use when |
|---|---|
| Top command bar | Users mostly work in one surface and need search/actions |
| Workspace tabs/segmented switcher | Users switch among a few peer modes |
| Contextual drawer | Secondary navigation should appear only when needed |
| Inspector rail | Selection drives detail/context rather than route switching |
| Bottom/mobile navigation | Mobile-first workflows with a few major destinations |
| Command palette first | Power users navigate and act by search/keyboard |
| Settings sidebar | Configuration has many nested categories |
| Split-pane shell | Compare/review/edit tasks need persistent side-by-side context |

Left navigation is only acceptable when the information architecture genuinely needs persistent hierarchical navigation, especially settings/admin/documentation-style surfaces. If the product only has a handful of peer pages, prefer top navigation, tabs, command palette, or contextual navigation.

Top navigation with many peer surfaces must include an overflow strategy: grouped routes, compact labels, styled local scroll with fade cue, overflow menu, command palette, or another shell. Do not let a top nav silently overflow with default scrollbars.

## Structural shaping

Pick a page shape before components:

- **Workspace**: primary work area + contextual side inspector + action rail
- **Monitor**: live feed + ranked queue + detail drawer
- **Compare**: table/list + chart/canvas + synchronized selection
- **Review**: evidence stack + decision panel + history/timeline
- **Create/Edit**: canvas/form + preview + validation stream
- **Triage**: queue + filters + batch actions + keyboard shortcuts
- **Analyze**: controls + visualization + drill-down + explanation

If none fits, name the custom shape in one sentence. The shape is the design skeleton.

## Visual system rules

- Build on a reusable design system: one canonical CSS token source plus one root `DESIGN.md`.
- Use primitive palette categories (`primary`, `secondary`, `neutral`, `success`, `warning`, `danger`, `info`), semantic roles (`surface`, `text`, `border`, `action`, `state`, `focus`), and component tokens (`button`, `input`, `panel`, `nav`, `badge`).
- If charts exist, define chart tokens and a chart interaction contract. Prefer inspectable, connected visualizations over static charts in cards.
- Do not use app-specific tokens like `--app-bg` or feature-specific color names as the primary token system.
- Define project-wide typography roles and component anatomy. Page titles, section titles, panel titles, descriptions, labels, metadata, data values, panels, rows, buttons, fields, badges, and charts should be consistent across routes.
- Use product density deliberately. Dense does not mean cramped.
- Avoid purple/violet as the default primary palette. If using it, document why it is explicitly appropriate for the product instead of defaulting to an AI-looking control-room aesthetic.
- Establish clear zones: work area, context, actions, status, navigation.
- Use cards/panels sparingly. When everything is boxed, nothing is important.
- Align sibling regions structurally. Equivalent panels need equivalent header slots or shared top edges.
- Use semantic color for state and meaning, not decoration.
- Typography should make scanning faster: tabular numbers, compact labels, stable hierarchy.
- Empty/loading/error/success states must preserve the layout shape.
- Motion should communicate object continuity, state change, or feedback.
- Plan motion at four layers: page/route transitions, region/panel transitions, component states, and micro-interactions. Use the design-system motion tokens consistently.
- Plan interaction at four layers: page, region, component, and micro. Include hover, focus-visible, active/pressed, selected, disabled, loading, success, error, and icon behavior where relevant.
- Reduced motion must still look intentional.
- Scroll containers need visual design: styled scrollbar, fade edge, sticky affordance, or explicit local scroll cue.
- Switches, segmented controls, icon-only actions, chart marks, and drag handles need at least 44×44px hit areas.
- For reorder, stage movement, grouping, and spatial workflows, evaluate drag-and-drop plus keyboard-accessible alternatives. Document the chosen interaction in `DESIGN.md`.

## Browser inspection checklist

Inspect the rendered UI at desktop and mobile:

- What is the first thing the eye sees, and is it the right thing?
- Is there a clear primary workflow, or just many panels?
- Can a user scan the page in 5 seconds and know where to act?
- Are chart/table/list/detail views connected or isolated?
- Are controls real, labeled, and stateful?
- Are scrollbars/scroll regions styled and intentional?
- Are toggle/segmented/icon controls at least 44×44px as hit targets?
- Did reorder/staging/grouping/spatial workflows consider drag-and-drop or keyboard reorder?
- Do icons, hover states, active states, and success/error feedback communicate useful state or direction?
- Does the layout still work when content is long?
- Does the interface feel specific to this product, or could labels be swapped for another app?
- Does any part look like default component-library output?
- Do equivalent elements use the same typography role, radius, spacing, and component anatomy across routes?

Patch issues before final handoff.

## AI Slop Risk score

Score internally from 0-10 before final:

- 0-2: specific, polished, workflow-driven
- 3: acceptable but still has minor generic patterns
- 4-6: generic; must iterate
- 7-10: AI slop; redesign the structure

If score is above 3, do not ship. Redesign or iterate.

## Validation

The task is incomplete while any requested or relevant build/test/lint/type-check is red. Browser-clean but test-red is not done; test-green but visually generic is not done.
