import { type Browser, chromium, type Page } from "playwright";
import { afterAll, beforeAll, describe, expect, it } from "vite-plus/test";
import {
	setupTestServer,
	type TestServerHandle,
	teardownTestServer,
} from "./test-helper";

const docsRoot = new URL("..", import.meta.url).pathname.replace(/\/$/u, "");
let handle: TestServerHandle;
let browser: Browser;

async function openDialog(page: Page, slug: string, trigger: string) {
	await page.goto(`${handle.url}/components/${slug}`, {
		waitUntil: "networkidle",
	});
	await page
		.getByRole("button", { exact: true, name: trigger })
		.first()
		.click();
	const dialog = page.locator('[data-slot="dialog-popup"][data-open]');
	await dialog.waitFor({ state: "visible" });
	await page.waitForTimeout(400);
	return dialog;
}

function boxes(dialog: ReturnType<Page["locator"]>, slot: string) {
	return dialog.evaluate((popup, name) => {
		const rect = (selector: string) =>
			popup.querySelector(selector)?.getBoundingClientRect() ?? null;
		return {
			close: rect(`[data-slot="${name}-default-close"]`),
			description: rect(`[data-slot="${name}-description"]`),
			field: rect('[data-slot="field"]'),
			header: rect(`[data-slot="${name}-header"]`),
			title: rect(`[data-slot="${name}-title"]`),
		};
	}, slot);
}

describe("Dialog header and form", { timeout: 60_000 }, () => {
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

	it("gives a header without the close button its full width, and keeps the form spacing", async () => {
		const page = await browser.newPage({
			viewport: { height: 900, width: 1440 },
		});
		const dialog = await openDialog(page, "dialog", "Change category");
		const layout = await dialog.evaluate((popup) => {
			const rect = (slot: string) =>
				popup.querySelector(`[data-slot="${slot}"]`)?.getBoundingClientRect();
			const header = rect("dialog-header");
			const description = rect("dialog-description");
			const field = rect("field");
			if (!(header && description && field)) {
				return null;
			}
			return {
				close: popup.querySelector('[data-slot="dialog-default-close"]'),
				end: Math.round(header.right - description.right),
				gap: Math.round(field.top - header.bottom),
				start: Math.round(description.left - header.left),
			};
		});
		// 24px on both sides of the text, and the header's own inset as the
		// only gap above the form's first field.
		expect(layout).toEqual({ close: null, end: 24, gap: 0, start: 24 });
		await page.close();
	});

	it("keeps only the title clear of the close button", async () => {
		const page = await browser.newPage({
			viewport: { height: 900, width: 1440 },
		});
		const dialog = await openDialog(page, "dialog", "About this workspace");
		const { close } = await boxes(dialog, "dialog");
		// The title's text box ends before the button.
		const textEnd = await dialog
			.locator('[data-slot="dialog-title"]')
			.evaluate(
				(element) =>
					element.getBoundingClientRect().right -
					Number.parseFloat(getComputedStyle(element).paddingInlineEnd)
			);
		expect(textEnd).toBeLessThanOrEqual(close?.left ?? 0);
		expect(
			await dialog
				.locator('[data-slot="dialog-header"]')
				.evaluate((element) => getComputedStyle(element).paddingInlineEnd)
		).toBe("24px");
		await page.close();
	});

	it("lays out small tiles two in a row on a phone", async () => {
		const page = await browser.newPage({
			viewport: { height: 900, width: 390 },
		});
		await page.goto(`${handle.url}/docs/examples/GridTileGalleryExample3`, {
			waitUntil: "networkidle",
		});
		const columns = await page
			.locator('[data-slot="grid-track"]')
			.evaluate(
				(track) => getComputedStyle(track).gridTemplateColumns.split(" ").length
			);
		expect(columns).toBe(2);
		await page.close();
	});
});
