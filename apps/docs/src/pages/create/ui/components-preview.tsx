"use client";

import {
	Alert,
	AlertDescription,
	AlertTitle,
	Avatar,
	AvatarFallback,
	Badge,
	Button,
	Card,
	CardDescription,
	CardHeader,
	CardPanel,
	CardTitle,
	Checkbox,
	Field,
	FieldDescription,
	FieldLabel,
	Grid,
	Inline,
	Input,
	MetricDelta,
	MetricTrend,
	Page,
	PageAction,
	PageDescription,
	PageHeader,
	PageTitle,
	Progress,
	SegmentedControl,
	SegmentedControlItem,
	Select,
	SelectItem,
	SelectLabel,
	SelectPopup,
	SelectTrigger,
	SelectValue,
	Slider,
	Stack,
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
} from "@mizen-labs/ui";

const PLANS = { pro: "Pro", starter: "Starter", team: "Team" };
const MEMBERS = [
	["Maya Chen", "MC", "Owner", "Active"],
	["Theo Martin", "TM", "Editor", "Invited"],
	["Lina Park", "LP", "Viewer", "Active"],
] as const;

function Actions() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Actions</CardTitle>
				<CardDescription>Every variant at the default size.</CardDescription>
			</CardHeader>
			<CardPanel>
				<Inline gap="2">
					<Button>Save</Button>
					<Button variant="brand">Publish</Button>
					<Button variant="outline">Export</Button>
					<Button variant="secondary">Draft</Button>
					<Button variant="ghost">Cancel</Button>
					<Button variant="destructive">Delete</Button>
				</Inline>
			</CardPanel>
		</Card>
	);
}

function Form() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Workspace</CardTitle>
				<CardDescription>Fields, choices, and toggles.</CardDescription>
			</CardHeader>
			<CardPanel>
				<Stack gap="4">
					<Field>
						<FieldLabel>Name</FieldLabel>
						<Input defaultValue="Northstar" />
						<FieldDescription>Shown to everyone you invite.</FieldDescription>
					</Field>
					<Select defaultValue="team" items={PLANS}>
						<SelectLabel>Plan</SelectLabel>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectPopup>
							<SelectItem value="starter">Starter</SelectItem>
							<SelectItem value="team">Team</SelectItem>
							<SelectItem value="pro">Pro</SelectItem>
						</SelectPopup>
					</Select>
					<Inline gap="4">
						<Switch aria-label="Notifications" defaultChecked />
						<Checkbox aria-label="Weekly report" defaultChecked />
					</Inline>
					<Slider aria-label="Seats" defaultValue={40} />
				</Stack>
			</CardPanel>
		</Card>
	);
}

function Members() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Members</CardTitle>
				<CardDescription>A table, avatars, and status badges.</CardDescription>
			</CardHeader>
			<CardPanel>
				<TableContainer aria-label="Members">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead scope="col">Name</TableHead>
								<TableHead scope="col">Role</TableHead>
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
									<TableCell>{role}</TableCell>
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
			</CardPanel>
		</Card>
	);
}

function Navigation() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Navigation</CardTitle>
				<CardDescription>
					Tabs, a segmented control, and progress.
				</CardDescription>
			</CardHeader>
			<CardPanel>
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
					<SegmentedControl aria-label="Range" defaultValue={["week"]}>
						<SegmentedControlItem value="day">Day</SegmentedControlItem>
						<SegmentedControlItem value="week">Week</SegmentedControlItem>
						<SegmentedControlItem value="month">Month</SegmentedControlItem>
					</SegmentedControl>
					<Progress aria-label="Storage" value={64} />
				</Stack>
			</CardPanel>
		</Card>
	);
}

// The parts a theme changes, side by side: actions, fields, a table, and
// navigation, under a page header and a row of metrics.
export function ComponentsPreview() {
	return (
		<Page>
			<PageHeader>
				<PageTitle>Components</PageTitle>
				<PageDescription>What the theme changes.</PageDescription>
				<PageAction>
					<Button variant="outline">Invite</Button>
					<Button variant="brand">New project</Button>
				</PageAction>
			</PageHeader>
			<Grid columns="2" gap="4">
				<MetricTrend
					delta={<MetricDelta appearance="soft" value={0.124} />}
					description="From last week"
					label="Revenue"
					value="$48,290"
				/>
				<MetricTrend
					delta={<MetricDelta appearance="soft" good="down" value={0.08} />}
					description="From last week"
					label="Refunds"
					value="$640"
				/>
			</Grid>
			<Alert variant="info">
				<AlertTitle>Theme preview</AlertTitle>
				<AlertDescription>
					<Text size="ui">
						Every color, radius, and size here comes from tokens.
					</Text>
				</AlertDescription>
			</Alert>
			<Grid columns="2" gap="4">
				<Actions />
				<Form />
				<Members />
				<Navigation />
			</Grid>
		</Page>
	);
}
