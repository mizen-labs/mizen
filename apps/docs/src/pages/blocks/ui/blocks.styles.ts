import { colors } from "@mizen-labs/ui/colors.stylex";
import { conditions } from "@mizen-labs/ui/conditions.stylex";
import { borderWidth } from "@mizen-labs/ui/interaction.stylex";
import { duration } from "@mizen-labs/ui/motion.stylex";
import { shape } from "@mizen-labs/ui/shape.stylex";
import { space } from "@mizen-labs/ui/spacing.stylex";
import {
	fontSize,
	fontWeight,
	letterSpacing,
	lineHeight,
} from "@mizen-labs/ui/typography.stylex";
import { create } from "@stylexjs/stylex";

const WIDE = conditions.md;

export const blocksStyles = create({
	// The drawing sits in the middle of its band.
	art: { alignContent: "center", display: "grid" },
	block: {
		display: "grid",
		gap: space["3"],
		scrollMarginTop: "5rem",
	},
	blockHead: {
		alignItems: "end",
		display: "flex",
		flexWrap: "wrap",
		gap: space["3"],
		justifyContent: "space-between",
	},
	blockText: {
		color: colors.mutedContent,
		fontSize: fontSize["14"],
		lineHeight: lineHeight["20"],
		margin: 0,
	},
	blockTitle: {
		fontSize: fontSize["20"],
		fontWeight: fontWeight.semibold,
		lineHeight: lineHeight["28"],
		margin: 0,
	},
	cell: {
		borderBottomColor: colors.border,
		borderBottomStyle: "solid",
		borderBottomWidth: borderWidth.thin,
		borderInlineEndColor: colors.border,
		borderInlineEndStyle: "solid",
		borderInlineEndWidth: borderWidth.thin,
		display: "grid",
	},
	count: {
		color: colors.mutedContent,
		fontSize: fontSize["13"],
		lineHeight: lineHeight["20"],
	},
	crumbLink: {
		color: colors.mutedContent,
		textDecoration: { ":hover": "underline", default: "none" },
	},
	// The category page.
	crumbs: {
		color: colors.mutedContent,
		fontSize: fontSize["13"],
		lineHeight: lineHeight["20"],
	},
	files: { display: "grid", gap: space["4"] },
	// The block runs in its own document at a desktop width.
	frame: {
		backgroundColor: colors.workarea,
		blockSize: { default: "34rem", [WIDE]: "40rem" },
		borderColor: colors.border,
		borderRadius: shape.surfaceRadiusLarge,
		borderStyle: "solid",
		borderWidth: borderWidth.thin,
		boxSizing: "border-box",
		display: "block",
		inlineSize: "100%",
	},
	// One ruled sheet: tiles share their borders.
	grid: {
		borderInlineStartColor: colors.border,
		borderInlineStartStyle: "solid",
		borderInlineStartWidth: borderWidth.thin,
		borderTopColor: colors.border,
		borderTopStyle: "solid",
		borderTopWidth: borderWidth.thin,
		display: "grid",
		gridTemplateColumns: {
			default: "minmax(0, 1fr)",
			[conditions.sm]: "repeat(2, minmax(0, 1fr))",
			[conditions.lg]: "repeat(3, minmax(0, 1fr))",
		},
		listStyle: "none",
		margin: 0,
		padding: 0,
	},
	group: { display: "grid", gap: space["3"] },
	groupTitle: {
		color: colors.mutedContent,
		fontSize: fontSize["13"],
		fontWeight: fontWeight.medium,
		lineHeight: lineHeight["20"],
		margin: 0,
	},
	id: {
		backgroundColor: colors.workarea,
		borderRadius: shape.controlRadiusSmall,
		color: colors.mutedContent,
		fontFamily: "ui-monospace, monospace",
		fontSize: fontSize["13"],
		lineHeight: lineHeight["20"],
		marginInlineStart: space["2"],
		paddingInline: space["2"],
	},
	intro: {
		display: "grid",
		gap: space["3"],
		maxWidth: "40rem",
		paddingBlockStart: { default: space["10"], [WIDE]: space["16"] },
	},
	lede: {
		color: colors.mutedContent,
		fontSize: fontSize["16"],
		lineHeight: lineHeight["24"],
		margin: 0,
	},
	page: {
		display: "grid",
		marginInline: "auto",
		maxWidth: "80rem",
		paddingBlockEnd: space["16"],
		paddingInline: { default: space["4"], [WIDE]: space["10"] },
		rowGap: space["8"],
	},
	tile: {
		backgroundColor: {
			":hover": { [conditions.canHover]: colors.workarea },
			default: "transparent",
		},
		color: colors.content,
		display: "grid",
		gap: space["4"],
		gridTemplateRows: "auto 9rem",
		outlineColor: colors.focusRing,
		outlineOffset: `-${borderWidth.focus}`,
		outlineStyle: { ":focus-visible": "solid", default: "none" },
		outlineWidth: borderWidth.focus,
		padding: space["5"],
		textDecoration: "none",
		transitionDuration: duration.fast,
		transitionProperty: "background-color",
	},
	tileHead: {
		alignItems: "baseline",
		display: "flex",
		gap: space["2"],
		justifyContent: "space-between",
	},
	tileTitle: {
		fontSize: fontSize["16"],
		fontWeight: fontWeight.semibold,
		lineHeight: lineHeight["24"],
	},
	title: {
		fontSize: fontSize["40"],
		fontWeight: fontWeight.semibold,
		letterSpacing: letterSpacing.display,
		lineHeight: lineHeight["44"],
		margin: 0,
	},
	toolbar: { alignItems: "center", display: "flex", gap: space["1"] },
});

