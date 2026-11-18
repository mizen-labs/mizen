import { props } from "@stylexjs/stylex";
import { Link } from "@tanstack/react-router";
import {
	blockCategories,
	blocksIn,
} from "../../../entities/documentation/model/blocks";
import { blocksStyles as s } from "./blocks.styles";
import { WIREFRAMES } from "./wireframes";

const GROUPS = [...new Set(blockCategories.map(({ group }) => group))];
const count = (n: number) => `${n} ${n === 1 ? "block" : "blocks"}`;

// Every category in a ruled grid: a small drawing, its name, and how many
// blocks it holds.
export default function BlocksPage() {
	return (
		<main id="docs-content" {...props(s.page)}>
			<header {...props(s.intro)}>
				<h1 {...props(s.title)}>Blocks</h1>
				<p {...props(s.lede)}>
					Screens built from Mizen components, by kind. Open a category, see
					each one live, and copy its files.
				</p>
			</header>
			{GROUPS.map((group) => (
				<section
					aria-labelledby={`group-${group}`}
					key={group}
					{...props(s.group)}
				>
					<h2 id={`group-${group}`} {...props(s.groupTitle)}>
						{group}
					</h2>
					<ul {...props(s.grid)}>
						{blockCategories
							.filter((category) => category.group === group)
							.map(({ slug, title }) => {
								const Drawing = WIREFRAMES[slug];
								return (
									<li key={slug} {...props(s.cell)}>
										<Link
											params={{ category: slug }}
											to="/blocks/$category"
											{...props(s.tile)}
										>
											<span {...props(s.tileHead)}>
												<span {...props(s.tileTitle)}>{title}</span>
												<span {...props(s.count)}>
													{count(blocksIn(slug).length)}
												</span>
											</span>
											<span aria-hidden="true" {...props(s.art)}>
												{Drawing ? <Drawing /> : null}
											</span>
										</Link>
									</li>
								);
							})}
					</ul>
				</section>
			))}
		</main>
	);
}
