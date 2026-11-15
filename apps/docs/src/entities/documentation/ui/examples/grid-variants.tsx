import {
	Badge,
	Card,
	CardDescription,
	CardHeader,
	CardPanel,
	CardTitle,
	Grid,
	Inline,
	PropertyList,
	PropertyListItem,
	PropertyListLabel,
	PropertyListValue,
	Stack,
	Text,
} from "@mizen-labs/ui";

const projects = [
	{
		name: "Northstar launch",
		owner: "Maya Chen",
		status: "In progress",
		summary: "Coordinate the autumn release.",
	},
	{
		name: "Field notes",
		owner: "Nadia Ilyin",
		status: "In progress",
		summary: "Turn customer feedback into clear next steps.",
	},
	{
		name: "Website refresh",
		owner: "Alex Morgan",
		status: "Planning",
		summary: "Make the product easier to discover.",
	},
	{
		name: "Design system",
		owner: "Sam Lee",
		status: "In review",
		summary: "Build a calmer, more consistent workspace.",
	},
];
export function GridYourProjectsExample1() {
	return (
		<Stack gap="4">
			<Grid columns="auto" gap="4">
				{projects.map((project) => (
					<Card key={project.name}>
						<CardHeader>
							<Stack gap="3">
								<Inline>
									<Badge variant="outline">{project.status}</Badge>
								</Inline>
								<CardTitle>{project.name}</CardTitle>
								<CardDescription>{project.summary}</CardDescription>
								<Text size="ui" tone="muted">
									Owned by {project.owner}
								</Text>
							</Stack>
						</CardHeader>
					</Card>
				))}
			</Grid>
		</Stack>
	);
}

export function GridMainAsideExample2() {
	return (
		<Grid columns="2:1" gap="4">
			<Card>
				<CardHeader>
					<CardTitle>Release notes</CardTitle>
					<CardDescription>Northstar 2.8.0</CardDescription>
				</CardHeader>
				<CardPanel>
					<Text>
						This release makes the workspace calmer. Navigation is quieter,
						tables are easier to scan, and forms explain their errors in place.
					</Text>
				</CardPanel>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Details</CardTitle>
				</CardHeader>
				<CardPanel>
					<PropertyList aria-label="Release details">
						<PropertyListItem>
							<PropertyListLabel>Owner</PropertyListLabel>
							<PropertyListValue>Maya Chen</PropertyListValue>
						</PropertyListItem>
						<PropertyListItem>
							<PropertyListLabel>Status</PropertyListLabel>
							<PropertyListValue>In review</PropertyListValue>
						</PropertyListItem>
					</PropertyList>
				</CardPanel>
			</Card>
		</Grid>
	);
}

const items = [
	["AK-47 | Redline", "$24.10", "Tradable"],
	["AWP | Asiimov", "$96.50", "Tradable"],
	["M4A1-S | Printstream", "$61.20", "On hold"],
	["Glock-18 | Fade", "$1,284.00", "Tradable"],
	["Desert Eagle | Blaze", "$410.00", "On hold"],
	["USP-S | Kill Confirmed", "$58.90", "Tradable"],
] as const;

// columns auto-sm fits small tiles of at least 9rem: two in a row on a
// phone, six on a wide screen.
export function GridTileGalleryExample3() {
	return (
		<Grid columns="auto-sm" gap="4">
			{items.map(([name, price, status]) => (
				<Card key={name}>
					<CardHeader>
						<CardTitle>{name}</CardTitle>
						<CardDescription>{price}</CardDescription>
					</CardHeader>
					<CardPanel>
						<Badge
							appearance="soft"
							variant={status === "Tradable" ? "success" : "warning"}
						>
							{status}
						</Badge>
					</CardPanel>
				</Card>
			))}
		</Grid>
	);
}
