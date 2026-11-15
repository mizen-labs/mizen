---
"@mizen-labs/ui": minor
---

Add `PageMedia` for an avatar, a logo or a record icon before the page title (#28). It spans the title and the description, keeps `PageAction` on the title line, and sits above the text when the header is narrower than 30rem.

`PageHeader` now has three columns. The first holds `PageMedia` and has no width without it, so a header without media looks the same.
