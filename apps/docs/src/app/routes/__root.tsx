import sansFontUrl from "@fontsource-variable/geist/files/geist-latin-wght-normal.woff2?url";
import { createRootRoute } from "@tanstack/react-router";
import { loadNavigation } from "../../entities/documentation/api/docs-functions";
import RootLayout from "../layouts/root-layout";
import { siteShare } from "../lib/page-head";
import { NotFound } from "../ui/route-error";

export const Route = createRootRoute({
	loader: () => loadNavigation(),
	staleTime: import.meta.env.DEV ? 0 : Number.POSITIVE_INFINITY,
	head: () => ({
		links: [
			{ href: "/icon.svg", rel: "icon", type: "image/svg+xml" },
			{
				as: "font",
				crossOrigin: "anonymous",
				href: sansFontUrl,
				rel: "preload",
				type: "font/woff2",
			},
		],
		meta: [
			{ charSet: "utf-8" },
			{ content: "width=device-width, initial-scale=1", name: "viewport" },
			{ title: "Mizen UI" },
			{
				content:
					"Mizen UI components, documentation, blocks, and application examples.",
				name: "description",
			},
			...siteShare,
		],
	}),
	notFoundComponent: NotFound,
	shellComponent: RootLayout,
});
