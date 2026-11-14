import {
	Badge,
	Button,
	Drawer,
	DrawerClose,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerPanel,
	DrawerPopup,
	DrawerTitle,
	DrawerTrigger,
	Select,
	SelectItem,
	SelectLabel,
	SelectPopup,
	SelectTrigger,
	SelectValue,
	Stack,
	Text,
} from "@mizen-labs/ui";

const STATUS = { active: "Active", all: "All players", banned: "Banned" };
const TIER = { all: "All tiers", streamer: "Streamer", vip: "VIP" };

// Popups inside a drawer, such as a Select list, open above it.
export function DrawerFiltersExample2() {
	return (
		<Drawer position="right">
			<DrawerTrigger render={<Button variant="outline">Filters</Button>} />
			<DrawerPopup showCloseButton variant="inset">
				<DrawerHeader>
					<DrawerTitle>Filters</DrawerTitle>
					<DrawerDescription>Narrow the player list.</DrawerDescription>
				</DrawerHeader>
				<DrawerPanel>
					<Stack>
						<Select defaultValue="all" items={STATUS} name="status">
							<SelectLabel>Status</SelectLabel>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectPopup>
								<SelectItem value="all">All players</SelectItem>
								<SelectItem value="active">Active</SelectItem>
								<SelectItem value="banned">Banned</SelectItem>
							</SelectPopup>
						</Select>
						<Select defaultValue="all" items={TIER} name="tier">
							<SelectLabel>Tier</SelectLabel>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectPopup>
								<SelectItem value="all">All tiers</SelectItem>
								<SelectItem value="vip">VIP</SelectItem>
								<SelectItem value="streamer">Streamer</SelectItem>
							</SelectPopup>
						</Select>
					</Stack>
				</DrawerPanel>
				<DrawerFooter>
					<DrawerClose render={<Button>Apply filters</Button>} />
				</DrawerFooter>
			</DrawerPopup>
		</Drawer>
	);
}

export function DrawerProductionWorkspaceExample1() {
	return (
		<Stack gap="4">
			<Drawer position="bottom">
				<DrawerTrigger
					render={<Button variant="outline">View project activity</Button>}
				/>
				<DrawerPopup showBar variant="inset">
					<DrawerHeader>
						<DrawerTitle>Project activity</DrawerTitle>
						<DrawerDescription>
							Recent events and deployment updates for this project.
						</DrawerDescription>
					</DrawerHeader>
					<DrawerPanel allowSelection scrollable>
						<Stack gap="3">
							<Stack gap="1">
								<Text size="ui" tone="muted">
									<Badge size="sm" variant="success">
										Deployed
									</Badge>{" "}
									Production release v2.4.1 completed.
								</Text>
								<Text size="caption">2 minutes ago by automated pipeline</Text>
							</Stack>
							<Stack gap="1">
								<Text size="ui" tone="muted">
									<Badge size="sm" variant="info">
										Sync
									</Badge>{" "}
									Schema migrations applied to primary database cluster.
								</Text>
								<Text size="caption">14 minutes ago by release-bot</Text>
							</Stack>
							<Stack gap="1">
								<Text size="ui" tone="muted">
									<Badge size="sm" variant="brand">
										Build
									</Badge>{" "}
									Static site assets generated and cached across edge nodes.
								</Text>
								<Text size="caption">28 minutes ago by ci-runner-04</Text>
							</Stack>
							<Stack gap="1">
								<Text size="ui" tone="muted">
									<Badge size="sm" variant="default">
										Audit
									</Badge>{" "}
									Automated vulnerability scan passed with zero findings.
								</Text>
								<Text size="caption">1 hour ago by security-agent</Text>
							</Stack>
						</Stack>
					</DrawerPanel>
					<DrawerFooter>
						<DrawerClose
							render={<Button variant="outline">Close activity</Button>}
						/>
					</DrawerFooter>
				</DrawerPopup>
			</Drawer>
		</Stack>
	);
}
