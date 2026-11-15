---
"@mizen-labs/ui": minor
---

`DialogPopup` takes `closeProps` for its default close button, as `SheetPopup` and `DrawerPopup` do, so an app can name it in its own language:

```tsx
<DialogPopup closeProps={{ "aria-label": "Закрыть" }}>
```
