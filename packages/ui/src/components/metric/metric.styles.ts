import { create } from "@stylexjs/stylex";
import { applicationStructure } from "../../styles/application-structure.stylex";
import { colors } from "../../styles/colors.stylex";
import { conditions } from "../../styles/conditions.stylex";
import { borderWidth } from "../../styles/interaction.stylex";
import { space } from "../../styles/spacing.stylex";
import {
	fontSize,
	fontWeight,
	letterSpacing,
	lineHeight,
} from "../../styles/typography.stylex";

// The MetricTrend card names its lead column; a value in a lead narrower
// than 14rem steps down a size.
const NARROW = applicationStructure.narrowMetric;

// A soft change chip fills with the tint of its tone, like a soft Badge. The
// sign carries the direction, so it needs no dot.
const soft = (fill: string, text: string) =>
	({
		backgroundColor: fill,
		borderColor: "transparent",
		color: text,
	}) as const;

export const metricStyles = create({
	// A hairline pill with ink text, like a status badge; the dot says whether
	// the change is good.
	delta: {
		alignItems: "center",
		borderColor: colors.border,
		borderRadius: "0.625rem",
		borderStyle: "solid",
		borderWidth: borderWidth.thin,
		boxSizing: "border-box",
		color: colors.content,
		display: "inline-flex",
		flexShrink: 0,
		fontSize: fontSize["12"],
		fontVariantNumeric: "tabular-nums",
		gap: "0.375rem",
		letterSpacing: letterSpacing.normal,
		lineHeight: lineHeight["16"],
		minHeight: "1.25rem",
		paddingInline: "0.375rem",
		whiteSpace: "nowrap",
		// Keeps the chip its own size when Metric stacks it in a column.
		width: "fit-content",
	},
	deltaBetter: { "--mizen-metric-delta": colors.successSolid },
	deltaDot: {
		"::before": {
			backgroundColor: "var(--mizen-metric-delta)",
			borderRadius: "9999px",
			content: '""',
			flexShrink: 0,
			height: "0.375rem",
			width: "0.375rem",
		},
	},
	deltaFlat: { "--mizen-metric-delta": colors.controlBorderStrong },
	deltaSoftBetter: soft(colors.success, colors.successContent),
	deltaSoftFlat: soft(colors.secondary, colors.secondaryContent),
	deltaSoftWorse: soft(colors.destructiveSubtle, colors.destructiveText),
	deltaWorse: { "--mizen-metric-delta": colors.destructive },
	description: {
		color: colors.mutedContent,
		fontSize: fontSize["13"],
		fontWeight: fontWeight.regular,
		letterSpacing: letterSpacing.ui,
		lineHeight: lineHeight["20"],
		margin: 0,
		minWidth: 0,
		overflowWrap: "break-word",
		textWrap: "pretty",
	},
	label: {
		color: colors.mutedContent,
		fontSize: fontSize["13"],
		fontWeight: fontWeight.medium,
		letterSpacing: letterSpacing.ui,
		lineHeight: lineHeight["20"],
		margin: 0,
		minWidth: 0,
		overflowWrap: "break-word",
	},
	root: {
		display: "flex",
		flexDirection: "column",
		gap: space["1"],
		margin: 0,
		minWidth: 0,
	},
	// A number never breaks across lines. In a narrow MetricTrend card it
	// steps down from 28px to 20px instead.
	value: {
		color: colors.content,
		margin: 0,
		minWidth: 0,
		whiteSpace: "nowrap",
	},
	// The numeric role's sizes, plus the step down in a narrow card.
	valueNarrow: {
		fontSize: {
			[conditions.sm]: { [NARROW]: fontSize["20"], default: fontSize["28"] },
			default: fontSize["20"],
		},
		lineHeight: {
			[conditions.sm]: {
				[NARROW]: lineHeight["28"],
				default: lineHeight["32"],
			},
			default: lineHeight["28"],
		},
	},
});
