---
"@mizen-labs/cli": minor
---

`mizen init --preset` takes a theme code from the Create page, such as `--preset m33ut`, besides a named preset such as `vivid`. The code holds the accent, whether it fills the main buttons, the neutral tone, radius, body and heading fonts, and density; init writes them to `mizen-theme.css` as `--mizen-*` variables for light and dark. A font comes from Google Fonts as an `@fontsource-variable` package: the theme file imports it, and init installs it with the app's package manager. Every accent keeps white text at 4.5:1 or more in both themes. A code from a newer Create page stops before any change and asks to update the CLI.
