import { Button } from "@mizen-labs/ui";
import { props } from "@stylexjs/stylex";
import { IconBrandGithub } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "../../../features/theme-switcher/ui/theme-toggle";
import { shellStyles } from "../../../shared/styles/docs-shell.styles";
import { MizenLogo } from "../../../shared/ui/mizen-logo";
import { MobileNavigation } from "./mobile-navigation";
import { SitePillNav } from "./site-pill-nav";
export function SiteHeader({ docs = false }: { docs?: boolean }) {
	return (
		<>
			<a {...props(shellStyles.skipLink)} href="#docs-content">
				Skip to content
			</a>
			<header {...props(shellStyles.header)}>
				<div {...props(shellStyles.headerInner)}>
					<Link aria-label="Mizen UI home" to="/" {...props(shellStyles.brand)}>
						<MizenLogo style={shellStyles.brandMark} />
						Mizen UI
					</Link>
					<span {...props(shellStyles.headerLinks)}>
						<SitePillNav />
					</span>
					<div {...props(shellStyles.headerControls)}>
						<a
							aria-label="Mizen UI on GitHub"
							href="https://github.com/mizen-labs/mizen"
							{...props(shellStyles.headerLink, shellStyles.headerIcon)}
						>
							<IconBrandGithub aria-hidden="true" size={18} />
						</a>
						<ThemeToggle />
						<span {...props(shellStyles.headerAction)}>
							<Button
								nativeButton={false}
								render={
									<Link params={{ guide: "installation" }} to="/docs/$guide" />
								}
								role="link"
								size="sm"
							>
								Get started
							</Button>
						</span>
						<MobileNavigation docs={docs} />
					</div>
				</div>
			</header>
		</>
	);
}
