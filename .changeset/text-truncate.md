---
"@mizen-labs/ui": minor
---

`Text` takes `truncate` and `lines` for text from data that can be long. `truncate` keeps one line with an ellipsis and lets the text shrink in a row; `lines={2}` clamps to two lines. While the text is cut, its full content shows as a tooltip, and the ellipsis sits at the end of the text's own script.

```tsx
<Inline gap="2" wrap={false}>
  <Avatar size="sm">…</Avatar>
  <Text size="ui" truncate>Northwind Industries Holdings International</Text>
</Inline>
```
