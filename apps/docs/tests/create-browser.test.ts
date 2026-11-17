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
	DEFAULT_CHOICES,
	encodePreset,
} from "../../../packages/cli/src/theme/create";
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

const panel = (page: Page) =>
	page.getByRole("complementary", { name: "Theme" });
// A font field's menu trigger; its name holds the field and the font.
const picker = (page: Page, field: string) =>
	panel(page).getByRole("button", { name: new RegExp(`^${field}`, "u") });
// A size field's segment.
const segment = (page: Page, field: string, name: string) =>
	panel(page)
		.getByRole("group", { name: field })
		.getByRole("button", { exact: true, name });
const swatch = (page: Page, name: string) =>
	panel(page).getByRole("radio", { exact: true, name });

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
		const page = await open(browser, "m33ut", errors);
		expect(await swatch(page, "Blue").isChecked()).toBe(true);
		await page.goto(`${handle.url}/create?preset=nonsense`, {
			waitUntil: "networkidle",
		});
		await expect.poll(() => shownCode(page)).toBe("m0");
		expect(await swatch(page, "Wine").isChecked()).toBe(true);
		// The reader learns why, until they change the theme.
		const notice = panel(page).getByText("isn't a theme code");
		expect(await notice.isVisible()).toBe(true);
		await page.goto(`${handle.url}/create?preset=mzzzzzzz`, {
			waitUntil: "networkidle",
		});
		await expect
			.poll(() => panel(page).getByText("newer version").isVisible())
			.toBe(true);
		await swatch(page, "Blue").check({ force: true });
		await expect
			.poll(() => panel(page).getByText("newer version").count())
			.toBe(0);
		await page.close();
	});

	it("previews a hovered swatch, or a highlighted font, without choosing it", async () => {
		const page = await open(browser, "m33ut", errors);
		await swatch(page, "Orange").hover({ force: true });
		await expect
			.poll(async () => (await shown(page)).theme)
			.toContain("Orange accent");
		expect(addressCode(page)).toBe("m33ut");
		await page.mouse.move(400, 400);
		await expect.poll(() => shownCode(page)).toBe("m33ut");
		await picker(page, "Font").click();
		await page.getByRole("menuitemradio", { name: "Inter" }).hover();
		await page.keyboard.press("ArrowDown");
		await expect
			.poll(async () => (await shown(page)).theme)
			.toContain("IBM Plex Sans");
		await page.keyboard.press("Escape");
		await expect.poll(() => shownCode(page)).toBe("m33ut");
		expect(addressCode(page)).toBe("m33ut");
		await page.close();
	});

	it("lists sizes small to large and chooses with one click", async () => {
		const page = await open(browser, "m33ut", errors);
		// One read of the group. Playwright 1.65's Firefox crashes when it reads
		// aria-labelledby in two worlds (microsoft/playwright#43967, Mozilla bug
		// 2090055); return to per-button reads once a fixed Firefox ships.
		expect(
			await panel(page).getByRole("group", { name: "Radius" }).textContent()
		).toBe("NoneSmallDefaultLarge");
		await segment(page, "Radius", "Small").click();
		await expect.poll(() => addressCode(page)).not.toBe("m33ut");
		await expect
			.poll(async () => (await shown(page)).theme)
			.toContain("small radius");
		await page.close();
	});

	it("keeps locked fields through a shuffle, and undoes and redoes", async () => {
		const page = await open(browser, "m33ut", errors);
		await page
			.getByRole("button", { name: "Keep accent when shuffling" })
			.click();
		for (let round = 0; round < 5; round += 1) {
			// biome-ignore lint/performance/noAwaitInLoops: each shuffle starts from the last.
			await page.getByRole("button", { name: "Shuffle" }).click();
			expect(await swatch(page, "Blue").isChecked()).toBe(true);
		}
		await segment(page, "Radius", "None").click();
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
		const page = await open(browser, "m33ut", errors);
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

	it("starts an app, sets one up, or gives the theme file", async () => {
		const page = await open(browser, "m33ut", errors);
		await page.getByRole("button", { exact: true, name: "Get code" }).click();
		const dialog = page.getByRole("dialog");
		const shownPanel = dialog.getByRole("tabpanel");
		const choose = (name: string) =>
			shownPanel.getByText(name, { exact: true }).click();
		await expect
			.poll(() => shownPanel.textContent())
			.toContain(
				"npx create-next-app@latest my-app --yes\ncd my-app\nnpx @mizen-labs/cli@latest init --preset m33ut"
			);
		await choose("Vite");
		await choose("pnpm");
		await expect
			.poll(() => shownPanel.textContent())
			.toContain(
				"pnpm dlx create-vite@latest my-app --template react-ts\ncd my-app\npnpm install\npnpm dlx @mizen-labs/cli@latest init --preset m33ut"
			);
		await dialog.getByRole("tab", { name: "Existing project" }).click();
		await expect
			.poll(() => shownPanel.textContent())
			.toContain("pnpm dlx @mizen-labs/cli@latest init --preset m33ut");
		expect(await shownPanel.textContent()).not.toContain("create-");
		await dialog.getByRole("tab", { name: "CSS" }).click();
		await expect
			.poll(() => shownPanel.textContent())
			.toContain("--mizen-color-accent: oklch(0.48 0.18 255);");
		await page.close();
	});

	it("starts the preview in the site's theme", async () => {
		const page = await browser.newPage({
			viewport: { height: 900, width: 1280 },
		});
		page.on("pageerror", (error) => errors.push(error.message));
		await page.addInitScript(() => localStorage.setItem("mizen-theme", "dark"));
		await page.goto(`${handle.url}/create?preset=m33ut`, {
			waitUntil: "networkidle",
		});
		await expect.poll(async () => (await shown(page)).mode).toBe("dark");
		await page.getByRole("button", { name: "Light preview" }).click();
		await expect.poll(async () => (await shown(page)).mode).toBe("light");
		expect(
			await page.evaluate(() => document.documentElement.dataset.theme)
		).toBe("dark");
		await page.close();
	});

	it("ignores shortcut keys while focus is outside the page", async () => {
		const page = await open(browser, "m33ut", errors);
		await page.getByRole("link", { name: "Docs" }).first().focus();
		await page.keyboard.press("r");
		await page.keyboard.press("d");
		expect(addressCode(page)).toBe("m33ut");
		expect((await shown(page)).mode).toBe("light");
		await page.close();
	});

	it("ends each menu row with its selected dot", async () => {
		const page = await open(browser, "m33ut", errors);
		await picker(page, "Font").click();
		const chosen = page.getByRole("menuitemradio", { name: "Inter" });
		await expect.poll(() => chosen.isVisible()).toBe(true);
		const [row, dot] = await Promise.all([
			chosen.boundingBox(),
			chosen.locator(":scope > :last-child").boundingBox(),
		]);
		// The dot sits in the last quarter of the row, after the label.
		expect((dot?.x ?? 0) - (row?.x ?? 0)).toBeGreaterThan(
			(row?.width ?? 0) * 0.75
		);
		await page.close();
	});

	it("keeps the preview and the inspector in view on a phone", async () => {
		const page = await browser.newPage({
			hasTouch: true,
			viewport: { height: 844, width: 390 },
		});
		page.on("pageerror", (error) => errors.push(error.message));
		await page.goto(`${handle.url}/create?preset=m33ut`, {
			waitUntil: "networkidle",
		});
		// Nothing scrolls: the preview takes the room the panel leaves.
		const overflow = await page.evaluate(() => {
			const root = document.documentElement;
			return Math.max(
				root.scrollWidth - root.clientWidth,
				root.scrollHeight - root.clientHeight
			);
		});
		expect(overflow).toBeLessThanOrEqual(0);
		// The sections fold away until asked for.
		expect(await swatch(page, "Stone").isVisible()).toBe(false);
		await page.getByRole("button", { name: "Theme options" }).tap();
		await swatch(page, "Stone").tap({ force: true });
		await expect
			.poll(async () => (await shown(page)).theme)
			.toContain("Stone neutrals");
		await page.close();
	});

	it("squares pills with the corners and keeps circles round", async () => {
		const page = await open(
			browser,
			encodePreset({ ...DEFAULT_CHOICES, radius: "none" }),
			errors
		);
		await page.getByText("Components", { exact: true }).click();
		await expect
			.poll(async () => (await shown(page)).heading)
			.toBe("Components");
		const radii = () =>
			frame(page).evaluate(() =>
				Object.fromEntries(
					["switch", "switch-thumb", "progress-track", "avatar"].map((slot) => [
						slot,
						getComputedStyle(
							document.querySelector(`[data-slot="${slot}"]`) as Element
						).borderTopLeftRadius,
					])
				)
			);
		await expect.poll(radii).toMatchObject({
			"progress-track": "0px",
			switch: "0px",
			"switch-thumb": "0px",
		});
		expect((await radii()).avatar).not.toBe("0px");
		await page.close();
	});

	it("sets headings in their own font, and in the body's by default", async () => {
		const family = (target: Page) =>
			frame(target).evaluate(() => ({
				body: getComputedStyle(document.body).fontFamily,
				heading: getComputedStyle(document.querySelector("h1") as Element)
					.fontFamily,
			}));
		const plain = await open(browser, "m0", errors);
		const fonts = await family(plain);
		expect(fonts.heading).toBe(fonts.body);
		await plain.close();
		const page = await open(
			browser,
			encodePreset({ ...DEFAULT_CHOICES, font: "inter", heading: "fraunces" }),
			errors
		);
		await expect
			.poll(() => family(page))
			.toMatchObject({
				body: expect.stringContaining("Inter Variable"),
				heading: expect.stringContaining("Fraunces Variable"),
			});
		await picker(page, "Heading").click();
		// The fonts come in groups, each under its category.
		await expect
			.poll(() =>
				page.getByRole("menu").getByText("Serif", { exact: true }).count()
			)
			.toBe(1);
		await page.close();
	});

	it("fills the main buttons with the accent when asked", async () => {
		const page = await open(browser, "m33ut", errors);
		const fill = () =>
			frame(page).evaluate(() => {
				const style = getComputedStyle(document.documentElement);
				return {
					accent: style.getPropertyValue("--mizen-color-accent").trim(),
					primary: style.getPropertyValue("--mizen-color-primary").trim(),
				};
			});
		const before = await fill();
		expect(before.primary).not.toBe(before.accent);
		await segment(page, "Main buttons", "Accent").click();
		await expect
			.poll(async () => {
				const { accent, primary } = await fill();
				return primary === accent;
			})
			.toBe(true);
		await page.close();
	});

	it("previews at desktop, tablet, and phone widths", async () => {
		const page = await open(browser, "m33ut", errors);
		const width = () =>
			page
				.getByTitle("Theme preview")
				.evaluate((element) =>
					Math.round(element.getBoundingClientRect().width)
				);
		const desktop = await width();
		await page.getByRole("button", { name: "Phone" }).click();
		await expect.poll(width).toBe(390);
		await page.getByRole("button", { name: "Tablet" }).click();
		await expect.poll(width).toBe(Math.min(834, desktop));
		await page.getByRole("button", { name: "Desktop" }).click();
		await expect.poll(width).toBe(desktop);
		await page.close();
	});

	it("names the page and announces each new theme", async () => {
		const page = await open(browser, "m33ut", errors);
		expect(
			await page
				.getByRole("heading", { level: 1, name: "Create a theme" })
				.count()
		).toBe(1);
		const status = page.getByRole("status").filter({ hasText: "Theme m" });
		expect(await status.textContent()).toContain("Theme m33ut: Blue accent");
		await segment(page, "Radius", "None").click();
		await expect.poll(() => status.textContent()).toContain("none radius");
		await page.close();
	});
});
