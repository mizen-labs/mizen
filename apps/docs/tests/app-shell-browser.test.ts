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

const NOTIFICATIONS = /Notifications/u;
const GLYPH = /layout-sidebar-left-(?<state>collapse|expand)/u;
const ACCOUNT = /Maya Chen/u;
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

async function open(browser: Browser, width: number, theme = "light") {
	const context = await browser.newContext({
		viewport: { height: 800, width },
	});
	await context.addInitScript(
		(value) => localStorage.setItem("mizen-theme", value),
		theme
	);
	const page = await context.newPage();
	await page.goto(`${handle.url}/docs/examples/AppShellAdminExample`, {
		waitUntil: "networkidle",
	});
	// Measure once the fonts and the hydrated layout have settled.
	await page.evaluate(() => document.fonts.ready);
	await expect
		.poll(() => page.evaluate(() => document.documentElement.scrollHeight))
		.toBe(800);
	return page;
}

function box(page: Page, slot: string) {
	return page
		.locator(`[data-slot="${slot}"]`)
		.first()
		.evaluate((element) => {
			const { height, left, right, top, width } =
				element.getBoundingClientRect();
			return { height, left, right, top, width };
		});
}

// The floating sidebar has slid in: it rests 8px from the edge.
function settled(page: Page) {
	return expect
		.poll(async () => (await box(page, "app-shell-sidebar")).left)
		.toBe(8);
}

// The trigger shows collapse while the sidebar is open, expand otherwise.
async function glyph(page: Page) {
	const name = await page
		.locator('[data-slot="app-shell-header"] button svg')
		.first()
		.getAttribute("class");
	return name?.match(GLYPH)?.groups?.state;
}

const trigger = (page: Page) =>
	page.getByRole("button", { name: "Toggle navigation" });

