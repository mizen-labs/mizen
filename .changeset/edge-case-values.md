---
"@mizen-labs/ui": patch
---

Long and short data no longer break these components:

- `MetricTrend` and `Metric` keep a value on one line. In a MetricTrend card narrower than 14rem the value steps down from 28px to 20px. A value and a `MetricDelta` keep their sign in place in a right-to-left page.
- `CalendarHeatmap` with a few days stops growing at a 24px pitch. One day used to fill the width and make the chart 900px tall.
- `AreaChart` and the shared time axis show a single point as a dot, with one date label (`Jan 1, 2026`) instead of a millisecond timestamp.
