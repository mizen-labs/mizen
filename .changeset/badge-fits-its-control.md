---
"@mizen-labs/ui": minor
---

A `Badge` inside a `Button`, a `TabsTab` or a `SegmentedControlItem` now fits the control. Put it after the label, with no `size` and no `variant`:

```tsx
<Button variant="outline">
  Filters <Badge>3</Badge>
</Button>
```

- The control sets the badge's height, padding and type size, from 18px in a 24px control to 24px in a 44px one. `size` is ignored there.
- A `default` or `secondary` badge takes the control's text color and a tint of it, so it shows on a filled button, an outline button, and a selected or unselected tab. Status, brand and outline badges keep their colors.
- A trailing badge sits concentric in the end of the control: the space above, below and after it is the same.
- Digits are tabular, and one digit makes a circle.

This changes a badge that an app already put inside one of these controls: it may get a different size, and a `default` or `secondary` badge gets the tinted fill.
