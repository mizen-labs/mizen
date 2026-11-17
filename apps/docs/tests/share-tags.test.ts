import { afterAll, beforeAll, describe, expect, it } from "vite-plus/test";
import {
	setupTestServer,
	type TestServerHandle,
	teardownTestServer,
} from "./test-helper";

// A shared link shows the page's own title and description, the site name,
// and the share image.
const docsRoot = new URL("..", import.meta.url).pathname.replace(/\/$/u, "");
const META = /<meta (?<attributes>[^>]*)>/gu;
const ATTRIBUTE = /(?<name>[\w:-]+)="(?<value>[^"]*)"/gu;
const CANONICAL = /<link [^>]*rel="canonical"[^>]*>/u;
const HREF = /href="(?<href>[^"]+)"/u;
let handle: TestServerHandle;

// One meta tag's attributes, keyed by name.
function attributesOf(tag: string): Record<string, string> {
	return Object.fromEntries(
		[...tag.matchAll(ATTRIBUTE)].map((match) => [
			match.groups?.name ?? "",
			match.groups?.value ?? "",
		])
	);
}

// og: tags name themselves by property, the rest by name.
const keyOf = (tag: Record<string, string>) =>
	"property" in tag ? tag.property : tag.name;

async function head(path: string) {
	const html = await (await fetch(`${handle.url}${path}`)).text();
	const tags = Object.fromEntries(
		[...html.matchAll(META)]
			.map((match) => attributesOf(match.groups?.attributes ?? ""))
			.filter((tag) => keyOf(tag) && "content" in tag)
			.map((tag) => [keyOf(tag), tag.content])
	);
	const canonical = HREF.exec(CANONICAL.exec(html)?.[0] ?? "")?.groups?.href;
	return { canonical, tags };
}

describe("share tags", { timeout: 60_000 }, () => {
	beforeAll(async () => {
		handle = await setupTestServer(docsRoot);
	}, 120_000);

	afterAll(async () => {
		await teardownTestServer(handle);
	});

	it.each(["/", "/create", "/docs/theming", "/docs/components/button"])(
		"%s names itself in a shared link",
		async (path) => {
			const { canonical, tags } = await head(path);
			expect(tags["og:title"]).toBeTruthy();
			expect(tags["og:title"]).toBe(tags["twitter:title"]);
			expect(tags["og:description"]).toBe(tags.description);
			expect(tags["og:url"]).toBe(canonical);
			expect(tags["og:site_name"]).toBe("Mizen UI");
			expect(tags["twitter:card"]).toBe("summary_large_image");
			expect(tags["og:image"]).toBe("https://ui.mizen-labs.dev/share.png");
		}
	);

	it("serves the share image", async () => {
		const response = await fetch(`${handle.url}/share.png`);
		expect(response.status).toBe(200);
		expect(response.headers.get("content-type")).toContain("image/png");
	});
});
