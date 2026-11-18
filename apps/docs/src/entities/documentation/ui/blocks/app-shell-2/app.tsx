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
	AppShellSidebarFooter,
	AppShellSidebarHeader,
	AppShellSidebarTrigger,
	Avatar,
	AvatarFallback,
	Badge,
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
	Button,
	Inline,
	Page,
	PageAction,
	PageDescription,
	PageHeader,
	PageTitle,
	Tabs,
	TabsIndicator,
	TabsList,
	TabsPanel,
	TabsTab,
	Text,
} from "@mizen-labs/ui";
import {
	IconBook,
	IconBug,
	IconCode,
	IconGitPullRequest,
	IconRocket,
	IconSettings,
	IconShare,
} from "@tabler/icons-react";

const REPOSITORIES = ["web", "api", "mobile"];

// A tool's frame: navigation in named groups that fold, a trail of where the
// reader is in the header, and a page split into tabs.
export function App() {
	return (
		<AppShell>
			<AppShellSidebar aria-label="Atlas">
				<AppShellSidebarHeader>
					<Inline gap="2" wrap={false}>
						<Avatar size="sm">
							<AvatarFallback>A</AvatarFallback>
						</Avatar>
						<Text size="ui" truncate>
							Atlas
						</Text>
					</Inline>
				</AppShellSidebarHeader>
				<AppShellNav aria-label="Main">
					<AppShellGroup>
						<AppShellItem current href="#overview">
							<IconCode aria-hidden="true" />
							Overview
						</AppShellItem>
						<AppShellItem href="#pulls">
							<IconGitPullRequest aria-hidden="true" />
							Pull requests
							<Badge>4</Badge>
						</AppShellItem>
						<AppShellItem href="#issues">
							<IconBug aria-hidden="true" />
							Issues
						</AppShellItem>
						<AppShellItem href="#deploys">
							<IconRocket aria-hidden="true" />
							Deploys
						</AppShellItem>
					</AppShellGroup>
					<AppShellGroup collapsible label="Repositories">
						{REPOSITORIES.map((name) => (
							<AppShellItem href={`#${name}`} key={name}>
								<IconBook aria-hidden="true" />
								{name}
							</AppShellItem>
						))}
					</AppShellGroup>
				</AppShellNav>
				<AppShellSidebarFooter>
					<AppShellItem href="#settings">
						<IconSettings aria-hidden="true" />
						Settings
					</AppShellItem>
				</AppShellSidebarFooter>
			</AppShellSidebar>
			<AppShellInset>
				<AppShellHeader>
					<AppShellSidebarTrigger aria-label="Toggle navigation" />
					<Breadcrumb aria-label="Location">
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink href="#atlas">Atlas</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbPage>web</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</AppShellHeader>
				<AppShellMain>
					<Page>
						<PageHeader>
							<PageTitle>web</PageTitle>
							<PageDescription>
								The customer site and its checkout.
							</PageDescription>
							<PageAction>
								<Button variant="outline">
									<IconShare aria-hidden="true" />
									Share
								</Button>
								<Button>Deploy</Button>
							</PageAction>
						</PageHeader>
						<Tabs defaultValue="overview">
							<TabsList aria-label="Repository">
								<TabsTab value="overview">Overview</TabsTab>
								<TabsTab value="activity">Activity</TabsTab>
								<TabsTab value="settings">Settings</TabsTab>
								<TabsIndicator />
							</TabsList>
							<TabsPanel value="overview">
								<Text tone="muted">
									Last deployed 12 minutes ago from main.
								</Text>
							</TabsPanel>
							<TabsPanel value="activity">
								<Text tone="muted">4 pull requests are open.</Text>
							</TabsPanel>
							<TabsPanel value="settings">
								<Text tone="muted">Deploys run on every push to main.</Text>
							</TabsPanel>
						</Tabs>
					</Page>
				</AppShellMain>
			</AppShellInset>
		</AppShell>
	);
}
