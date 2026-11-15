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
import { IconSearch, IconSelector } from "@tabler/icons-react";
import type { ReactNode } from "react";
import type { Dashboard, NavItem } from "./data";

// A count past 99 shows as 99+; the full number is in the page itself.
function formatCount(count: number) {
	return count > 99 ? "99+" : count.toLocaleString();
}

// An array, not a component: each item becomes its own entry in the group.
function items(list: readonly NavItem[]) {
	return list.map(({ count, current, href, icon: Glyph, label }) => (
		<AppShellItem current={current} href={href} key={href}>
			<Glyph aria-hidden="true" />
			{label}
			{count ? (
				<Badge>
					{formatCount(count)}
					<VisuallyHidden> new</VisuallyHidden>
				</Badge>
			) : null}
		</AppShellItem>
	));
}

function Account({ person }: { person: Dashboard["account"] }) {
	return (
		<Menu>
			<MenuTrigger render={<Button variant="ghost" />}>
				<Avatar size="sm">
					<AvatarFallback>{person.initials}</AvatarFallback>
				</Avatar>
				{person.name}
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
export function AppShellFrame({
	children,
	data,
}: {
	children: ReactNode;
	data: Dashboard;
}) {
	return (
		<AppShell>
			<AppShellSidebar aria-label={data.workspace.name}>
				<AppShellSidebarHeader>
					<Inline gap="2" wrap={false}>
						<Avatar size="sm">
							<AvatarFallback>{data.workspace.initials}</AvatarFallback>
						</Avatar>
						<Text size="ui" truncate>
							{data.workspace.name}
						</Text>
					</Inline>
					<Button variant="outline">
						<IconSearch aria-hidden="true" />
						Search
						<Kbd>⌘K</Kbd>
					</Button>
				</AppShellSidebarHeader>
				<AppShellNav aria-label="Main">
					{data.navigation.map((group) => (
						<AppShellGroup
							collapsible={group.label !== undefined}
							key={group.label ?? "main"}
							label={group.label}
						>
							{items(group.items)}
						</AppShellGroup>
					))}
				</AppShellNav>
				<AppShellSidebarFooter>
					<Account person={data.account} />
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
