import {
	ACCENTS,
	DEFAULT_CHOICES,
	DENSITIES,
	decodePreset,
	FONTS,
	NEUTRALS,
	ORDER,
	RADII,
	type ThemeChoices,
} from "../../../../../../packages/cli/src/theme/create";
export type Field = keyof ThemeChoices;
export type PreviewView = "app" | "components";

export const FIELDS: readonly Field[] = [
	"accent",
	"neutral",
	"radius",
	"font",
	"density",
];

export const FIELD_LABELS: Record<Field, string> = {
	accent: "Accent",
	density: "Density",
	font: "Font",
	neutral: "Neutral tone",
	radius: "Radius",
};

const TABLES = {
	accent: ACCENTS,
	density: DENSITIES,
	font: FONTS,
	neutral: NEUTRALS,
	radius: RADII,
};

export function optionLabel(field: Field, name: string): string {
	return (
		(TABLES[field] as Record<string, { label: string }>)[name]?.label ?? name
	);
}

// A swatch color for an accent or a neutral, in the light theme.
export function swatch(field: "accent" | "neutral", name: string): string {
	if (field === "accent") {
		const { chroma, hue } = ACCENTS[name as keyof typeof ACCENTS];
		return chroma === 0 ? "oklch(0.2046 0 0)" : `oklch(0.48 ${chroma} ${hue})`;
	}
	const { chroma, hue } = NEUTRALS[name as keyof typeof NEUTRALS];
	return `oklch(0.62 ${chroma * 4} ${hue})`;
}

// The order a menu lists each field's options: sizes from small to large.
// The code keeps ORDER, so old codes keep their meaning.
export const MENU_ORDER: { [F in Field]: readonly ThemeChoices[F][] } = {
	...ORDER,
	density: ["compact", "default", "comfortable"],
	radius: ["none", "small", "default", "large"],
};

// The font a sample renders in; the app font is the page's own.
export function fontFamily(name: string): string {
	return FONTS[name as keyof typeof FONTS]?.family ?? "inherit";
}

export function radiusFactor(name: string): number {
	return RADII[name as keyof typeof RADII]?.factor ?? 1;
}

// The medium control height in rem, which the density glyph spaces by.
export function densitySize(name: string): number {
	return DENSITIES[name as keyof typeof DENSITIES]?.sizes[2] ?? 2;
}

export function choicesFrom(code: string | undefined): ThemeChoices {
	return (code && decodePreset(code)) || DEFAULT_CHOICES;
}

// A random pick for every field the reader has not locked. Accents and
// neutrals weigh the default lower, so a shuffle usually shows a change.
export function randomize(
	current: ThemeChoices,
	locked: ReadonlySet<Field>,
	random: () => number = Math.random
): ThemeChoices {
	const next = { ...current } as Record<Field, string>;
	for (const field of FIELDS) {
		if (!locked.has(field)) {
			const names = ORDER[field] as readonly string[];
			next[field] = names[Math.floor(random() * names.length)] ?? names[0];
		}
	}
	return next as unknown as ThemeChoices;
}

// The message the Create page sends its preview frame.
export interface PreviewMessage {
	dark: boolean;
	preset: string;
	type: "mizen-create";
	view: PreviewView;
}

export function isPreviewMessage(data: unknown): data is PreviewMessage {
	return (
		typeof data === "object" &&
		data !== null &&
		(data as { type?: unknown }).type === "mizen-create"
	);
}

// A package manager and the command that runs a package without installing it.
export const PACKAGE_MANAGERS = [
	["npm", "npx"],
	["pnpm", "pnpm dlx"],
	["yarn", "yarn dlx"],
	["bun", "bunx"],
] as const;
export type PackageManager = (typeof PACKAGE_MANAGERS)[number][0];

// The apps init sets up, and the scaffolder that starts each one. Vite's
// template leaves the install to the reader; init needs React installed.
export const FRAMEWORKS = [
	["next", "Next.js", "create-next-app@latest my-app --yes", false],
	["vite", "Vite", "create-vite@latest my-app --template react-ts", true],
	["start", "TanStack Start", "@tanstack/cli@latest create my-app", false],
] as const;
export type Framework = (typeof FRAMEWORKS)[number][0];

const runnerOf = (manager: PackageManager) =>
	PACKAGE_MANAGERS.find(([name]) => name === manager)?.[1] ?? "npx";

export function initCommand(manager: PackageManager, code: string): string {
	return `${runnerOf(manager)} @mizen-labs/cli@latest init --preset ${code}`;
}

// The commands that start an app and set it up with the theme.
export function newProjectCommands(
	manager: PackageManager,
	framework: Framework,
	code: string
): string {
	const [, , create, install] =
		FRAMEWORKS.find(([name]) => name === framework) ?? FRAMEWORKS[0];
	return [
		`${runnerOf(manager)} ${create}`,
		"cd my-app",
		...(install ? [`${manager} install`] : []),
		initCommand(manager, code),
	].join("\n");
}
