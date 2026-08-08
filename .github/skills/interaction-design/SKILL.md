---
name: interaction-design
description: Use for making product UI feel alive through meaningful hover, focus, active, icon, transition, gesture, drag/drop, validation, loading, success, error, and state-change behavior. Applies from tiny controls to full page/workflow transitions. Avoids decorative motion by tying every effect to affordance, feedback, continuity, hierarchy, or confidence.
---

# Interaction Design

Interaction is how the product feels in the user's hand. It is not decoration after layout; it is part of the interface contract.

## Interaction plan

For every non-trivial page or component, define effects at the right scale:

```text
Page -> Region -> Component -> Micro
```

| Layer | Examples | Purpose |
|---|---|---|
| Page | route transition, mode transition, shared element continuity | preserve context |
| Region | drawer, inspector, panel, table, chart, command palette | show spatial relationship |
| Component | button, input, tab, toggle, card, row, chip | communicate affordance/state |
| Micro | icon movement, count update, checkmark, drag handle, focus pulse | confirm action |

Every effect must answer one question:

> What does this communicate?

Valid answers: affordance, feedback, hierarchy, continuity, loading, validation, success, error, selection, drag/drop position, or confidence.

Invalid answers: "it looks cool", "adds polish", "makes it modern".

## Required component interaction states

Interactive components should define:

- default
- hover
- focus-visible
- active/pressed
- selected/current
- disabled
- loading
- success
- error

If a state does not apply, that should be clear from the component's role.

## Hover and focus effects

Hover should reveal affordance, not repaint the component randomly.

Good hover effects:

- border strengthens
- background shifts one semantic step
- shadow/elevation changes when elevation communicates interactivity
- icon moves slightly in the direction of action
- nested metadata appears only when it is secondary
- row highlights and synchronizes a detail/preview area

Focus-visible should be stronger and clearer than hover. Never rely on hover-only cues.

## Icon choreography

Icons should participate in state and direction:

- chevron rotates on expand/collapse
- arrow nudges in action direction on hover
- plus becomes check after creation
- save icon changes to check on success
- refresh rotates only during loading
- drag handle appears on draggable/reorderable items
- warning/info/success icons pair with text labels

Icon effects should be consistent within the same action family. If one expand/collapse chevron rotates, all equivalent chevrons should rotate the same way.

## Buttons and actions

Buttons should feel tactile:

- hover: semantic color/border shift
- active: tiny press (`translateY(1px)` or `scale(0.98)`)
- loading: disable double-submit and show busy state
- success: acknowledge completion briefly
- destructive: support undo or clear confirmation path

Primary actions should have the richest feedback. Secondary actions should be quieter.

## Forms and validation

Forms should communicate progress and recoverability:

- validate on blur or submit, not every keystroke unless the task requires live validation
- show inline errors with `aria-describedby`
- clear field errors when the user changes the field
- show save/loading/success/error states
- disabled controls explain why they are disabled
- focus should move intentionally after major state changes only when it helps

## Lists, rows, and tables

Rows should be scannable and interactive when they are selectable:

- hover row highlight
- selected row state
- keyboard selection path
- row action reveal when secondary actions would otherwise clutter
- synchronized detail inspector when row selection matters
- drag/reorder handle when ordering matters

Do not turn every row into a card. Use row density when scanning is the job.

## Drag and direct manipulation

Consider drag/drop or direct manipulation when the workflow involves:

- reorder
- stage movement
- grouping
- priority sorting
- spatial placement
- assignment
- board/kanban movement
- arranging steps or sequences

If drag/drop is used:

- provide keyboard-accessible alternatives
- show lift, drop target, and invalid drop states
- preserve focus after drop
- make handles at least 44x44px
- avoid accidental drag on scrollable mobile surfaces

If drag/drop is not used, document why buttons, menus, or keyboard reorder are better.

## Page and region transitions

Use transitions to preserve mental model:

- route/mode changes: short crossfade or shared-element continuity
- drawers/inspectors: slide from the side they occupy
- dialogs/command palettes: scale/fade with focus management
- filters: result count and list changes should acknowledge update
- charts: data transitions should morph or highlight changes when useful

Avoid full-page theatrical entrances in product UI unless the surface is explicitly presentational.

## Motion tokens

Use design-system tokens:

```css
--duration-fast
--duration-base
--duration-slow
--ease-out
```

Do not invent one-off durations/easings in components. Keep transitions fast for product UI.

## Browser inspection checklist

Inspect interactions in browser:

- Is hover different from focus-visible?
- Does active/pressed state feel tactile?
- Does loading prevent duplicate action?
- Does success/error feedback appear where the user is looking?
- Do icons communicate direction or state?
- Do selected rows/panels stay synchronized?
- Are drag/drop affordances clear and keyboard-safe?
- Does reduced motion preserve meaning?

Patch interaction issues before handoff.

## Anti-patterns

- Effects that only decorate
- Hover-only information required for completion
- Slow transitions in task-focused UI
- Loading state that does not disable duplicate action
- Success toast far away from the control that changed
- Drag/drop without keyboard fallback
- Tiny switches or drag handles with small hit targets
- Route transitions that hide content or delay work
