import assert from "node:assert/strict";
import { test } from "node:test";
import {
	ACCENTS,
	DEFAULT_CHOICES,
	decodePreset,
	encodePreset,
	NEUTRALS,
	ORDER,
	presetCss,
	presetPackages,
} from "../dist/theme/create.js";

const R0 = /--mizen-[\w-]+:/u;
const R1 = /create\?preset=m0/u;
const R2 = /^m[0-9a-z]{1,6}$/u;
const R3 = /--mizen-color-accent: oklch\(0\.48 0\.18 255\);/u;
const R4 = /--mizen-color-accent: oklch\(0\.55 0\.18 255\);/u;
const R5 = /--mizen-color-workarea: oklch\(0\.965 0\.012 255\);/u;
const R6 = /--mizen-color-surface: oklch\(1 0 255\);/u;
const R7 = /--mizen-color-surface: oklch\(0\.17 0\.012 255\);/u;
const R8 = /--mizen-shape-control-radius: 0\.75rem;/u;
const R9 = /--mizen-control-size-md: 1\.75rem;/u;
const R10 = /@fontsource-variable\/inter/u;
const R11 = /font-family: "Inter Variable"/u;
const R12 = /shape|control-size/u;

const PILL = /--mizen-shape-pill-radius: (?<value>[^;]+);/u;
const every = (options) => Object.keys(options);

test("the default theme is m0 and writes no rules", () => {
	assert.equal(encodePreset(DEFAULT_CHOICES), "m0");
	assert.deepEqual(decodePreset("m0"), DEFAULT_CHOICES);
	const css = presetCss(DEFAULT_CHOICES);
	assert.doesNotMatch(css, R0);
	assert.match(css, R1);
});

test("every combination round-trips through its code", () => {
	// Every choice of every field, as one list of combinations.
	const combinations = Object.entries(ORDER).reduce(
		(all, [field, names]) =>
			all.flatMap((choices) =>
				names.map((name) => ({ ...choices, [field]: name }))
			),
		[{}]
	);
	assert.equal(combinations.length, 9 * 5 * 4 * 30 * 3 * 30 * 2);
	for (const choices of combinations) {
		const code = encodePreset(choices);
		assert.match(code, R2);
		assert.deepEqual(decodePreset(code), choices);
	}
});

test("fonts import their packages, and headings set their own family", () => {
	const choices = { ...DEFAULT_CHOICES, font: "inter", heading: "fraunces" };
	const css = presetCss(choices);
	assert.deepEqual(presetPackages(choices), [
		"@fontsource-variable/inter",
		"@fontsource-variable/fraunces",
	]);
	// @import comes first, before any rule.
	assert.ok(css.indexOf("@import") < css.indexOf("{"));
	assert.ok(css.includes('@import "@fontsource-variable/fraunces/wght.css";'));
	assert.ok(
		css.includes('--mizen-font-heading: "Fraunces Variable", Georgia, serif;')
	);
	assert.ok(
		css.includes('font-family: "Inter Variable", system-ui, sans-serif;')
	);
	// One package for a body and heading in the same family; none for System.
	assert.deepEqual(
		presetPackages({ ...DEFAULT_CHOICES, font: "lora", heading: "lora" }),
		["@fontsource-variable/lora"]
	);
	assert.deepEqual(
		presetPackages({ ...DEFAULT_CHOICES, font: "system", heading: "body" }),
		[]
	);
});

test("pills square off with the corners; circles keep no token", () => {
	const pill = (radius) =>
		PILL.exec(presetCss({ ...DEFAULT_CHOICES, radius }))?.groups.value;
	assert.equal(pill("none"), "0rem");
	assert.equal(pill("small"), "0.375rem");
	assert.equal(pill("default"), undefined);
	assert.equal(pill("large"), undefined);
});

test("a code this version cannot read decodes to nothing", () => {
	for (const code of ["", "m", "x1", "M0", "m-1", "mzzzzzzz", "m1f"]) {
		assert.equal(decodePreset(code), undefined, code);
	}
});

test("choices set the matching tokens in light and dark", () => {
	const css = presetCss({
		accent: "blue",
		density: "compact",
		font: "inter",
		heading: "body",
		neutral: "slate",
		primary: "ink",
		radius: "large",
	});
	const [light, dark] = css.split('[data-theme="dark"] {');
	assert.match(light, R3);
	assert.match(dark, R4);
	assert.match(light, R5);
	// White stays white in light; the dark surface takes the tint.
	assert.match(light, R6);
	assert.match(dark, R7);
	assert.match(light, R8);
	assert.match(light, R9);
	assert.match(css, R10);
	assert.match(css, R11);
	assert.doesNotMatch(dark, R12);
});

// Contrast from the CSS the theme writes, with its own color math, so the
// check does not trust the code it checks.
const OKLCH = /oklch\((?<l>[\d.]+) (?<c>[\d.]+) (?<h>[\d.]+)\)/u;
const DECLARATION = /--mizen-(?<name>[\w-]+): (?<value>[^;]+);/gu;

function luminance(color) {
	const { l, c, h } = OKLCH.exec(color).groups;
	const [L, C, H] = [Number(l), Number(c), (Number(h) * Math.PI) / 180];
	const a = C * Math.cos(H);
	const b = C * Math.sin(H);
	const lc = (L + 0.396_337_777_4 * a + 0.215_803_757_3 * b) ** 3;
	const mc = (L - 0.105_561_345_8 * a - 0.063_854_172_8 * b) ** 3;
	const sc = (L - 0.089_484_177_5 * a - 1.291_485_548 * b) ** 3;
	const clip = (value) => Math.min(1, Math.max(0, value));
	const r = clip(
		4.076_741_662_1 * lc - 3.307_711_591_3 * mc + 0.230_969_929_2 * sc
	);
	const g = clip(
		-1.268_438_004_6 * lc + 2.609_757_401_1 * mc - 0.341_319_396_5 * sc
	);
	const bl = clip(
		-0.004_196_086_3 * lc - 0.703_418_614_7 * mc + 1.707_614_701 * sc
	);
	return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
}