// The tiles' drawings.
export const wireStyles = create({
	accent: { backgroundColor: colors.accent },
	accentFill: { backgroundColor: colors.accent },
	area: { fill: colors.brandBackground },
	chart: { blockSize: "3.5rem", inlineSize: "100%" },
	column: { alignContent: "start", display: "grid", gap: space["2"] },
	content: { alignContent: "start", display: "grid", gap: space["2"] },
	field: {
		blockSize: "1.25rem",
		borderColor: colors.controlBorder,
		borderRadius: shape.controlRadiusSmall,
		borderStyle: "solid",
		borderWidth: "1.5px",
	},
	figure: { minBlockSize: "2.25rem" },
	fill: {
		backgroundColor: colors.workarea,
		blockSize: "100%",
		borderRadius: shape.controlRadius,
		minBlockSize: "4rem",
	},
	frame: {
		borderColor: colors.controlBorder,
		borderRadius: shape.controlRadiusLarge,
		borderStyle: "solid",
		borderWidth: "1.5px",
		display: "grid",
		gap: space["2"],
		gridTemplateColumns: "28% 1fr",
		padding: space["2"],
	},
	line: {
		backgroundColor: colors.controlBorder,
		blockSize: "0.375rem",
		borderRadius: "9999px",
		inlineSize: "70%",
	},
	row: {
		display: "grid",
		gap: space["2"],
		gridTemplateColumns: "repeat(3, 1fr)",
	},
	setting: {
		alignItems: "center",
		display: "flex",
		justifyContent: "space-between",
	},
	short: { inlineSize: "45%" },
	sidebar: {
		alignContent: "start",
		backgroundColor: colors.workarea,
		borderRadius: shape.controlRadius,
		display: "grid",
		gap: space["2"],
		padding: space["2"],
	},
	stroke: { fill: "none", stroke: colors.accent, strokeWidth: 1.5 },
	title: { blockSize: "0.5rem", inlineSize: "40%" },
	toggle: {
		backgroundColor: colors.controlBorder,
		blockSize: "0.75rem",
		borderRadius: "9999px",
		inlineSize: "1.5rem",
	},
});
