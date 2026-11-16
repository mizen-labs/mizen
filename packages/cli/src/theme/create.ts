// Mizen Create: theme choices, their short preset code, and the theme file
// they produce. Pure, so the CLI and the docs Create page share it.
//
// A choice only sets --mizen-* variables (and the body font). Components never
// change. Index 0 of every option is Mizen's default, so code "m0" is the
// default theme.

export interface ThemeChoices {
	accent: AccentName;
	density: DensityName;
	font: FontName;
	neutral: NeutralName;
	radius: RadiusName;
}

// Hue in OKLCH degrees; chroma 0 makes an ink accent.
export const ACCENTS = {
	blue: { chroma: 0.18, hue: 255, label: "Blue" },
	green: { chroma: 0.15, hue: 150, label: "Green" },
	indigo: { chroma: 0.19, hue: 275, label: "Indigo" },
	ink: { chroma: 0, hue: 0, label: "Ink" },
	orange: { chroma: 0.16, hue: 48, label: "Orange" },
	rose: { chroma: 0.19, hue: 18, label: "Rose" },
	teal: { chroma: 0.12, hue: 190, label: "Teal" },
	violet: { chroma: 0.2, hue: 300, label: "Violet" },
	wine: { chroma: 0.19, hue: 3, label: "Wine" },
} as const;

// A tint the neutral greys take: chroma at full strength, hue in degrees.
export const NEUTRALS = {
	neutral: { chroma: 0, hue: 0, label: "Neutral" },
	olive: { chroma: 0.009, hue: 120, label: "Olive" },
	slate: { chroma: 0.012, hue: 255, label: "Slate" },
	stone: { chroma: 0.008, hue: 70, label: "Stone" },
	zinc: { chroma: 0.006, hue: 285, label: "Zinc" },
} as const;

// A factor on every radius token.
export const RADII = {
	default: { factor: 1, label: "Default" },
	large: { factor: 1.5, label: "Large" },
	none: { factor: 0, label: "None" },
	small: { factor: 0.5, label: "Small" },
} as const;

// The app loads the font; the theme file names the package that holds it.
export const FONTS = {
	default: { family: null, label: "App font", package: null },
	geist: {
		family: '"Geist Variable", system-ui, sans-serif',
		label: "Geist",
		package: "@fontsource-variable/geist",
	},
	"ibm-plex-sans": {
		family: '"IBM Plex Sans Variable", system-ui, sans-serif',
		label: "IBM Plex Sans",
		package: "@fontsource-variable/ibm-plex-sans",
	},
	inter: {
		family: '"Inter Variable", system-ui, sans-serif',
		label: "Inter",
		package: "@fontsource-variable/inter",
	},
	manrope: {
		family: '"Manrope Variable", system-ui, sans-serif',
		label: "Manrope",
		package: "@fontsource-variable/manrope",
	},
	system: {
		family: "system-ui, sans-serif",
		label: "System",
		package: null,
	},
} as const;

// Control heights in rem, xs to xl.
export const DENSITIES = {
	comfortable: { label: "Comfortable", sizes: [1.75, 2, 2.25, 2.75, 3] },
	compact: { label: "Compact", sizes: [1.5, 1.625, 1.75, 2.25, 2.5] },
	default: { label: "Default", sizes: [1.5, 1.75, 2, 2.5, 2.75] },
} as const;

export type AccentName = keyof typeof ACCENTS;
export type NeutralName = keyof typeof NEUTRALS;
export type RadiusName = keyof typeof RADII;
export type FontName = keyof typeof FONTS;
export type DensityName = keyof typeof DENSITIES;

// The order each option takes in the code and in the Create page. Index 0
// is Mizen's default. Add a name only at the end of a list, and a field only
// at the end of FIELDS, so old codes keep their meaning.
export const ORDER = {
	accent: [
		"wine",
		"rose",
		"orange",
		"green",
		"teal",
		"blue",
		"indigo",
		"violet",
		"ink",
	],
	density: ["default", "compact", "comfortable"],
	font: ["default", "geist", "inter", "ibm-plex-sans", "manrope", "system"],
	neutral: ["neutral", "stone", "slate", "zinc", "olive"],
	radius: ["default", "none", "small", "large"],
} as const satisfies { [Field in keyof ThemeChoices]: ThemeChoices[Field][] };

