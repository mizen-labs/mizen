"use client";

import {
	ApprovalCard,
	type ApprovalCardStatus,
	Button,
	CodeBlock,
	CodeBlockContent,
	CodeBlockCopy,
	CodeBlockHeader,
	CodeBlockTitle,
	Text,
} from "@mizen-labs/ui";
import { props } from "@stylexjs/stylex";
import { IconArrowRight, IconMail } from "@tabler/icons-react";
import { Link, useLoaderData } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { Hero } from "./hero";
import { homeStyles as s } from "./landing.styles";
import { LandingPreview } from "./landing-preview";

const INIT_COMMAND = "npx @mizen-labs/cli@latest init --preset m33ut";
const INIT_OUTPUT = [
	"✓ Found a Next.js app",
	"✓ Installed @mizen-labs/ui and @fontsource-variable/inter",
	"✓ Imported @mizen-labs/ui/styles.css in app/layout.tsx",
	"✓ Wrote app/mizen-theme.css",
	"✓ Doctor passed",
].join("\n");

const EMAIL = [
	{ label: "To", value: "Product updates · 42 people" },
	{ label: "Subject", value: "What's new in November" },
	{ label: "Send", value: "Today, 9:00 AM" },
];

function Setup() {
	return (
		<section aria-labelledby="home-setup" {...props(s.split)}>
			<div {...props(s.statement)}>
				<h2 id="home-setup" {...props(s.heading)}>
					Set up in one command.
				</h2>
				<p {...props(s.body)}>
					Init finds your Next.js, Vite, or TanStack Start app, installs Mizen,
					imports the stylesheet, and writes your theme file. It shows every
					change before it makes one.
				</p>
			</div>
			<div data-ui {...props(s.steps)}>
				<CodeBlock>
					<CodeBlockHeader>
						<CodeBlockTitle>Terminal</CodeBlockTitle>
						<CodeBlockCopy code={INIT_COMMAND} />
					</CodeBlockHeader>
					<CodeBlockContent aria-label="Init and what it prints">
						{`$ ${INIT_COMMAND}\n${INIT_OUTPUT}`}
					</CodeBlockContent>
				</CodeBlock>
			</div>
		</section>
	);
}

function Showcase() {
	return (
		<section aria-labelledby="home-showcase" {...props(s.showcase)}>
			<div {...props(s.showcaseHead)}>
				<h2 id="home-showcase" {...props(s.heading)}>
					A whole dashboard, working.
				</h2>
				<p {...props(s.body)}>
					Metrics, charts, a table, and a period select, all Mizen. Change the
					year or point at a chart.
				</p>
			</div>
			<LandingPreview />
		</section>
	);
}

function Agents() {
	const [status, setStatus] = useState<ApprovalCardStatus>("pending");
	const approve = useCallback(() => setStatus("approved"), []);
	const deny = useCallback(() => setStatus("denied"), []);
	return (
		<section aria-labelledby="home-agents" {...props(s.split, s.splitReverse)}>
			<div data-ui {...props(s.steps, s.first)}>
				<ApprovalCard
					description="It goes to everyone on the list and can't be unsent."
					details={EMAIL}
					icon={<IconMail size={16} />}
					onApprove={approve}
					onDeny={deny}
					status={status}
					title="Send the November newsletter"
				/>
			</div>
			<div {...props(s.statement)}>
				<h2 id="home-agents" {...props(s.heading)}>
					Agents ask before they act.
				</h2>
				<p {...props(s.body)}>
					Approvals, tool calls, a composer, and streaming text, in the same
					design language as your tables. Approve or deny this one.
				</p>
			</div>
		</section>
	);
}

function Close() {
	const componentCount = useLoaderData({
		from: "__root__",
		select: (data) => data.componentCount,
	});
	return (
		<section aria-labelledby="home-close" {...props(s.close)}>
			<div {...props(s.closeLine)}>
				<h2 id="home-close" {...props(s.closeTitle)}>
					Make it yours.
				</h2>
				<p {...props(s.closeBody)}>
					{componentCount} components, MIT licensed. Pick a theme, then run one
					command.
				</p>
			</div>
			<div data-ui {...props(s.closePanel)}>
				<Text size="ui" tone="muted">
					Choose an accent, fonts, radius, and density, see them on a whole app,
					and copy the command.
				</Text>
				<Button
					nativeButton={false}
					render={<Link to="/create" />}
					role="link"
					size="lg"
				>
					Open Create <IconArrowRight aria-hidden="true" size={18} />
				</Button>
				<Button
					nativeButton={false}
					render={<Link params={{ guide: "installation" }} to="/docs/$guide" />}
					role="link"
					size="lg"
					variant="outline"
				>
					Read the installation guide
				</Button>
			</div>
		</section>
	);
}

function Footer() {
	return (
		<footer {...props(s.footer)}>
			<span>Mizen UI · MIT licensed</span>
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
			</nav>
			<a
				href="https://github.com/mizen-labs/mizen"
				{...props(s.link, s.footerEnd)}
			>
				GitHub
			</a>
		</footer>
	);
}

export default function HomePage() {
	return (
		<main id="docs-content" {...props(s.page)}>
			<Hero />
			<Setup />
			<Showcase />
			<Agents />
			<Close />
			<Footer />
		</main>
	);
}
