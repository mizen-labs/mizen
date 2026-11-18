// Blocks: screens built from Mizen components, grouped by kind. A category
// holds several blocks; each block is a live preview with its source files.

export interface BlockCategory {
	description: string;
	/** The group on the index, such as App. */
	group: string;
	slug: string;
	title: string;
}

export interface Block {
	category: string;
	/** The main components the block shows off. */
	components: string[];
	description: string;
	/** What to do before the files go into an application. */
	setup: {
		code: string;
		links: { href: string; label: string }[];
		paragraphs: string[];
	};
	slug: string;
	title: string;
}

export const blockCategories: BlockCategory[] = [
	{
		description:
			"The frame around every screen: a sidebar, a header, and the content area.",
		group: "App",
		slug: "app-shell",
		title: "App Shell",
	},
	{
		description:
			"Overviews of a business at a glance: figures, trends, and the rows behind them.",
		group: "App",
		slug: "dashboard",
		title: "Dashboard",
	},
	{
		description:
			"Account, workspace, and notification settings, with fields that save as you go.",
		group: "App",
		slug: "settings",
		title: "Settings",
	},
];

const VIVID_SETUP = "npx @mizen-labs/cli@latest init --preset vivid --yes";
const SETUP = "npx @mizen-labs/cli@latest init --yes";
const COPY =
	"init sets up Mizen and writes mizen-theme.css. Copy app.tsx into src and render App where the screen belongs.";

export const blocks: Block[] = [
	{
		category: "app-shell",
		components: ["App Shell", "Empty", "Page"],
		description:
			"The smallest frame: a sidebar of four places, a header with its title, and an empty first page.",
		setup: {
			code: `${SETUP}
npm install @tabler/icons-react`,
			links: [
				{ href: "/docs/components/app-shell", label: "App Shell" },
				{ href: "/docs/components/empty", label: "Empty" },
			],
			paragraphs: [
				COPY,
				"Collapse the sidebar with the button in the header. On a narrow screen the navigation opens in a drawer.",
			],
		},
		slug: "app-shell-1",
		title: "App Shell 1",
	},
	{
		category: "app-shell",
		components: ["App Shell", "Breadcrumb", "Tabs", "Page"],
		description:
			"A tool's frame: navigation in groups that fold, a breadcrumb in the header, and a page split into tabs.",
		setup: {
			code: `${SETUP}
npm install @tabler/icons-react`,
			links: [
				{ href: "/docs/components/app-shell", label: "App Shell" },
				{ href: "/docs/components/breadcrumb", label: "Breadcrumb" },
				{ href: "/docs/components/tabs", label: "Tabs" },
			],
			paragraphs: [
				COPY,
				"Groups with a label fold; the group without one stays open. Settings sits in the sidebar footer, apart from the work.",
			],
		},
		slug: "app-shell-2",
		title: "App Shell 2",
	},
	{
		category: "dashboard",
		components: [
			"App Shell",
			"Metric Trend",
			"Table",
			"Area Chart",
			"Calendar Heatmap",
			"Menu",
		],
		description:
			"A store overview in an application shell: metrics, a table with selection, and two charts, in the Vivid theme.",
		setup: {
			code: `${VIVID_SETUP}
npm install @tabler/icons-react`,
			links: [{ href: "/docs/components/app-shell", label: "App Shell" }],
			paragraphs: [
				"init sets up Mizen and writes mizen-theme.css with the Vivid preset. The block also uses Tabler icons. Copy the files into src and render App at the root of your application.",
				"The block has no CSS. home.tsx is the screen: Page, Section, Grid and Stack lay it out, so it fits a wide window, a narrow one, and the space beside the sidebar.",
				"app-shell.tsx is the frame around every screen, built from AppShell. Collapse the sidebar with the button in the header; it returns while the pointer rests on the left edge. On a narrow screen the navigation opens in a drawer and closes after a link is chosen.",
			],
		},
		slug: "dashboard-1",
		title: "Dashboard 1",
	},
	{
		category: "dashboard",
		components: ["Metric Trend", "Area Chart", "Bar List", "Segmented Control"],
		description:
			"Traffic for a site: three figures, the trend behind them by source, and the top pages.",
		setup: {
			code: SETUP,
			links: [
				{ href: "/docs/components/area-chart", label: "Area Chart" },
				{ href: "/docs/components/bar-list", label: "Bar List" },
				{ href: "/docs/components/metric-trend", label: "Metric Trend" },
			],
			paragraphs: [
				COPY,
				"The range control changes the description only; connect it to your own data.",
			],
		},
		slug: "dashboard-2",
		title: "Dashboard 2",
	},
	{
		category: "settings",
		components: ["Card", "Field", "Input", "Textarea", "Avatar"],
		description:
			"A profile form: photo, name, email, and bio, saved with one button.",
		setup: {
			code: SETUP,
			links: [
				{ href: "/docs/components/field", label: "Field" },
				{ href: "/docs/components/card", label: "Card" },
			],
			paragraphs: [COPY],
		},
		slug: "settings-1",
		title: "Settings 1",
	},
	{
		category: "settings",
		components: ["Switch", "Radio Group", "Card", "Field"],
		description:
			"Notification settings: switches that save on their own, and a choice of how often mail arrives.",
		setup: {
			code: SETUP,
			links: [
				{ href: "/docs/components/switch", label: "Switch" },
				{ href: "/docs/components/radio-group", label: "Radio Group" },
			],
			paragraphs: [
				COPY,
				"Each switch saves as it changes, so the screen has no Save button.",
			],
		},
		slug: "settings-2",
		title: "Settings 2",
	},
];

export function getBlockCategory(slug: string) {
	return blockCategories.find((category) => category.slug === slug);
}

export function getBlock(slug: string) {
	return blocks.find((block) => block.slug === slug);
}

export function blocksIn(category: string) {
	return blocks.filter((block) => block.category === category);
}

// Old /apps addresses, kept working.
export const LEGACY_APPS: Record<string, string> = { dashboard: "dashboard-1" };
