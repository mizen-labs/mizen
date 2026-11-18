import { colors } from "@mizen-labs/ui/colors.stylex";
import { conditions } from "@mizen-labs/ui/conditions.stylex";
import { shape } from "@mizen-labs/ui/shape.stylex";
import { space } from "@mizen-labs/ui/spacing.stylex";
import {
	fontSize,
	fontWeight,
	letterSpacing,
	lineHeight,
} from "@mizen-labs/ui/typography.stylex";
import { create } from "@stylexjs/stylex";

const WIDE = conditions.lg;

export const appsStyles = create({
	actions: { display: "flex", flexWrap: "wrap", gap: space["3"] },
	// The screen keeps its desktop width; the crop shows its top-left.
	crop: {
		blockSize: { default: "18rem", [conditions.sm]: "26rem" },
		borderRadius: shape.surfaceRadius,
		overflow: "hidden",
		pointerEvents: "none",
		position: "relative",
	},
	definition: {
		fontSize: fontSize["14"],
		lineHeight: lineHeight["20"],
		margin: 0,
	},
	// The app beside what it is and how to open it, on one tone step.
	entry: {
		backgroundColor: colors.workarea,
		borderRadius: shape.surfaceRadiusLarge,
		display: "grid",
		gap: space["6"],
		gridTemplateColumns: {
			default: "minmax(0, 1fr)",
			[WIDE]: "minmax(0, 7fr) minmax(0, 4fr)",
		},
		padding: { default: space["4"], [conditions.sm]: space["6"] },
	},
	entryBody: {
		fontSize: fontSize["16"],
		lineHeight: lineHeight["24"],
		margin: 0,
	},
	entryTitle: {
		fontSize: fontSize["28"],
		fontWeight: fontWeight.semibold,
		letterSpacing: letterSpacing.title,
		lineHeight: lineHeight["32"],
		margin: 0,
	},
	facts: { alignContent: "start", display: "grid", gap: space["4"] },
	// The app runs in its own document, so it has its own theme and follows
	// the width of this frame, not of the window.
	frame: {
		backgroundColor: colors.workarea,
		blockSize: `calc(${space["16"]} * 12)`,
		borderColor: colors.border,
		borderRadius: shape.surfaceRadius,
		borderStyle: "solid",
		borderWidth: "1px",
		boxSizing: "border-box",
		display: "block",
		inlineSize: "100%",
	},
	header: { display: "grid", gap: space["3"], maxInlineSize: "40rem" },
	lede: {
		color: colors.mutedContent,
		fontSize: fontSize["16"],
		lineHeight: lineHeight["24"],
		margin: 0,
	},
	list: { display: "grid", gap: space["1"], margin: 0 },
	live: {
		blockSize: "56rem",
		borderStyle: "none",
		inlineSize: "80rem",
		insetBlockStart: 0,
		insetInlineStart: 0,
		position: "absolute",
		transform: { default: "scale(0.5)", [conditions.sm]: "scale(0.62)" },
		transformOrigin: "top left",
	},
	next: { display: "grid", gap: space["4"] },
	nextItem: {
		backgroundColor: {
			":hover": colors.selected,
			default: colors.workarea,
		},
		borderRadius: shape.surfaceRadius,
		color: colors.content,
		display: "grid",
		gap: space["1"],
		outlineColor: colors.focusRing,
		outlineOffset: "2px",
		outlineStyle: { ":focus-visible": "solid", default: "none" },
		outlineWidth: "2px",
		padding: space["5"],
		textDecoration: "none",
	},
	nextLabel: {
		fontSize: fontSize["16"],
		fontWeight: fontWeight.medium,
		lineHeight: lineHeight["24"],
	},
	nextList: {
		display: "grid",
		gap: space["4"],
		gridTemplateColumns: {
			default: "minmax(0, 1fr)",
			[conditions.md]: "repeat(3, minmax(0, 1fr))",
		},
		listStyle: "none",
		margin: 0,
		padding: 0,
	},
	nextTitle: {
		fontSize: fontSize["20"],
		fontWeight: fontWeight.semibold,
		lineHeight: lineHeight["28"],
		margin: 0,
	},
	// The site's centered column, wide enough to frame an app at desktop width.
	page: {
		boxSizing: "border-box",
		display: "grid",
		gap: space["8"],
		gridTemplateColumns: "minmax(0, 1fr)",
		marginInline: "auto",
		maxInlineSize: "88rem",
		paddingBlock: { default: space["6"], [conditions.sm]: space["8"] },
		paddingInline: { default: space["4"], [conditions.sm]: space["8"] },
		width: "100%",
	},
	// Text and code keep a readable measure inside the wide column.
	section: { maxInlineSize: "56rem" },
	term: {
		color: colors.mutedContent,
		fontSize: fontSize["13"],
		lineHeight: lineHeight["20"],
	},
	title: {
		fontSize: fontSize["40"],
		fontWeight: fontWeight.semibold,
		letterSpacing: letterSpacing.display,
		lineHeight: lineHeight["44"],
		margin: 0,
	},
});
