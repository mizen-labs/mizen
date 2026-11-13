import { execFile } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
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
	setupTestServer,
	type TestServerHandle,
	teardownTestServer,
} from "./test-helper";

const execute = promisify(execFile);
const docsRoot = new URL("..", import.meta.url).pathname.replace(/\/$/u, "");
const browserTypes: readonly [string, BrowserType][] = [
	["Chromium", chromium],
	["Firefox", firefox],
	["WebKit", webkit],
];
const TWENTIETH = /-20$/u;
let handle: TestServerHandle;

// Opens the first date picker with its field at the bottom of the window, so
// the calendar has no room below and opens upward. Base UI then positions the
// bare popup absolutely, which is where its width once collapsed.
async function openUpward(page: Page) {
	await page.goto(`${handle.url}/components/date-picker`, {
		waitUntil: "networkidle",
	});
	const trigger = page
		.locator('main button[aria-haspopup="dialog"]:visible')
		.first();
	await trigger.evaluate((element) => {
		const { bottom } = element.getBoundingClientRect();
		window.scrollBy(0, bottom - window.innerHeight + 24);
	});
	await trigger.click();
	const popup = page.locator('[data-slot="popover-popup"][data-open]');
	await popup.waitFor({ state: "visible" });
	// The width collapsed only after the opening transition and the frames
	// Base UI takes to finish it, about 400ms in all.
	await page.waitForTimeout(1000);
	return { popup, trigger };
}

async function verifyBarePopup(page: Page) {
	const { popup, trigger } = await openUpward(page);
	const [field, calendar] = await Promise.all([
		trigger.boundingBox(),
		popup.boundingBox(),
	]);
	// It opened upward, and it has the full width of a calendar: squeezed, it
	// was 246px in Chromium and 0px in Firefox and WebKit.
	expect((calendar?.y ?? 0) + (calendar?.height ?? 0)).toBeLessThanOrEqual(
		field?.y ?? 0
	);
	expect(calendar?.width).toBeGreaterThan(260);
	expect(calendar?.width).toBeLessThan(300);
	// A day can be picked, so nothing else lies over the calendar.
	await popup.getByText("20", { exact: true }).click();
	await expectLocator(
		page.locator('main [data-slot="input-group-input"]').first()
	).toHaveValue(TWENTIETH);
}

async function verifyTextPopup(page: Page) {
	await page.goto(`${handle.url}/components/popover`, {
		waitUntil: "networkidle",
	});
	await page
		.getByRole("button", { exact: true, name: "About the shared bank" })
		.click();
	const popup = page.locator('[data-slot="popover-popup"][data-open]');
	await popup.waitFor({ state: "visible" });
	await expect.poll(async () => (await popup.boundingBox())?.width).toBe(288);
}

describe("Popover width in every browser engine", () => {
	beforeAll(async () => {
		handle = await setupTestServer(docsRoot);
	}, 120_000);

	afterAll(async () => {
		await teardownTestServer(handle);
	}, 120_000);

	it.each(browserTypes)(
		"%s sizes a bare popup to its calendar and wraps a text popup",
		async (_name, browserType) => {
			// Isolate Firefox app data from macOS 27's protected personal profile.
			// https://github.com/microsoft/playwright/issues/42768
			const env =
				process.platform === "darwin" && browserType === firefox
					? {
							...process.env,
							CFFIXED_USER_HOME: await mkdtemp(
								join(tmpdir(), "mizen-firefox-data-")
							),
						}
					: undefined;
			let browser: Browser | undefined;
			try {
				browser = await browserType.launch({ env, headless: true });
				const page = await browser.newPage({
					viewport: { height: 800, width: 1280 },
				});
				await verifyBarePopup(page);
				await verifyTextPopup(page);
			} finally {
				await browser?.close();
				// macOS adds a deny-delete ACL to this disposable Library folder.
				if (env) {
					await execute("chmod", ["-RN", env.CFFIXED_USER_HOME]);
					await rm(env.CFFIXED_USER_HOME, { force: true, recursive: true });
				}
			}
		},
		120_000
	);
});
