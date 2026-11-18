import { renderBlockMarkdown } from "./block-data.server";

export function GET(category: string, slug: string) {
	const markdown = renderBlockMarkdown(category, slug);
	return new Response(markdown ?? "Block not found.\n", {
		headers: { "content-type": "text/markdown; charset=utf-8" },
		status: markdown ? 200 : 404,
	});
}
