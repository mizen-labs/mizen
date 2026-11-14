---
"@mizen-labs/ui": patch
---

Fix two overlay defects.

- A `Select`, `Combobox`, `Menu`, `Popover` or `DatePicker` inside a `Drawer` now opens above the drawer and takes mouse and touch input (#27). The drawer viewport now sits in the same layer as the `Dialog` and `Sheet` viewports.
- A closed `Sheet`, `Dialog` or `Drawer` with `keepMounted` is now hidden and takes no clicks (#26). Their popup and viewport no longer override the `hidden` attribute.
