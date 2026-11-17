import { createFileRoute } from "@tanstack/react-router";
import type { PreviewView } from "../../pages/create/model/create";
import CreatePreview from "../../pages/create/ui/preview";

interface PreviewSearch {
	dark?: boolean;
	preset: string;
	view: PreviewView;
}

// The theme preview the Create page frames. Its own document, so the theme
// and the dark mode apply to every popup too.
export const Route = createFileRoute("/create_/preview")({
	component: Preview,
	head: () => ({
		meta: [
			{ title: "Theme preview · Mizen UI" },
			{ content: "noindex", name: "robots" },
		],
	}),
	validateSearch: (search: Record<string, unknown>): PreviewSearch => ({
		// Without it, the preview keeps the site's theme.
		dark:
			search.dark === undefined
				? undefined
				: search.dark === true || search.dark === "true",
		preset: typeof search.preset === "string" ? search.preset : "m0",
		view: search.view === "components" ? "components" : "app",
	}),
});

function Preview() {
	const search = Route.useSearch();
	return <CreatePreview initial={{ ...search, type: "mizen-create" }} />;
}
