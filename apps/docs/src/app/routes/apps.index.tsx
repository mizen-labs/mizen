import { createFileRoute } from "@tanstack/react-router";
import AppsPage from "../../pages/apps/ui/page";
import SiteLayout from "../layouts/site-layout";
import { pageHead } from "../lib/page-head";

export const Route = createFileRoute("/apps/")({
	component: Apps,
	head: () =>
		pageHead(
			"/apps/",
			"Apps · Mizen UI",
			"Whole screens built from Mizen components, with their sources."
		),
});
function Apps() {
	return (
		<SiteLayout>
			<AppsPage />
		</SiteLayout>
	);
}
