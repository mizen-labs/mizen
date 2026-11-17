import { defineVars } from "@stylexjs/stylex";

// Components inherit the interface family from the app's body. Headings and
// titles take their own family when a theme sets one; code has its own.
export const fonts = defineVars({
	heading: "inherit",
	mono: 'ui-monospace, "SFMono-Regular", Consolas, "Liberation Mono", monospace',
	// Type roles normalize x-height with font-size-adjust so a role keeps its
	// optical size in any family. Set "none" or "from-font" to opt out.
	sizeAdjust: "0.5",
});