// Each field and its width in bits, from the low bits of the code.
const FIELDS = [
	["accent", 5],
	["neutral", 4],
	["radius", 3],
	["font", 4],
	["density", 3],
] as const;

const PREFIX = "m";
const TRAILING_LINES = /\n+$/u;
const CODE = /^m[0-9a-z]+$/u;

export const DEFAULT_CHOICES: ThemeChoices = {
	accent: "wine",
	density: "default",
	font: "default",
	neutral: "neutral",
	radius: "default",
};

export function encodePreset(choices: ThemeChoices): string {
	let value = 0;
	let shift = 0;
	for (const [field, bits] of FIELDS) {
		const index = (ORDER[field] as readonly string[]).indexOf(choices[field]);
		value += Math.max(index, 0) * 2 ** shift;
		shift += bits;
	}
	return `${PREFIX}${value.toString(36)}`;
}

export function isPresetCode(code: string): boolean {
	return CODE.test(code);
}

// Undefined for a code this version cannot read, such as one with an index
// past the end of an option list.
export function decodePreset(code: string): ThemeChoices | undefined {
	if (!isPresetCode(code)) {
		return;
	}
	let value = Number.parseInt(code.slice(PREFIX.length), 36);
	const choices: Record<string, string> = {};
	for (const [field, bits] of FIELDS) {
		const size = 2 ** bits;
		const name = ORDER[field][value % size];
		if (name === undefined) {
			return;
		}
		choices[field] = name;
		value = Math.floor(value / size);
	}
	return value === 0 ? (choices as unknown as ThemeChoices) : undefined;
}

const round = (value: number) => Number(value.toFixed(4));
const oklch = (l: number, c: number, h: number) =>
	`oklch(${round(l)} ${round(c)} ${round(h)})`;

// The default theme's neutral lightness, light and dark, per color token.
const NEUTRAL_TOKENS: readonly [string, number, number][] = [
	["content", 0.2046, 0.94],
	["control-border", 0.89, 0.28],
	["control-border-strong", 0.62, 0.55],
	["control-surface", 0.94, 0.235],
	["control-surface-disabled", 0.965, 0.205],
	["control-surface-hover", 0.92, 0.265],
	["floating-highlight", 0.94, 0.31],
	["muted-content", 0.47, 0.74],
	["secondary", 0.95, 0.25],
	["secondary-content", 0.2046, 0.94],
	["selected", 0.92, 0.29],
	["workarea", 0.965, 0.205],
	["workarea-control-surface", 0.94, 0.235],
	["primary", 0.2046, 0.94],
	["primary-content", 1, 0.17],
	["surface", 1, 0.17],
	["floating-surface", 1, 0.235],
	["outline-surface", 1, 0.215],
];

type Rule = [name: string, light: string, dark: string];

function neutralRules({ chroma, hue }: { chroma: number; hue: number }) {
	if (chroma === 0) {
		return [];
	}
	// Pure white stays white; every other grey takes the tint.
	return NEUTRAL_TOKENS.map(
		([name, light, dark]): Rule => [
			`color-${name}`,
			oklch(light, light >= 1 ? 0 : chroma, hue),
			oklch(dark, chroma, hue),
		]
	);
}

// An ink accent is the text color: near black on light, near white on dark,
// with the surface color on it.
const INK_RULES: Rule[] = [
	["color-accent", oklch(0.2046, 0, 0), oklch(0.94, 0, 0)],
	["color-accent-content", oklch(1, 0, 0), oklch(0.17, 0, 0)],
	["color-focus-ring", oklch(0.2046, 0, 0), oklch(0.94, 0, 0)],
	["color-switch-track-checked", oklch(0.2046, 0, 0), oklch(0.94, 0, 0)],
	["color-brand-foreground", oklch(0.2046, 0, 0), oklch(0.94, 0, 0)],
	["color-brand-background", oklch(0.95, 0, 0), oklch(0.25, 0, 0)],
];

