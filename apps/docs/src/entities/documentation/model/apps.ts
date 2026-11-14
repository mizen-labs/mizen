export interface AppDoc {
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

// An app is a whole screen built from Mizen components, with its sources.
export const appDocs: AppDoc[] = [
	{
		description:
			"A store overview in an application shell: metrics, a table with selection, and two charts, in the Vivid theme.",
		setup: {
			code: `npx @mizen-labs/cli@latest init --preset vivid --yes
npm install @tabler/icons-react`,
			links: [{ href: "/docs/components/app-shell", label: "App Shell" }],
			paragraphs: [
				"init sets up Mizen and writes mizen-theme.css with the Vivid preset. The app also uses Tabler icons. Copy the files into src and render App at the root of your application.",
				"The app has no CSS. home.tsx is the screen: Page, Section, Grid and Stack lay it out, so it fits a wide window, a narrow one, and the space beside the sidebar.",
				"app-shell.tsx is the frame around every screen, built from AppShell. Collapse the sidebar with the button in the header; it returns while the pointer rests on the left edge. On a narrow screen the navigation opens in a drawer and closes after a link is chosen.",
			],
		},
		slug: "dashboard",
		title: "Dashboard",
	},
];

export function getAppDoc(slug: string) {
	return appDocs.find((app) => app.slug === slug);
}
