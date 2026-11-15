---
"@mizen-labs/ui": patch
---

- A `Menu` or `ContextMenu` with a long item now wraps the item at 20rem. Before, the menu grew to the width of the window.
- A `PropertyList` stacked on a narrow screen puts 4px between a label and its value and 12px before the next label, so each pair reads as one. Before, both spaces were about the same.
