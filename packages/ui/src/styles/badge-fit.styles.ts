import { create } from "@stylexjs/stylex";
import { borderWidth } from "./interaction.stylex";
import { fontSize, lineHeight } from "./typography.stylex";

// The size of a Badge inside a control, from the height of the control. The
// space above, below, and after a trailing badge is the same, so the pill sits
// concentric in the control's end.
//
// A neutral badge also takes the control's text color and a tint of it, so it
// shows on any control surface: a filled button, an outline button, or a
// selected or unselected tab.
const fit = (
	item: string,
	height: string,
	inline: string,
	leading: string,
	font: string
) =>
	({
		"--mizen-badge-fill": "color-mix(in oklab, currentcolor 14%, transparent)",
		"--mizen-badge-font-size": font,
		"--mizen-badge-ink": "currentcolor",
		"--mizen-badge-line-height": leading,
		"--mizen-badge-numeric": "tabular-nums",
		"--mizen-badge-padding": inline,
		"--mizen-badge-size": height,
		paddingInlineEnd: {
			":has(> [data-slot='badge']:last-child)": `calc((${item} - ${height}) / 2 - ${borderWidth.thin})`,
			default: null,
		},
	}) as const;

const LINE = lineHeight["16"];
const FONT = fontSize["12"];

// Named by the height of the control: a button, a tab, or a segment.
export const badgeFit = create({
	h24: fit("1.5rem", "1.125rem", "0.25rem", LINE, FONT),
	h28: fit("1.75rem", "1.125rem", "0.3125rem", LINE, FONT),
	h32: fit("2rem", "1.25rem", "0.375rem", LINE, FONT),
	h36: fit("2.25rem", "1.25rem", "0.375rem", LINE, FONT),
	h40: fit("2.5rem", "1.375rem", "0.5rem", LINE, FONT),
	h44: fit("2.75rem", "1.5rem", "0.625rem", lineHeight["20"], fontSize["13"]),
});
