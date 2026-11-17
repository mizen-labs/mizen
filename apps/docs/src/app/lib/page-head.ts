import { homepage } from "../../../package.json";
import { canonical } from "./canonical";

// What a page shows in search and in a shared link: its address, title, and
// description. The root route adds the site name and the image.
export function pageHead(path: string, title: string, description: string) {
	const link = canonical(path);
	return {
		links: [link],
		meta: [
			{ title },
			{ content: description, name: "description" },
			{ content: title, property: "og:title" },
			{ content: description, property: "og:description" },
			{ content: link.href, property: "og:url" },
			{ content: title, name: "twitter:title" },
			{ content: description, name: "twitter:description" },
		],
	};
}

const image = new URL("/share.png", homepage).href;

export const siteShare = [
	{ content: "Mizen UI", property: "og:site_name" },
	{ content: "website", property: "og:type" },
	{ content: image, property: "og:image" },
	{ content: "1200", property: "og:image:width" },
	{ content: "630", property: "og:image:height" },
	{ content: "Mizen UI", property: "og:image:alt" },
	{ content: "summary_large_image", name: "twitter:card" },
	{ content: image, name: "twitter:image" },
];
