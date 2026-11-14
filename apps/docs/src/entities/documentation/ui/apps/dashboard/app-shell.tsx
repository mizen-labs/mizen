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
	MenuSeparator,
	MenuTrigger,
	Text,
	VisuallyHidden,
} from "@mizen-labs/ui";
import {
	type Icon,
	IconChartBar,
	IconHome,
	IconPackage,
	IconSearch,
	IconSelector,
	IconSettings,
	IconShoppingCart,
	IconSpeakerphone,
	IconUsers,
	IconUsersGroup,
} from "@tabler/icons-react";
import type { ReactNode } from "react";

interface NavItem {
	count?: number;
	current?: boolean;
	href: string;
	icon: Icon;
	label: string;
}

// Each href is a place in this demo. In your app, pass your router's link to
// render, and the item reads aria-current from it.
const primary: NavItem[] = [
	{ current: true, href: "#home", icon: IconHome, label: "Home" },
	{ count: 12, href: "#orders", icon: IconShoppingCart, label: "Orders" },
	{ href: "#customers", icon: IconUsers, label: "Customers" },
	{ href: "#products", icon: IconPackage, label: "Products" },
];
const insights: NavItem[] = [
	{ href: "#analytics", icon: IconChartBar, label: "Analytics" },
	{ href: "#marketing", icon: IconSpeakerphone, label: "Marketing" },
];
const workspace: NavItem[] = [
	{ href: "#team", icon: IconUsersGroup, label: "Team" },
	{ href: "#settings", icon: IconSettings, label: "Settings" },
];

// An array, not a component: each item becomes its own entry in the group.
function items(list: NavItem[]) {
	return list.map(({ count, current, href, icon: Glyph, label }) => (
		<AppShellItem current={current} href={href} key={href}>
			<Glyph aria-hidden="true" />
			{label}
			{count ? (
				<Badge>
					{count}
					<VisuallyHidden> new</VisuallyHidden>
				</Badge>
			) : null}
		</AppShellItem>
	));
}

function Account() {
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
				<MenuItem>Profile</MenuItem>
				<MenuItem>Billing</MenuItem>
				<MenuSeparator />
				<MenuItem>Sign out</MenuItem>
			</MenuPopup>
		</Menu>
	);
}

// The frame around every screen. On a wide screen the navigation is a
// sidebar; collapsed, it returns when the pointer rests on the left edge. On
// a narrow screen it opens in a drawer from the button in the header.
export function AppShellFrame({ children }: { children: ReactNode }) {
	return (
		<AppShell>
			<AppShellSidebar aria-label="Northstar">
				<AppShellSidebarHeader>
					<Inline gap="2">
						<Avatar size="sm">
							<AvatarFallback>N</AvatarFallback>
						</Avatar>
						<Text size="ui">Northstar</Text>
					</Inline>
					<Button variant="outline">
						<IconSearch aria-hidden="true" />
						Search
						<Kbd>⌘K</Kbd>
					</Button>
				</AppShellSidebarHeader>
				<AppShellNav aria-label="Main">
					<AppShellGroup>{items(primary)}</AppShellGroup>
					<AppShellGroup collapsible label="Insights">
						{items(insights)}
					</AppShellGroup>
					<AppShellGroup collapsible label="Workspace">
						{items(workspace)}
					</AppShellGroup>
				</AppShellNav>
				<AppShellSidebarFooter>
					<Account />
				</AppShellSidebarFooter>
			</AppShellSidebar>
			<AppShellInset>
				<AppShellHeader>
					<AppShellSidebarTrigger aria-label="Toggle navigation" />
					<AppShellTitle>Home</AppShellTitle>
				</AppShellHeader>
				<AppShellMain>{children}</AppShellMain>
			</AppShellInset>
		</AppShell>
	);
}
