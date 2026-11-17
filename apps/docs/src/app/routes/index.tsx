import { createFileRoute } from "@tanstack/react-router";
import HomePage from "../../pages/home/ui/page";
import SiteLayout from "../layouts/site-layout";
import { pageHead } from "../lib/page-head";

export const Route = createFileRoute("/")({
	component: Home,
	head: () =>
		pageHead(
			"/",
			"Mizen UI",
			"React components for dashboards and data-rich interfaces. Explore interactive charts, metrics, and tables built with Base UI and StyleX."
		),
});
function Home() {
	return (
		<SiteLayout>
			<HomePage />
		</SiteLayout>
	);
}
