"use client";

import {
	Button,
	SegmentedControl,
	SegmentedControlItem,
	Tooltip,
	TooltipPopup,
	TooltipTrigger,
} from "@mizen-labs/ui";
import { props } from "@stylexjs/stylex";
import { IconArrowUpRight, IconRefresh } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { useCallback, useRef, useState } from "react";
import type { CategoryPageData } from "../../../entities/documentation/api/block-data.server";
import { SourceCode } from "../../../shared/ui/source-code";
import { blocksStyles as s } from "./blocks.styles";

type Entry = CategoryPageData["blocks"][number];

function Hint({
	children,
	label,
}: {
	children: React.ReactElement;
	label: string;
}) {
	return (
		<Tooltip>
			<TooltipTrigger render={children} />
			<TooltipPopup>{label}</TooltipPopup>
		</Tooltip>
	);
}

// One block: its name and line, Preview or Code, refresh, full screen, and
// its id. The preview loads as it scrolls into view.
function BlockEntry({ block, files }: Entry) {
	const [view, setView] = useState("preview");
	const frame = useRef<HTMLIFrameElement>(null);
	const src = `/blocks/${block.category}/${block.slug}/preview`;
	const change = useCallback((next: string[]) => {
		if (next[0]) {
			setView(next[0]);
		}
	}, []);
	const reload = useCallback(() => {
		frame.current?.contentWindow?.location.reload();
	}, []);
	return (
		<section
			aria-labelledby={`${block.slug}-title`}
			id={block.slug}
			{...props(s.block)}
		>
			<div {...props(s.blockHead)}>
				<div>
					<h2 id={`${block.slug}-title`} {...props(s.blockTitle)}>
						{block.title}
					</h2>
					<p {...props(s.blockText)}>{block.description}</p>
				</div>
				<div {...props(s.toolbar)}>
					<SegmentedControl
						aria-label={`${block.title} view`}
						onValueChange={change}
						size="sm"
						value={[view]}
					>
						<SegmentedControlItem value="preview">Preview</SegmentedControlItem>
						<SegmentedControlItem value="code">Code</SegmentedControlItem>
					</SegmentedControl>
					<Hint label="Reload preview">
						<Button
							aria-label="Reload preview"
							onClick={reload}
							size="icon"
							variant="ghost"
						>
							<IconRefresh aria-hidden="true" size={18} />
						</Button>
					</Hint>
					<Hint label="Open full screen">
						<Button
							aria-label="Open full screen"
							nativeButton={false}
							render={
								<a href={src} rel="noreferrer" target="_blank">
									<IconArrowUpRight aria-hidden="true" size={18} />
								</a>
							}
							role="link"
							size="icon"
							variant="ghost"
						/>
					</Hint>
					<span {...props(s.id)}>{block.slug}</span>
				</div>
			</div>
			{view === "preview" ? (
				<iframe
					loading="lazy"
					ref={frame}
					src={src}
					title={`${block.title} preview`}
					{...props(s.frame)}
				/>
			) : (
				<div {...props(s.files)}>
					<SourceCode code={block.setup.code} label="Set up" />
					{files.map(({ code, path }) => (
						<SourceCode code={code} key={path} label={path} title={path} />
					))}
				</div>
			)}
		</section>
	);
}

// A category: its blocks one after another, each live.
export default function CategoryPage({
	data: { blocks, category },
}: {
	data: CategoryPageData;
}) {
	return (
		<main id="docs-content" {...props(s.page)}>
			<header {...props(s.intro)}>
				<nav aria-label="Breadcrumb" {...props(s.crumbs)}>
					<Link to="/blocks" {...props(s.crumbLink)}>
						Blocks
					</Link>{" "}
					/ {category.group}
				</nav>
				<h1 {...props(s.title)}>{category.title}</h1>
				<p {...props(s.lede)}>{category.description}</p>
			</header>
			{blocks.map((entry) => (
				<BlockEntry key={entry.block.slug} {...entry} />
			))}
		</main>
	);
}
