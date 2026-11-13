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

interface Watch {
	layers: string[];
	scroll: number;
	widths: number[];
}
// Records, on every frame, the size of the tooltip while it is visible and
// how much scrolling the chart and its ancestors gained since the start.
function watchTooltip(selector: string) {
	const chain: Element[] = [];
	for (
		let element = document.querySelector(selector);
		element;
		element = element.parentElement
	) {
		chain.push(element);
	}
	const size = (element: Element) =>
		Math.max(
			element.scrollWidth - element.clientWidth,
			element.scrollHeight - element.clientHeight
		);
	const start = chain.map(size);
	const seen: Watch = { layers: [], scroll: 0, widths: [] };
	const read = () => {
		const tooltip = document.querySelector('[data-slot="chart-tooltip"]');
		if (tooltip && getComputedStyle(tooltip).visibility === "visible") {
			seen.widths.push(Math.round(tooltip.getBoundingClientRect().width));
			seen.layers.push(
				tooltip.closest("[popover]")?.matches(":popover-open")
					? "top layer"
					: "in page"
			);
		}
		seen.scroll = Math.max(
			seen.scroll,
			...chain.map((element, index) => size(element) - (start[index] ?? 0))
		);
		requestAnimationFrame(read);
	};
	requestAnimationFrame(read);
	Object.assign(window, { tooltipWatch: seen });
}

const readWatch = () =>
	page.evaluate(
		() => (window as unknown as { tooltipWatch: Watch }).tooltipWatch
	);

// Moves the pointer from outside the chart to a point inside it in one step,
// as a pointer does when it crosses the edge.
async function enter(slug: string, selector: string, x: number, y: number) {
	await page.goto(`${handle.url}/components/${slug}`, {
		waitUntil: "networkidle",
	});
	const chart = page.locator(`main ${selector}`).first();
	await chart.scrollIntoViewIfNeeded();
	const box = await chart.boundingBox();
	if (!box) {
		throw new Error(`No chart on the ${slug} page`);
	}
	await page.mouse.move(box.x + box.width / 2, box.y - 60);
	await page.evaluate(watchTooltip, `main ${selector}`);
	await page.mouse.move(box.x + box.width * x, box.y + box.height * y);
	await page.waitForTimeout(400);
	return readWatch();
}

describe("Chart tooltip at the edge of a chart", { timeout: 30_000 }, () => {
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

	it.each([
		["time-series", 0.985, 0.5],
		["area-chart", 0.985, 0.8],
		["category-comparison", 0.985, 0.12],
		["heatmap", 0.985, 0.5],
		["area-chart", 0.03, 0.5],
	])(
		"shows the %s tooltip at its full size from the first frame",
		async (slug, x, y) => {
			const seen = await enter(slug, '[data-slot="chart-frame"]', x, y);
			expect(seen.widths.length).toBeGreaterThan(0);
			// One width in every visible frame: it never shows squeezed and growing.
			expect(new Set(seen.widths).size).toBe(1);
			expect(seen.widths[0]).toBeGreaterThan(100);
			expect(new Set(seen.layers)).toEqual(new Set(["top layer"]));
			expect(seen.scroll).toBe(0);
		}
	);

	it.each([
		["progress-rings", '[data-slot="progress-rings"]'],
		["sankey-chart", '[data-slot="sankey-chart"]'],
		["radial-bars", '[data-slot="radial-bars"]'],
	])(
		"adds no scrolling while a %s tooltip follows the pointer",
		async (slug, selector) => {
			await page.goto(`${handle.url}/components/${slug}`, {
				waitUntil: "networkidle",
			});
			const chart = page.locator(`main ${selector}`).first();
			await chart.scrollIntoViewIfNeeded();
			const box = await chart.boundingBox();
			if (!box) {
				throw new Error(`No chart on the ${slug} page`);
			}
			await page.mouse.move(2, 2);
			await page.evaluate(watchTooltip, `main ${selector}`);
			for (const y of [0.1, 0.5, 0.92]) {
				for (const x of [0.04, 0.3, 0.6, 0.96]) {
					// biome-ignore lint/performance/noAwaitInLoops: The pointer visits the points one after another.
					await page.mouse.move(box.x + box.width * x, box.y + box.height * y);
					await page.waitForTimeout(50);
				}
			}
			const seen = await readWatch();
			expect(seen.widths.length).toBeGreaterThan(0);
			expect(new Set(seen.layers)).toEqual(new Set(["top layer"]));
			expect(seen.scroll).toBe(0);
		}
	);
});
