import { create } from "@stylexjs/stylex";
import { colors } from "../../styles/colors.stylex";
import { controlSize } from "../../styles/dimensions.stylex";
import {
	borderWidth,
	focus,
	focusMotion,
	focusOutline,
} from "../../styles/interaction.stylex";
import { space } from "../../styles/spacing.stylex";
import {
	fontSize,
	fontWeight,
	letterSpacing,
	lineHeight,
} from "../../styles/typography.stylex";

// A status badge is a hairline pill with ink text; a dot carries the status
// color, so the label never depends on color alone. An icon replaces the dot.
const status = (dot: string) =>
	({
		"::before": {
			backgroundColor: dot,
			borderRadius: "9999px",
			content: '""',
			display: { ":has(svg)": "none", default: "block" },
			flexShrink: 0,
			height: "0.375rem",
			width: "0.375rem",
		},
		backgroundColor: "transparent",
		borderColor: colors.border,
		color: colors.content,
		gap: "0.375rem",
	}) as const;

// A soft status badge fills with the status tint. The label names the
// status, so it needs no dot.
const soft = (fill: string, text: string) =>
	({
		backgroundColor: fill,
		borderColor: "transparent",
		color: text,
	}) as const;

const LG_PADDING = "0.625rem";
// The size a badge that stands alone reports to its block margins: none.
const ALONE = "0px";

export const badgeStyles = create({
	base: {
		alignItems: "center",
		animationDuration: {
			":focus-visible": focusMotion.duration,
		},
		animationName: {
			":focus-visible": focusMotion.ring,
		},
		borderStyle: "solid",
		borderWidth: borderWidth.thin,
		boxSizing: "border-box",
		display: "inline-flex",
		flexShrink: 1,
		fontFamily: "inherit",
		// Inside a control, digits keep one width and one digit makes a circle.
		fontVariantNumeric: "var(--mizen-badge-numeric, normal)",
		fontWeight: fontWeight.medium,
		gap: space["1"],
		justifyContent: "center",
		// Inside a control the badge can be taller than the label's line. The
		// margins take it out of the control's height, and it stays centered.
		marginBlock: `calc(var(--mizen-badge-size, ${ALONE}) / -2)`,
		maxWidth: "100%",
		minWidth: "var(--mizen-badge-size, 0)",
		outlineColor: {
			":focus-visible": colors.focusRing,
			default: "transparent",
		},
		outlineOffset: { ":focus-visible": focus.offset, default: focus.offset },
		outlineStyle: {
			":focus-visible": "solid",
			default: focusOutline.restingOutlineStyle,
		},
		outlineWidth: {
			":focus-visible": borderWidth.focus,
			default: borderWidth.focus,
		},
		// break-word, not anywhere: a long label still wraps, but a table column
		// cannot shrink the badge to one letter per line.
		overflowWrap: "break-word",
		whiteSpace: "normal",
		// A Stack or grid cell would stretch it to a full-width bar.
		width: "fit-content",
	},
	brand: {
		backgroundColor: colors.brandBackground,
		borderColor: "transparent",
		color: colors.brandForeground,
	},
	// The tile tone: visible on the page surface and on card fills alike.
	// Inside a control, the control sets the fill and the ink.
	default: {
		backgroundColor: `var(--mizen-badge-fill, ${colors.controlSurface})`,
		borderColor: "transparent",
		color: `var(--mizen-badge-ink, ${colors.secondaryContent})`,
	},
	// Each radius is half the one-line height: a pill that stays a rounded
	// rectangle when the label wraps. Inside a control, the control sets the
	// size, so the three sizes are for a badge that stands alone.
	defaultSize: {
		borderRadius: "calc(var(--mizen-badge-size, 1.375rem) / 2)",
		fontSize: `var(--mizen-badge-font-size, ${fontSize["12"]})`,
		letterSpacing: letterSpacing.caption,
		lineHeight: `var(--mizen-badge-line-height, ${lineHeight["16"]})`,
		minHeight: "var(--mizen-badge-size, 1.375rem)",
		paddingInline: `var(--mizen-badge-padding, ${space["2"]})`,
	},
	destructive: status(colors.destructive),
	info: status(colors.infoSolid),
	lg: {
		borderRadius: `calc(var(--mizen-badge-size, ${controlSize.xs}) / 2)`,
		fontSize: `var(--mizen-badge-font-size, ${fontSize["13"]})`,
		letterSpacing: letterSpacing.ui,
		lineHeight: `var(--mizen-badge-line-height, ${lineHeight["20"]})`,
		minHeight: `var(--mizen-badge-size, ${controlSize.xs})`,
		paddingInline: `var(--mizen-badge-padding, ${LG_PADDING})`,
	},
	outline: {
		backgroundColor: "transparent",
		borderColor: colors.border,
		color: colors.content,
	},
	secondary: {
		backgroundColor: `var(--mizen-badge-fill, ${colors.secondary})`,
		borderColor: "transparent",
		color: `var(--mizen-badge-ink, ${colors.secondaryContent})`,
	},
	sm: {
		borderRadius: "calc(var(--mizen-badge-size, 1.25rem) / 2)",
		fontSize: `var(--mizen-badge-font-size, ${fontSize["12"]})`,
		letterSpacing: letterSpacing.caption,
		lineHeight: `var(--mizen-badge-line-height, ${lineHeight["16"]})`,
		minHeight: "var(--mizen-badge-size, 1.25rem)",
		paddingInline: `var(--mizen-badge-padding, ${space["1.5"]})`,
	},
	softDestructive: soft(colors.destructiveSubtle, colors.destructiveText),
	softInfo: soft(colors.info, colors.infoContent),
	softSuccess: soft(colors.success, colors.successContent),
	softWarning: soft(colors.warning, colors.warningContent),
	success: status(colors.successSolid),
	warning: status(colors.warningSolid),
});
