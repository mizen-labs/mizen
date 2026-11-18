import {
	Button,
	ErrorState,
	ErrorStateContent,
	ErrorStateDescription,
	ErrorStateHeader,
	ErrorStateMedia,
	ErrorStateTitle,
	Inline,
} from "@mizen-labs/ui";
import { props } from "@stylexjs/stylex";
import { IconAlertTriangle, IconCompass } from "@tabler/icons-react";
import {
	type ErrorComponentProps,
	Link,
	useRouter,
} from "@tanstack/react-router";
import { type ReactNode, useCallback } from "react";
import SiteLayout from "../layouts/site-layout";
import { routeErrorStyles as s } from "./route-error.styles";

// A page that could not be shown. It fills the area its route gives it: the
// content pane of a docs page, whose sidebar stays, or the whole page.
function Notice({
	actions,
	description,
	icon,
	title,
}: {
	actions: ReactNode;
	description: string;
	icon: ReactNode;
	title: string;
}) {
	return (
		<main id="docs-content" {...props(s.page)}>
			<div role="alert" {...props(s.notice)}>
				<ErrorState>
					<ErrorStateHeader>
						<ErrorStateMedia>{icon}</ErrorStateMedia>
						<ErrorStateTitle level={1}>{title}</ErrorStateTitle>
						<ErrorStateDescription>{description}</ErrorStateDescription>
					</ErrorStateHeader>
					<ErrorStateContent>
						<Inline justify="center">{actions}</Inline>
					</ErrorStateContent>
				</ErrorState>
			</div>
		</main>
	);
}

function reloadPage() {
	window.location.reload();
}

export function RouteError({ reset }: ErrorComponentProps) {
	const router = useRouter();
	const retry = useCallback(async () => {
		await router.invalidate();
		reset();
	}, [router, reset]);
	return (
		<Notice
			actions={
				<>
					<Button onClick={retry}>Try again</Button>
					<Button onClick={reloadPage} variant="outline">
						Reload page
					</Button>
				</>
			}
			description="Something went wrong while loading it. Try again, or reload if it keeps happening."
			icon={<IconAlertTriangle aria-hidden="true" />}
			title="This page didn't load"
		/>
	);
}

// No route matched, so no frame was drawn: the site's header comes with it.
export function NotFound() {
	return (
		<SiteLayout>
			<Notice
				actions={
					<>
						<Button
							nativeButton={false}
							render={<Link to="/docs" />}
							role="link"
						>
							Browse documentation
						</Button>
						<Button
							nativeButton={false}
							render={<Link to="/" />}
							role="link"
							variant="outline"
						>
							Go home
						</Button>
					</>
				}
				description="The address may be mistyped, or the page has moved."
				icon={<IconCompass aria-hidden="true" />}
				title="Page not found"
			/>
		</SiteLayout>
	);
}