function accentRules({ chroma, hue }: { chroma: number; hue: number }): Rule[] {
	if (chroma === 0) {
		return INK_RULES;
	}
	const accent = oklch(0.48, chroma, hue);
	const accentDark = oklch(0.55, chroma, hue);
	return [
		["color-accent", accent, accentDark],
		["color-focus-ring", accent, oklch(0.72, chroma * 0.7, hue)],
		["color-switch-track-checked", accent, accentDark],
		["color-brand-foreground", accent, oklch(0.9, chroma * 0.3, hue)],
		[
			"color-brand-background",
			oklch(0.96, chroma * 0.18, hue),
			oklch(0.235, chroma * 0.24, hue),
		],
	];
}

const RADIUS_TOKENS: readonly [string, number][] = [
	["checkbox-radius", 0.25],
	["control-radius", 0.5],
	["control-radius-large", 0.625],
	["control-radius-small", 0.375],
	["floating-radius", 0.75],
	["inline-radius", 0.375],
	["surface-radius", 1],
	["surface-radius-large", 1.25],
];

const SIZE_NAMES = ["xs", "sm", "md", "lg", "xl"] as const;

function declarations(rules: readonly [string, string][]) {
	return rules.map(([name, value]) => `\t--mizen-${name}: ${value};`);
}

function themeRules(choices: ThemeChoices) {
	const colors = [
		...(choices.accent === "wine" ? [] : accentRules(ACCENTS[choices.accent])),
		...neutralRules(NEUTRALS[choices.neutral]),
	];
	const { factor } = RADII[choices.radius];
	const radius =
		factor === 1
			? []
			: RADIUS_TOKENS.map(([name, rem]): [string, string] => [
					`shape-${name}`,
					`${round(rem * factor)}rem`,
				]);
	const sizes =
		choices.density === "default"
			? []
			: DENSITIES[choices.density].sizes.map((rem, index): [string, string] => [
					`control-size-${SIZE_NAMES[index]}`,
					`${rem}rem`,
				]);
	return { colors, radius, sizes };
}

function block(selector: string, lines: string[]) {
	return lines.length ? [`${selector} {`, ...lines, "}", ""] : [];
}

// The theme file for the choices: commented, with a light :root block and a
// dark [data-theme="dark"] block. The default theme is a file with no rules.
export function presetCss(choices: ThemeChoices): string {
	const code = encodePreset(choices);
	const { colors, radius, sizes } = themeRules(choices);
	const font = FONTS[choices.font];
	const light = [
		...declarations(colors.map(([name, value]) => [name, value])),
		...declarations(radius),
		...declarations(sizes),
	];
	const dark = declarations(colors.map(([name, , value]) => [name, value]));
	const fontLines = font.family
		? [
				...(font.package
					? [
							`/* The font: install ${font.package} and import it at the app root. */`,
						]
					: []),
				...block("body", [`\tfont-family: ${font.family};`]),
			]
		: [];
	return [
		"/*",
		` * Mizen theme ${code}: ${describe(choices)}.`,
		" * This file is yours. Change a value, or set any other --mizen-* variable",
		' * here. A rule in [data-theme="dark"] applies to the dark theme only.',
		` * Remake it at https://ui.mizen-labs.dev/create?preset=${code}`,
		" */",
		"",
		...block(":root", light),
		...block('[data-theme="dark"]', dark),
		...fontLines,
	]
		.join("\n")
		.replace(TRAILING_LINES, "\n");
}

export function describe(choices: ThemeChoices): string {
	return [
		`${ACCENTS[choices.accent].label} accent`,
		`${NEUTRALS[choices.neutral].label} neutrals`,
		`${RADII[choices.radius].label.toLowerCase()} radius`,
		`${FONTS[choices.font].label}`,
		`${DENSITIES[choices.density].label.toLowerCase()} density`,
	].join(", ");
}
