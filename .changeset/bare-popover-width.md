---
"@mizen-labs/ui": patch
---

A bare `PopoverPopup` is as wide as its content in every browser. In 0.3.0 a bare popup that opened upward or to the left was 0px wide in Safari, so a `DatePicker` or `DateRangePicker` calendar could not be seen or clicked there. In other browsers it was squeezed to its narrowest width. The popup no longer takes its width from the positioner.
