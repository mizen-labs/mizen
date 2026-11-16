---
"@mizen-labs/cli": minor
---

`mizen init --preset` takes a theme code from the Create page, such as `--preset m1m4l`, besides a named preset such as `vivid`. The code holds the accent, neutral tone, radius, font and density; init writes them to `mizen-theme.css` as `--mizen-*` variables for light and dark. A code from a newer Create page stops before any change and asks to update the CLI.
