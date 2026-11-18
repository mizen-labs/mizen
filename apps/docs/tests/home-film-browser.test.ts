import { type Browser, chromium, type Page } from "playwright";
import { afterAll, beforeAll, describe, expect, it } from "vite-plus/test";
import {
	setupTestServer,
	type TestServerHandle,
	teardownTestServer,
} from "./test-helper";

// The landing's film: a c‍ursor themes a live product, the reader can take
// the panel, and reduced motion shows the result as a still.
const docsRoot = new URL("..", import.meta.url).pathname.replace(/\/$/u, "");
let handle: TestServerHandle;
let browser: Browser;

// The accent the film's product reads.
const fill = (page: Page) =>
	page
		.locator("[data-film-theme]")
		.evaluate((stage) =>
			getComputedStyle(stage).getPropertyValue("--mizen-color-accent").trim()
		);

async function open(reducedMotion: "no-preference" | "reduce") {
	const page = await browser.newPage({
		reducedMotion,
		viewport: { height: 900, width: 1440 },
	});
	await page.goto(handle.url, { waitUntil: "networkidle" });
	await page.locator("[data-film-theme]").scrollIntoViewIfNeeded();
	return page;
}

describe("the landing film", { timeout: 60_000 }, () => {
	beforeAll(async () => {
		handle = await setupTestServer(docsRoot);
		browser = await chromium.launch({
			executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH,
			headless: true,
		});
	}, 120_000);

	afterAll(async () => {
		await browser?.close();
		await teardownTestServer(handle);
	});

	it("says what Mizen is in one heading", async () => {
		const page = await open("no-preference");
		expect(await page.getByRole("heading", { level: 1 }).textContent()).toBe(
			"Change the theme, not the components."
		);
		await page.close();
	});

	it("themes the real components, beat by beat", async () => {
		const page = await open("no-preference");
		const before = await fill(page);
		await expect.poll(() => fill(page), { timeout: 8000 }).not.toBe(before);
		expect(
			await page
				.getByRole("button", { name: "Blue" })
				.getAttribute("aria-pressed")
		).toBe("true");
		await page.close();
	});

	it("stops when the reader takes the panel", async () => {
		const page = await open("no-preference");
		// The c‍ursor shows once the script runs, so the page has hydrated.
		await page.locator("[data-film-theme] svg[aria-hidden]").waitFor();
		await page.getByRole("button", { name: "Green" }).click();
		const chosen = await fill(page);
		await page.waitForTimeout(5000);
		expect(await fill(page)).toBe(chosen);
		expect(
			await page
				.getByRole("button", { name: "Green" })
				.getAttribute("aria-pressed")
		).toBe("true");
		await page.close();
	});

	it("shows the result as a still under reduced motion", async () => {
		const page = await open("reduce");
		await expect
			.poll(() =>
				page.getByRole("button", { name: "Blue" }).getAttribute("aria-pressed")
			)
			.toBe("true");
		expect(
			await page.locator("[data-film-theme] svg[aria-hidden]").count()
		).toBe(0);
		await page.close();
	});
});
