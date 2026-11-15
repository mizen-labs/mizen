"use client";

import {
	Button,
	Dialog,
	DialogClose,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogPanel,
	DialogPopup,
	DialogTitle,
	DialogTrigger,
	Field,
	FieldLabel,
	Input,
	Stack,
	Text,
} from "@mizen-labs/ui";
import { type FormEvent, useCallback, useState } from "react";

export function BasicDialog() {
	return (
		<Dialog>
			<DialogTrigger
				render={<Button variant="outline">About this workspace</Button>}
			/>
			<DialogPopup size="sm">
				<DialogHeader>
					<DialogTitle>Product workspace</DialogTitle>
					<DialogDescription>
						A shared place for your team's projects.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<DialogClose render={<Button>Done</Button>} />
				</DialogFooter>
			</DialogPopup>
		</Dialog>
	);
}

export function ControlledDialog() {
	const [open, setOpen] = useState(false);
	const close = useCallback(() => setOpen(false), []);
	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger
				render={<Button variant="outline">Review notifications</Button>}
			/>
			<DialogPopup size="sm">
				<DialogHeader>
					<DialogTitle>Notification preferences</DialogTitle>
					<DialogDescription>
						Workspace notifications are enabled. This example does not save
						settings.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button onClick={close}>Close review</Button>
				</DialogFooter>
			</DialogPopup>
		</Dialog>
	);
}

// A form holds the panel and the footer, so Enter in a field submits and
// the submit button sits in the footer. The spacing stays as without it.
export function DialogFormExample() {
	const [open, setOpen] = useState(false);
	const [category, setCategory] = useState("Regular");
	const save = useCallback((event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		setCategory(String(data.get("category") ?? ""));
		setOpen(false);
	}, []);
	return (
		<Stack gap="2">
			<Dialog onOpenChange={setOpen} open={open}>
				<DialogTrigger
					render={<Button variant="outline">Change category</Button>}
				/>
				<DialogPopup showCloseButton={false} size="sm">
					<DialogHeader>
						<DialogTitle>Change user category</DialogTitle>
						<DialogDescription>
							Choose a new category for the user.
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={save}>
						<DialogPanel>
							<Field>
								<FieldLabel>Category</FieldLabel>
								<Input defaultValue={category} name="category" required />
							</Field>
						</DialogPanel>
						<DialogFooter>
							<DialogClose render={<Button variant="ghost">Cancel</Button>} />
							<Button type="submit">Save</Button>
						</DialogFooter>
					</form>
				</DialogPopup>
			</Dialog>
			<Text size="ui" tone="muted">
				Category: {category}
			</Text>
		</Stack>
	);
}
