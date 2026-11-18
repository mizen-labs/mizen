import { createFileRoute, redirect } from "@tanstack/react-router";
import {
	getBlock,
	LEGACY_APPS,
} from "../../entities/documentation/model/blocks";

// An old app address opens its block's category, at the block.
export const Route = createFileRoute("/apps/$app")({
	beforeLoad: ({ params }) => {
		const block = getBlock(LEGACY_APPS[params.app] ?? "");
		throw redirect({
			href: block ? `/blocks/${block.category}#${block.slug}` : "/blocks",
			statusCode: 308,
		});
	},
});
