import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
	type Browser,
	type BrowserType,
	chromium,
	firefox,
	type Page,
	webkit,
} from "playwright";
import { expect as expectLocator } from "playwright/test";
import { afterAll, beforeAll, describe, expect, it } from "vite-plus/test";
import {
	blockCategories,
	blocks,
	blocksIn,
} from "../src/entities/documentation/model/blocks";
import {
	setupTestServer,
	type TestServerHandle,
	teardownTestServer,
} from "./test-helper";

const docsRoot = new URL("..", import.meta.url).pathname.replace(/\/$/u, "");
let handle: TestServerHandle | undefined;
let browser: Browser;
let page: Page;
let errors: string[] = [];

// Firefox needs its own home, or parallel runs share a profile lock.
function launch(engine: BrowserType) {
	if (engine === chromium) {
		return engine.launch({
			executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH,
			headless: true,
		});
	}
	const env =
		engine === firefox
			? {
					...process.env,
					CFFIXED_USER_HOME: mkdtempSync(join(tmpdir(), "mizen-firefox-")),
				}
			: undefined;
	return engine.launch({ env, headless: true });
}

const url = (path: string) => `${handle?.url}${path}`;

async function openPreview(width: number, theme: "dark" | "light" = "light") {
	await page.setViewportSize({ height: 900, width });
	await page.addInitScript(
		(value) => localStorage.setItem("mizen-theme", value),
		theme
	);
	await page.goto(url("/blocks/dashboard/dashboard-1/preview"), {
		waitUntil: "networkidle",
	});
}

const token = (name: string) =>
	page.evaluate(
		(property) =>
			getComputedStyle(document.documentElement).getPropertyValue(property),
		name
	);

afterAll(async () => {
	if (handle) {
		await teardownTestServer(handle);
	}
});

