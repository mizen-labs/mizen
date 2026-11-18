import { createFileRoute } from "@tanstack/react-router";
import { GET } from "../../entities/documentation/api/block-markdown";
import { readOnlyHandlers } from "../../shared/lib/read-only-handlers";

export const Route = createFileRoute("/blocks_/$category_/$block_/markdown")({
	server: {
		handlers: {
			...readOnlyHandlers,
			GET: ({ params }) => GET(params.category, params.block),
		},
	},
});
