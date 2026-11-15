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
import { afterAll, beforeAll, describe, expect, it } from "vite-plus/test";
import {
	setupTestServer,
	type TestServerHandle,
	teardownTestServer,
} from "./test-helper";

// The dashboard app with worst-case, empty, one-item and 1,000-row data. Each
// case broke something once; the fixture keeps it fixed.
const REFUNDS = /^Refunds/u;
const ORDERS = /^Orders/u;
const docsRoot = new URL("..", import.meta.url).pathname.replace(/\/$/u, "");
let handle: TestServerHandle;

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

async function open(
	browser: Browser,
	data: string,
	width: number,
	dir: "ltr" | "rtl" = "ltr"
) {
	const page = await browser.newPage({ viewport: { height: 860, width } });
	await page.goto(`${handle.url}/internal/app-fixtures?data=${data}`, {
		waitUntil: "networkidle",
	});
	if (dir === "rtl") {
		await page.evaluate(() => {
			document.documentElement.dir = "rtl";
		});
	}
	await page.evaluate(() => document.fonts.ready);
	return page;
}

// Lines a single-line element spans: its height over its line height.
function lines(page: Page, selector: string) {
	return page.locator(selector).evaluateAll((elements) =>
		elements.map((element) => {
			const { lineHeight } = getComputedStyle(element);
			return Math.round(
				element.getBoundingClientRect().height / Number.parseFloat(lineHeight)
			);
		})
	);
}

describe.each([
	["chromium", chromium],
	["webkit", webkit],
	["firefox", firefox],
] as const)("dashboard edge cases in %s", { timeout: 60_000 }, (_, engine) => {
	let browser: Browser;

	beforeAll(async () => {
		handle ??= await setupTestServer(docsRoot);
		browser = await launch(engine);
	}, 120_000);

	afterAll(async () => {
		await browser?.close();
	});

	it("keeps long values whole and the window still", async () => {
		const page = await open(browser, "worst", 1280);
		expect(
			await page.evaluate(() => document.documentElement.scrollWidth)
		).toBe(1280);
		// Numbers, counts, statuses and dates never wrap.
		expect(await lines(page, '[data-slot="metric-value"] > bdi')).not.toContain(
			2
		);
		const badges = await page
			.locator(
				'[data-slot="app-shell-item"] [data-slot="badge"], td [data-slot="badge"]'
			)
			.evaluateAll((elements) =>
				elements.map((element) => element.getBoundingClientRect().height)
			);
		expect(Math.max(...badges)).toBeLessThan(26);
		expect(
			await page
				.getByRole("link", { name: ORDERS })
				.locator('[data-slot="badge"]')
				.textContent()
		).toBe("99+ new");
		// The product and the account end in an ellipsis on one line.
		const brand = page.locator('[data-slot="app-shell-sidebar-header"] p');
		await expect
			.poll(() => brand.getAttribute("title"))
			.toBe("Northwind Industries Holdings International");
		const name = await page
			.locator(
				'[data-slot="app-shell-sidebar-footer"] button > span:not([data-slot])'
			)
			.evaluate((element) => [
				element.scrollWidth > element.clientWidth,
				element.getBoundingClientRect().height,
			]);
		expect(name[0]).toBe(true);
		expect(name[1]).toBeLessThan(20);
		await page.close();
	});

	it("keeps signs before their numbers right to left", async () => {
		const page = await open(browser, "worst", 1280, "rtl");
		const refunds = page
			.locator('[data-slot="metric-trend"]')
			.filter({ hasText: REFUNDS });
		const [value, delta] = await Promise.all([
			refunds.locator('[data-slot="metric-value"] bdi').getAttribute("dir"),
			refunds.locator('[data-slot="metric-delta"] bdi').getAttribute("dir"),
		]);
		expect([value, delta]).toEqual(["ltr", "ltr"]);
		expect(
			await page.locator("td[data-slot='table-cell'] > bdi[dir='ltr']").count()
		).toBeGreaterThan(0);
		await page.close();
	});

	it("shows no orders and no selection when there are none", async () => {
		const page = await open(browser, "empty", 1440);
		expect(await page.getByText("No orders yet").isVisible()).toBe(true);
		expect(await page.getByRole("checkbox").count()).toBe(0);
		await page.close();
	});

	it("draws one day and one point at a readable size", async () => {
		const page = await open(browser, "one", 1440);
		expect(
			await page
				.getByRole("checkbox", { name: "Select all orders" })
				.isChecked()
		).toBe(false);
		const heatmap = await page
			.locator('[data-slot="calendar-heatmap"]')
			.boundingBox();
		expect(heatmap?.height).toBeLessThan(260);
		const ticks = await page
			.getByRole("img", { name: "Revenue by channel" })
			.locator("text")
			.allTextContents();
		expect(ticks.filter((tick) => tick === "Jan 1, 2026")).toHaveLength(1);
		await page.close();
	});

	it("shows only the recent orders and the current page in view", async () => {
		const page = await open(browser, "many", 1440);
		expect(
			await page
				.getByRole("region", { name: "Recent orders" })
				.locator("tbody tr")
				.count()
		).toBe(7);
		const visible = await page.evaluate(() => {
			const current = document.querySelector('[aria-current="page"]');
			const view = current?.closest('[data-slot="scroll-area-viewport"]');
			if (!(current && view)) {
				return false;
			}
			const item = current.getBoundingClientRect();
			const box = view.getBoundingClientRect();
			return item.top >= box.top && item.bottom <= box.bottom + 1;
		});
		expect(visible).toBe(true);
		await page.close();
	});

	it("starts the sidebar collapsed on a medium screen", async () => {
		const page = await open(browser, "demo", 900);
		expect(
			await page.locator('[data-slot="app-shell"]').getAttribute("data-sidebar")
		).toBe("collapsed");
		await page.setViewportSize({ height: 860, width: 1280 });
		await expect
			.poll(() =>
				page.locator('[data-slot="app-shell"]').getAttribute("data-sidebar")
			)
			.toBe("open");
		await page.close();
	});
});

describe("dashboard drawer", { timeout: 60_000 }, () => {
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

	it("keeps the product name clear of the close button", async () => {
		const page = await open(browser, "worst", 390);
		await page.getByRole("button", { name: "Toggle navigation" }).click();
		const drawer = page.getByRole("dialog");
		await drawer.waitFor({ state: "visible" });
		await page.waitForTimeout(400);
		const [name, close] = await Promise.all([
			drawer.locator('[data-slot="app-shell-sidebar-header"] p').boundingBox(),
			drawer.getByRole("button", { name: "Close navigation" }).boundingBox(),
		]);
		expect((name?.x ?? 0) + (name?.width ?? 0)).toBeLessThanOrEqual(
			close?.x ?? 0
		);
		await page.close();
	});
});
