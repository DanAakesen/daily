---
name: data-visualization
description: Use for charts, dashboards, analytics views, metrics, timelines, heatmaps, matrices, maps, event streams, and data-heavy product UI. Helps choose chart types, define chart interaction contracts, integrate with design-system tokens, and avoid decorative/basic chart slop.
---

# Data Visualization

Great charts are decision tools. They answer a question, support inspection, and connect to the surrounding workflow.

## Workflow

Use this sequence for every meaningful visualization:

```text
Question -> Data shape -> Chart type -> Interaction -> Accessibility -> Implementation -> Browser inspect
```

1. **Question**: What must the user understand or decide?
2. **Data shape**: Time series, categories, distribution, relationship, flow, geospatial, hierarchy, event stream, or matrix.
3. **Chart type**: Choose the simplest chart that answers the question.
4. **Interaction**: Define hover/focus, selection, filters, zoom, brushing, legend toggle, or synchronized detail.
5. **Accessibility**: Add labels, summary, contrast, keyboard path, reduced motion, and table/text fallback.
6. **Implementation**: Use design-system chart tokens and the lightest suitable renderer.
7. **Browser inspect**: Verify rendered pixels, tooltip position, overflow, mobile behavior, and console.

## Chart contract

For important product charts, record this in `DESIGN.md`:

- chart name
- user question
- data dimensions/measures
- selected chart type and why
- interactions
- empty/loading/error behavior
- accessibility fallback
- token usage

## Chart type guide

| Need | Use |
|---|---|
| Trend over time | Line, area, horizon chart |
| Compare ranked categories | Sorted bar, lollipop, dot plot |
| Part-to-whole | Stacked bar, 100% stacked bar, treemap |
| Distribution | Histogram, box plot, density plot, beeswarm |
| Correlation | Scatter, bubble, connected scatter |
| Progress through stages | Funnel, timeline, flow |
| Risk/priority/coverage | Matrix, heatmap, quadrant |
| Events over time | Event timeline, swimlanes, virtualized stream |
| Relationships | Network only when relationships matter; otherwise use table/detail |
| Location | Map only when geography changes the decision |

Avoid pie/donut charts by default.

## Interaction patterns

Prefer connected interactions over isolated charts:

- Select a row -> highlight matching chart series/point
- Select a chart point -> open detail inspector
- Brush a date range -> filter table and summary
- Toggle legend -> update chart and summary text
- Hover/focus point -> show exact values and context
- Keyboard navigate points/series for important charts
- Compare mode -> show delta annotations

## Design-system tokens

Use chart tokens from the canonical design-system CSS source:

```css
--chart-series-01
--chart-series-02
--chart-axis
--chart-grid
--chart-label
--chart-tooltip-bg
--chart-tooltip-border
--chart-positive
--chart-negative
--chart-warning
```

If a charting library requires inline values, derive them from CSS variables through a small helper. Do not repeat raw OKLCH/hex values across chart components.

## Advanced chart capabilities

Use when the workflow earns it:

- Crosshair inspection
- Brush/range selection
- Zoom/pan
- Synchronized chart/list/table/detail selection
- Heatmaps and matrices for dense risk/coverage views
- Timelines and swimlanes for operational history
- Canvas/WebGL for dense points or live streams
- Virtualized event streams
- Animated transitions between data states, with reduced-motion fallback

Do not add advanced rendering just to look advanced. The chart must become easier to inspect or faster to use.

## Accessibility checklist

- Title and text summary present
- Axis/legend meaning clear
- Tooltips not the only way to understand the chart
- Data table or text fallback available for complex charts
- Color is not the only state cue
- Contrast works for marks, labels, grid, tooltip, and background
- Keyboard path exists for meaningful selection
- Reduced motion fallback exists

## Anti-slop test

Reject the chart if:

- It is a static line in a card with no inspection
- It could be removed without changing the workflow
- It uses generic dashboard colors unrelated to the design system
- It repeats the same chart card pattern across the page
- It hides precise values behind hover-only tooltips
- It uses a pie/donut chart for complex comparison
- It has no empty/loading/error state
