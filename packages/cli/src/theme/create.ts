// Mizen Create: theme choices, their short preset code, and the theme file
// they produce. Pure, so the CLI and the docs Create page share it.
//
// A choice only sets --mizen-* variables, the body font, and the font
// packages the theme imports. Components never change. Index 0 of every option is Mizen's default, so code "m0" is the
// default theme.

export interface ThemeChoices {
	accent: AccentName;
	density: DensityName;
	font: FontName;
	heading: HeadingName;
	neutral: NeutralName;
	primary: PrimaryName;
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

// Google Fonts as @fontsource-variable packages: the theme file imports
// them, and init installs them, so the app serves its own font files.
const FONT_CATALOG = [
	["geist", "Geist", "sans"],
	["inter", "Inter", "sans"],
	["ibm-plex-sans", "IBM Plex Sans", "sans"],
	["manrope", "Manrope", "sans"],
	["dm-sans", "DM Sans", "sans"],
	["figtree", "Figtree", "sans"],
	["plus-jakarta-sans", "Plus Jakarta Sans", "sans"],
	["outfit", "Outfit", "sans"],
	["public-sans", "Public Sans", "sans"],
	["noto-sans", "Noto Sans", "sans"],
	["nunito-sans", "Nunito Sans", "sans"],
	["space-grotesk", "Space Grotesk", "sans"],
	["work-sans", "Work Sans", "sans"],
	["onest", "Onest", "sans"],
	["instrument-sans", "Instrument Sans", "sans"],
	["sora", "Sora", "sans"],
	["lexend", "Lexend", "sans"],
	["lora", "Lora", "serif"],
	["source-serif-4", "Source Serif 4", "serif"],
	["playfair-display", "Playfair Display", "serif"],
	["fraunces", "Fraunces", "serif"],
	["newsreader", "Newsreader", "serif"],
	["eb-garamond", "EB Garamond", "serif"],
	["literata", "Literata", "serif"],
	["jetbrains-mono", "JetBrains Mono", "mono"],
	["geist-mono", "Geist Mono", "mono"],
	["roboto-mono", "Roboto Mono", "mono"],
	["fira-code", "Fira Code", "mono"],
] as const;

export type FontCategory = "mono" | "sans" | "serif";
type CatalogFont = (typeof FONT_CATALOG)[number][0];
export type FontName = "default" | "system" | CatalogFont;
export type HeadingName = "body" | "system" | CatalogFont;

export interface FontInfo {
	category: FontCategory | null;
	family: string | null;
	label: string;
	package: string | null;
}

const FALLBACKS: Record<FontCategory, string> = {
	mono: "ui-monospace, monospace",
	sans: "system-ui, sans-serif",
	serif: "Georgia, serif",
};

const CATALOG_FONTS = Object.fromEntries(
	FONT_CATALOG.map(([name, label, category]): [CatalogFont, FontInfo] => [
		name,
		{
			category,
			family: `"${label} Variable", ${FALLBACKS[category]}`,
			label,
			package: `@fontsource-variable/${name}`,
		},
	])
) as Record<CatalogFont, FontInfo>;

const SYSTEM_FONT: FontInfo = {
	category: "sans",
	family: FALLBACKS.sans,
	label: "System",
	package: null,
};

// "default" keeps the app's font; a heading of "body" keeps the body's.
export const FONTS: Record<FontName, FontInfo> = {
	...CATALOG_FONTS,
	default: { category: null, family: null, label: "App font", package: null },
	system: SYSTEM_FONT,
};

export const HEADINGS: Record<HeadingName, FontInfo> = {
	...CATALOG_FONTS,
	body: { category: null, family: null, label: "Same as body", package: null },
	system: SYSTEM_FONT,
};

const CATALOG_NAMES = FONT_CATALOG.map(([name]) => name);

// Control heights in rem, xs to xl.
export const DENSITIES = {
	comfortable: { label: "Comfortable", sizes: [1.75, 2, 2.25, 2.75, 3] },
	compact: { label: "Compact", sizes: [1.5, 1.625, 1.75, 2.25, 2.5] },
	default: { label: "Default", sizes: [1.5, 1.75, 2, 2.5, 2.75] },
} as const;

export type AccentName = keyof typeof ACCENTS;
export type NeutralName = keyof typeof NEUTRALS;
export type RadiusName = keyof typeof RADII;
export type DensityName = keyof typeof DENSITIES;

// What fills the main action: ink, as Mizen does, or the accent, as Vivid does.
export const PRIMARIES = {
	accent: { label: "Accent" },
	ink: { label: "Ink" },
} as const;
export type PrimaryName = keyof typeof PRIMARIES;

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
	font: ["default", "system", ...CATALOG_NAMES],
	heading: ["body", "system", ...CATALOG_NAMES],
	neutral: ["neutral", "stone", "slate", "zinc", "olive"],
	primary: ["ink", "accent"],
	radius: ["default", "none", "small", "large"],
} as const satisfies { [Field in keyof ThemeChoices]: ThemeChoices[Field][] };

// Each field and its width in bits, from the low bits of the code.
const FIELDS = [
	["accent", 5],
	["neutral", 4],
	["radius", 3],
	["font", 5],
	["density", 3],
	["heading", 5],
	["primary", 1],
] as const;

const PREFIX = "m";
const TRAILING_LINES = /\n+$/u;
const CODE = /^m[0-9a-z]+$/u;

