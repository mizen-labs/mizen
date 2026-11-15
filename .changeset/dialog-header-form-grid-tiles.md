---
"@mizen-labs/ui": minor
---

- A `Dialog`, `Sheet` or `Drawer` header without the close button uses its full width (#33). With the button, only the title keeps clear of it, so the description no longer wraps early either way.
- A `form` around `DialogPanel` and `DialogFooter` keeps the dialog's spacing and scrolling (#34). The Dialog docs and `mizen info dialog` show the pattern.
- `Grid columns="auto-sm"` fits as many tiles of at least 9rem as there is room for: two in a row on a phone (#32). `"auto"` stays at 16rem.
