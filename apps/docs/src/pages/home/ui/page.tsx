"use client";

import { Button, useCopyToClipboard } from "@mizen-labs/ui";
import { props } from "@stylexjs/stylex";
import { Link } from "@tanstack/react-router";
import { useCallback } from "react";
import { MizenLogo } from "../../../shared/ui/mizen-logo";
import { Film } from "./film";
import { homeStyles as s } from "./landing.styles";

const INIT = "npx @mizen-labs/cli@latest init";
const COPY_LABELS = { copied: "Copied", failed: "Copy failed", idle: "Copy" };

// How Mizen works, in three claims each backed by the library itself.
const PRINCIPLES = [
	[
		"Styles stay closed.",
		"Components take props, not className. An upgrade never breaks a page, because no page reaches inside a component.",
	],
	[
		"One file makes it yours.",
		"Color, shape, density, and type live in mizen-theme.css. Change a value and every component follows, in light and dark.",
	],
	[
		"Built for real work.",
		"Tables, charts, forms, and agent parts, tested in three browsers, right to left, and at 200% zoom. Agents get the docs as Markdown.",
	],
] as const;

// The command wraps on a narrow screen; the button beside it copies it.
function CopyInit() {
	const { copy, status } = useCopyToClipboard();
	const run = useCallback(() => copy(INIT), [copy]);
	return (
		<div {...props(s.command)}>
			<code {...props(s.commandText)}>{INIT}</code>
			<Button onClick={run} size="lg" variant="outline">
				<span aria-live="polite">{COPY_LABELS[status]}</span>
			</Button>
		</div>
	);
}

export default function HomePage() {
	return (
		<main id="docs-content" {...props(s.page)}>
			<section aria-labelledby="home-title" {...props(s.hero)}>
				<MizenLogo style={s.crest} />
				<h1 id="home-title" {...props(s.title)}>
					Components for the screens people work in.
				</h1>
				<p {...props(s.lede)}>
					Mizen is a React library for dashboards, data, and agents, built on
					Base UI and StyleX. Accessible behavior, closed styles, and one theme
					file that makes every part yours.
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
						<MizenLogo style={s.mark} />
						<h2 {...props(s.principleTitle)}>{title}</h2>
						<p {...props(s.principleText)}>{text}</p>
					</div>
				))}
			</section>
			<section aria-labelledby="home-start" {...props(s.start)}>
				<MizenLogo style={s.markLarge} />
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
