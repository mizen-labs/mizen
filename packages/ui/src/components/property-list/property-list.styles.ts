import { create } from "@stylexjs/stylex";
import { colors } from "../../styles/colors.stylex";
import { conditions } from "../../styles/conditions.stylex";
import { space } from "../../styles/spacing.stylex";
import {
	fontSize,
	fontWeight,
	letterSpacing,
	lineHeight,
} from "../../styles/typography.stylex";

export const propertyListStyles = create({
	// Stacked on a narrow screen, a value sits 4px under its label and 12px
	// above the next label, so each pair reads as one.
	item: {
		alignItems: "baseline",
		columnGap: space["3"],
		display: "grid",
		gridColumnEnd: "-1",
		gridColumnStart: "1",
		gridTemplateColumns: "subgrid",
		minWidth: 0,
		rowGap: space["1"],
	},
	label: {
		color: colors.mutedContent,
		fontSize: fontSize["14"],
		fontWeight: fontWeight.regular,
		letterSpacing: letterSpacing.ui,
		lineHeight: lineHeight["20"],
		margin: 0,
		minWidth: 0,
		overflowWrap: "break-word",
	},
	root: {
		display: "grid",
		gridTemplateColumns: {
			[conditions.sm]: "fit-content(8rem) minmax(0, 1fr)",
			default: "minmax(0, 1fr)",
		},
		margin: 0,
		rowGap: { [conditions.sm]: space["2"], default: space["3"] },
	},
	value: {
		color: colors.content,
		fontSize: fontSize["14"],
		fontWeight: fontWeight.regular,
		letterSpacing: letterSpacing.ui,
		lineHeight: lineHeight["20"],
		margin: 0,
		minWidth: 0,
		overflowWrap: "anywhere",
		textAlign: "start",
	},
});
