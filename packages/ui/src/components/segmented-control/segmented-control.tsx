"use client";

import { Toggle as BaseToggle } from "@base-ui/react/toggle";
import { ToggleGroup as BaseToggleGroup } from "@base-ui/react/toggle-group";
import { props } from "@stylexjs/stylex";
import { createContext, useContext } from "react";
import { controlLabel } from "../../control-label";
import { badgeFit } from "../../styles/badge-fit.styles";
import type {
	ToggleGroupProps,
	ToggleProps,
	ToggleSize,
} from "../toggle/toggle";
import { segmentedStyles } from "./segmented-control.styles";

type SegmentedControlSize = Extract<ToggleSize, "default" | "sm" | "lg">;
const SizeContext = createContext<ToggleSize>("default");
// The size of a segment also sizes a Badge inside it.
const sizeStyles = {
	default: [segmentedStyles.defaultSize, badgeFit.h28],
	icon: segmentedStyles.defaultSize,
	"icon-lg": segmentedStyles.lg,
	"icon-sm": segmentedStyles.sm,
	lg: [segmentedStyles.lg, badgeFit.h36],
	sm: [segmentedStyles.sm, badgeFit.h24],
};

export type SegmentedControlProps<Value extends string = string> = Omit<
	ToggleGroupProps<Value>,
	"multiple" | "size" | "type" | "variant"
> & {
	size?: SegmentedControlSize;
};

type DistributiveOmit<Props, Key extends PropertyKey> = Props extends unknown
	? Omit<Props, Key>
	: never;

export type SegmentedControlItemProps<Value extends string = string> =
	DistributiveOmit<ToggleProps<Value>, "type" | "variant">;

export function SegmentedControl<Value extends string = string>({
	children,
	orientation = "horizontal",
	ref: forwardedRef = undefined,
	size = "default",
	...rest
}: SegmentedControlProps<Value>) {
	Reflect.deleteProperty(rest, "className");
	Reflect.deleteProperty(rest, "style");
	Reflect.deleteProperty(rest, "render");
	Reflect.deleteProperty(rest, "type");

	return (
		<SizeContext value={size}>
			<BaseToggleGroup
				{...rest}
				data-slot="segmented-control"
				multiple={false}
				orientation={orientation}
				ref={forwardedRef}
				{...props(
					segmentedStyles.root,
					orientation === "vertical" && segmentedStyles.vertical
				)}
			>
				<span
					aria-hidden="true"
					data-slot="segmented-control-indicator"
					{...props(segmentedStyles.indicator)}
				/>
				{children}
			</BaseToggleGroup>
		</SizeContext>
	);
}

export function SegmentedControlItem<Value extends string = string>({
	children,
	ref: forwardedRef = undefined,
	size,
	...rest
}: SegmentedControlItemProps<Value>) {
	const groupSize = useContext(SizeContext);
	const resolvedSize = size ?? groupSize;
	Reflect.deleteProperty(rest, "className");
	Reflect.deleteProperty(rest, "style");
	Reflect.deleteProperty(rest, "render");

	return (
		<BaseToggle
			{...rest}
			data-slot="segmented-control-item"
			ref={forwardedRef}
			type="button"
			{...props(
				segmentedStyles.item,
				sizeStyles[resolvedSize],
				resolvedSize.startsWith("icon") && segmentedStyles.iconSize
			)}
		>
			{controlLabel(children)}
		</BaseToggle>
	);
}
