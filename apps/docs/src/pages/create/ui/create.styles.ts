import { colors } from "@mizen-labs/ui/colors.stylex";
import { conditions } from "@mizen-labs/ui/conditions.stylex";
import { borderWidth } from "@mizen-labs/ui/interaction.stylex";
import { shape } from "@mizen-labs/ui/shape.stylex";
import { space } from "@mizen-labs/ui/spacing.stylex";
import {
	fontSize,
	fontWeight,
	lineHeight,
} from "@mizen-labs/ui/typography.stylex";
import { create } from "@stylexjs/stylex";
import { header } from "../../../shared/styles/header.stylex";

const WIDE = conditions.md;

export const createStyles = create({
	code: {
		fontFamily: "ui-monospace, monospace",
		fontSize: fontSize["13"],
	},
	color: (value: string) => ({ backgroundColor: value }),
	controls: {
		display: "flex",
		flexDirection: "column",
		gap: space["5"],
		gridColumn: { default: "1", [WIDE]: "1" },
		gridRow: { default: "2", [WIDE]: "1" },
		minHeight: 0,
		overflowY: { default: "visible", [WIDE]: "auto" },
		paddingBlock: space["2"],
	},
	fieldHeader: {
		alignItems: "center",
		display: "flex",
		justifyContent: "space-between",
	},
	fieldLabel: {
		color: colors.content,
		fontSize: fontSize["13"],
		fontWeight: fontWeight.medium,
		lineHeight: lineHeight["20"],
		margin: 0,
	},
	frame: {
		backgroundColor: colors.workarea,
		borderColor: colors.border,
		borderRadius: shape.surfaceRadius,
		borderStyle: "solid",
		borderWidth: borderWidth.thin,
		boxSizing: "border-box",
		display: "block",
		flexGrow: 1,
		height: { default: "36rem", [WIDE]: "auto" },
		inlineSize: "100%",
	},
	// The controls beside the preview on a wide screen; under it on a phone.
	page: {
		boxSizing: "border-box",
		display: "grid",
		gap: space["4"],
		gridTemplateColumns: {
			default: "minmax(0, 1fr)",
			[WIDE]: "18rem minmax(0, 1fr)",
		},
		height: { default: "auto", [WIDE]: `calc(100svh - ${header.offset})` },
		paddingBlockEnd: space["4"],
		paddingInline: space["4"],
	},
	preview: {
		display: "flex",
		flexDirection: "column",
		gap: space["2"],
		gridColumn: { default: "1", [WIDE]: "2" },
		gridRow: "1",
		minHeight: 0,
		minWidth: 0,
	},
	swatch: {
		aspectRatio: "1",
		borderRadius: "9999px",
		cursor: "pointer",
		display: "grid",
		outlineColor: colors.focusRing,
		outlineOffset: "2px",
		outlineStyle: {
			":has(:checked)": "solid",
			":has(:focus-visible)": "solid",
			default: "none",
		},
		outlineWidth: borderWidth.focus,
		placeItems: "center",
		position: "relative",
	},
	swatches: {
		borderStyle: "none",
		display: "grid",
		gap: space["2"],
		gridTemplateColumns: "repeat(auto-fill, minmax(2rem, 1fr))",
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
	toolbar: {
		alignItems: "center",
		display: "flex",
		flexWrap: "wrap",
		gap: space["2"],
		justifyContent: "space-between",
	},
});
