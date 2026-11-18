import { createFileRoute, redirect } from "@tanstack/react-router";
import {
	getBlock,
	LEGACY_APPS,
} from "../../entities/documentation/model/blocks";

export const Route = createFileRoute("/apps_/$app_/preview")({
	beforeLoad: ({ params }) => {
		const block = getBlock(LEGACY_APPS[params.app] ?? "");
		throw redirect({
			href: block
				? `/blocks/${block.category}/${block.slug}/preview`
				: "/blocks",
			statusCode: 308,
		});
	},
});
