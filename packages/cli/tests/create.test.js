import assert from "node:assert/strict";
import { test } from "node:test";
import {
	ACCENTS,
	DEFAULT_CHOICES,
	DENSITIES,
	decodePreset,
	encodePreset,
	FONTS,
	NEUTRALS,
	presetCss,
	RADII,
} from "../dist/theme/create.js";

const R0 = /--mizen-[\w-]+:/u;
const R1 = /create\?preset=m0/u;
const R2 = /^m[0-9a-z]{1,5}$/u;
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

const every = (options) => Object.keys(options);

test("the default theme is m0 and writes no rules", () => {
	assert.equal(encodePreset(DEFAULT_CHOICES), "m0");
	assert.deepEqual(decodePreset("m0"), DEFAULT_CHOICES);
	const css = presetCss(DEFAULT_CHOICES);
	assert.doesNotMatch(css, R0);
	assert.match(css, R1);
});

test("every combination round-trips through its code", () => {
	for (const accent of every(ACCENTS)) {
		for (const neutral of every(NEUTRALS)) {
			for (const radius of every(RADII)) {
				for (const font of every(FONTS)) {
					for (const density of every(DENSITIES)) {
						const choices = { accent, density, font, neutral, radius };
						const code = encodePreset(choices);
						assert.match(code, R2);
						assert.deepEqual(decodePreset(code), choices);
					}
				}
			}
		}
	}
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
		neutral: "slate",
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
