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
import { create, keyframes } from "@stylexjs/stylex";

// The hero uses a fluid display scale; the live dashboard uses product type roles.
export const landingStyles = create({
	account: { alignItems: "center", display: "flex", gap: space["3"] },
	charts: {
		display: "grid",
		gap: space["4"],
		gridTemplateColumns: {
			"@media (min-width: 64rem)": "repeat(3, minmax(0, 1fr))",
			default: "minmax(0, 1fr)",
		},
	},
	// Charts keep their own height, so cards stack in two columns and the last
	// card of the shorter column takes the spare height.
	column: {
		display: "flex",
		flexDirection: "column",
		gap: space["4"],
		minInlineSize: 0,
	},
	dashboard: {
		backgroundColor: colors.surface,
		borderColor: colors.border,
		borderRadius: shape.surfaceRadius,
		borderStyle: "solid",
		borderWidth: borderWidth.thin,
		boxShadow: shadows.surface,
		minInlineSize: 0,
	},
	dashboardBar: {
		alignItems: "center",
		borderBlockEndColor: colors.border,
		borderBlockEndStyle: "solid",
		borderBlockEndWidth: borderWidth.thin,
		display: "flex",
		flexWrap: "wrap",
		gap: space["3"],
		justifyContent: "space-between",
		paddingBlock: space["4"],
		paddingInline: { default: space["4"], [conditions.sm]: space["6"] },
	},
	dashboardBody: {
		display: "grid",
		gap: space["6"],
		minInlineSize: 0,
		padding: { default: space["2"], [conditions.sm]: space["6"] },
	},
	dashboardHeading: {
		alignItems: "center",
		display: "flex",
		flexWrap: "wrap",
		gap: space["4"],
		justifyContent: "space-between",
		paddingBlock: space["2"],
		paddingInline: { default: space["2"], [conditions.sm]: 0 },
	},
	grow: { display: "grid", flexGrow: 1 },
	metrics: {
		display: "grid",
		gap: space["4"],
		gridTemplateColumns: {
			"@media (min-width: 40rem)": "repeat(2, minmax(0, 1fr))",
			"@media (min-width: 64rem)": "repeat(4, minmax(0, 1fr))",
			default: "minmax(0, 1fr)",
		},
	},
	muted: { color: colors.mutedContent },
	period: {
		alignItems: "center",
		display: "flex",
		flexWrap: "wrap",
		gap: space["3"],
	},
	supporting: { color: colors.mutedContent, marginBlockStart: space["2"] },
	title: {
		fontSize: "clamp(2.75rem, 6vw, 5.25rem)",
		fontWeight: fontWeight.medium,
		letterSpacing: "-0.04em",
		lineHeight: 1.05,
		maxInlineSize: "100%",
		overflowWrap: "anywhere",
		textWrap: "balance",
	},
	wide: {
		gridColumn: { "@media (min-width: 64rem)": "span 2", default: "auto" },
	},
	workspace: {
		alignItems: "center",
		display: "flex",
		flexWrap: "wrap",
		gap: space["2"],
	},
	workspaceMark: {
		alignItems: "center",
		backgroundColor: colors.brandBackground,
		borderRadius: shape.inlineRadius,
		color: colors.brandForeground,
		display: "flex",
		padding: space["2"],
	},
});

const HOME_WIDE = conditions.md;
const HOME_LARGE = conditions.lg;
const MOTION = "@media (prefers-reduced-motion: no-preference)";

// The stage opens from its left edge once, when the page loads.
const shutter = keyframes({
	from: { clipPath: "inset(0 100% 0 0)" },
	to: { clipPath: "inset(0 0 0 0)" },
});
const settle = keyframes({
	from: { transform: "scale(1.04) translateY(12px)" },
	to: { transform: "none" },
});