describe.each([
	["chromium", chromium],
	["webkit", webkit],
	["firefox", firefox],
] as const)("AppShell in %s", { timeout: 60_000 }, (_, engine) => {
	let browser: Browser;

	beforeAll(async () => {
		handle ??= await setupTestServer(docsRoot);
		browser = await launch(engine);
	}, 120_000);

	afterAll(async () => {
		await browser?.close();
	});

	it("places the sidebar beside the content and keeps both in the window", async () => {
		const page = await open(browser, 1280);
		const sidebar = await box(page, "app-shell-sidebar");
		const inset = await box(page, "app-shell-inset");
		expect(sidebar.width).toBe(256);
		expect(inset.left).toBeGreaterThanOrEqual(sidebar.right);
		expect(inset.right).toBe(1280 - 8);
		expect(
			await page.evaluate(() => document.documentElement.scrollHeight)
		).toBe(800);
		const footer = await box(page, "app-shell-sidebar-footer");
		expect(footer.top + footer.height).toBeLessThanOrEqual(800);
		await page.context().close();
	});

	it("marks the current page and moves it on navigation", async () => {
		const page = await open(browser, 1280);
		const nav = page.getByRole("navigation", { name: "Main" });
		await expect
			.poll(() => nav.locator('[aria-current="page"]').textContent())
			.toBe("Players");
		await nav.getByRole("link", { name: "Balances" }).click();
		await expect
			.poll(() => nav.locator('[aria-current="page"]').textContent())
			.toBe("Balances");
		const unread = nav.getByRole("link", { name: NOTIFICATIONS });
		expect(await unread.textContent()).toBe("Notifications3 unread");
		await page.context().close();
	});

	it("truncates a long label and keeps its full text", async () => {
		const page = await open(browser, 1280);
		const label = page
			.getByRole("link", { name: "Session security analytics" })
			.locator("span[title]");
		expect(await label.getAttribute("title")).toBe(
			"Session security analytics"
		);
		expect(
			await label.evaluate((element) => getComputedStyle(element).textOverflow)
		).toBe("ellipsis");
		await page.context().close();
	});

	it("folds a group and announces each list", async () => {
		const page = await open(browser, 1280);
		const finance = page.getByRole("button", { name: "Finance" });
		expect(await finance.getAttribute("aria-expanded")).toBe("true");
		await finance.click();
		await expect
			.poll(() => page.getByRole("link", { name: "Payouts" }).isVisible())
			.toBe(false);
		expect(
			await page
				.getByRole("list", { name: "Pinned" })
				.getByRole("listitem")
				.count()
		).toBe(1);
		await page.context().close();
	});

	it("collapses, and shows the sidebar while the pointer rests on the edge", async () => {
		const page = await open(browser, 1280);
		const sidebar = page.locator('[data-slot="app-shell-sidebar"]');
		expect(await glyph(page)).toBe("collapse");
		await trigger(page).click();
		expect(await trigger(page).getAttribute("aria-expanded")).toBe("false");
		expect(await glyph(page)).toBe("expand");
		// It goes at once: no floating card slides over the content.
		expect(
			await sidebar.evaluate((element) => getComputedStyle(element).visibility)
		).toBe("hidden");
		expect(await sidebar.getAttribute("data-state")).toBe("floating");
		await expect
			.poll(async () => (await box(page, "app-shell-inset")).left)
			.toBe(8);
		expect(
			await sidebar.evaluate((element) => (element as HTMLElement).inert)
		).toBe(true);

		await page.mouse.move(4, 400);
		await settled(page);
		expect(
			await sidebar.evaluate((element) => (element as HTMLElement).inert)
		).toBe(false);
		await page.getByRole("link", { name: "Balances" }).click();

		await page.mouse.move(900, 400);
		await expect.poll(() => sidebar.isVisible()).toBe(false);

		// A pointer that leaves the edge for the content hides it too.
		await page.mouse.move(4, 400);
		await settled(page);
		await page.mouse.move(900, 400);
		await expect.poll(() => sidebar.isVisible()).toBe(false);
		await trigger(page).click();
		await expect.poll(() => sidebar.getAttribute("data-state")).toBe("docked");
		await page.context().close();
	});

	it("floats above raised layers in the content", async () => {
		const page = await open(browser, 1280);
		await page.evaluate(() => {
			const raised = document.createElement("div");
			raised.style.cssText =
				"position:sticky;top:0;z-index:999;height:200px;background:red";
			document.querySelector('[data-slot="app-shell-main"]')?.prepend(raised);
		});
		await trigger(page).click();
		await page.mouse.move(4, 160);
		await settled(page);
		expect(
			await page.evaluate(
				() =>
					document
						.elementFromPoint(200, 160)
						?.closest('[data-slot="app-shell-sidebar"]') !== null
			)
		).toBe(true);
		await page.context().close();
	});

	it("starts the product name where the item icons start", async () => {
		const page = await open(browser, 1280);
		const [avatar, icon] = await page.evaluate(() =>
			[
				'[data-slot="app-shell-sidebar-header"] [data-slot="avatar"]',
				'[data-slot="app-shell-item"] svg',
			].map((selector) =>
				Math.round(
					document.querySelector(selector)?.getBoundingClientRect().left ?? -1
				)
			)
		);
		expect(avatar).toBe(icon);
		await page.context().close();
	});

	it("keeps the floating sidebar while its account menu is open", async () => {
		const page = await open(browser, 1280);
		await trigger(page).click();
		const sidebar = page.locator('[data-slot="app-shell-sidebar"]');
		await page.mouse.move(4, 400);
		await settled(page);
		await page.getByRole("button", { name: ACCOUNT }).click();
		const signOut = page.getByRole("menuitem", { name: "Sign out" });
		await signOut.waitFor({ state: "visible" });
		await signOut.hover();
		expect(await sidebar.isVisible()).toBe(true);
		await page.context().close();
	});

	it("opens the navigation in a drawer on a narrow screen", async () => {
		const page = await open(browser, 390);
		expect(await page.locator('[data-slot="app-shell-sidebar"]').count()).toBe(
			0
		);
		const inset = await box(page, "app-shell-inset");
		expect([inset.left, inset.width]).toEqual([0, 390]);
		await trigger(page).click();
		const drawer = page.getByRole("dialog", { name: "Admin navigation" });
		await drawer.waitFor({ state: "visible" });
		await drawer.getByRole("link", { name: "Balances" }).click();
		await drawer.waitFor({ state: "hidden" });
		expect(
			await page.locator('[data-slot="app-shell-title"]').textContent()
		).toBe("Balances");
		await expect
			.poll(() => page.evaluate(() => document.activeElement?.textContent))
			.toBe("");
		await page.context().close();
	});

	it("skips to the content from the first Tab", async () => {
		const page = await open(browser, 1280, "dark");
		await page.keyboard.press(engine === webkit ? "Alt+Tab" : "Tab");
		const skip = page.getByRole("link", { name: "Skip to content" });
		await expect
			.poll(() => skip.evaluate((e) => e === document.activeElement))
			.toBe(true);
		await page.keyboard.press("Enter");
		await expect
			.poll(() =>
				page.evaluate(() => document.activeElement?.getAttribute("data-slot"))
			)
			.toBe("app-shell-main");
		await page.context().close();
	});
});

describe("AppShell docs", { timeout: 60_000 }, () => {
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

	it("shows the busy line and its status", async () => {
		const page = await browser.newPage({
			viewport: { height: 800, width: 1280 },
		});
		await page.goto(`${handle.url}/docs/examples/AppShellControlledExample`, {
			waitUntil: "networkidle",
		});
		expect(
			await page.getByRole("button", { name: "Show navigation" }).count()
		).toBe(1);
		await page.getByRole("button", { name: "Load" }).click();
		await expect
			.poll(() => page.getByRole("status").textContent())
			.toBe("Loading the page");
		expect(await page.getByRole("main").getAttribute("aria-busy")).toBe("true");
		await page.close();
	});

	it("frames the dashboard app with no app styles", async () => {
		const page = await browser.newPage({
			viewport: { height: 800, width: 1280 },
		});
		await page.goto(`${handle.url}/apps/dashboard/preview`, {
			waitUntil: "networkidle",
		});
		expect(await page.locator('[data-slot="app-shell"]').count()).toBe(1);
		expect(
			await page
				.getByRole("navigation", { name: "Main" })
				.locator('[aria-current="page"]')
				.textContent()
		).toBe("Home");
		await page.close();
	});
});
