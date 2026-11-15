import { create, keyframes } from "@stylexjs/stylex";
import { colors } from "../../styles/colors.stylex";
import { conditions } from "../../styles/conditions.stylex";
import { controlSize } from "../../styles/dimensions.stylex";
import { borderWidth, focusMotion } from "../../styles/interaction.stylex";
import { duration, easing } from "../../styles/motion.stylex";
import { shadows } from "../../styles/shadows.stylex";
import { shape } from "../../styles/shape.stylex";
import { space } from "../../styles/spacing.stylex";
import {
	fontSize,
	fontWeight,
	lineHeight,
} from "../../styles/typography.stylex";

// From the md breakpoint the navigation is a sidebar; below it, a drawer.
const WIDE = conditions.md;
const COARSE = "@media (pointer: coarse)";
const SIDEBAR_WIDTH = "16rem";
// The floating sidebar keeps the inset of the shell on every edge.
const FLOATING_WIDTH = "15rem";

const travel = keyframes({
	"0%": { transform: "translateX(-100%)" },
	"100%": { transform: "translateX(250%)" },
});

export const appShellStyles = create({
	busy: {
		blockSize: "2px",
		insetBlockStart: 0,
		insetInline: 0,
		overflow: "hidden",
		pointerEvents: "none",
		position: "absolute",
		zIndex: 1,
	},
	busyBar: {
		animationDuration: "1.2s",
		animationIterationCount: "infinite",
		animationName: { [conditions.reducedMotion]: "none", default: travel },
		animationTimingFunction: easing.easeInOut,
		backgroundColor: colors.accent,
		blockSize: "100%",
		display: "block",
		inlineSize: "40%",
	},
	collapsed: {
		gridTemplateColumns: {
			default: "minmax(0, 1fr)",
			[WIDE]: "0rem minmax(0, 1fr)",
		},
		paddingInlineStart: { default: 0, [WIDE]: space["2"] },
	},
	content: {
		display: "flex",
		flexDirection: "column",
		flexGrow: 1,
		marginInline: `calc(-1 * ${space["2"]})`,
		minBlockSize: 0,
	},
	// A strip at the start edge: a pointer that rests on it shows the sidebar.
	edge: {
		display: { default: "none", [WIDE]: "block" },
		inlineSize: space["3"],
		insetBlock: 0,
		insetInlineStart: 0,
		position: "absolute",
		zIndex: 1,
	},
	// Collapsed, the sidebar floats over the content and slides in on hover.
	floating: {
		backgroundColor: colors.floatingSurface,
		borderColor: colors.border,
		borderRadius: shape.floatingRadius,
		borderStyle: "solid",
		borderWidth: borderWidth.thin,
		boxShadow: shadows.floating,
		inlineSize: FLOATING_WIDTH,
		insetBlock: space["2"],
		insetInlineStart: space["2"],
		position: "absolute",
		transitionDuration: {
			[conditions.reducedMotion]: duration.instant,
			default: duration.overlayEnter,
		},
		transitionProperty: "transform, visibility",
		transitionTimingFunction: easing.expoOut,
		zIndex: 2,
	},
	floatingHidden: {
		transform: `translateX(calc(-100% - ${space["4"]}))`,
		transitionDuration: {
			[conditions.reducedMotion]: duration.instant,
			default: duration.overlayExit,
		},
		transitionTimingFunction: easing.easeIn,
		visibility: "hidden",
	},
	floatingInstant: { transitionDuration: "0s" },
	// The account menu sits at the start, like the items above it.
	footer: { justifyItems: "start" },

	group: {
		display: "flex",
		flexDirection: "column",
		gap: space.px,
		minInlineSize: 0,
	},
	groupItems: {
		display: "flex",
		flexDirection: "column",
		gap: space.px,
		listStyleType: "none",
		margin: 0,
		paddingBlockStart: space.px,
		paddingInline: 0,
	},
	groupLabel: {
		alignItems: "center",
		boxSizing: "border-box",
		color: colors.mutedContent,
		display: "flex",
		fontSize: fontSize["12"],
		fontWeight: fontWeight.medium,
		gap: space["1"],
		lineHeight: lineHeight["16"],
		minBlockSize: controlSize.xs,
		minInlineSize: 0,
		paddingInline: space["2"],
	},
	groupTrigger: {
		backgroundColor: "transparent",
		borderRadius: shape.controlRadius,
		borderStyle: "none",
		color: {
			":hover": { [conditions.canHover]: colors.content },
			default: colors.mutedContent,
		},
		cursor: "pointer",
		fontFamily: "inherit",
		inlineSize: "100%",
		outlineColor: colors.focusRing,
		outlineOffset: `calc(-1 * ${borderWidth.focus})`,
		outlineStyle: { ":focus-visible": "solid", default: "none" },
		outlineWidth: borderWidth.focus,
		textAlign: "start",
		transform: {
			":is([data-panel-open]) > svg": "none",
			":is(*) > svg": "rotate(-90deg)",
		},
		transitionDuration: {
			":is(*) > svg": duration.fast,
			[conditions.reducedMotion]: duration.instant,
		},
		transitionProperty: { ":is(*) > svg": "transform", default: "color" },
		transitionTimingFunction: easing.expoOut,
	},
	header: {
		alignItems: "center",
		borderBlockEndColor: colors.border,
		borderBlockEndStyle: "solid",
		borderBlockEndWidth: borderWidth.thin,
		boxSizing: "border-box",
		display: "flex",
		flexShrink: 0,
		gap: space["2"],
		minBlockSize: "3rem",
		minInlineSize: 0,
		paddingBlock: space["2"],
		paddingInline: space["3"],
	},
	// Text in the header, such as the product name and its avatar, starts
	// where the item icons start. Controls keep their own edges.
	headerText: {
		paddingInline: {
			":is(*) > :not(button, a, input, [role])": space["2"],
		},
	},
	// Inside the drawer on a narrow screen.
	inDrawer: {
		display: "flex",
		flexGrow: 1,
		paddingBlock: space["3"],
		paddingInline: space["3"],
	},

	// The surface beside the sidebar: a header, then the scrolling content.
	inset: {
		backgroundColor: colors.surface,
		borderRadius: { default: 0, [WIDE]: shape.surfaceRadius },
		boxShadow: {
			default: "none",
			[WIDE]: `0 0 0 ${borderWidth.thin} ${colors.border}, ${shadows.surface}`,
		},
		display: "flex",
		flexDirection: "column",
		gridColumn: { default: "1", [WIDE]: "2" },
		gridRow: "1",
		// Its own stacking context: a sticky table header or any raised layer
		// inside stays under the floating sidebar.
		isolation: "isolate",
		minBlockSize: 0,
		minInlineSize: 0,
		overflow: "hidden",
		position: "relative",
	},

	item: {
		alignItems: "center",
		animationDuration: { ":focus-visible": focusMotion.duration },
		animationName: { ":focus-visible": focusMotion.ring },
		// The current page reads aria-current, so a router link that sets it
		// needs no prop.
		backgroundColor: {
			":active": colors.selected,
			":hover": { [conditions.canHover]: colors.workareaControlSurface },
			":is([aria-current='page'])": colors.selected,
			default: "transparent",
		},
		borderRadius: shape.controlRadius,
		boxSizing: "border-box",
		color: {
			":hover": { [conditions.canHover]: colors.content },
			":is([aria-current='page'])": colors.content,
			default: colors.mutedContent,
		},
		display: "flex",
		flexShrink: { ":is(*) > svg": 0 },
		fontSize: fontSize["14"],
		fontWeight: {
			":is([aria-current='page'])": fontWeight.medium,
			default: null,
		},
		gap: space["2"],
		height: { ":is(*) > svg": "1rem" },
		lineHeight: lineHeight["20"],
		minBlockSize: { [COARSE]: controlSize.xl, default: controlSize.md },
		minInlineSize: 0,
		outlineColor: colors.focusRing,
		outlineOffset: `calc(-1 * ${borderWidth.focus})`,
		outlineStyle: { ":focus-visible": "solid", default: "none" },
		outlineWidth: borderWidth.focus,
		paddingInline: space["2"],
		textDecoration: "none",
		transitionDuration: {
			[conditions.reducedMotion]: duration.instant,
			default: duration.fast,
		},
		transitionProperty: "background-color, color",
		transitionTimingFunction: easing.expoOut,
		width: { ":is(*) > svg": "1rem" },
	},
	itemLabel: {
		flexGrow: 1,
		minInlineSize: 0,
		overflow: "hidden",
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
	},
	listItem: { display: "flex", flexDirection: "column", minInlineSize: 0 },
	main: {
		display: "flex",
		flexDirection: "column",
		flexGrow: 1,
		minBlockSize: 0,
		minInlineSize: 0,
		outline: "none",
		overflowY: "auto",
		overscrollBehavior: "contain",
	},
	nav: {
		display: "flex",
		flexDirection: "column",
		gap: space["4"],
		paddingInline: space["2"],
	},
	// A grid stretches each child, so a search or account button spans the
	// sidebar.
	region: {
		display: "grid",
		flexShrink: 0,
		gap: space["2"],
		gridTemplateColumns: "minmax(0, 1fr)",
		minInlineSize: 0,
	},
	// The workarea holds the sidebar and one inset surface. The shell takes
	// the height of the window, or of a parent that has a height.
	root: {
		backgroundColor: colors.workarea,
		blockSize: "100dvh",
		boxSizing: "border-box",
		color: colors.content,
		display: "grid",
		gridTemplateColumns: {
			default: "minmax(0, 1fr)",
			[WIDE]: `${SIDEBAR_WIDTH} minmax(0, 1fr)`,
		},
		gridTemplateRows: "minmax(0, 1fr)",
		isolation: "isolate",
		maxBlockSize: "100%",
		overflow: "hidden",
		paddingBlock: { default: 0, [WIDE]: space["2"] },
		paddingInlineEnd: { default: 0, [WIDE]: space["2"] },
		paddingInlineStart: 0,
		position: "relative",
		transitionDuration: {
			[conditions.reducedMotion]: duration.instant,
			default: duration.overlayEnter,
		},
		transitionProperty: "grid-template-columns, padding-inline-start",
		transitionTimingFunction: easing.expoOut,
	},

	sidebar: {
		boxSizing: "border-box",
		display: { default: "none", [WIDE]: "flex" },
		flexDirection: "column",
		gap: space["3"],
		minBlockSize: 0,
		minInlineSize: 0,
		paddingBlock: space["2"],
		paddingInline: space["2"],
	},
	skipLink: {
		backgroundColor: colors.floatingSurface,
		borderRadius: shape.controlRadius,
		// Out of view, its shadow would still reach into the window.
		boxShadow: { ":focus": shadows.floating, default: "none" },
		color: colors.content,
		fontSize: fontSize["14"],
		fontWeight: fontWeight.medium,
		insetBlockStart: space["2"],
		insetInlineStart: space["2"],
		lineHeight: lineHeight["20"],
		outlineColor: colors.focusRing,
		outlineStyle: { ":focus-visible": "solid", default: "none" },
		outlineWidth: borderWidth.focus,
		paddingBlock: space["2"],
		paddingInline: space["3"],
		position: "absolute",
		textDecoration: "none",
		transform: {
			":focus": "none",
			default: "translateY(calc(-100% - 1rem))",
		},
		zIndex: 3,
	},
	title: {
		flexGrow: 1,
		fontSize: fontSize["14"],
		fontWeight: fontWeight.medium,
		lineHeight: lineHeight["20"],
		margin: 0,
		minInlineSize: 0,
		overflow: "hidden",
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
	},
});
