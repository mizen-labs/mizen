"use client";

import { props } from "@stylexjs/stylex";
import { useCallback, useState } from "react";
import { shellStyles } from "../../../shared/styles/docs-shell.styles";
import { SiteLinks } from "./site-links";

interface Box {
	left: number;
	width: number;
}

// The site's sections in one pill. A raised indicator sits under the current
// section and springs to the next one when the reader moves on.
export function SitePillNav() {
	const [box, setBox] = useState<Box | null>(null);

	// Measured again when the current section changes and whenever the pill
	// resizes, such as when its font loads.
	const measure = useCallback((nav: HTMLElement | null) => {
		if (!nav) {
			return;
		}
		const place = () => {
			const current = nav.querySelector<HTMLElement>('[aria-current="page"]');
			// Fractional widths, so the indicator fits the link exactly.
			const frame = nav.getBoundingClientRect();
			const link = current?.getBoundingClientRect();
			setBox(link ? { left: link.left - frame.left, width: link.width } : null);
		};
		place();
		const resized = new ResizeObserver(place);
		resized.observe(nav);
		const moved = new MutationObserver(place);
		moved.observe(nav, {
			attributeFilter: ["aria-current"],
			attributes: true,
			subtree: true,
		});
		return () => {
			resized.disconnect();
			moved.disconnect();
		};
	}, []);

	return (
		<nav
			aria-label="Site navigation"
			ref={measure}
			{...props(shellStyles.pill)}
		>
			{box ? (
				<span
					aria-hidden="true"
					{...props(
						shellStyles.pillIndicator,
						shellStyles.pillAt(box.left, box.width)
					)}
				/>
			) : null}
			<SiteLinks pill />
		</nav>
	);
}