describe.each([
	["chromium", chromium],
	["webkit", webkit],
	["firefox", firefox],
] as const)("Blocks in %s", { timeout: 30_000 }, (_name, engine) => {
	beforeAll(async () => {
		handle ??= await setupTestServer(docsRoot);
		browser = await launch(engine);
		page = await browser.newPage({ viewport: { height: 900, width: 1280 } });
		errors = [];
		page.on("pageerror", (error) => errors.push(error.message));
	}, 120_000);

	afterAll(async () => {
		await browser?.close();
		expect(errors).toEqual([]);
	});

	it("lists every category on the index and every block in llms.txt", async () => {
		await page.goto(url("/blocks"), { waitUntil: "networkidle" });
		await expectLocator(
			page
				.getByRole("navigation", { name: "Site navigation" })
				.getByRole("link", { exact: true, name: "Blocks" })
		).toHaveAttribute("aria-current", "page");
		const main = page.getByRole("main");
		await Promise.all(
			blockCategories.map(({ slug, title }) =>
				expectLocator(
					main.getByRole("link", { name: new RegExp(`^${title}`, "u") })
				).toHaveAttribute("href", `/blocks/${slug}`)
			)
		);
		const llms = await (await page.request.get(url("/llms.txt"))).text();
		for (const block of blocks) {
			expect(llms).toContain(
				`- [${block.title}](/blocks/${block.category}/${block.slug}/markdown): ${block.description}`
			);
		}
	});

	it.each(blocks.map((block) => [block.slug, block] as const))(
		"runs %s on its own without errors",
		async (_slug, block) => {
			const response = await page.goto(
				url(`/blocks/${block.category}/${block.slug}/preview`),
				{ waitUntil: "networkidle" }
			);
			expect(response?.status()).toBe(200);
			await expectLocator(
				page.getByRole("heading", { level: 1 }).first()
			).toBeVisible();
		}
	);

	it("serves a block's set up and sources as Markdown", async () => {
		const response = await page.request.get(
			url("/blocks/dashboard/dashboard-1/markdown")
		);
		expect(response.status()).toBe(200);
		expect(response.headers()["content-type"]).toContain("text/markdown");
		const markdown = await response.text();
		expect(markdown).toContain("init --preset vivid");
		for (const source of [
			"### src/app.tsx",
			"export function Home(",
			"export function AppShellFrame(",
			"export const orders",
		]) {
			expect(markdown).toContain(source);
		}
		const missing = await Promise.all(
			[
				"/blocks/unknown",
				"/blocks/dashboard/unknown/markdown",
				"/blocks/dashboard/unknown/preview",
				"/blocks/settings/dashboard-1/preview",
				"/blocks/settings/dashboard-1/markdown",
			].map((path) => page.request.get(url(path)))
		);
		expect(missing.map((entry) => entry.status())).toEqual([
			404, 404, 404, 404, 404,
		]);
	});

	it.each([
		["/apps", "/blocks"],
		["/apps/dashboard", "/blocks/dashboard#dashboard-1"],
		["/apps/dashboard/preview", "/blocks/dashboard/dashboard-1/preview"],
		["/apps/dashboard/markdown", "/blocks/dashboard/dashboard-1/markdown"],
		["/apps/unknown", "/blocks"],
	])("redirects %s to %s", async (from, to) => {
		const response = await page.request.get(url(from), {
			maxRedirects: 0,
		});
		expect(response.status()).toBe(308);
		const location = new URL(response.headers().location, url("/"));
		expect(location.pathname + location.hash).toBe(to);
	});

	it("lists a category's blocks, each live, with its code a switch away", async () => {
		await page.setViewportSize({ height: 900, width: 1440 });
		await page.goto(url("/blocks/dashboard"), {
			waitUntil: "networkidle",
		});
		await expectLocator(
			page.getByRole("heading", { level: 1, name: "Dashboard" })
		).toBeVisible();
		await expectLocator(
			page.getByRole("main").getByRole("heading", { level: 2 })
		).toHaveText(blocksIn("dashboard").map(({ title }) => title));
		const block = page.locator("#dashboard-1");
		await expectLocator(
			block
				.frameLocator('iframe[title="Dashboard 1 preview"]')
				.getByRole("heading", { level: 1, name: "Home" })
		).toBeVisible();
		await expectLocator(
			block.getByRole("link", { name: "Open full screen" })
		).toHaveAttribute("href", "/blocks/dashboard/dashboard-1/preview");
		await block.getByRole("button", { exact: true, name: "Code" }).click();
		await expectLocator(block.locator("iframe")).toHaveCount(0);
		await expectLocator(
			block.locator('[data-slot="code-block-title"]')
		).toHaveText([
			"src/app.tsx",
			"src/home.tsx",
			"src/app-shell.tsx",
			"src/data.ts",
		]);
		expect(
			await page.evaluate(() => document.documentElement.scrollWidth)
		).toBeLessThanOrEqual(1440);
	});

	it.each(["/blocks", "/blocks/settings"])(
		"fits %s on a phone",
		async (path) => {
			await page.setViewportSize({ height: 800, width: 375 });
			await page.goto(url(path), { waitUntil: "networkidle" });
			const [scroll, client] = await page.evaluate(() => [
				document.documentElement.scrollWidth,
				document.documentElement.clientWidth,
			]);
			expect(scroll).toBeLessThanOrEqual(client);
		}
	);

	it.each(["light", "dark"] as const)(
		"runs the dashboard in the Vivid theme in %s mode",
		async (theme) => {
			await openPreview(1280, theme);
			await expectLocator(page.locator("html")).toHaveAttribute(
				"data-theme",
				theme
			);
			// Vivid fills the primary action with the accent.
			expect(await token("--mizen-color-primary")).toBe(
				await token("--mizen-color-accent")
			);
			const nav = page.getByRole("navigation", { name: "Main" });
			await expectLocator(
				nav.getByRole("link", { name: "Home" })
			).toHaveAttribute("aria-current", "page");
			await expectLocator(
				page.getByRole("button", { name: "Toggle navigation" })
			).toHaveAttribute("aria-expanded", "true");
			// The window does not scroll; the pane does.
			expect(
				await page.evaluate(() => [
					document.documentElement.scrollWidth,
					document.documentElement.scrollHeight,
				])
			).toEqual([1280, 900]);
		}
	);

	it("selects orders one by one and all at once", async () => {
		await openPreview(1280);
		const table = page.getByRole("table");
		const all = table.getByRole("checkbox", { name: "Select all orders" });
		const selected = table.locator('tbody tr[data-selected="true"]');
		await expectLocator(all).toHaveAttribute("aria-checked", "mixed");
		await expectLocator(selected).toHaveCount(2);
		await table.getByRole("checkbox", { name: "Select ORD-1045" }).click();
		await expectLocator(selected).toHaveCount(3);
		await all.click();
		await expectLocator(selected).toHaveCount(7);
		await expectLocator(all).toBeChecked();
		await all.click();
		await expectLocator(selected).toHaveCount(0);
	});

	it("moves the navigation into a drawer on a narrow screen", async () => {
		await openPreview(375);
		await expectLocator(
			page.getByRole("navigation", { name: "Main" })
		).toHaveCount(0);
		expect(
			await page.evaluate(() => document.documentElement.scrollWidth)
		).toBe(375);
		await page.getByRole("button", { name: "Toggle navigation" }).click();
		const drawer = page.getByRole("dialog", { name: "Northstar" });
		const orders = drawer.getByRole("link", { name: "Orders" });
		await expectLocator(orders).toBeVisible();
		await expectLocator(orders).toHaveCSS("font-size", "14px");
		await orders.click();
		await expectLocator(drawer).toBeHidden();
	});
});
