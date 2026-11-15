import {
	IconBell,
	IconChartBar,
	IconHome,
	IconLock,
	IconSettings,
	IconShoppingCart,
	IconStar,
	IconUsers,
} from "@tabler/icons-react";
import {
	type Dashboard,
	dashboard,
	type NavGroup,
	type Order,
} from "../../../entities/documentation/ui/apps/dashboard/data";

// Worst realistic data for the dashboard app, passed through the same prop as
// the demo data. Each value is something a real workspace produces.

const DAY = 86_400_000;
const firstDay = Date.UTC(2026, 6, 1);
const monthly = (values: readonly number[]) =>
	values.map((value, month) => ({ time: Date.UTC(2026, month, 1), value }));

const worstNavigation: NavGroup[] = [
	{
		items: [
			{ current: true, href: "#home", icon: IconHome, label: "Home" },
			{ count: 1284, href: "#orders", icon: IconShoppingCart, label: "Orders" },
			{ count: 1, href: "#alerts", icon: IconBell, label: "Notifications" },
			{
				href: "#security",
				icon: IconLock,
				label: "Аналитика защиты сессий и транзакций",
			},
			{
				count: 100_000,
				href: "#settings-de",
				icon: IconSettings,
				label: "Benachrichtigungseinstellungen",
			},
		],
	},
	{
		items: [
			{
				href: "#pinned-1",
				icon: IconStar,
				label: "Q3 Board Deck — FINAL (revised) v12",
			},
			{ href: "#pinned-2", icon: IconStar, label: "Jo" },
		],
		label: "Customer success and enterprise onboarding",
	},
	...Array.from({ length: 6 }, (_, group) => ({
		items: Array.from({ length: 7 }, (_slot, position) => ({
			href: `#g${group}-${position}`,
			icon: [IconUsers, IconChartBar, IconSettings][position % 3] ?? IconUsers,
			label: `Paramètres de confidentialité ${group + 1}.${position + 1}`,
		})),
		label: `Region ${group + 1}`,
	})),
];

const worstOrders: Order[] = [
	{
		color: "blue",
		customer: "Aleksandra Wiśniewska-Kowalczyk",
		id: "ORD-100001",
		initials: "AW",
		status: "Delivery failed — address not found",
		total: "$12,345,678.90",
		updated: "Dec 31, 2025",
		variant: "destructive",
	},
	{
		color: "purple",
		customer: "Jo",
		id: "ORD-100002",
		initials: "J",
		status: "Shipped",
		total: "$0.00",
		updated: "Today",
		variant: "success",
	},
	{
		color: "green",
		customer: "Christopher Alexander Montgomery III",
		id: "ORD-100003",
		initials: "CM",
		status: "Waiting for customs clearance",
		total: "−$42.50",
		updated: "Nov 14",
		variant: "warning",
	},
	{
		color: "orange",
		customer: "🦊 Fox",
		id: "ORD-100004",
		initials: "🦊",
		status: "Processing",
		total: "$1,284.00",
		updated: "Nov 12",
		variant: "info",
	},
	{
		color: "neutral",
		customer: "王秀英",
		id: "ORD-100005",
		initials: "王",
		status: "Shipped",
		total: "$96.00",
		updated: "Nov 11",
		variant: "success",
	},
	{
		color: "blue",
		customer:
			"bartholomew.fitzgerald@northwind-industries-holdings.example.com",
		id: "ORD-100006",
		initials: "BF",
		status: "Shipped",
		total: "$708.00",
		updated: "Nov 10",
		variant: "success",
	},
];

export const worst: Dashboard = {
	account: { initials: "AW", name: "Aleksandra Wiśniewska-Kowalczyk" },
	metrics: [
		{
			change: 1.42,
			good: "up",
			label: "Average order value after refunds and chargebacks",
			value: "$12,345,678.90",
		},
		{ change: 0, good: "up", label: "New customers", value: "0" },
		{ change: -0.425, good: "up", label: "Conversion", value: "0.3%" },
		{ change: 0.08, good: "down", label: "Refunds", value: "−$1,284.50" },
	],
	navigation: worstNavigation,
	orders: worstOrders,
	ordersPerDay: Array.from({ length: 126 }, (_, index) => ({
		date: new Date(firstDay + index * DAY).toISOString().slice(0, 10),
		value: index === 60 ? 12_345 : 0,
	})),
	revenue: [
		{
			id: "online",
			label: "Online and marketplace channels, including partner storefronts",
			points: monthly([0, 0, 12_345_678, 9_000_000, 0, 1, 2, 3, 4, 5, 6, 7]),
		},
		{ id: "retail", label: "Retail", points: monthly(new Array(12).fill(0)) },
	],
	workspace: {
		initials: "NI",
		name: "Northwind Industries Holdings International",
	},
};

export const empty: Dashboard = {
	...dashboard,
	metrics: [],
	navigation: [],
	orders: [],
	ordersPerDay: [],
	revenue: [],
};

export const one: Dashboard = {
	...dashboard,
	metrics: dashboard.metrics.slice(0, 1),
	navigation: [{ items: dashboard.navigation[0]?.items.slice(0, 1) ?? [] }],
	orders: dashboard.orders.slice(0, 1),
	ordersPerDay: dashboard.ordersPerDay.slice(0, 1),
	revenue: [{ id: "online", label: "Online", points: monthly([42]) }],
};

const firstOrder = dashboard.orders[0] as Order;

export const many: Dashboard = {
	...dashboard,
	navigation: Array.from({ length: 8 }, (_, group) => ({
		items: Array.from({ length: 8 }, (_slot, position) => ({
			current: group === 7 && position === 7,
			href: `#m${group}-${position}`,
			icon: IconUsers,
			label: `Section ${group + 1} item ${position + 1}`,
		})),
		label: group === 0 ? undefined : `Group ${group + 1}`,
	})),
	orders: Array.from({ length: 1000 }, (_, index) => ({
		...firstOrder,
		id: `ORD-${String(10_000 + index)}`,
	})),
};

export const fixtures = { demo: dashboard, empty, many, one, worst };
export type FixtureName = keyof typeof fixtures;
