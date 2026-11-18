import { colors } from "@mizen-labs/ui/colors.stylex";
import { shape } from "@mizen-labs/ui/shape.stylex";
import {
	DEFAULT_CHOICES,
	encodePreset,
	presetCss,
	type ThemeChoices,
} from "../../../../../../packages/cli/src/theme/create";

export const HERO_ACCENTS = [
	["wine", "Wine", "oklch(0.48 0.19 3)"],
	["blue", "Blue", "oklch(0.48 0.18 255)"],
	["green", "Green", "oklch(0.48 0.15 150)"],
	["violet", "Violet", "oklch(0.48 0.2 300)"],
	["orange", "Orange", "oklch(0.48 0.16 48)"],
] as const;

export const HERO_RADII = [
	["none", "None"],
	["small", "Small"],
	["default", "Default"],
	["large", "Large"],
] as const;

export type HeroAccent = (typeof HERO_ACCENTS)[number][0];
export type HeroRadius = (typeof HERO_RADII)[number][0];

const VAR = /^var\((?<name>--[\w-]+)\)$/u;
const kebab = (key: string) =>
	key.replace(/[A-Z]/gu, (c) => `-${c.toLowerCase()}`);

// The docs compile Mizen's tokens to their own variables, each set once at
// the root from its --mizen-* value. Setting them again here makes the
// components inside read this element's --mizen-* values.
const GROUPS: [string, unknown][] = [
	["color", colors],
	["shape", shape],
];
const REBIND = GROUPS.flatMap(([group, tokens]) =>
	Object.entries(tokens as Record<string, unknown>).map(([key, value]) => {
		const name = VAR.exec(String(value))?.groups?.name;
		return name ? `\t${name}: var(--mizen-${group}-${kebab(key)});` : "";
	})
)
	.filter(Boolean)
	.join("\n");

const COMMENT = /\/\*[\s\S]*?\*\//gu;
const IMPORT = /^@import [^\n]*\n/gmu;
const BODY = /:root body \{[^}]*\}/u;

// The theme a Create code writes, scoped to one element: the hero changes,
// the page around it keeps Mizen's own theme.
export function heroTheme(accent: HeroAccent, radius: HeroRadius) {
	const choices: ThemeChoices = {
		...DEFAULT_CHOICES,
		accent,
		primary: "accent",
		radius,
	};
	const css = presetCss(choices)
		.replace(COMMENT, "")
		.replace(IMPORT, "")
		.replace(BODY, "")
		.replace(":root {", "[data-hero-theme] {")
		.replace(
			'[data-theme="dark"] {',
			'[data-theme="dark"] [data-hero-theme] {'
		);
	return {
		code: encodePreset(choices),
		css: `${css}\n[data-hero-theme] {\n${REBIND}\n}\n`,
	};
}
