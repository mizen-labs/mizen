import { colors } from "@mizen-labs/ui/colors.stylex";
import { conditions } from "@mizen-labs/ui/conditions.stylex";
import { borderWidth, focus } from "@mizen-labs/ui/interaction.stylex";
import { duration, easing } from "@mizen-labs/ui/motion.stylex";
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
		overflow: "hidden",
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
	},
	// Phone: one row, the code taking the room left. Wide: stacked.
	codeButton: {
		display: "grid",
		flexBasis: { default: 0, [WIDE]: "100%" },
		flexGrow: 1,
		minWidth: 0,
	},
	codePrefix: { display: { default: "none", [WIDE]: "inline" } },
	color: (value: string) => ({ backgroundColor: value }),
	dot: {
		blockSize: "1rem",
		borderRadius: "9999px",
		boxShadow: `inset 0 0 0 ${borderWidth.thin} rgb(0 0 0 / 0.12)`,
		inlineSize: "1rem",
	},
	family: (value: string) => ({ fontFamily: value }),
	fontSample: {
		fontSize: fontSize["14"],
		fontWeight: fontWeight.medium,
		lineHeight: lineHeight["16"],
	},
	footer: {
		borderBlockStartColor: colors.border,
		borderBlockStartStyle: "solid",
		borderBlockStartWidth: borderWidth.thin,
		display: "flex",
		flexWrap: { default: "nowrap", [WIDE]: "wrap" },
		gap: space["2"],
		padding: space["3"],
	},
	footerAction: {
		display: "grid",
		flexBasis: { default: "auto", [WIDE]: "100%" },
	},
	frame: {
		backgroundColor: colors.workarea,
		borderColor: colors.border,
		borderRadius: shape.surfaceRadiusLarge,
		borderStyle: "solid",
		borderWidth: borderWidth.thin,
		boxSizing: "border-box",
		display: "block",
		flexGrow: 1,
		inlineSize: "100%",
		minHeight: 0,
	},
	indicator: {
		alignItems: "center",
		color: colors.content,
		display: "inline-flex",
		flexShrink: 0,
		justifyContent: "center",
		minBlockSize: "1rem",
		minInlineSize: "1rem",
	},
	lock: {
		insetBlockStart: "50%",
		insetInlineEnd: space["1.5"],
		position: "absolute",
		transform: "translateY(-50%)",
	},
	option: {
		alignItems: "center",
		display: "inline-flex",
		gap: space["2"],
	},
	// Wide: the panel beside the preview. Phone: the preview fills the screen
	// and the panel sits under it, so every change stays in view.
	page: {
		boxSizing: "border-box",
		display: "grid",
		gap: { default: space["3"], [WIDE]: space["4"] },
		gridTemplateColumns: {
			default: "minmax(0, 1fr)",
			[WIDE]: "15rem minmax(0, 1fr)",
		},
		gridTemplateRows: {
			default: "minmax(0, 1fr) auto",
			[WIDE]: "minmax(0, 1fr)",
		},
		height: `calc(100svh - ${header.offset})`,
		paddingBlockEnd: { default: space["3"], [WIDE]: space["4"] },
		paddingInline: { default: space["3"], [WIDE]: space["4"] },
	},
	panel: {
		backgroundColor: colors.surface,
		borderColor: colors.border,
		borderRadius: shape.surfaceRadiusLarge,
		borderStyle: "solid",
		borderWidth: borderWidth.thin,
		display: "flex",
		flexDirection: "column",
		gridColumn: "1",
		gridRow: { default: "2", [WIDE]: "1" },
		minHeight: 0,
		minWidth: 0,
		overflow: "hidden",
	},
	picker: {
		flexShrink: 0,
		inlineSize: { default: "9.5rem", [WIDE]: "auto" },
		position: "relative",
	},
	pickers: {
		display: "flex",
		flexDirection: { default: "row", [WIDE]: "column" },
		flexGrow: 1,
		gap: space["2"],
		minHeight: 0,
		overflowX: { default: "auto", [WIDE]: "hidden" },
		overflowY: { default: "hidden", [WIDE]: "auto" },
		overscrollBehavior: "contain",
		padding: space["3"],
		scrollbarWidth: "none",
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
	separator: {
		backgroundColor: colors.border,
		blockSize: borderWidth.thin,
		borderStyle: "none",
		display: { default: "none", [WIDE]: "block" },
		flexShrink: 0,
		marginBlock: space["1"],
		marginInline: `calc(-1 * ${space["3"]})`,
	},
	toolbar: {
		alignItems: "center",
		display: "flex",
		flexWrap: "wrap",
		gap: space["2"],
		justifyContent: "space-between",
	},
	trigger: {
		alignItems: "center",
		backgroundColor: {
			":is([data-popup-open])": colors.controlSurfaceHover,
			default: "transparent",
			[conditions.canHover]: {
				":hover": colors.controlSurfaceHover,
				default: "transparent",
			},
		},
		borderColor: colors.controlBorder,
		borderRadius: shape.controlRadiusLarge,
		borderStyle: "solid",
		borderWidth: borderWidth.thin,
		boxSizing: "border-box",
		color: colors.content,
		cursor: "pointer",
		display: "grid",
		fontFamily: "inherit",
		gap: space["2"],
		gridTemplateColumns: "minmax(0, 1fr) auto",
		inlineSize: "100%",
		margin: 0,
		outlineColor: colors.focusRing,
		outlineOffset: focus.offset,
		outlineStyle: { ":focus-visible": "solid", default: "none" },
		outlineWidth: borderWidth.focus,
		paddingBlock: space["2"],
		// Room at the end for the lock, which sits over the trigger.
		paddingInlineEnd: "2.25rem",
		paddingInlineStart: space["3"],
		textAlign: "start",
		touchAction: "manipulation",
		transitionDuration: duration.fast,
		transitionProperty: "background-color",
		transitionTimingFunction: easing.easeOut,
	},
	triggerLabel: {
		color: colors.mutedContent,
		fontSize: fontSize["12"],
		lineHeight: lineHeight["16"],
	},
	triggerText: { display: "grid", minWidth: 0 },
	triggerValue: {
		fontSize: fontSize["14"],
		fontWeight: fontWeight.medium,
		lineHeight: lineHeight["20"],
		overflow: "hidden",
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
	},
});
