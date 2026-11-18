// biome-ignore-all lint/performance/noAwaitInLoops: Sequential browser checks keep memory use bounded.
import { type Browser, chromium, type Page } from "playwright";
import { expect as expectLocator } from "playwright/test";
import { afterAll, beforeAll, expect, it } from "vite-plus/test";
import {
	setupTestServer,
	type TestServerHandle,
	teardownTestServer,
} from "./test-helper";

let handle: TestServerHandle;
let browser: Browser;
let page: Page;
const errors: string[] = [];

beforeAll(async () => {
	handle = await setupTestServer(new URL("..", import.meta.url).pathname);
	browser = await chromium.launch({
		executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH,
		headless: true,
	});
	page = await browser.newPage();
	page.on("pageerror", (error) => errors.push(error.message));
	page.on("console", (message) => {
		if (message.type() === "error") {
			errors.push(message.text());
		}
	});
}, 120_000);
afterAll(async () => {
	await browser?.close();
	await teardownTestServer(handle);
});

it("keeps content readable in both themes, narrow layouts, and enlarged text", async () => {
	for (const theme of ["light", "dark"]) {
		await page.addInitScript(
			(value) => localStorage.setItem("mizen-theme", value),
			theme
		);
		for (const width of [1440, 1024, 768, 320]) {
			await page.setViewportSize({ height: 1000, width });
			await page.goto(handle.url, { waitUntil: "networkidle" });
			await expectLocator(page.locator("html")).toHaveAttribute(
				"data-theme",
				theme
			);
			expect(
				await page.evaluate(
					() => document.documentElement.scrollWidth <= innerWidth
				)
			).toBe(true);
			await expectLocator(page.locator("h1")).toHaveCount(1);
			await expectLocator(
				page.getByRole("main").getByRole("link", { name: "Get started" })
			).toBeVisible();
			await page.screenshot({
				fullPage: true,
				path: `/private/tmp/mizen-dashboard-${theme}-${width}.png`,
			});
		}
	}
	await page.emulateMedia({ reducedMotion: "reduce" });
	await page.evaluate(() => {
		document.documentElement.style.fontSize = "32px";
	});
	await page.screenshot({
		fullPage: true,
		path: "/private/tmp/mizen-dashboard-large-text.png",
	});
	const overflow = await page.locator("main *").evaluateAll((elements) =>
		elements
			.filter((element) => element.getBoundingClientRect().right > innerWidth)
			.map((element) => ({
				tag: element.tagName,
				text: element.textContent?.slice(0, 70),
				width: element.getBoundingClientRect().width,
			}))
	);
	expect(
		await page.evaluate(
			() => document.documentElement.scrollWidth <= innerWidth
		),
		JSON.stringify(overflow)
	).toBe(true);
	await expectLocator(page.getByRole("button", { name: "Wine" })).toBeVisible();
	expect(errors).toEqual([]);
}, 60_000);
