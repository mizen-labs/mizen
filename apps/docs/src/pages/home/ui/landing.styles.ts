import { colors } from "@mizen-labs/ui/colors.stylex";
import { conditions } from "@mizen-labs/ui/conditions.stylex";
import { borderWidth } from "@mizen-labs/ui/interaction.stylex";
import { duration, easing } from "@mizen-labs/ui/motion.stylex";
import { shadows } from "@mizen-labs/ui/shadows.stylex";
import { shape } from "@mizen-labs/ui/shape.stylex";
import { space } from "@mizen-labs/ui/spacing.stylex";
import {
	fontSize,
	fontWeight,
	lineHeight,
} from "@mizen-labs/ui/typography.stylex";
import { create } from "@stylexjs/stylex";

const WIDE = conditions.md;
const MOTION = "@media (prefers-reduced-motion: no-preference)";

// The page: a short statement, the film, three principles, one command.
export const homeStyles = create({
	actions: {
		display: "flex",
		flexWrap: "wrap",
		gap: space["3"],
		justifyContent: "center",
		paddingBlockStart: space["2"],
	},
	footer: {
		alignItems: "center",
		color: colors.mutedContent,
		display: "flex",
		flexWrap: "wrap",
		fontSize: fontSize["14"],
		gap: space["4"],
		justifyContent: "space-between",
		paddingBlockEnd: space["8"],
	},
	footerLinks: { display: "flex", flexWrap: "wrap", gap: space["6"] },
	hero: {
		display: "grid",
		gap: space["5"],
		justifyItems: "center",
		paddingBlockStart: { default: space["12"], [WIDE]: "6rem" },
		textAlign: "center",
	},
	lede: {
		color: colors.mutedContent,
		fontSize: { default: fontSize["16"], [WIDE]: "1.1875rem" },
		lineHeight: 1.5,
		margin: 0,
		maxWidth: "34ch",
	},
	link: {
		color: colors.content,
		textDecoration: { ":hover": "underline", default: "none" },
		textUnderlineOffset: "0.2em",
	},
	page: {
		display: "grid",
		marginInline: "auto",
		maxWidth: "80rem",
		paddingInline: { default: space["4"], [WIDE]: space["10"] },
		rowGap: { default: "5rem", [WIDE]: "8rem" },
	},
	principle: { alignContent: "start", display: "grid", gap: space["3"] },
	principles: {
		display: "grid",
		gap: { default: space["10"], [WIDE]: space["8"] },
		gridTemplateColumns: {
			default: "minmax(0, 1fr)",
			[WIDE]: "repeat(3, minmax(0, 1fr))",
		},
	},
	principleText: {
		color: colors.mutedContent,
		fontSize: fontSize["16"],
		lineHeight: 1.55,
		margin: 0,
		maxWidth: "30ch",
	},
	principleTitle: {
		fontSize: "clamp(1.5rem, 2.4vw, 2rem)",
		fontWeight: fontWeight.semibold,
		letterSpacing: "-0.035em",
		lineHeight: 1.1,
		margin: 0,
	},
	start: {
		alignItems: "center",
		display: "grid",
		gap: space["6"],
		justifyItems: "center",
		textAlign: "center",
	},
	startTitle: {
		fontSize: "clamp(2rem, 4vw, 3.25rem)",
		fontWeight: fontWeight.semibold,
		letterSpacing: "-0.045em",
		lineHeight: 1,
		margin: 0,
	},
	title: {
		fontSize: "clamp(2.5rem, 6vw, 5rem)",
		fontWeight: fontWeight.semibold,
		letterSpacing: "-0.05em",
		lineHeight: 0.98,
		margin: 0,
		maxWidth: "15ch",
		textWrap: "balance",
	},
});