const ratio = (one, two) => {
	const [high, low] = [luminance(one), luminance(two)].sort((x, y) => y - x);
	return (high + 0.05) / (low + 0.05);
};

// Mizen's own values, where a theme leaves a token out.
const DEFAULTS = {
	dark: {
		"color-accent": "oklch(0.55 0.19 5)",
		"color-accent-content": "oklch(1 0 0)",
		"color-chart-series1": "oklch(0.64 0.22 300)",
		"color-chart-series2": "oklch(0.64 0.135 75)",
		"color-chart-series3": "oklch(0.63 0.22 352)",
		"color-chart-series4": "oklch(0.66 0.175 132)",
		"color-chart-series5": "oklch(0.64 0.195 255)",
		"color-chart-series6": "oklch(0.64 0.13 165)",
		"color-content": "oklch(0.94 0 0)",
		"color-muted-content": "oklch(0.74 0 0)",
		"color-primary": "oklch(0.94 0 0)",
		"color-primary-content": "oklch(0.17 0 0)",
		"color-surface": "oklch(0.17 0 0)",
		"color-workarea": "oklch(0.205 0 0)",
	},
	light: {
		"color-accent": "oklch(0.48 0.19 3)",
		"color-accent-content": "oklch(1 0 0)",
		"color-chart-series1": "oklch(0.66 0.21 300)",
		"color-chart-series2": "oklch(0.64 0.135 75)",
		"color-chart-series3": "oklch(0.66 0.22 352)",
		"color-chart-series4": "oklch(0.625 0.175 132)",
		"color-chart-series5": "oklch(0.64 0.19 255)",
		"color-chart-series6": "oklch(0.62 0.13 165)",
		"color-content": "oklch(0.2046 0 0)",
		"color-muted-content": "oklch(0.47 0 0)",
		"color-primary": "oklch(0.2046 0 0)",
		"color-primary-content": "oklch(1 0 0)",
		"color-surface": "oklch(1 0 0)",
		"color-workarea": "oklch(0.965 0 0)",
	},
};

const VAR = /^var\(--mizen-(?<name>[\w-]+)\)$/u;

function tokens(css) {
	const [light, dark = ""] = css.split('[data-theme="dark"] {');
	const read = (block, base) => ({
		...base,
		...Object.fromEntries(
			[...block.matchAll(DECLARATION)].map(({ groups }) => [
				groups.name,
				groups.value,
			])
		),
	});
	return {
		dark: resolved(read(dark, DEFAULTS.dark)),
		light: resolved(read(light, DEFAULTS.light)),
	};
}

// var(--mizen-x) takes the value of x from the same theme.
function resolved(theme) {
	return Object.fromEntries(
		Object.entries(theme).map(([name, value]) => [
			name,
			theme[VAR.exec(value)?.groups.name] ?? value,
		])
	);
}

// Text 4.5:1; focus rings and switch tracks 3:1 against what they sit on.
const PAIRS = [
	["color-accent-content", "color-accent", 4.5],
	["color-primary-content", "color-primary", 4.5],
	["color-brand-foreground", "color-brand-background", 4.5],
	["color-content", "color-workarea", 4.5],
	["color-muted-content", "color-workarea", 4.5],
	["color-muted-content", "color-surface", 4.5],
	["color-focus-ring", "color-workarea", 3],
	["color-focus-ring", "color-surface", 3],
	["color-switch-track-checked", "color-surface", 3],
];

test("the color math agrees with known contrast", () => {
	assert.equal(ratio("oklch(1 0 0)", "oklch(0 0 0)").toFixed(1), "21.0");
});

test("every accent, neutral, and button fill reads in light and dark", () => {
	const themes = every(ACCENTS).flatMap((accent) =>
		every(NEUTRALS).flatMap((neutral) =>
			["ink", "accent"].map((primary) => ({ accent, neutral, primary }))
		)
	);
	const failures = themes.flatMap((choices) => {
		const theme = tokens(presetCss({ ...DEFAULT_CHOICES, ...choices }));
		const name = Object.values(choices).join("/");
		return ["light", "dark"].flatMap((mode) =>
			PAIRS.filter(([fore, back, minimum]) => {
				const [one, two] = [theme[mode][fore], theme[mode][back]];
				return one && two && ratio(one, two) < minimum;
			}).map(([fore, back]) => `${name} ${mode} ${fore} on ${back}`)
		);
	});
	assert.deepEqual(failures, []);
});

// Mizen's chart palette sits near 3:1 on its own workarea; a neutral tone
// must not lower that.
test("neutral tones keep chart lines as clear as Mizen's default", () => {
	const SERIES = [1, 2, 3, 4, 5, 6].map((n) => `color-chart-series${n}`);
	const clarity = (theme, mode) =>
		SERIES.map((name) =>
			ratio(theme[mode][name], theme[mode]["color-workarea"])
		);
	const base = tokens(presetCss(DEFAULT_CHOICES));
	const failures = every(NEUTRALS).flatMap((neutral) => {
		const theme = tokens(presetCss({ ...DEFAULT_CHOICES, neutral }));
		return ["light", "dark"].flatMap((mode) => {
			const before = clarity(base, mode);
			return clarity(theme, mode)
				.map((value, index) => [value, before[index], SERIES[index]])
				.filter(([value, was]) => value < was - 0.02)
				.map(([, , name]) => `${neutral} ${mode} ${name}`);
		});
	});
	assert.deepEqual(failures, []);
});
