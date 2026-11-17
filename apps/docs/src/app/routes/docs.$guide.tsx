import { createFileRoute, notFound } from "@tanstack/react-router";
import { loadGuide } from "../../entities/documentation/api/docs-functions";
import GuidePage from "../../pages/guide/ui/page";
import { pageHead } from "../lib/page-head";

export const Route = createFileRoute("/docs/$guide")({
	component: Guide,
	staleTime: import.meta.env.DEV ? 0 : Number.POSITIVE_INFINITY,
	loader: async ({ params }) => {
		const guide = await loadGuide({ data: params.guide });
		if (!guide) {
			throw notFound();
		}
		return guide;
	},
	head: ({ loaderData }) =>
		loaderData
			? pageHead(
					`/docs/${loaderData.slug}/`,
					loaderData.title,
					loaderData.description
				)
			: {},
});
function Guide() {
	return <GuidePage guide={Route.useLoaderData()} />;
}