export const homeStyles = create({
	actions: {
		alignItems: "center",
		display: "flex",
		flexWrap: "wrap",
		gap: space["3"],
	},
	body: {
		color: colors.content,
		fontSize: { default: fontSize["16"], [HOME_WIDE]: "1.125rem" },
		lineHeight: 1.55,
		margin: 0,
	},
	// The close: the accent field, the closing line, and the first step.
	close: {
		backgroundColor: colors.accent,
		borderRadius: shape.surfaceRadiusLarge,
		color: colors.accentContent,
		display: "grid",
		gap: space["8"],
		gridTemplateColumns: {
			default: "minmax(0, 1fr)",
			[HOME_WIDE]: "minmax(0, 1fr) minmax(0, 1fr)",
		},
		minHeight: { default: "auto", [HOME_WIDE]: "28rem" },
		padding: { default: space["6"], [HOME_WIDE]: space["12"] },
	},
	closeBody: {
		fontSize: "1.125rem",
		lineHeight: 1.5,
		margin: 0,
		opacity: 0.86,
	},
	closeLine: {
		alignSelf: "end",
		display: "grid",
		gap: space["4"],
	},
	closePanel: {
		alignSelf: { default: "start", [HOME_WIDE]: "center" },
		backgroundColor: colors.surface,
		borderRadius: shape.surfaceRadius,
		color: colors.content,
		display: "grid",
		gap: space["4"],
		padding: space["5"],
	},
	closeTitle: {
		fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
		fontWeight: fontWeight.semibold,
		letterSpacing: "-0.045em",
		lineHeight: 0.96,
		margin: 0,
	},
	code: {
		color: colors.mutedContent,
		fontSize: fontSize["13"],
		lineHeight: lineHeight["20"],
	},
	color: (value: string) => ({ backgroundColor: value, color: value }),
	// The theme control sits on the stage, beside what it changes.
	control: {
		alignSelf: "start",
		backgroundColor: colors.surface,
		borderRadius: shape.surfaceRadius,
		display: "grid",
		gap: space["4"],
		padding: space["4"],
	},
	controlLabel: {
		color: colors.mutedContent,
		fontSize: fontSize["13"],
		lineHeight: lineHeight["20"],
		margin: 0,
	},
	first: { order: { default: 0, [HOME_WIDE]: -1 } },
	footer: {
		alignItems: "center",
		color: colors.mutedContent,
		display: "grid",
		fontSize: fontSize["14"],
		gap: space["3"],
		gridTemplateColumns: {
			default: "minmax(0, 1fr)",
			[HOME_WIDE]: "1fr auto 1fr",
		},
		paddingBlockEnd: space["8"],
	},
	footerEnd: { justifySelf: { default: "start", [HOME_WIDE]: "end" } },
	footerLinks: { display: "flex", flexWrap: "wrap", gap: space["6"] },
	fragment: {
		alignSelf: "start",
		animationDuration: { default: "0s", [MOTION]: "1.1s" },
		animationName: { default: "none", [MOTION]: settle },
		animationTimingFunction: easing.expoOut,
		backgroundColor: colors.surface,
		borderEndEndRadius: 0,
		borderEndStartRadius: 0,
		borderStartEndRadius: shape.surfaceRadiusLarge,
		borderStartStartRadius: shape.surfaceRadiusLarge,
		display: "grid",
		gap: space["4"],
		maxWidth: "40rem",
		minWidth: 0,
		padding: space["5"],
		paddingBlockEnd: space["8"],
	},
	fragmentHead: {
		alignItems: "center",
		display: "flex",
		flexWrap: "wrap",
		gap: space["3"],
		justifyContent: "space-between",
	},
	fragmentTitle: {
		fontSize: fontSize["16"],
		fontWeight: fontWeight.semibold,
		lineHeight: lineHeight["24"],
		margin: 0,
	},
	heading: {
		fontSize: "clamp(2rem, 3.4vw, 3rem)",
		fontWeight: fontWeight.semibold,
		letterSpacing: "-0.035em",
		lineHeight: 1.04,
		margin: 0,
		textWrap: "balance",
	},
	// The headline and the action on the left; the stage runs off the right
	// and the bottom of the first screen.
	hero: {
		display: "grid",
		gap: { default: space["8"], [HOME_LARGE]: space["6"] },
		gridTemplateColumns: {
			default: "minmax(0, 1fr)",
			[HOME_LARGE]: "minmax(0, 5fr) minmax(0, 7fr)",
		},
		paddingBlockStart: { default: space["10"], [HOME_WIDE]: space["16"] },
	},
	heroText: { alignSelf: "start", display: "grid", gap: space["5"] },
	lede: {
		color: colors.mutedContent,
		fontSize: { default: fontSize["16"], [HOME_WIDE]: "1.125rem" },
		lineHeight: 1.5,
		margin: 0,
		maxWidth: "36ch",
	},
	link: {
		color: colors.content,
		textDecoration: { ":hover": "underline", default: "none" },
		textUnderlineOffset: "0.2em",
	},
	page: {
		display: "grid",
		marginInline: "auto",
		maxWidth: "90rem",
		paddingInline: { default: space["4"], [HOME_WIDE]: space["10"] },
		rowGap: { default: "6rem", [HOME_WIDE]: "10rem" },
	},
	showcase: { display: "grid", gap: space["8"] },
	showcaseHead: {
		alignItems: "end",
		display: "grid",
		gap: space["4"],
		gridTemplateColumns: {
			default: "minmax(0, 1fr)",
			[HOME_WIDE]: "minmax(0, 7fr) minmax(0, 5fr)",
		},
	},
	// A statement beside the product doing that thing.
	split: {
		alignItems: "center",
		display: "grid",
		gap: { default: space["8"], [HOME_WIDE]: space["16"] },
		gridTemplateColumns: {
			default: "minmax(0, 1fr)",
			[HOME_WIDE]: "minmax(0, 5fr) minmax(0, 7fr)",
		},
	},
	splitReverse: {
		gridTemplateColumns: {
			default: "minmax(0, 1fr)",
			[HOME_WIDE]: "minmax(0, 7fr) minmax(0, 5fr)",
		},
	},
	// The stage: a field of the accent with one corner cut, holding the
	// product at its true size.
	stage: {
		alignSelf: "end",
		animationDuration: { default: "0s", [MOTION]: "1.1s" },
		animationName: { default: "none", [MOTION]: shutter },
		animationTimingFunction: easing.expoOut,
		backgroundColor: colors.accent,
		clipPath: "polygon(4.5rem 0, 100% 0, 100% 100%, 0 100%, 0 4.5rem)",
		display: "grid",
		gap: space["4"],
		gridTemplateColumns: {
			default: "minmax(0, 1fr)",
			[HOME_WIDE]: "minmax(0, 1fr) 15.5rem",
		},
		marginBlockStart: { default: 0, [HOME_LARGE]: "6rem" },
		marginInlineEnd: {
			default: `calc(-1 * ${space["4"]})`,
			[HOME_WIDE]: `calc(-1 * ${space["10"]})`,
		},
		paddingBlockStart: { default: space["10"], [HOME_WIDE]: space["12"] },
		paddingInline: { default: space["4"], [HOME_WIDE]: space["10"] },
		transitionDuration: duration.disclosure,
		transitionProperty: "background-color",
	},
	statement: { display: "grid", gap: space["4"], maxWidth: "30rem" },
	steps: { display: "grid", gap: space["3"], minWidth: 0 },
	swatch: {
		blockSize: "1.5rem",
		borderRadius: "9999px",
		cursor: "pointer",
		inlineSize: "1.5rem",
		outlineColor: {
			":has(:focus-visible)": colors.focusRing,
			default: "currentColor",
		},
		outlineOffset: "2px",
		outlineStyle: {
			":has(:checked)": "solid",
			":has(:focus-visible)": "solid",
			default: "none",
		},
		outlineWidth: borderWidth.focus,
		position: "relative",
	},
	swatches: {
		borderStyle: "none",
		display: "flex",
		flexWrap: "wrap",
		gap: space["2"],
		margin: 0,
		padding: 0,
	},
	swatchInput: {
		cursor: "pointer",
		inset: 0,
		margin: 0,
		opacity: 0,
		position: "absolute",
	},
	title: {
		fontSize: "clamp(2.75rem, 4.4vw, 4rem)",
		fontWeight: fontWeight.semibold,
		letterSpacing: "-0.045em",
		lineHeight: 0.98,
		margin: 0,
		maxWidth: "16ch",
		textWrap: "balance",
	},
});
