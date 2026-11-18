import { type Browser, chromium, type Page } from "playwright";
import { afterAll, beforeAll, describe, expect, it } from "vite-plus/test";
import {
	setupTestServer,
	type TestServerHandle,
	teardownTestServer,
} from "./test-helper";

// The header's sections sit in one pill; a raised indicator lies under the
// current one and moves to the next.
const docsRoot = new URL("..", import.meta.url).pathname.replace(/\/$/u, "");
let handle: TestServerHandle;
let browser: Browser;

const pill = (page: Page) =>
	page.getByRole("banner").getByRole("navigation", { name: "Site navigation" });

// Where the indicator sits, against the current link, in pixels.
function offset(page: Page) {
	return pill(page).evaluate((nav) => {
		const indicator = nav.querySelector("span[aria-hidden]");
		const current = nav.querySelector('[aria-current="page"]');
		if (!(indicator && current)) {
			return null;
		}
		const [a, b] = [
			indicator.getBoundingClientRect(),
			current.getBoundingClientRect(),
		];
		return Math.round(Math.abs(a.left - b.left) + Math.abs(a.width - b.width));
	});
}

describe("header pill", { timeout: 60_000 }, () => {
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

	it("marks the current section and moves the indicator to the next", async () => {
		const page = await browser.newPage({
			viewport: { height: 900, width: 1280 },
		});
		await page.goto(`${handle.url}/docs`, { waitUntil: "networkidle" });
		const current = () =>
			pill(page).locator('[aria-current="page"]').textContent();
		expect(await current()).toBe("Docs");
		await expect.poll(() => offset(page)).toBe(0);
		await pill(page).getByRole("link", { name: "Create" }).click();
		await expect.poll(current).toBe("Create");
		await expect.poll(() => offset(page)).toBe(0);
		await page.close();
	});

	it("shows no indicator on a page outside the sections", async () => {
		const page = await browser.newPage({
			viewport: { height: 900, width: 1280 },
		});
		await page.goto(handle.url, { waitUntil: "networkidle" });
		expect(await pill(page).locator("span[aria-hidden]").count()).toBe(0);
		await page.close();
	});

	it("leaves the sections to Browse on a phone", async () => {
		const page = await browser.newPage({
			viewport: { height: 844, width: 390 },
		});
		await page.goto(`${handle.url}/docs`, { waitUntil: "networkidle" });
		expect(await pill(page).isVisible()).toBe(false);
		expect(await page.getByRole("button", { name: "Browse" }).isVisible()).toBe(
			true
		);
		await page.close();
	});
});
