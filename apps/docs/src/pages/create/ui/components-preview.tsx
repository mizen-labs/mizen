"use client";

import {
	Alert,
	AlertDescription,
	AlertTitle,
	Avatar,
	AvatarFallback,
	AvatarGroup,
	Badge,
	BarList,
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
	Button,
	Calendar,
	Card,
	CardDescription,
	CardHeader,
	CardPanel,
	CardTitle,
	Checkbox,
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
	Grid,
	Inline,
	Input,
	Kbd,
	KbdGroup,
	Meter,
	MeterIndicator,
	MeterLabel,
	MeterTrack,
	MeterValue,
	MetricDelta,
	MetricTrend,
	Page,
	PageAction,
	PageDescription,
	PageHeader,
	PageTitle,
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
	Progress,
	Radio,
	RadioGroup,
	SegmentedControl,
	SegmentedControlItem,
	Select,
	SelectItem,
	SelectLabel,
	SelectPopup,
	SelectTrigger,
	SelectValue,
	Skeleton,
	Slider,
	Spinner,
	Stack,
	StatusDot,
	Switch,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableHeader,
	TableRow,
	Tabs,
	TabsIndicator,
	TabsList,
	TabsTab,
	Text,
	Textarea,
} from "@mizen-labs/ui";
import { props } from "@stylexjs/stylex";
import {
	IconDownload,
	IconFolder,
	IconPlus,
	IconSettings,
} from "@tabler/icons-react";
import { type MouseEvent, type ReactNode, useState } from "react";
import { sheetStyles } from "./components-preview.styles";

const ROLES = { admin: "Admin", editor: "Editor", viewer: "Viewer" };
const MEMBERS = [
	["Maya Chen", "MC", "Owner", "Active"],
	["Theo Martin", "TM", "Editor", "Invited"],
	["Lina Park", "LP", "Viewer", "Active"],
] as const;
const BADGES = [
	"default",
	"secondary",
	"outline",
	"brand",
	"success",
	"warning",
	"info",
	"destructive",
] as const;
const SOFT_BADGES = [
	["success", "Paid"],
	["warning", "Pending"],
	["info", "Draft"],
	["destructive", "Failed"],
] as const;
const STATUSES = [
	["success", "Operational"],
	["warning", "Degraded"],
	["error", "Down"],
	["neutral", "Paused"],
] as const;
const ALERTS = [
	["info", "Maintenance on Sunday", "Sign-in may pause for a few minutes."],
	["success", "Payout sent", "$12,480 reaches your bank in 2 days."],
	["warning", "Card expires soon", "Update it before 30 November."],
	["error", "Sync failed", "Reconnect Stripe to import orders."],
] as const;

// Links in the sheet stay on the sheet.
const stay = (event: MouseEvent) => event.preventDefault();

function Sheet({
	children,
	description,
	title,
}: {
	children: ReactNode;
	description: string;
	title: string;
}) {
	return (
		<div {...props(sheetStyles.card)}>
			<Card>
				<CardHeader>
					<CardTitle>{title}</CardTitle>
					<CardDescription>{description}</CardDescription>
				</CardHeader>
				<CardPanel>{children}</CardPanel>
			</Card>
		</div>
	);
}

function Actions() {
	return (
		<Sheet
			description="Variants, sizes, icons, and busy states."
			title="Actions"
		>
			<Stack gap="3">
				<Inline gap="2">
					<Button>Save</Button>
					<Button variant="brand">Publish</Button>
					<Button variant="secondary">Draft</Button>
					<Button variant="outline">Export</Button>
					<Button variant="ghost">Cancel</Button>
					<Button variant="destructive">Delete</Button>
				</Inline>
				<Inline gap="2">
					<Button size="xs">Extra small</Button>
					<Button size="sm">Small</Button>
					<Button size="lg">Large</Button>
				</Inline>
				<Inline gap="2">
					<Button aria-label="Add" size="icon" variant="outline">
						<IconPlus aria-hidden="true" />
					</Button>
					<Button aria-label="Settings" size="icon" variant="ghost">
						<IconSettings aria-hidden="true" />
					</Button>
					<Button variant="outline">
						<IconDownload aria-hidden="true" />
						Download
					</Button>
					<Button disabled>
						<Spinner />
						Saving
					</Button>
				</Inline>
				<Text size="ui" tone="muted">
					Search with{" "}
					<KbdGroup>
						<Kbd>⌘</Kbd>
						<Kbd>K</Kbd>
					</KbdGroup>
				</Text>
			</Stack>
		</Sheet>
	);
}

