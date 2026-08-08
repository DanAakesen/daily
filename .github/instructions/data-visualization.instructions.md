# Data Visualization — Always-On Rules

These rules apply to charts, graphs, dashboards, analytics views, metrics, timelines, maps, matrices, and any data-heavy UI.

---

## Chart Quality Bar

Charts are interaction surfaces, not decorative cards. A chart must help users inspect, compare, decide, explain, or monitor something.

Reject charts that are only:

- A static line in a box
- A generic metric tile with a tiny sparkline
- A decorative donut/pie chart with no decision value
- A chart disconnected from nearby filters, tables, lists, or detail views
- Colorful but unreadable or unlabelled

If a table would answer the question better, use a table. If a chart is needed, make it inspectable.

---

## Required Data-Viz Contract

Before implementing a chart, define:

- **Question**: What decision or comparison does this visualization answer?
- **Dataset**: What entities, measures, dimensions, and time ranges are represented?
- **Chart type**: Why this chart type fits the question.
- **Interaction**: Hover, focus, brushing, zoom, range select, legend toggle, row selection, or cross-filter.
- **Empty/loading/error states**: What the chart shows before/after data is available or when data fails.
- **Accessibility**: Text summary, labels, keyboard path, color-independent encoding, and table fallback where useful.

Record this contract in `DESIGN.md` for important product charts.

---

## Token Architecture

Charts must use the same design-system token model as the rest of the app.

Expected chart tokens:

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

Use semantic chart tokens in components. Do not hard-code chart colors inside chart props unless the charting library requires inline values; when it does, derive values from CSS variables or a typed chart-token helper.

---

## Choosing Chart Types

Use the chart type that matches the question:

| Question | Better patterns |
|---|---|
| Change over time | Line, area, timeline, horizon chart |
| Compare categories | Bar, sorted bar, dot plot |
| Composition | Stacked bar, 100% stacked bar, treemap |
| Distribution | Histogram, box plot, beeswarm |
| Relationship | Scatter, bubble, connected scatter |
| Flow | Sankey, funnel, journey/timeline |
| Risk / priority | Matrix, heatmap, quadrant |
| Geography | Map only when location matters |
| Large event stream | Virtualized timeline, canvas/WebGL scatter, heatmap |

Avoid pie/donut charts unless the comparison is genuinely part-to-whole with very few slices.

---

## Interaction Requirements

At least one meaningful interaction is expected for important product charts:

- Hover/focus tooltip with precise values
- Keyboard-accessible data point or series inspection
- Legend toggle for series visibility
- Brush/range selection for time windows
- Click selection synchronized with a table/list/detail panel
- Zoom/pan for dense data
- Cross-filtering adjacent panels
- Accessible text summary and data table fallback

Charts and adjacent tables/lists should share selection state when they describe the same entities.

---

## Accessibility

Every chart needs:

- A visible title or nearby heading
- A concise text summary of the main takeaway
- Axis/legend labels or equivalent annotation
- Color-independent encoding where state matters (labels, icons, patterns, or text)
- Sufficient contrast for grid, labels, marks, and tooltips
- Reduced-motion behavior for animated transitions
- A table fallback or text summary for complex data

Do not rely on red/green alone to communicate status.

---

## Performance

Match renderer to data size:

- Small/medium static charts: SVG chart libraries are fine.
- Dense charts, thousands of points, real-time updates, or heavy interactions: consider Canvas/WebGL.
- Large tables/lists next to charts: virtualize.
- Expensive data transforms: memoize or move to a worker.

Do not add heavy chart dependencies without checking `package.json` and explaining why the dependency is needed.

---

## Anti-Patterns

- Chart colors not connected to the design system
- Inline hard-coded chart colors repeated across files
- Tiny sparkline used as decoration
- Tooltip-only data with no visible labels or summary
- Charts that cannot be understood in reduced motion or by keyboard users
- Dashboard pages where every chart is the same card with a different title
- Basic chart added when a richer matrix/timeline/heatmap/detail view would match the workflow better
