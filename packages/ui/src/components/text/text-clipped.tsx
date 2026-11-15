"use client";

import type { ComponentPropsWithRef } from "react";
import { useCallback } from "react";
import { assignRef } from "../../ref-utils";

type ClippedProps = ComponentPropsWithRef<"p">;

function isClipped(element: HTMLElement) {
	return (
		element.scrollWidth > element.clientWidth + 1 ||
		element.scrollHeight > element.clientHeight + 1
	);
}

// Text that may be cut shows its full content as a title, only while it is
// cut. A title the app passes wins.
export function ClippedText({
	ref: forwardedRef,
	title,
	...rest
}: ClippedProps) {
	const ref = useCallback(
		(element: HTMLParagraphElement | null) => {
			const release = assignRef(forwardedRef, element);
			if (!element || title !== undefined) {
				return release;
			}
			const update = () => {
				if (isClipped(element)) {
					element.title = element.textContent ?? "";
				} else {
					element.removeAttribute("title");
				}
			};
			const observer = new ResizeObserver(update);
			observer.observe(element);
			return () => {
				observer.disconnect();
				release?.();
			};
		},
		[forwardedRef, title]
	);
	// dir="auto" puts the ellipsis at the end of the text's own script.
	return <p dir="auto" {...rest} ref={ref} title={title} />;
}
