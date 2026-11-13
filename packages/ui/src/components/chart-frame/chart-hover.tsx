"use client";

import { create, props } from "@stylexjs/stylex";
import {
	type PointerEvent,
	type ReactNode,
	useCallback,
	useState,
} from "react";
import { conditions } from "../../styles/conditions.stylex";
import { duration } from "../../styles/motion.stylex";
import {
	ChartTooltip,
	type ChartTooltipItem,
} from "../chart-tooltip/chart-tooltip";

// Hover for charts drawn without the chart engine: the hovered item stays at
// full strength while the rest recede, and a tooltip follows the pointer.

export interface ChartHoverTip {
	items: readonly ChartTooltipItem[];
	label?: ReactNode;
}

// The pointer position is in window coordinates: the tooltip is placed in the
// window, not in the chart.
interface HoverState {
	id: string;
	tip?: ChartHoverTip;
	x: number;
	y: number;
}

const styles = create({
	// The focused item keeps full color while the rest recede, as on engine charts.
	dim: { opacity: 0.3 },
	host: { position: "relative" },
	mark: {
		transitionDuration: {
			[conditions.reducedMotion]: duration.instant,
			default: duration.fast,
		},
		transitionProperty: "opacity",
	},
	// A popover in the browser's top layer, fixed in the window: it adds no
	// scrollable overflow to the chart, and no card clips it. The rest resets
	// the browser's popover style.
	tip: {
		backgroundColor: "transparent",
		borderStyle: "none",
		color: "inherit",
		inset: "auto",
		margin: 0,
		overflow: "visible",
		padding: 0,
		pointerEvents: "none",
		position: "fixed",
		// Small hosts such as rings must not squeeze the tooltip.
		width: "max-content",
	},
});

const EDGE = 8;
const GAP = 12;

// Places the tooltip beside the pointer and keeps it inside the window: it
// goes to the left of the pointer when the right has no room.
function placeTip(tip: HTMLElement, x: number, y: number) {
	if (tip.showPopover && !tip.matches(":popover-open")) {
		tip.showPopover();
	}
	const { height, width } = tip.getBoundingClientRect();
	const fits = x + GAP + width <= window.innerWidth - EDGE;
	const left = Math.max(EDGE, fits ? x + GAP : x - GAP - width);
	const top = Math.min(
		Math.max(EDGE, y - height / 2),
		Math.max(EDGE, window.innerHeight - EDGE - height)
	);
	tip.style.left = `${left}px`;
	tip.style.top = `${top}px`;
}

export function useChartHover() {
	const [hover, setHover] = useState<HoverState | null>(null);
	const [linked, setLinked] = useState<string | null>(null);
	/** Pointer handlers for a mark: hovering shows its tooltip. */
	const markProps = useCallback(
		(id: string, tip?: ChartHoverTip) => ({
			onPointerLeave: () => setHover(null),
			onPointerMove: (event: PointerEvent) =>
				setHover({ id, tip, x: event.clientX, y: event.clientY }),
		}),
		[]
	);
	/** Pointer handlers for a legend tile or row: hovering highlights its mark. */
	const linkProps = useCallback(
		(id: string) => ({
			onPointerEnter: () => setLinked(id),
			onPointerLeave: () => setLinked(null),
		}),
		[]
	);
	const active = hover?.id ?? linked;
	/** StyleX styles for a mark or tile: it recedes while another item is active. */
	const fade = useCallback(
		(id: string) =>
			[styles.mark, active !== null && active !== id && styles.dim] as const,
		[active]
	);
	return {
		active,
		fade,
		hostStyle: styles.host,
		hover,
		linkProps,
		markProps,
	};
}

export function ChartHoverTooltip({
	hover,
}: {
	hover: { tip?: ChartHoverTip; x: number; y: number } | null;
}) {
	const x = hover?.x ?? 0;
	const y = hover?.y ?? 0;
	// A new callback for each position, so React places the tooltip again
	// after every move, before the browser paints.
	const place = useCallback(
		(tip: HTMLDivElement | null) => {
			if (tip) {
				placeTip(tip, x, y);
			}
		},
		[x, y]
	);
	if (!hover?.tip) {
		return null;
	}
	return (
		<div
			aria-hidden="true"
			data-slot="chart-hover-tooltip"
			popover="manual"
			ref={place}
			{...props(styles.tip)}
		>
			<ChartTooltip items={hover.tip.items} label={hover.tip.label} />
		</div>
	);
}
