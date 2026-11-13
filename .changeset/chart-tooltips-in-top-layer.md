---
"@mizen-labs/ui": patch
---

A chart tooltip no longer appears squeezed, and no longer makes a chart or its container scroll.

- Near an edge of a chart, a tooltip first showed a few characters wide and hundreds of pixels tall, then grew to its size over several frames. It is now as wide as its content from the first frame it shows.
- Every chart opens its tooltip in the browser's top layer. It adds no scrollable overflow, no card clips it, and the window, not the chart, limits where it goes. A tooltip can therefore extend past the edge of its chart.
- `ChartTooltip` is as wide as its content and does not wrap.

For your own `ChartFrame` definition, pass `tooltip: { use: tooltip, portal }` with `portal` from `@tanstack/charts/tooltip/portal` to get the same behavior.
