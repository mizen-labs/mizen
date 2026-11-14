import { type Browser, chromium } from "playwright";
import { afterAll, beforeAll, describe, expect, it } from "vite-plus/test";
import {
	setupTestServer,
	type TestServerHandle,
	teardownTestServer,
} from "./test-helper";

const docsRoot = new URL("..", import.meta.url).pathname.replace(/\/$/u, "");
let handle: TestServerHandle;
let browser: Browser;

async function measure(width: number, height: number) {
	const page = await browser.newPage({ viewport: { height, width } });
	await page.goto(`${handle.url}/components/alert-dialog`, {
		waitUntil: "networkidle",
	});
	await page.getByRole("button", { name: "Change balance" }).first().click();
	const dialog = page.getByRole("alertdialog", { name: "Change the balance?" });
	await dialog.waitFor({ state: "visible" });
	await page.waitForTimeout(400);
	const result = await dialog.evaluate((popup) => {
		const box = (slot: string) => {
			const element = popup.querySelector(`[data-slot="${slot}"]`);
			const rect = (element as HTMLElement).getBoundingClientRect();
			return { bottom: rect.bottom, left: rect.left, top: rect.top };
		};
		const panel = popup.querySelector(
			'[data-slot="alert-dialog-panel"]'
		) as HTMLElement;
		return {
			footer: box("alert-dialog-footer"),
			list: box("property-list"),
			panelScrolls: panel.scrollHeight > panel.clientHeight,
			title: box("alert-dialog-title"),
		};
	});
	await page.close();
	return result;
}

describe("AlertDialogPanel", { timeout: 60_000 }, () => {
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
	}, 120_000);

	it("aligns its content with the title", async () => {
		const { list, panelScrolls, title } = await measure(1280, 900);
		expect(list.left).toBe(title.left);
		expect(panelScrolls).toBe(false);
	});

	it("scrolls on a short phone screen while the title and actions stay", async () => {
		const { footer, panelScrolls, title } = await measure(390, 420);
		expect(panelScrolls).toBe(true);
		expect(title.top).toBeGreaterThanOrEqual(0);
		expect(footer.bottom).toBeLessThanOrEqual(420);
	});
});
