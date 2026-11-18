"use client";

import { typographyStyles } from "@mizen-labs/ui/typography.styles";
import { props } from "@stylexjs/stylex";
import { Link, useLocation } from "@tanstack/react-router";
import { shellStyles } from "../../../shared/styles/docs-shell.styles";
import { siteSections } from "../model/site-sections";

// Beside the brand, an underline marks the current section instead of a fill.
export function SiteLinks({ underlined = false }: { underlined?: boolean }) {
	const pathname = useLocation({ select: (location) => location.pathname });
	return siteSections.map(([label, href]) => {
		const active = pathname === href || pathname.startsWith(`${href}/`);
		return (
			<Link
				aria-current={active ? "page" : undefined}
				key={href}
				to={href}
				{...props(
					shellStyles.headerLink,
					underlined && shellStyles.sectionLink,
					active &&
						(underlined
							? shellStyles.sectionLinkCurrent
							: shellStyles.navLinkCurrent)
				)}
			>
				<span {...props(typographyStyles.controlLabel)}>{label}</span>
			</Link>
		);
	});
}
