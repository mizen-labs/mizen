"use client";

import {
	Avatar,
	AvatarFallback,
	Button,
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardPanel,
	CardTitle,
	Field,
	FieldDescription,
	FieldLabel,
	Inline,
	Input,
	Page,
	PageDescription,
	PageHeader,
	PageTitle,
	Stack,
	Textarea,
} from "@mizen-labs/ui";

// A profile: who you are, as others see it, saved in one place.
export function App() {
	return (
		<Page>
			<PageHeader>
				<PageTitle>Profile</PageTitle>
				<PageDescription>How you appear to your team.</PageDescription>
			</PageHeader>
			<Card>
				<CardHeader>
					<CardTitle>Public profile</CardTitle>
					<CardDescription>
						Shown on your comments and in the member list.
					</CardDescription>
				</CardHeader>
				<CardPanel>
					<Stack gap="5">
						<Inline gap="4" wrap={false}>
							<Avatar size="lg">
								<AvatarFallback>MC</AvatarFallback>
							</Avatar>
							<Inline gap="2">
								<Button variant="outline">Upload photo</Button>
								<Button variant="ghost">Remove</Button>
							</Inline>
						</Inline>
						<Field>
							<FieldLabel>Name</FieldLabel>
							<Input autoComplete="name" defaultValue="Maya Chen" name="name" />
						</Field>
						<Field>
							<FieldLabel>Email</FieldLabel>
							<Input
								autoComplete="email"
								defaultValue="maya@northstar.dev"
								name="email"
								type="email"
							/>
							<FieldDescription>
								We send sign-in links and receipts here.
							</FieldDescription>
						</Field>
						<Field>
							<FieldLabel>Bio</FieldLabel>
							<Textarea
								defaultValue="Design lead at Northstar."
								name="bio"
								rows={3}
							/>
						</Field>
					</Stack>
				</CardPanel>
				<CardFooter>
					<Button>Save changes</Button>
					<Button variant="ghost">Cancel</Button>
				</CardFooter>
			</Card>
		</Page>
	);
}
