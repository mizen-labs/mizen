"use client";

import { Button, useCopyToClipboard } from "@mizen-labs/ui";
import { props } from "@stylexjs/stylex";
import { Link } from "@tanstack/react-router";
import { useCallback } from "react";
import { Film } from "./film";
import { homeStyles as s } from "./landing.styles";

const INIT = "npx @mizen-labs/cli@latest init";
const COPY_LABELS = { copied: "Copied", failed: "Copy failed", idle: INIT };

// What Mizen believes, in three lines each.
const PRINCIPLES = [
	[
		"Closed by design.",
		"No className, no style. Props cover what varies; tokens cover the look.",
	],
	[
		"Calm by default.",
		"Neutral surfaces, one accent, and type and rhythm before boxes.",
	],
	[
		"Ready for agents.",
		"Every page has a Markdown twin, and the package ships its own skill.",
	],
] as const;

function CopyInit() {
	const { copy, status } = useCopyToClipboard();
	const run = useCallback(() => copy(INIT), [copy]);
	return (
		<Button onClick={run} size="lg" variant="outline">
			<span aria-live="polite">{COPY_LABELS[status]}</span>
		</Button>
	);
}

export default function HomePage() {
	return (
		<main id="docs-content" {...props(s.page)}>
			<section aria-labelledby="home-title" {...props(s.hero)}>
				<h1 id="home-title" {...props(s.title)}>
					Change the theme, not the components.
				</h1>
				<p {...props(s.lede)}>
					React components that keep their own styles. One CSS file decides how
					all of them look.
				</p>
				<div {...props(s.actions)}>
					<Button
						nativeButton={false}
						render={
							<Link params={{ guide: "installation" }} to="/docs/$guide" />
						}
						role="link"
						size="lg"
					>
						Get started
					</Button>
					<Button
						nativeButton={false}
						render={<Link to="/create" />}
						role="link"
						size="lg"
						variant="outline"
					>
						Make a theme
					</Button>
				</div>
			</section>
			<Film />
			<section aria-label="Principles" {...props(s.principles)}>
				{PRINCIPLES.map(([title, text]) => (
					<div key={title} {...props(s.principle)}>
						<h2 {...props(s.principleTitle)}>{title}</h2>
						<p {...props(s.principleText)}>{text}</p>
					</div>
				))}
			</section>
			<section aria-labelledby="home-start" {...props(s.start)}>
				<h2 id="home-start" {...props(s.startTitle)}>
					One command to start.
				</h2>
				<CopyInit />
			</section>
			<footer {...props(s.footer)}>
				<span>Mizen UI · MIT · Base UI and StyleX</span>
				<nav aria-label="Home footer" {...props(s.footerLinks)}>
					<Link
						params={{ guide: "foundations" }}
						to="/docs/$guide"
						{...props(s.link)}
					>
						Foundations
					</Link>
					<Link params={{ guide: "cli" }} to="/docs/$guide" {...props(s.link)}>
						CLI
					</Link>
					<Link
						params={{ guide: "for-agents" }}
						to="/docs/$guide"
						{...props(s.link)}
					>
						For agents
					</Link>
					<a href="https://github.com/mizen-labs/mizen" {...props(s.link)}>
						GitHub
					</a>
				</nav>
			</footer>
		</main>
	);
}
