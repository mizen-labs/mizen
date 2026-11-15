---
"@mizen-labs/ui": minor
---

- `TableCell` takes `nowrap` for a cell that must stay on one line, such as a date or a status `Badge`. The table scrolls instead of wrapping it.
- A table wider than its container fades at the edge that has more columns, so a cut column reads as scrollable. The fade follows the scroll position where the browser supports scroll-driven animation; Firefox shows no fade yet. A focused table shows its focus ring instead.
- A numeric cell keeps a sign before its number in a right-to-left table.
