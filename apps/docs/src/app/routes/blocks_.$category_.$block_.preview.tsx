import { createFileRoute, notFound } from "@tanstack/react-router";
import { getBlock } from "../../entities/documentation/model/blocks";
import BlockPreview from "../../pages/blocks/ui/preview";

// One block on its own, at the full size of the window, in its own theme.
// The category page frames this route.
export const Route = createFileRoute("/blocks_/$category_/$block_/preview")({
	component: Preview,
	loader: async ({ params }) => {
		// Imported here, so the blocks stay out of the site's first chunk.
		const { blockApps } = await import(
			"../../entities/documentation/ui/blocks"
		);
		const entry = blockApps[params.block];
		if (!entry || getBlock(params.block)?.category !== params.category) {
			throw notFound();
		}
		return { name: params.block, theme: entry.theme };
	},
	head: ({ loaderData }) =>
		loaderData
			? {
					links: loaderData.theme
						? [{ href: loaderData.theme, rel: "stylesheet" }]
						: [],
					meta: [
						{ title: `${loaderData.name} preview · Mizen UI` },
						{ content: "noindex", name: "robots" },
					],
				}
			: {},
});
function Preview() {
	return <BlockPreview name={Route.useLoaderData().name} />;
}
