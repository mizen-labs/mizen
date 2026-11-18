"use client";

import {
	Card,
	CardDescription,
	CardHeader,
	CardPanel,
	CardTitle,
	Field,
	FieldDescription,
	FieldLabel,
	Page,
	PageDescription,
	PageHeader,
	PageTitle,
	RadioCard,
	RadioGroup,
	Separator,
	Stack,
	Switch,
} from "@mizen-labs/ui";

const CHANNELS = [
	[
		"mentions",
		"Mentions",
		"When someone mentions you or replies to you.",
		true,
	],
	["assigned", "Assignments", "When a task is assigned to you.", true],
	[
		"digest",
		"Weekly digest",
		"A summary of your workspace every Monday.",
		false,
	],
] as const;

// Notifications: which events reach you, and how often. Each switch saves on
// its own, so there is no Save button.
export function App() {
	return (
		<Page>
			<PageHeader>
				<PageTitle>Notifications</PageTitle>
				<PageDescription>Changes save as you make them.</PageDescription>
			</PageHeader>
			<Card>
				<CardHeader>
					<CardTitle>Email</CardTitle>
					<CardDescription>What we write to you about.</CardDescription>
				</CardHeader>
				<CardPanel>
					<Stack gap="4">
						{CHANNELS.map(([id, label, text, on], index) => (
							<Stack gap="4" key={id}>
								{index > 0 ? <Separator /> : null}
								<Field>
									<FieldLabel>
										<Switch defaultChecked={on} name={id} />
										{label}
									</FieldLabel>
									<FieldDescription>{text}</FieldDescription>
								</Field>
							</Stack>
						))}
					</Stack>
				</CardPanel>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Delivery</CardTitle>
					<CardDescription>How often notifications arrive.</CardDescription>
				</CardHeader>
				<CardPanel>
					<RadioGroup
						aria-label="Delivery"
						defaultValue="hourly"
						name="delivery"
					>
						<RadioCard
							description="Each one as it happens."
							label="Right away"
							value="now"
						/>
						<RadioCard
							description="Grouped, at most once an hour."
							label="Hourly"
							value="hourly"
						/>
						<RadioCard
							description="One email at 9 AM."
							label="Daily"
							value="daily"
						/>
					</RadioGroup>
				</CardPanel>
			</Card>
		</Page>
	);
}