function Account() {
	return (
		<Sheet description="Fields, a select, and an error." title="Account">
			<Stack gap="4">
				<Field>
					<FieldLabel>Name</FieldLabel>
					<Input defaultValue="Maya Chen" />
				</Field>
				<Field invalid>
					<FieldLabel>Email</FieldLabel>
					<Input defaultValue="maya@northstar" type="email" />
					<FieldError match>
						Enter an email such as maya@northstar.io.
					</FieldError>
				</Field>
				<Select defaultValue="editor" items={ROLES}>
					<SelectLabel>Role</SelectLabel>
					<SelectTrigger>
						<SelectValue />
					</SelectTrigger>
					<SelectPopup>
						<SelectItem value="admin">Admin</SelectItem>
						<SelectItem value="editor">Editor</SelectItem>
						<SelectItem value="viewer">Viewer</SelectItem>
					</SelectPopup>
				</Select>
				<Field>
					<FieldLabel>Bio</FieldLabel>
					<Textarea defaultValue="Design lead at Northstar." rows={2} />
					<FieldDescription>Shown on your profile.</FieldDescription>
				</Field>
				<Field>
					<FieldLabel>
						<Checkbox defaultChecked />
						Email me product updates
					</FieldLabel>
				</Field>
			</Stack>
		</Sheet>
	);
}

function Preferences() {
	return (
		<Sheet description="Radios, switches, a slider." title="Preferences">
			<Stack gap="4">
				<RadioGroup aria-label="Density" defaultValue="comfortable">
					<Field>
						<FieldLabel>
							<Radio value="compact" />
							Compact
						</FieldLabel>
					</Field>
					<Field>
						<FieldLabel>
							<Radio value="comfortable" />
							Comfortable
						</FieldLabel>
					</Field>
				</RadioGroup>
				<Field>
					<FieldLabel>
						<Switch defaultChecked />
						Weekly report
					</FieldLabel>
				</Field>
				<Field>
					<FieldLabel>
						<Switch />
						Mentions only
					</FieldLabel>
				</Field>
				<Slider aria-label="Seats" defaultValue={40} />
				<SegmentedControl aria-label="Range" defaultValue={["week"]}>
					<SegmentedControlItem value="day">Day</SegmentedControlItem>
					<SegmentedControlItem value="week">Week</SegmentedControlItem>
					<SegmentedControlItem value="month">Month</SegmentedControlItem>
				</SegmentedControl>
			</Stack>
		</Sheet>
	);
}

function Status() {
	return (
		<Sheet description="Badges, status dots, avatars." title="Status">
			<Stack gap="4">
				<Inline gap="2">
					{BADGES.map((variant) => (
						<Badge key={variant} variant={variant}>
							{variant[0]?.toUpperCase() + variant.slice(1)}
						</Badge>
					))}
				</Inline>
				<Inline gap="2">
					{SOFT_BADGES.map(([variant, label]) => (
						<Badge appearance="soft" key={variant} variant={variant}>
							{label}
						</Badge>
					))}
				</Inline>
				<Grid columns="2" gap="2">
					{STATUSES.map(([variant, label]) => (
						<Inline gap="2" key={variant} wrap={false}>
							<StatusDot aria-hidden="true" label={label} variant={variant} />
							<Text size="ui">{label}</Text>
						</Inline>
					))}
				</Grid>
				<AvatarGroup aria-label="Reviewers" role="group">
					{MEMBERS.map(([name, initials]) => (
						<Avatar key={name}>
							<AvatarFallback aria-label={name} role="img">
								{initials}
							</AvatarFallback>
						</Avatar>
					))}
				</AvatarGroup>
			</Stack>
		</Sheet>
	);
}

function Schedule() {
	const [date, setDate] = useState<Date | undefined>(new Date(2026, 10, 18));
	return (
		<Sheet description="Today, a choice, and the month." title="Schedule">
			<Calendar
				aria-label="Launch date"
				defaultMonth={new Date(2026, 10, 1)}
				mode="single"
				onValueChange={setDate}
				value={date}
			/>
		</Sheet>
	);
}

function Usage() {
	return (
		<Sheet description="Progress, a meter, and a ranking." title="Usage">
			<Stack gap="4">
				<Progress aria-label="Onboarding" value={64} />
				<Meter max={100} value={72}>
					<MeterLabel>Storage</MeterLabel>
					<Stack gap="1">
						<MeterValue />
						<MeterTrack>
							<MeterIndicator />
						</MeterTrack>
					</Stack>
				</Meter>
				<BarList
					aria-label="Visitors by source"
					items={[
						{ id: "search", label: "Search", value: 4620 },
						{ id: "referral", label: "Referral", value: 3110 },
						{ id: "direct", label: "Direct", value: 2290 },
					]}
				/>
			</Stack>
		</Sheet>
	);
}