export const DEFAULT_CHOICES: ThemeChoices = {
	accent: "wine",
	density: "default",
	font: "default",
	heading: "body",
	neutral: "neutral",
	primary: "ink",
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

// WCAG relative luminance of an OKLCH color, clipped to sRGB.
function luminance(l: number, c: number, h: number): number {
	const a = c * Math.cos((h * Math.PI) / 180);
	const b = c * Math.sin((h * Math.PI) / 180);
	const lms = [
		(l + 0.396_337_777_4 * a + 0.215_803_757_3 * b) ** 3,
		(l - 0.105_561_345_8 * a - 0.063_854_172_8 * b) ** 3,
		(l - 0.089_484_177_5 * a - 1.291_485_548 * b) ** 3,
	] as const;
	const [lc, mc, sc] = lms;
	const rgb = [
		4.076_741_662_1 * lc - 3.307_711_591_3 * mc + 0.230_969_929_2 * sc,
		-1.268_438_004_6 * lc + 2.609_757_401_1 * mc - 0.341_319_396_5 * sc,
		-0.004_196_086_3 * lc - 0.703_418_614_7 * mc + 1.707_614_701 * sc,
	].map((channel) => Math.min(1, Math.max(0, channel)));
	const [r = 0, g = 0, bl = 0] = rgb;
	return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
}

// White text on an accent clears 4.5:1 with a margin for gamut mapping.
const WHITE_TEXT = 4.6;

// The accent's lightness: the design value, darkened in steps until white
// text on it reads. A hue that is light at a given lightness, such as teal,
// gets a deeper fill; the rest keep the design value.
function readableLightness(start: number, chroma: number, hue: number) {
	let lightness = start;
	while (1.05 / (luminance(lightness, chroma, hue) + 0.05) < WHITE_TEXT) {
		lightness -= 0.005;
	}
	return round(lightness);
}

function accentRules({ chroma, hue }: { chroma: number; hue: number }): Rule[] {
	if (chroma === 0) {
		return INK_RULES;
	}
	const accent = oklch(readableLightness(0.48, chroma, hue), chroma, hue);
	const accentDark = oklch(readableLightness(0.55, chroma, hue), chroma, hue);
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

// Pills square off with the corners; Default and Large keep them round.
const PILL_RADII: Partial<Record<RadiusName, string>> = {
	none: "0rem",
	small: "0.375rem",
};

const SIZE_NAMES = ["xs", "sm", "md", "lg", "xl"] as const;

function declarations(rules: readonly [string, string][]) {
	return rules.map(([name, value]) => `\t--mizen-${name}: ${value};`);
}

const PRIMARY_TOKENS = new Set(["color-primary", "color-primary-content"]);
const PRIMARY_RULES: Rule[] = [
	["color-primary", "var(--mizen-color-accent)", "var(--mizen-color-accent)"],
	[
		"color-primary-content",
		"var(--mizen-color-accent-content)",
		"var(--mizen-color-accent-content)",
	],
];

function themeRules(choices: ThemeChoices) {
	const filled = choices.primary === "accent";
	// The accent then fills the main action in both themes, so the neutral
	// tone leaves primary alone.
	const colors = [
		...(choices.accent === "wine" ? [] : accentRules(ACCENTS[choices.accent])),
		...neutralRules(NEUTRALS[choices.neutral]).filter(
			([name]) => !(filled && PRIMARY_TOKENS.has(name))
		),
		...(filled ? PRIMARY_RULES : []),
	];
	const { factor } = RADII[choices.radius];
	const pill = PILL_RADII[choices.radius];
	const radius = [
		...(factor === 1
			? []
			: RADIUS_TOKENS.map(([name, rem]): [string, string] => [
					`shape-${name}`,
					`${round(rem * factor)}rem`,
				])),
		...(pill ? [["shape-pill-radius", pill] as [string, string]] : []),
	];
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
	const { family } = FONTS[choices.font];
	const heading = HEADINGS[choices.heading].family;
	const light = [
		...declarations(colors.map(([name, value]) => [name, value])),
		...declarations(radius),
		...declarations(sizes),
		...declarations(heading ? [["font-heading", heading]] : []),
	];
	const dark = declarations(colors.map(([name, , value]) => [name, value]));
	const packages = presetPackages(choices);
	// @import comes before every other rule.
	const imports = packages.length
		? [
				"/* init installs these fonts. Copying this file? Install them too. */",
				...packages.map((name) => `@import "${name}/wght.css";`),
				"",
			]
		: [];
	// :root body outranks an app's own body rule or font class, which load
	// later; delete the rule to keep the app's font.
	const body = family
		? [
				"/* The body font. It outranks the app's own; delete this rule to keep yours. */",
				...block(":root body", [`\tfont-family: ${family};`]),
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
		...imports,
		...block(":root", light),
		...block('[data-theme="dark"]', dark),
		...body,
	]
		.join("\n")
		.replace(TRAILING_LINES, "\n");
}

// The font packages the theme imports, for init to install.
export function presetPackages(choices: ThemeChoices): string[] {
	const names = [
		FONTS[choices.font].package,
		HEADINGS[choices.heading].package,
	];
	return [...new Set(names.filter((name): name is string => name !== null))];
}

export function describe(choices: ThemeChoices): string {
	const heading = HEADINGS[choices.heading];
	return [
		`${ACCENTS[choices.accent].label} accent`,
		`${NEUTRALS[choices.neutral].label} neutrals`,
		`${RADII[choices.radius].label.toLowerCase()} radius`,
		`${FONTS[choices.font].label}`,
		...(heading.family ? [`${heading.label} headings`] : []),
		...(choices.primary === "accent" ? ["accent buttons"] : []),
		`${DENSITIES[choices.density].label.toLowerCase()} density`,
	].join(", ");
}
