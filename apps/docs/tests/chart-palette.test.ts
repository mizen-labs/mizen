import { readFileSync } from "node:fs";
import { describe, expect, it } from "vite-plus/test";

// The categorical chart palette, as the token sources declare it: each series
// reads at 3:1 on the workarea, and neighbors stay apart (OKLab ΔE ≥ 13.5)
// for readers with protanopia or deuteranopia.
const styles = new URL("../../../packages/ui/src/styles/", import.meta.url);
const SERIES = /chartSeries\d: "(?<color>oklch\([^"]+\))"/gu;
const WORKAREA = /\tworkarea: "(?<color>oklch\([^"]+\))"/u;
const OKLCH = /oklch\((?<l>[\d.]+) (?<c>[\d.]+) (?<h>[\d.]+)\)/u;

type Rgb = [number, number, number];

function palette(file: string) {
	const source = readFileSync(new URL(file, styles), "utf8");
	return {
		series: [...source.matchAll(SERIES)].map(
			(match) => match.groups?.color ?? ""
		),
		workarea: WORKAREA.exec(source)?.groups?.color ?? "",
	};
}

const clip = (value: number) => Math.min(1, Math.max(0, value));

// Linear sRGB, clipped to the gamut.
function linear(color: string): Rgb {
	const { c = "0", h = "0", l = "0" } = OKLCH.exec(color)?.groups ?? {};
	const hue = (Number(h) * Math.PI) / 180;
	const a = Number(c) * Math.cos(hue);
	const b = Number(c) * Math.sin(hue);
	const L = Number(l);
	const lc = (L + 0.396_337_777_4 * a + 0.215_803_757_3 * b) ** 3;
	const mc = (L - 0.105_561_345_8 * a - 0.063_854_172_8 * b) ** 3;
	const sc = (L - 0.089_484_177_5 * a - 1.291_485_548 * b) ** 3;
	return [
		clip(4.076_741_662_1 * lc - 3.307_711_591_3 * mc + 0.230_969_929_2 * sc),
		clip(-1.268_438_004_6 * lc + 2.609_757_401_1 * mc - 0.341_319_396_5 * sc),
		clip(-0.004_196_086_3 * lc - 0.703_418_614_7 * mc + 1.707_614_701 * sc),
	];
}

const luminance = ([r, g, b]: Rgb) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

function contrast(one: Rgb, two: Rgb) {
	const [high, low] = [luminance(one), luminance(two)].sort((x, y) => y - x);
	return ((high ?? 0) + 0.05) / ((low ?? 0) + 0.05);
}

// Machado, Oliveira and Fernandes (2009), full severity, on linear sRGB.
const VISION: Record<string, Rgb[]> = {
	deuteranopia: [
		[0.367_322, 0.860_646, -0.227_968],
		[0.280_085, 0.672_501, 0.047_413],
		[-0.011_82, 0.042_94, 0.968_881],
	],
	protanopia: [
		[0.152_286, 1.052_583, -0.204_868],
		[0.114_503, 0.786_281, 0.099_216],
		[-0.003_882, -0.048_116, 1.051_998],
	],
};

const seen = (rgb: Rgb, matrix: Rgb[]) =>
	matrix.map(([r, g, b]) => clip(r * rgb[0] + g * rgb[1] + b * rgb[2])) as Rgb;

function oklab([r, g, b]: Rgb): Rgb {
	const l = Math.cbrt(
		0.412_221_470_8 * r + 0.536_332_536_3 * g + 0.051_445_992_9 * b
	);
	const m = Math.cbrt(
		0.211_903_498_2 * r + 0.680_699_545_1 * g + 0.107_396_956_6 * b
	);
	const s = Math.cbrt(
		0.088_302_461_9 * r + 0.281_718_837_6 * g + 0.629_978_700_5 * b
	);
	return [
		0.210_454_255_3 * l + 0.793_617_785 * m - 0.004_072_046_8 * s,
		1.977_998_495_1 * l - 2.428_592_205 * m + 0.450_593_709_9 * s,
		0.025_904_037_1 * l + 0.782_771_766_2 * m - 0.808_675_766 * s,
	];
}

const distance = (one: Rgb, two: Rgb) => {
	const [p, q] = [oklab(one), oklab(two)];
	return 100 * Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
};

describe.each([
	["light", "colors.stylex.ts"],
	["dark", "themes.ts"],
])("the %s chart palette", (_, file) => {
	const { series, workarea } = palette(file);

	it("has six series and a workarea", () => {
		expect(series).toHaveLength(6);
		expect(workarea).not.toBe("");
	});

	it("reads at 3:1 on the workarea", () => {
		const back = linear(workarea);
		for (const color of series) {
			expect(contrast(linear(color), back), color).toBeGreaterThanOrEqual(3);
		}
	});

	it.each(Object.keys(VISION))("keeps neighbors apart with %s", (vision) => {
		const shown = series.map((color) =>
			seen(linear(color), VISION[vision] ?? [])
		);
		for (const [index, color] of shown.slice(1).entries()) {
			const before = shown[index] ?? color;
			expect(
				distance(before, color),
				`${series[index]} beside ${series[index + 1]}`
			).toBeGreaterThanOrEqual(13.5);
		}
	});
});
