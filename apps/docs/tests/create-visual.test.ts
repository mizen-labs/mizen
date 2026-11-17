import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import pixelmatch from "pixelmatch";
import { type Browser, chromium } from "playwright";
import { PNG } from "pngjs";
import { afterAll, beforeAll, describe, expect, it } from "vite-plus/test";
import {
	DEFAULT_CHOICES,
	encodePreset,
	type ThemeChoices,
} from "../../../packages/cli/src/theme/create";

// What a few Create themes look like, against committed baselines. The
// browser runs in the Playwright image (pnpm test:visual), so fonts and
// rasterizing match on every machine. MIZEN_VISUAL_UPDATE=1 rewrites them.
const endpoint = process.env.MIZEN_VISUAL_WS;
const origin =
	process.env.MIZEN_VISUAL_URL ?? "http://host.docker.internal:3211";
const update = process.env.MIZEN_VISUAL_UPDATE === "1";
const baselines = new URL("__screenshots__/create-visual/", import.meta.url);
// Antialiasing may move a few pixels; a real change moves many more.
const ALLOWED = 0.001;

const THEMES: [string, Partial<ThemeChoices>, "app" | "components", boolean][] =
	[
		["default-components", {}, "components", false],
		[
			"blue-slate-large-components",
			{ accent: "blue", density: "compact", neutral: "slate", radius: "large" },
			"components",
			false,
		],
		[
			"violet-serif-square-dark",
			{
				accent: "violet",
				font: "inter",
				heading: "fraunces",
				primary: "accent",
				radius: "none",
			},
			"components",
			true,
		],
		["green-stone-app", { accent: "green", neutral: "stone" }, "app", false],
	];

let browser: Browser;

// The server starts with the container; wait for it to listen.
async function connect(deadline: number): Promise<Browser> {
	try {
		return await chromium.connect(endpoint ?? "", { timeout: 5000 });
	} catch (error) {
		if (Date.now() > deadline) {
			throw error;
		}
		await new Promise((resolve) => setTimeout(resolve, 1000));
		return connect(deadline);
	}
}

function compare(name: string, actual: Buffer) {
	const file = new URL(`${name}.png`, baselines);
	if (update || !existsSync(file)) {
		mkdirSync(baselines, { recursive: true });
		writeFileSync(file, actual);
		return update ? 0 : Number.POSITIVE_INFINITY;
	}
	const [want, got] = [
		PNG.sync.read(readFileSync(file)),
		PNG.sync.read(actual),
	];
	if (want.width !== got.width || want.height !== got.height) {
		return Number.POSITIVE_INFINITY;
	}
	const diff = new PNG({ height: want.height, width: want.width });
	const changed = pixelmatch(
		want.data,
		got.data,
		diff.data,
		want.width,
		want.height,
		{
			threshold: 0.1,
		}
	);
	const share = changed / (want.width * want.height);
	if (share > ALLOWED) {
		writeFileSync(join(tmpdir(), `${name}-diff.png`), PNG.sync.write(diff));
	}
	return share;
}

describe.skipIf(!endpoint)(
	"Create themes look as they did",
	{ timeout: 60_000 },
	() => {
		beforeAll(async () => {
			browser = await connect(Date.now() + 90_000);
		}, 120_000);

		afterAll(async () => {
			await browser?.close();
		});

		it.each(THEMES)("%s", async (name, choices, view, dark) => {
			const page = await browser.newPage({
				reducedMotion: "reduce",
				viewport: { height: 900, width: 1280 },
			});
			await page.clock.setFixedTime(new Date("2026-11-18T12:00:00Z"));
			const preset = encodePreset({ ...DEFAULT_CHOICES, ...choices });
			await page.goto(
				`${origin}/create/preview?preset=${preset}&view=${view}&dark=${dark}`,
				{ waitUntil: "networkidle" }
			);
			// A blocked or broken page must never become a baseline.
			await page
				.locator("h1")
				.first()
				.waitFor({ state: "visible", timeout: 15_000 });
			await page.evaluate(() => document.fonts.ready);
			const share = compare(name, await page.screenshot());
			await page.close();
			expect(
				share,
				`${name} changed; see ${join(tmpdir(), `${name}-diff.png`)}, or run with MIZEN_VISUAL_UPDATE=1`
			).toBeLessThanOrEqual(ALLOWED);
		});
	}
);
