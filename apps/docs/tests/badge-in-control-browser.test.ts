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
let page: Page;

// Every badge in an example, measured against the control that holds it.
function measure(title: string) {
	return page
		.locator(`section[aria-label$=": ${title} example"] [data-slot="badge"]`)
		.evaluateAll((badges) =>
			badges.map((badge) => {
				const control = badge.parentElement as HTMLElement;
				const inner = badge.getBoundingClientRect();
				const outer = control.getBoundingClientRect();
				const style = getComputedStyle(badge);
				const round = (value: number) => Math.round(value * 2) / 2;
				return {
					above: round(inner.top - outer.top),
					after: round(outer.right - inner.right),
					below: round(outer.bottom - inner.bottom),
					control: round(outer.height),
					fill: style.backgroundColor,
					height: round(inner.height),
					ink: style.color,
					label: getComputedStyle(control).color,
					width: round(inner.width),
				};
			})
		);
}

const open = (slug: string) =>
	page.goto(`${handle.url}/components/${slug}`, { waitUntil: "networkidle" });

describe("Badge inside a control", { timeout: 30_000 }, () => {
	beforeAll(async () => {
		handle = await setupTestServer(docsRoot);
		browser = await chromium.launch({
			executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH,
			headless: true,
		});
		page = await browser.newPage({ viewport: { height: 900, width: 1280 } });
	}, 120_000);

	afterAll(async () => {
		await browser?.close();
		await teardownTestServer(handle);
	});

	it("fits every button size without changing the button's height", async () => {
		await open("button");
		const badges = await measure("With a count");
		const sizes = badges.slice(0, 5);
		expect(sizes.map((badge) => [badge.control, badge.height])).toEqual([
			[24, 16],
			[28, 18],
			[32, 20],
			[40, 22],
			[44, 24],
		]);
		for (const badge of badges) {
			// Concentric: the same space above, below, and after the badge.
			expect([badge.below, badge.after]).toEqual([badge.above, badge.above]);
			// One digit makes a circle; more digits make a pill.
			expect(badge.width).toBeGreaterThanOrEqual(badge.height);
		}
	});

	it("gives a neutral badge the control's text color and a tint of it", async () => {
		await open("button");
		const [, , , , , primary, , , status] = await measure("With a count");
		expect(primary?.ink).toBe(primary?.label);
		expect(primary?.fill).toContain("/ 0.14");
		// A status badge keeps its own colors.
		expect(status?.ink).not.toBe(status?.label);
		expect(status?.fill).not.toContain("/ 0.14");
	});

	it.each([
		["tabs", [24, 28, 36]],
		["segmented-control", [24, 28, 36]],
	] as const)(
		"fits every size of %s and shows on an unselected item",
		async (slug, heights) => {
			await open(slug);
			const badges = await measure("With counts");
			const fits = { 24: 16, 28: 18, 36: 20 } as const;
			for (const height of heights) {
				const row = badges.filter((badge) => badge.control === height);
				expect(row.length).toBeGreaterThanOrEqual(2);
				for (const badge of row) {
					expect(badge.height).toBe(fits[height]);
					expect([badge.below, badge.after]).toEqual([
						badge.above,
						badge.above,
					]);
				}
				// The unselected item has muted text, and its badge a tint of it.
				const [selected, unselected] = row;
				expect(unselected?.ink).toBe(unselected?.label);
				expect(unselected?.ink).not.toBe(selected?.ink);
				expect(unselected?.fill).toContain("/ 0.14");
			}
		}
	);

	it("leaves a badge that stands alone as it was", async () => {
		await open("badge");
		const sizes = await page
			.locator('section[aria-label$=": Sizes example"] [data-slot="badge"]')
			.evaluateAll((badges) =>
				badges.map((badge) => {
					const style = getComputedStyle(badge);
					return [
						badge.getBoundingClientRect().height,
						style.marginTop,
						style.fontVariantNumeric,
						style.backgroundColor.includes("/"),
					];
				})
			);
		expect(sizes.map(([height]) => height).sort()).toEqual([20, 22, 24]);
		for (const [, margin, numeric, tinted] of sizes) {
			expect([margin, numeric, tinted]).toEqual(["0px", "normal", false]);
		}
	});
});