function Alerts() {
	return (
		<Sheet description="Every tone, title and text." title="Alerts">
			<Stack gap="3">
				{ALERTS.map(([variant, title, text]) => (
					<Alert key={variant} variant={variant}>
						<AlertTitle>{title}</AlertTitle>
						<AlertDescription>{text}</AlertDescription>
					</Alert>
				))}
			</Stack>
		</Sheet>
	);
}

function Members() {
	return (
		<Sheet description="Rows, a selection, and badges." title="Members">
			<TableContainer aria-label="Members">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead scope="col">Name</TableHead>
							<TableHead scope="col">Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{MEMBERS.map(([name, initials, role, status]) => (
							<TableRow key={name} selected={role === "Owner"}>
								<TableHead scope="row">
									<Inline gap="2" wrap={false}>
										<Avatar size="sm">
											<AvatarFallback>{initials}</AvatarFallback>
										</Avatar>
										{name}
									</Inline>
								</TableHead>
								<TableCell nowrap>
									<Badge
										appearance="soft"
										variant={status === "Active" ? "success" : "info"}
									>
										{status}
									</Badge>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Sheet>
	);
}

function Navigation() {
	return (
		<Sheet description="Tabs, a trail, and pages." title="Navigation">
			<Stack gap="4">
				<Tabs defaultValue="overview">
					<TabsList aria-label="Sections">
						<TabsTab value="overview">Overview</TabsTab>
						<TabsTab value="activity">
							Activity <Badge>12</Badge>
						</TabsTab>
						<TabsTab value="settings">Settings</TabsTab>
						<TabsIndicator />
					</TabsList>
				</Tabs>
				<Breadcrumb aria-label="Location">
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="#" onClick={stay}>
								Projects
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>Northstar</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
				<Pagination aria-label="Pages">
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious href="#" onClick={stay} />
						</PaginationItem>
						{[1, 2, 3].map((page) => (
							<PaginationItem key={page}>
								<PaginationLink active={page === 2} href="#" onClick={stay}>
									{page}
								</PaginationLink>
							</PaginationItem>
						))}
						<PaginationItem>
							<PaginationNext href="#" onClick={stay} />
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</Stack>
		</Sheet>
	);
}

function States() {
	return (
		<Sheet description="Nothing yet, and still loading." title="States">
			<Stack gap="5">
				<Empty>
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<IconFolder aria-hidden="true" />
						</EmptyMedia>
						<EmptyTitle>No projects yet</EmptyTitle>
						<EmptyDescription>Start one to invite your team.</EmptyDescription>
					</EmptyHeader>
					<EmptyContent>
						<Button variant="brand">New project</Button>
					</EmptyContent>
				</Empty>
				<div {...props(sheetStyles.skeletonRow)}>
					<div {...props(sheetStyles.skeletonAvatar)}>
						<Skeleton shape="circle" />
					</div>
					<Stack gap="2">
						<div {...props(sheetStyles.skeletonLine("70%"))}>
							<Skeleton />
						</div>
						<div {...props(sheetStyles.skeletonLine("45%"))}>
							<Skeleton />
						</div>
					</Stack>
				</div>
			</Stack>
		</Sheet>
	);
}

// Every part a theme reaches, in one sheet: actions, fields, choices,
// status, dates, data, alerts, navigation, and empty and loading states.
export function ComponentsPreview() {
	return (
		<Page>
			<PageHeader>
				<PageTitle>Components</PageTitle>
				<PageDescription>Every part the theme reaches.</PageDescription>
				<PageAction>
					<Button variant="outline">Invite</Button>
					<Button variant="brand">New project</Button>
				</PageAction>
			</PageHeader>
			<Grid columns="auto-sm" gap="4">
				<MetricTrend
					delta={<MetricDelta appearance="soft" value={0.124} />}
					description="From last week"
					label="Revenue"
					value="$48,290"
				/>
				<MetricTrend
					delta={<MetricDelta appearance="soft" value={0.031} />}
					description="From last week"
					label="Customers"
					value="312"
				/>
				<MetricTrend
					delta={<MetricDelta appearance="soft" good="down" value={0.08} />}
					description="From last week"
					label="Refunds"
					value="$640"
				/>
			</Grid>
			<div {...props(sheetStyles.columns)}>
				<Actions />
				<Account />
				<Preferences />
				<Status />
				<Schedule />
				<Usage />
				<Alerts />
				<Members />
				<Navigation />
				<States />
			</div>
		</Page>
	);
}
