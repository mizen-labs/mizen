import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { choicesFrom, unreadableCode } from "../../pages/create/model/create";
import CreatePage from "../../pages/create/ui/page";
import SiteLayout from "../layouts/site-layout";
import { pageHead } from "../lib/page-head";

export const Route = createFileRoute("/create")({
	component: Create,
	head: () =>
		pageHead(
			"/create",
			"Create · Mizen UI",
			"Pick an accent, main buttons, neutrals, fonts, radius, and density, see them on a whole app, and get the command that sets them up."
		),
	validateSearch: (search: Record<string, unknown>): { preset?: string } =>
		typeof search.preset === "string" ? { preset: search.preset } : {},
});

function Create() {
	const { preset } = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });
	// The code lives in the address, so a link shares the theme.
	const keep = useCallback(
		(code: string) =>
			navigate({ replace: true, resetScroll: false, search: { preset: code } }),
		[navigate]
	);
	return (
		<SiteLayout>
			<CreatePage
				initial={choicesFrom(preset)}
				notice={unreadableCode(preset)}
				onChange={keep}
			/>
		</SiteLayout>
	);
}
