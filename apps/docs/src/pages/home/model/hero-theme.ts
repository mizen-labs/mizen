import { colors } from "@mizen-labs/ui/colors.stylex";
import { controlSize } from "@mizen-labs/ui/dimensions.stylex";
import { shape } from "@mizen-labs/ui/shape.stylex";
import {
	ACCENTS,
	DEFAULT_CHOICES,
	DENSITIES,
	encodePreset,
	presetCss,
	RADII,
	type ThemeChoices,
} from "../../../../../../packages/cli/src/theme/create";

export type FilmTheme = Pick<ThemeChoices, "accent" | "density" | "radius">;

// The film changes one field per beat, in this order, through these themes.
// It ends where it began, so the loop has no reset.
export const FILM_THEMES: readonly FilmTheme[] = [
	{ accent: "wine", density: "default", radius: "default" },
	{ accent: "blue", density: "compact", radius: "large" },
	{ accent: "green", density: "comfortable", radius: "none" },
];

export const FILM_FIELDS = ["accent", "radius", "density"] as const;
export type FilmField = (typeof FILM_FIELDS)[number];

export const FILM_OPTIONS = {
	accent: [
		["wine", "Wine", "oklch(0.48 0.19 3)"],
		["blue", "Blue", "oklch(0.48 0.18 255)"],
		["green", "Green", "oklch(0.48 0.15 150)"],
	],
	density: [
		["compact", "Compact"],
		["default", "Default"],
		["comfortable", "Roomy"],
	],
	radius: [
		["none", "None"],
		["default", "Default"],
		["large", "Large"],
	],
} as const;

const VAR = /^var\((?<name>--[\w-]+)\)$/u;
const UPPER = /[A-Z]/gu;
const COMMENT = /\/\*[\s\S]*?\*\//gu;
const IMPORT = /^@import [^\n]*\n/gmu;
const BODY = /:root body \{[^}]*\}/u;
const kebab = (key: string) =>
	key.replace(UPPER, (letter) => `-${letter.toLowerCase()}`);

// The docs compile Mizen's tokens to their own variables, each set once at
// the root from its --mizen-* value. Setting them again on the film makes
// the components inside read the film's --mizen-* values.
const GROUPS: [string, unknown][] = [
	["color", colors],
	["shape", shape],
	["control-size", controlSize],
];
const REBIND = GROUPS.flatMap(([group, tokens]) =>
	Object.entries(tokens as Record<string, unknown>).map(([key, value]) => {
		const name = VAR.exec(String(value))?.groups?.name;
		return name ? `\t${name}: var(--mizen-${group}-${kebab(key)});` : "";
	})
)
	.filter(Boolean)
	.join("\n");

// The theme a Create code writes, scoped to the film, with the accent on
// the main buttons so every change shows.
export function filmTheme(theme: FilmTheme) {
	const choices: ThemeChoices = {
		...DEFAULT_CHOICES,
		...theme,
		primary: "accent",
	};
	const css = presetCss(choices)
		.replace(COMMENT, "")
		.replace(IMPORT, "")
		.replace(BODY, "")
		.replace(":root {", "[data-film-theme] {")
		.replace(
			'[data-theme="dark"] {',
			'[data-theme="dark"] [data-film-theme] {'
		);
	return {
		code: encodePreset(choices),
		css: `${css}\n[data-film-theme] {\n${REBIND}\n}\n`,
	};
}

// The lines of mizen-theme.css each field writes, as the film shows them.
export function fileLines(theme: FilmTheme): [FilmField, string, string][] {
	const { chroma, hue } = ACCENTS[theme.accent];
	return [
		["accent", "--mizen-color-accent", `oklch(48% ${chroma} ${hue})`],
		[
			"radius",
			"--mizen-shape-control-radius",
			`${0.5 * RADII[theme.radius].factor}rem`,
		],
		[
			"density",
			"--mizen-control-size-md",
			`${DENSITIES[theme.density].sizes[2]}rem`,
		],
	];
}
