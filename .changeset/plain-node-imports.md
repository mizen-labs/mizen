---
"@mizen-labs/ui": patch
---

Plain Node can load every component module, such as a server build or a test runner that does not bundle Mizen.

- Each import in the built JavaScript and declarations names its file (`../../icons.js`), as Node's ES module loader and TypeScript's `node16` resolution require.
- No module imports CSS anymore. The few component rules StyleX cannot express (Button icons, ButtonGroup, Composer, Diagram) ship in `@mizen-labs/ui/styles.css`, the one stylesheet an app already imports.

The `*.stylex` token entries still point at TypeScript source; they are for a StyleX build, which compiles them.
