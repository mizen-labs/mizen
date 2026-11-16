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

// The Create page: the code in the address, the preview frame it drives, and
// the commands it gives.
const THEME_CODE = /Mizen theme (?<code>\w+)/u;
const PRESET = /preset=(?<code>\w+)/u;
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

function frame(page: Page) {
	const found = page.frames().find((x) => x.url().includes("/create/preview"));
	if (!found) {
		throw new Error("The preview frame is missing");
	}
	return found;
}

// What the preview shows: the theme code it applies, light or dark, and the
// page heading.
function shown(page: Page) {
	return frame(page).evaluate(() => {
		const theme = [...document.querySelectorAll("style")].find((style) =>
			style.textContent?.includes("Mizen theme")
		);
		return {
			heading: document.querySelector("h1")?.textContent ?? "",
			mode: document.documentElement.dataset.theme,
			theme: theme?.textContent ?? "",
		};
	});
}

const shownCode = async (page: Page) =>
	THEME_CODE.exec((await shown(page)).theme)?.groups?.code;
const addressCode = (page: Page) => PRESET.exec(page.url())?.groups?.code;

async function open(browser: Browser, preset: string, errors: string[]) {
	const page = await browser.newPage({
		viewport: { height: 900, width: 1280 },
	});
	page.on("pageerror", (error) => errors.push(error.message));
	await page.goto(`${handle.url}/create?preset=${preset}`, {
		waitUntil: "networkidle",
	});
	await expect.poll(() => shownCode(page)).toBe(preset);
	return page;
}

afterAll(async () => {
	await teardownTestServer(handle);
}, 120_000);

describe.each([
	["chromium", chromium],
	["webkit", webkit],
	["firefox", firefox],
] as const)("Create in %s", { timeout: 60_000 }, (_, engine) => {
	let browser: Browser;
	const errors: string[] = [];

	beforeAll(async () => {
		handle ??= await setupTestServer(docsRoot);
		browser = await launch(engine);
	}, 120_000);

	afterAll(async () => {
		await browser?.close();
		expect(errors).toEqual([]);
	});

	it("reads the code from the address and falls back to the default", async () => {
		const page = await open(browser, "m1m4l", errors);
		expect(await page.getByRole("radio", { name: "Blue" }).isChecked()).toBe(
			true
		);
		await page.goto(`${handle.url}/create?preset=nonsense`, {
			waitUntil: "networkidle",
		});
		await expect.poll(() => shownCode(page)).toBe("m0");
		expect(await page.getByRole("radio", { name: "Wine" }).isChecked()).toBe(
			true
		);
		await page.close();
	});

	it("previews a hovered option without choosing it", async () => {
		const page = await open(browser, "m1m4l", errors);
		await page.getByRole("radio", { name: "Orange" }).hover();
		await expect
			.poll(async () => (await shown(page)).theme)
			.toContain("Orange accent");
		expect(addressCode(page)).toBe("m1m4l");
		await page.mouse.move(900, 20);
		await expect.poll(() => shownCode(page)).toBe("m1m4l");
		await page.close();
	});

	it("keeps locked fields through a shuffle, and undoes and redoes", async () => {
		const page = await open(browser, "m1m4l", errors);
		await page
			.getByRole("button", { name: "Keep accent when shuffling" })
			.click();
		for (let round = 0; round < 5; round += 1) {
			// biome-ignore lint/performance/noAwaitInLoops: each shuffle starts from the last.
			await page.getByRole("button", { name: "Shuffle" }).click();
			expect(await page.getByRole("radio", { name: "Blue" }).isChecked()).toBe(
				true
			);
		}
		await page.getByText("None", { exact: true }).click();
		const chosen = addressCode(page);
		await expect.poll(() => shownCode(page)).toBe(chosen);
		await page.keyboard.press("ControlOrMeta+z");
		await expect.poll(() => addressCode(page)).not.toBe(chosen);
		await page.keyboard.press("ControlOrMeta+Shift+z");
		await expect.poll(() => addressCode(page)).toBe(chosen);
		await expect.poll(() => shownCode(page)).toBe(chosen);
		await page.close();
	});

	it("switches the preview to dark and to components", async () => {
		const page = await open(browser, "m1m4l", errors);
		expect(await shown(page)).toMatchObject({ heading: "Home", mode: "light" });
		await page.getByText("Components", { exact: true }).click();
		await page.keyboard.press("d");
		await expect
			.poll(async () => {
				const { heading, mode } = await shown(page);
				return { heading, mode };
			})
			.toEqual({ heading: "Components", mode: "dark" });
		// The page around the preview keeps its own theme.
		expect(
			await page.evaluate(() => document.documentElement.dataset.theme)
		).toBe("light");
		await page.close();
	});

	it("gives the init command and the theme file", async () => {
		const page = await open(browser, "m1m4l", errors);
		await page.getByRole("button", { name: "Get code" }).click();
		const dialog = page.getByRole("dialog");
		await expect
			.poll(() => dialog.textContent())
			.toContain("npx @mizen-labs/cli@latest init --preset m1m4l");
		await dialog.getByText("pnpm", { exact: true }).click();
		await expect
			.poll(() => dialog.textContent())
			.toContain("pnpm dlx @mizen-labs/cli@latest init --preset m1m4l");
		await dialog.getByRole("tab", { name: "CSS" }).click();
		await expect
			.poll(() => dialog.textContent())
			.toContain("--mizen-color-accent: oklch(0.48 0.18 255);");
		await page.close();
	});
});
