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
	AppShellTitle,
	Avatar,
	AvatarFallback,
	Badge,
	Button,
	Inline,
	Kbd,
	Menu,
	MenuItem,
	MenuPopup,
	MenuRadioGroup,
	MenuRadioItem,
	MenuSeparator,
	MenuTrigger,
	Page,
	PageDescription,
	PageHeader,
	PageTitle,
	Section,
	SectionHeader,
	SectionTitle,
	Text,
	VisuallyHidden,
} from "@mizen-labs/ui";
import {
	IconBell,
	IconChartBar,
	IconHome,
	IconLock,
	IconReceipt,
	IconSearch,
	IconSelector,
	IconSettings,
	IconStar,
	IconUsers,
	IconWallet,
} from "@tabler/icons-react";
import { type MouseEvent, useCallback, useState } from "react";

const PAGES = {
	balances: "Balances",
	dashboard: "Dashboard",
	notifications: "Notifications",
	payouts: "Payouts",
	players: "Players",
	security: "Session security analytics",
	settings: "Settings",
} as const;
type PageKey = keyof typeof PAGES;

// The demo keeps the current page in state. In an app, pass the router's link
// to render and let the router mark the current page.
function useCurrentPage(initial: PageKey) {
	const [page, setPage] = useState<PageKey>(initial);
	const navigate = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
		event.preventDefault();
		const key = event.currentTarget.hash.slice(1);
		if (key in PAGES) {
			setPage(key as PageKey);
		}
	}, []);
	return { navigate, page };
}

function Brand() {
	return (
		<Inline gap="2">
			<Avatar size="sm">
				<AvatarFallback>H</AvatarFallback>
			</Avatar>
			<Text size="ui">Howlup Admin</Text>
		</Inline>
	);
}

function Account() {
	const [theme, setTheme] = useState("system");
	return (
		<Menu>
			<MenuTrigger render={<Button variant="ghost" />}>
				<Avatar size="sm">
					<AvatarFallback>MC</AvatarFallback>
				</Avatar>
				Maya Chen
				<IconSelector aria-hidden="true" />
			</MenuTrigger>
			<MenuPopup>
				<MenuRadioGroup onValueChange={setTheme} value={theme}>
					<MenuRadioItem value="light">Light</MenuRadioItem>
					<MenuRadioItem value="dark">Dark</MenuRadioItem>
					<MenuRadioItem value="system">System</MenuRadioItem>
				</MenuRadioGroup>
				<MenuSeparator />
				<MenuItem>Sign out</MenuItem>
			</MenuPopup>
		</Menu>
	);
}

function Screen({ title }: { title: string }) {
	return (
		<Page>
			<PageHeader>
				<PageTitle>{title}</PageTitle>
				<PageDescription>The screen of the current page.</PageDescription>
			</PageHeader>
			<Section aria-labelledby="app-shell-section">
				<SectionHeader>
					<SectionTitle id="app-shell-section">Recent</SectionTitle>
				</SectionHeader>
				<Text tone="muted">
					The content scrolls inside the inset. The sidebar and the header stay.
				</Text>
			</Section>
		</Page>
	);
}

// The parts an application needs: a sidebar with a header, navigation
// groups and a footer, then a header and the content. Collapse the sidebar
// with the header button; it returns while the pointer rests on the left edge.
export function AppShellAdminExample() {
	const { navigate, page } = useCurrentPage("players");
	const item = (key: PageKey, icon: React.ReactNode, count?: number) => (
		<AppShellItem current={page === key} href={`#${key}`} onClick={navigate}>
			{icon}
			{PAGES[key]}
			{count ? (
				<Badge>
					{count}
					<VisuallyHidden> unread</VisuallyHidden>
				</Badge>
			) : null}
		</AppShellItem>
	);
	return (
		<AppShell>
			<AppShellSidebar aria-label="Admin navigation">
				<AppShellSidebarHeader>
					<Brand />
					<Button variant="outline">
						<IconSearch aria-hidden="true" />
						Search
						<Kbd>⌘K</Kbd>
					</Button>
				</AppShellSidebarHeader>
				<AppShellNav aria-label="Main">
					<AppShellGroup label="Pinned">
						{item("dashboard", <IconStar aria-hidden="true" />)}
					</AppShellGroup>
					<AppShellGroup>
						{item("players", <IconUsers aria-hidden="true" />)}
						{item("notifications", <IconBell aria-hidden="true" />, 3)}
					</AppShellGroup>
					<AppShellGroup collapsible label="Finance">
						{item("balances", <IconWallet aria-hidden="true" />)}
						{item("payouts", <IconReceipt aria-hidden="true" />)}
						{item("security", <IconLock aria-hidden="true" />)}
					</AppShellGroup>
					<AppShellGroup collapsible label="System">
						{item("settings", <IconSettings aria-hidden="true" />)}
					</AppShellGroup>
				</AppShellNav>
				<AppShellSidebarFooter>
					<Account />
				</AppShellSidebarFooter>
			</AppShellSidebar>
			<AppShellInset>
				<AppShellHeader>
					<AppShellSidebarTrigger aria-label="Toggle navigation" />
					<AppShellTitle>{PAGES[page]}</AppShellTitle>
				</AppShellHeader>
				<AppShellMain>
					<Screen title={PAGES[page]} />
				</AppShellMain>
			</AppShellInset>
		</AppShell>
	);
}

// The app owns whether the sidebar is open: read it from a cookie or storage,
// and save it in onSidebarOpenChange. busy shows a line while a screen loads.
export function AppShellControlledExample() {
	const [open, setOpen] = useState(false);
	const [busy, setBusy] = useState(false);
	const load = useCallback(() => setBusy((value) => !value), []);
	return (
		<AppShell onSidebarOpenChange={setOpen} sidebarOpen={open}>
			<AppShellSidebar aria-label="Navigation">
				<AppShellSidebarHeader>
					<Brand />
				</AppShellSidebarHeader>
				<AppShellNav aria-label="Main">
					<AppShellGroup>
						<AppShellItem current href="#home">
							<IconHome aria-hidden="true" />
							Home
						</AppShellItem>
						<AppShellItem href="#reports">
							<IconChartBar aria-hidden="true" />
							Reports
						</AppShellItem>
					</AppShellGroup>
				</AppShellNav>
			</AppShellSidebar>
			<AppShellInset>
				<AppShellHeader>
					<AppShellSidebarTrigger
						aria-label={open ? "Hide navigation" : "Show navigation"}
					/>
					<AppShellTitle>Home</AppShellTitle>
					<Button onClick={load} size="sm" variant="outline">
						{busy ? "Stop loading" : "Load"}
					</Button>
				</AppShellHeader>
				<AppShellMain busy={busy} busyLabel="Loading the page">
					<Screen title="Home" />
				</AppShellMain>
			</AppShellInset>
		</AppShell>
	);
}
