import { create } from "@stylexjs/stylex";
import { colors } from "../../styles/colors.stylex";
import { space } from "../../styles/spacing.stylex";
import {
	fontSize,
	letterSpacing,
	lineHeight,
} from "../../styles/typography.stylex";

export const alertDialogStyles = create({
	description: {
		fontSize: fontSize["14"],
		letterSpacing: letterSpacing.ui,
		lineHeight: lineHeight["20"],
		overflowWrap: "anywhere",
		textWrap: "pretty",
	},
	footer: {
		backgroundColor: colors.workarea,
		flexShrink: 0,
	},
	// Alone, the header scrolls a long description. Above a panel it keeps
	// its height, and the panel scrolls instead.
	header: {
		display: "flex",
		flexDirection: "column",
		flexShrink: {
			":has(+ [data-slot='alert-dialog-panel'])": 0,
			default: 1,
		},
		gap: space["1"],
		minHeight: 0,
		overflowY: "auto",
		overscrollBehavior: "contain",
		paddingBlock: space["6"],
		paddingBlockEnd: {
			":has(+ [data-slot='alert-dialog-panel'])": space["4"],
			default: space["6"],
		},
		paddingInline: space["6"],
	},
	// Aligned with the title, and as far from the footer as the header is.
	panel: {
		display: "flex",
		flexDirection: "column",
		gap: space["4"],
		minHeight: 0,
		overflowY: "auto",
		overscrollBehavior: "contain",
		paddingBlockEnd: space["6"],
		paddingBlockStart: {
			":is([data-slot='alert-dialog-header'] + *)": space["0"],
			default: space["6"],
		},
		paddingInline: space["6"],
	},
	popup: { maxWidth: "32rem" },
	title: { overflowWrap: "anywhere" },
});
