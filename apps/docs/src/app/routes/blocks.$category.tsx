import { createFileRoute, notFound } from "@tanstack/react-router";
import { loadBlockCategory } from "../../entities/documentation/api/docs-functions";
import CategoryPage from "../../pages/blocks/ui/category-page";
import SiteLayout from "../layouts/site-layout";
import { pageHead } from "../lib/page-head";

export const Route = createFileRoute("/blocks/$category")({
	component: Category,
	staleTime: import.meta.env.DEV ? 0 : Number.POSITIVE_INFINITY,
	loader: async ({ params }) => {
		const data = await loadBlockCategory({ data: params.category });
		if (!data) {
			throw notFound();
		}
		return data;
	},
	head: ({ loaderData }) =>
		loaderData
			? pageHead(
					`/blocks/${loaderData.category.slug}/`,
					`${loaderData.category.title} blocks · Mizen UI`,
					loaderData.category.description
				)
			: {},
});
function Category() {
	return (
		<SiteLayout>
			<CategoryPage data={Route.useLoaderData()} />
		</SiteLayout>
	);
}
