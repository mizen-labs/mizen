import { props } from "@stylexjs/stylex";
import type { ComponentPropsWithRef } from "react";
import { typeRoles } from "../../styles/typography.styles";
import { textStyles } from "./text.styles";
import { ClippedText } from "./text-clipped";

type NativeParagraphProps = ComponentPropsWithRef<"p">;

export type TextSize = "body" | "caption" | "ui";
export type TextTone = "default" | "muted";

export type TextProps = Omit<
	NativeParagraphProps,
	"className" | "role" | "style"
> & {
	/**
	 * Clamps the text to this many lines, with an ellipsis on the last. The
	 * full text shows as a tooltip while it is cut.
	 */
	lines?: number;
	size?: TextSize;
	/** Ink. Defaults to muted for `caption` and to content otherwise. */
	tone?: TextTone;
	/**
	 * Keeps the text on one line with an ellipsis, and lets it shrink in a
	 * row. The full text shows as a tooltip while it is cut.
	 */
	truncate?: boolean;
};

const sizeStyles = {
	body: typeRoles.body,
	caption: typeRoles.caption,
	ui: typeRoles.ui,
};

function fitStyle(truncate: boolean, lines: number | undefined) {
	if (truncate) {
		return textStyles.truncate;
	}
	return lines && lines > 0 ? textStyles.lines(lines) : null;
}

export function Text({
	children,
	lines,
	ref: forwardedRef,
	size = "body",
	tone = size === "caption" ? "muted" : "default",
	truncate = false,
	...rest
}: TextProps) {
	Reflect.deleteProperty(rest, "role");
	const fit = fitStyle(truncate, lines);
	// Only text that can be cut needs the client part that measures it.
	const Element = fit ? ClippedText : "p";

	return (
		<Element
			{...rest}
			data-size={size}
			data-slot="text"
			data-tone={tone}
			ref={forwardedRef}
			{...props(textStyles.base, sizeStyles[size], textStyles[tone], fit)}
		>
			{children}
		</Element>
	);
}
