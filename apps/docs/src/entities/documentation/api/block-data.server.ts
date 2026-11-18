import { blocksIn, getBlock, getBlockCategory } from "../model/blocks";
import appShell1 from "../ui/blocks/app-shell-1/app.tsx?raw";
import appShell2 from "../ui/blocks/app-shell-2/app.tsx?raw";
import dashboard1App from "../ui/blocks/dashboard-1/app.tsx?raw";
import dashboard1Shell from "../ui/blocks/dashboard-1/app-shell.tsx?raw";
import dashboard1Data from "../ui/blocks/dashboard-1/data.ts?raw";
import dashboard1Home from "../ui/blocks/dashboard-1/home.tsx?raw";
import dashboard2 from "../ui/blocks/dashboard-2/app.tsx?raw";
import settings1 from "../ui/blocks/settings-1/app.tsx?raw";
import settings2 from "../ui/blocks/settings-2/app.tsx?raw";

export interface BlockFile {
	code: string;
	path: string;
}

// Each block's files in reading order, at the paths they take in an app.
const files: Record<string, BlockFile[]> = {
	"app-shell-1": [{ code: appShell1, path: "src/app.tsx" }],
	"app-shell-2": [{ code: appShell2, path: "src/app.tsx" }],
	"dashboard-1": [
		{ code: dashboard1App, path: "src/app.tsx" },
		{ code: dashboard1Home, path: "src/home.tsx" },
		{ code: dashboard1Shell, path: "src/app-shell.tsx" },
		{ code: dashboard1Data, path: "src/data.ts" },
	],
	"dashboard-2": [{ code: dashboard2, path: "src/app.tsx" }],
	"settings-1": [{ code: settings1, path: "src/app.tsx" }],
	"settings-2": [{ code: settings2, path: "src/app.tsx" }],
};

export function getCategoryPageData(slug: string) {
	const category = getBlockCategory(slug);
	return category
		? {
				blocks: blocksIn(slug).map((block) => ({
					block,
					files: files[block.slug] ?? [],
				})),
				category,
			}
		: null;
}

export type CategoryPageData = NonNullable<
	ReturnType<typeof getCategoryPageData>
>;

const language = (path: string) => path.slice(path.lastIndexOf(".") + 1);

// A block's Markdown twin: what it is, how to set it up, and every file.
export function renderBlockMarkdown(category: string, slug: string) {
	const block = getBlock(slug);
	if (block?.category !== category) {
		return null;
	}
	return [
		`# ${block.title}`,
		block.description,
		`Live: /blocks/${block.category}/${block.slug}/preview`,
		"## Set up",
		`\`\`\`sh\n${block.setup.code}\n\`\`\``,
		...block.setup.paragraphs,
		block.setup.links
			.map(({ href, label }) => `- [${label}](${href}/markdown)`)
			.join("\n"),
		"## Files",
		...(files[slug] ?? []).flatMap(({ code, path }) => [
			`### ${path}`,
			`\`\`\`${language(path)}\n${code.trimEnd()}\n\`\`\``,
		]),
		"",
	]
		.filter(Boolean)
		.join("\n\n");
}
