import { Button, Text } from "@mizen-labs/ui";
import { props } from "@stylexjs/stylex";
import { IconArrowRight } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import {
	type AppDoc,
	appDocs,
} from "../../../entities/documentation/model/apps";
import { appsStyles as s } from "./apps.styles";

// An app at its true width, cropped: a picture of the screen, not a control.
function Preview({ slug, title }: Pick<AppDoc, "slug" | "title">) {
	return (
		<div aria-hidden="true" {...props(s.crop)}>
			<iframe
				loading="lazy"
				src={`/apps/${slug}/preview`}
				tabIndex={-1}
				title={`${title} preview`}
				{...props(s.live)}
			/>
		</div>
	);
}

function AppEntry({ components, description, slug, title }: AppDoc) {
	return (
		<article aria-labelledby={`app-${slug}`} {...props(s.entry)}>
			<Preview slug={slug} title={title} />
			<div {...props(s.facts)}>
				<h2 id={`app-${slug}`} {...props(s.entryTitle)}>
					{title}
				</h2>
				<p {...props(s.entryBody)}>{description}</p>
				<dl {...props(s.list)}>
					<dt {...props(s.term)}>Built with</dt>
					<dd {...props(s.definition)}>{components.join(", ")}</dd>
				</dl>
				<div {...props(s.actions)}>
					<Button
						nativeButton={false}
						render={<Link params={{ app: slug }} to="/apps/$app" />}
						role="link"
						size="lg"
					>
						Open {title.toLowerCase()}{" "}
						<IconArrowRight aria-hidden="true" size={18} />
					</Button>
					<Button
						nativeButton={false}
						render={<a href={`/apps/${slug}/preview`} />}
						role="link"
						size="lg"
						variant="outline"
					>
						Full screen
					</Button>
				</div>
			</div>
		</article>
	);
}

const NEXT = [
	[
		"Theme it",
		"Open the app in Create with your accent, fonts, and radius.",
		"/create",
	],
	[
		"Try the edge cases",
		"Long names, empty data, a thousand rows, and right to left.",
		"/internal/app-fixtures?data=worst",
	],
	[
		"Copy it",
		"Every source file is on the app's page, ready for your project.",
		"/apps/dashboard",
	],
] as const;

export default function AppsPage() {
	return (
		<main id="docs-content" {...props(s.page)}>
			<header {...props(s.header)}>
				<h1 {...props(s.title)}>Apps</h1>
				<p {...props(s.lede)}>
					Whole screens built from Mizen. Open one live, read every source file,
					and set it up in your app.
				</p>
			</header>
			{appDocs.map((app) => (
				<AppEntry key={app.slug} {...app} />
			))}
			<section aria-labelledby="apps-next" {...props(s.next)}>
				<h2 id="apps-next" {...props(s.nextTitle)}>
					From here
				</h2>
				<ul {...props(s.nextList)}>
					{NEXT.map(([label, text, href]) => (
						<li key={label}>
							<a href={href} {...props(s.nextItem)}>
								<span {...props(s.nextLabel)}>{label}</span>
								<Text size="ui" tone="muted">
									{text}
								</Text>
							</a>
						</li>
					))}
				</ul>
			</section>
		</main>
	);
}
