---
"@mizen-labs/ui": minor
---

On a phone, the `AppShell` navigation is a floating drawer with gestures:

- A swipe from the left edge opens it, and it follows the finger. A swipe back, a tap outside, Escape, or choosing a link closes it. The edge strip is 12px, so the header's menu button stays tappable.
- It floats as a card 8px from the screen edges, with rounded corners, and has no visible close button. Keyboard and touch screen reader users still get a close button; it shows only while it has keyboard focus.

`Drawer` with `variant="inset"` now floats on phones too: 8px from the edges below 40rem, 12px above, with its border and rounded corners at every width. Before, an inset drawer was full-bleed on a phone.