// The film: a window of the product running off the right and the bottom,
// with the theme panel straddling its left edge.
export const filmStyles = create({
	at: (x: number, y: number, pressed: boolean) => ({
		transform: `translate(${x - 2}px, ${y - 2}px) scale(${pressed ? 0.86 : 1})`,
	}),
	body: {
		display: "grid",
		flexGrow: 1,
		gridTemplateColumns: {
			default: "minmax(0, 1fr)",
			[WIDE]: "11rem minmax(0, 1fr)",
		},
		minHeight: 0,
	},
	code: {
		color: colors.mutedContent,
		fontFamily: "ui-monospace, monospace",
		fontSize: fontSize["13"],
		lineHeight: lineHeight["20"],
		textDecoration: { ":hover": "underline", default: "none" },
	},
	color: (value: string) => ({ backgroundColor: value, color: value }),
	fieldset: {
		borderStyle: "none",
		display: "grid",
		gap: space["2"],
		margin: 0,
		minWidth: 0,
		padding: 0,
	},
	figure: {
		backgroundColor: colors.workarea,
		borderRadius: shape.surfaceRadius,
		display: "grid",
		gap: space["1"],
		padding: space["4"],
		transitionDuration: duration.disclosure,
		transitionProperty: "border-radius",
	},
	figureLabel: {
		color: colors.mutedContent,
		fontSize: fontSize["13"],
		lineHeight: lineHeight["20"],
	},
	figures: {
		display: "grid",
		gap: space["3"],
		gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
	},
	figureValue: {
		fontSize: { default: fontSize["16"], [WIDE]: fontSize["20"] },
		fontVariantNumeric: "tabular-nums",
		fontWeight: fontWeight.semibold,
		lineHeight: lineHeight["28"],
	},
	filler: {
		backgroundColor: colors.controlSurface,
		blockSize: "0.5rem",
		borderRadius: "9999px",
		inlineSize: "60%",
		marginBlock: space["2"],
		marginInline: space["2"],
	},
	fillerWide: { inlineSize: "75%" },
	light: {
		backgroundColor: colors.controlBorder,
		blockSize: "0.625rem",
		borderRadius: "9999px",
		inlineSize: "0.625rem",
	},
	lights: { display: "flex", gap: space["1.5"] },
	main: {
		alignContent: "start",
		display: "grid",
		gap: space["5"],
		minWidth: 0,
		padding: { default: space["4"], [WIDE]: space["6"] },
		// The window runs 4rem past the stage; its content stops before it.
		paddingInlineEnd: { default: "5rem", [WIDE]: "6rem" },
	},
	mainHead: {
		alignItems: "center",
		display: "flex",
		justifyContent: "space-between",
	},
	mainTitle: {
		fontSize: fontSize["20"],
		fontWeight: fontWeight.semibold,
		lineHeight: lineHeight["28"],
	},
	navCurrent: { backgroundColor: colors.selected, color: colors.content },
	navItem: {
		borderRadius: shape.controlRadius,
		color: colors.mutedContent,
		fontSize: fontSize["13"],
		lineHeight: lineHeight["20"],
		paddingBlock: space["1.5"],
		paddingInline: space["2"],
	},
	// The panel floats over the window's edge, the one thing with a shadow.
	panel: {
		backgroundColor: colors.surface,
		borderRadius: shape.surfaceRadius,
		boxShadow: shadows.floating,
		display: "grid",
		gap: space["3"],
		insetBlockStart: { default: space["4"], [WIDE]: "13rem" },
		insetInlineStart: { default: space["4"], [WIDE]: "4%" },
		padding: space["4"],
		position: "absolute",
		width: "16rem",
		zIndex: 1,
	},
	panelField: { display: "grid", gap: space["2"] },
	panelLabel: {
		color: colors.mutedContent,
		fontSize: fontSize["13"],
		lineHeight: lineHeight["20"],
	},
	pointer: {
		insetBlockStart: 0,
		insetInlineStart: 0,
		pointerEvents: "none",
		position: "absolute",
		transitionDuration: { default: "0s", [MOTION]: "750ms" },
		transitionProperty: "transform",
		transitionTimingFunction: easing.expoOut,
		zIndex: 2,
	},
	sidebar: {
		alignContent: "start",
		display: { default: "none", [WIDE]: "grid" },
		gap: space["1"],
		padding: space["3"],
	},
	stage: {
		backgroundColor: colors.workarea,
		borderRadius: {
			default: shape.surfaceRadius,
			[WIDE]: shape.surfaceRadiusLarge,
		},
		height: { default: "36rem", [WIDE]: "32rem" },
		overflow: "hidden",
		position: "relative",
	},
	swatch: {
		blockSize: "1.5rem",
		borderRadius: "9999px",
		borderStyle: "none",
		cursor: "pointer",
		inlineSize: "1.5rem",
		outlineColor: {
			":focus-visible": colors.focusRing,
			default: "currentColor",
		},
		outlineOffset: "2px",
		outlineStyle: {
			":focus-visible": "solid",
			"[aria-pressed=true]": "solid",
			default: "none",
		},
		outlineWidth: borderWidth.focus,
		padding: 0,
	},
	swatches: { display: "flex", gap: space["2"] },
	switchRow: {
		alignItems: "center",
		display: "inline-flex",
		fontSize: fontSize["14"],
		gap: space["2"],
		lineHeight: lineHeight["20"],
	},
	titlebar: {
		alignItems: "center",
		display: "flex",
		gap: space["4"],
		minBlockSize: "2.5rem",
		paddingInline: space["4"],
	},
	window: {
		backgroundColor: colors.surface,
		borderRadius: shape.surfaceRadiusLarge,
		display: "flex",
		flexDirection: "column",
		insetBlockEnd: "-3rem",
		insetBlockStart: { default: "18.5rem", [WIDE]: "3rem" },
		insetInlineEnd: "-4rem",
		insetInlineStart: { default: space["4"], [WIDE]: "14%" },
		overflow: "hidden",
		position: "absolute",
	},
	windowTitle: {
		color: colors.mutedContent,
		fontSize: fontSize["13"],
		lineHeight: lineHeight["20"],
	},
});
