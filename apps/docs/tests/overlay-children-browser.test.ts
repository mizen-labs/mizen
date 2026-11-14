import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
	type Browser,
	type BrowserType,
	chromium,
	firefox,
	type Locator,
	type Page,
	webkit,
} from "playwright";
import { afterAll, beforeAll, describe, expect, it } from "vite-plus/test";
import {
	setupTestServer,
	type TestServerHandle,
	teardownTestServer,
} from "./test-helper";

const docsRoot = new URL("..", import.meta.url).pathname.replace(/\/$/u, "");
let handle: TestServerHandle;

// The element under the center of a locator is the locator or inside it.
function receivesPointer(locator: Locator) {
	return locator.evaluate((element) => {
		const box = element.getBoundingClientRect();
		const hit = document.elementFromPoint(
			box.x + box.width / 2,
			box.y + box.height / 2
		);
		return hit !== null && element.contains(hit);
	});
}

function launch(engine: BrowserType) {
	const env =
		engine === firefox
			? {
					...process.env,
					CFFIXED_USER_HOME: mkdtempSync(join(tmpdir(), "mizen-firefox-")),
				}
			: undefined;
	return engine.launch({ env, headless: true });
}

async function openFilters(page: Page) {
	await page.goto(`${handle.url}/components/drawer`, {
		waitUntil: "networkidle",
	});
	await page.getByRole("button", { exact: true, name: "Filters" }).click();
	const drawer = page.getByRole("dialog", { name: "Filters" });
	await drawer.waitFor({ state: "visible" });
	return drawer;
}

describe.each([
	["chromium", chromium],
	["webkit", webkit],
	["firefox", firefox],
] as const)("overlay children in %s", { timeout: 60_000 }, (_, engine) => {
	let browser: Browser;

	beforeAll(async () => {
		handle ??= await setupTestServer(docsRoot);
		browser = await launch(engine);
	}, 120_000);

	afterAll(async () => {
		await browser?.close();
	});

	it("selects an option of a Select inside a Drawer with a mouse", async () => {
		const page = await browser.newPage({
			viewport: { height: 800, width: 1280 },
		});
		const drawer = await openFilters(page);
		const tier = drawer.getByRole("combobox", { name: "Tier" });
		await tier.click();
		const vip = page.getByRole("option", { name: "VIP" });
		await vip.waitFor({ state: "visible" });
		expect(await receivesPointer(vip)).toBe(true);
		await vip.click();
		await expect.poll(() => tier.textContent()).toBe("VIP");
		expect(await drawer.isVisible()).toBe(true);
		await page.close();
	});

	it("hides a closed sheet that stays mounted", async () => {
		const page = await browser.newPage({
			viewport: { height: 800, width: 1280 },
		});
		await page.goto(`${handle.url}/components/sheet`, {
			waitUntil: "networkidle",
		});
		const trigger = page.getByRole("button", { name: "Draft note" });
		const hidden = () =>
			page.evaluate(() =>
				["sheet-viewport", "sheet-popup"].map((slot) => {
					const element = [
						...document.querySelectorAll(`[data-slot="${slot}"]`),
					].find((node) => (node as HTMLElement).hidden);
					return element ? getComputedStyle(element).display : "missing";
				})
			);
		expect(await hidden()).toEqual(["none", "none"]);
		await trigger.click();
		const sheet = page.getByRole("dialog", { name: "Draft note" });
		await sheet.getByRole("textbox", { name: "Note" }).fill("Call back");
		await sheet.getByRole("button", { name: "Done" }).click();
		await sheet.waitFor({ state: "hidden" });
		expect(await hidden()).toEqual(["none", "none"]);
		expect(await receivesPointer(trigger)).toBe(true);
		await trigger.click();
		await expect
			.poll(() => sheet.getByRole("textbox", { name: "Note" }).inputValue())
			.toBe("Call back");
		await page.close();
	});
});

describe("overlay children with touch", { timeout: 60_000 }, () => {
	let browser: Browser;

	beforeAll(async () => {
		handle ??= await setupTestServer(docsRoot);
		browser = await chromium.launch({
			executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH,
			headless: true,
		});
	}, 120_000);

	afterAll(async () => {
		await browser?.close();
		await teardownTestServer(handle);
	}, 120_000);

	it("selects an option of a Select inside a Drawer with a tap", async () => {
		const context = await browser.newContext({
			hasTouch: true,
			isMobile: true,
			viewport: { height: 800, width: 390 },
		});
		const page = await context.newPage();
		await page.goto(`${handle.url}/components/drawer`, {
			waitUntil: "networkidle",
		});
		await page.getByRole("button", { exact: true, name: "Filters" }).tap();
		const drawer = page.getByRole("dialog", { name: "Filters" });
		await drawer.waitFor({ state: "visible" });
		const tier = drawer.getByRole("combobox", { name: "Tier" });
		await tier.tap();
		await page.getByRole("option", { name: "Streamer" }).tap();
		await expect.poll(() => tier.textContent()).toBe("Streamer");
		await context.close();
	});
});
