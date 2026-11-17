import { defineVars } from "@stylexjs/stylex";
export const shape = defineVars({
	checkboxRadius: "0.25rem",
	controlRadius: "0.5rem",
	controlRadiusLarge: "0.625rem",
	// 24px controls: small enough to nest 4px inside a field.
	controlRadiusSmall: "0.375rem",
	floatingRadius: "0.75rem",
	// Inline marks inside text, such as Code: small enough to stay rectangular.
	inlineRadius: "0.375rem",
	// Pill shapes: Switch, Progress, Meter, Badge, a delta chip. A theme with
	// square corners sets 0; circles such as Radio and dots stay round.
	pillRadius: "9999px",
	surfaceRadius: "1rem",
	surfaceRadiusLarge: "1.25rem",
});
