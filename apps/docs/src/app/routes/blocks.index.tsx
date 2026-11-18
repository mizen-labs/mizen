import { createFileRoute } from "@tanstack/react-router";
import BlocksPage from "../../pages/blocks/ui/index-page";
import SiteLayout from "../layouts/site-layout";
import { pageHead } from "../lib/page-head";

export const Route = createFileRoute("/blocks/")({
	component: Blocks,
	head: () =>
		pageHead(
			"/blocks/",
			"Blocks · Mizen UI",
			"Screens built from Mizen components, by kind. See each one live and copy its files."
		),
});
function Blocks() {
	return (
		<SiteLayout>
			<BlocksPage />
		</SiteLayout>
	);
}
