import { createFileRoute } from "@tanstack/react-router";
import DocumentationPage from "../../pages/docs-index/ui/page";
import { pageHead } from "../lib/page-head";
export const Route = createFileRoute("/docs/")({
	component: DocumentationPage,
	head: () =>
		pageHead(
			"/docs/",
			"Documentation · Mizen UI",
			"Install Mizen UI and explore its components, guides, and executable examples."
		),
});
