import { createFileRoute } from "@tanstack/react-router";
// The theme file `mizen init --preset vivid` writes into an application.
import vividTheme from "../../../../../packages/cli/presets/vivid.css?url";
import type { FixtureName } from "../../pages/app-fixtures/ui/fixtures";
import Page from "../../pages/app-fixtures/ui/page";

const NAMES = new Set(["demo", "empty", "many", "one", "worst"]);

// The dashboard app with demo, worst-case, empty, one-item, and 1,000-row
// data, chosen with ?data=.
export const Route = createFileRoute("/internal/app-fixtures")({
	component: InternalPage,
	head: () => ({
		links: [{ href: vividTheme, rel: "stylesheet" }],
		meta: [{ content: "noindex", name: "robots" }],
	}),
	validateSearch: (search: Record<string, unknown>): { data: FixtureName } => ({
		data: NAMES.has(String(search.data))
			? (search.data as FixtureName)
			: "demo",
	}),
});

function InternalPage() {
	return <Page data={Route.useSearch().data} />;
}
