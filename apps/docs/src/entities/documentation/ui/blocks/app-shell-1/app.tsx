"use client";

import {
	AppShell,
	AppShellGroup,
	AppShellHeader,
	AppShellInset,
	AppShellItem,
	AppShellMain,
	AppShellNav,
	AppShellSidebar,
	AppShellSidebarHeader,
	AppShellSidebarTrigger,
	AppShellTitle,
	Avatar,
	AvatarFallback,
	Button,
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
	Inline,
	Page,
	PageHeader,
	PageTitle,
	Text,
} from "@mizen-labs/ui";
import {
	IconFolder,
	IconHome,
	IconInbox,
	IconPlus,
	IconSettings,
} from "@tabler/icons-react";

// The smallest frame: a sidebar of four places, a header with its title, and
// a page that starts empty.
export function App() {
	return (
		<AppShell>
			<AppShellSidebar aria-label="Northstar">
				<AppShellSidebarHeader>
					<Inline gap="2" wrap={false}>
						<Avatar size="sm">
							<AvatarFallback>N</AvatarFallback>
						</Avatar>
						<Text size="ui" truncate>
							Northstar
						</Text>
					</Inline>
				</AppShellSidebarHeader>
				<AppShellNav aria-label="Main">
					<AppShellGroup>
						<AppShellItem href="#home">
							<IconHome aria-hidden="true" />
							Home
						</AppShellItem>
						<AppShellItem href="#inbox">
							<IconInbox aria-hidden="true" />
							Inbox
						</AppShellItem>
						<AppShellItem current href="#projects">
							<IconFolder aria-hidden="true" />
							Projects
						</AppShellItem>
						<AppShellItem href="#settings">
							<IconSettings aria-hidden="true" />
							Settings
						</AppShellItem>
					</AppShellGroup>
				</AppShellNav>
			</AppShellSidebar>
			<AppShellInset>
				<AppShellHeader>
					<AppShellSidebarTrigger aria-label="Toggle navigation" />
					<AppShellTitle>Projects</AppShellTitle>
				</AppShellHeader>
				<AppShellMain>
					<Page>
						<PageHeader>
							<PageTitle>Projects</PageTitle>
						</PageHeader>
						<Empty>
							<EmptyHeader>
								<EmptyMedia variant="icon">
									<IconFolder aria-hidden="true" />
								</EmptyMedia>
								<EmptyTitle>No projects yet</EmptyTitle>
								<EmptyDescription>
									A project holds its tasks, files, and people.
								</EmptyDescription>
							</EmptyHeader>
							<EmptyContent>
								<Button>
									<IconPlus aria-hidden="true" />
									New project
								</Button>
							</EmptyContent>
						</Empty>
					</Page>
				</AppShellMain>
			</AppShellInset>
		</AppShell>
	);
}
