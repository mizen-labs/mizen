import {
	AlertDialog,
	AlertDialogClose,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogPanel,
	AlertDialogPopup,
	AlertDialogTitle,
	AlertDialogTrigger,
	Button,
	PropertyList,
	PropertyListItem,
	PropertyListLabel,
	PropertyListValue,
} from "@mizen-labs/ui";

const CHANGE = [
	["Account", "Alpha Player · 76561198000000001"],
	["Operation", "Manual balance correction"],
	["Current balance", "1,250.00 USD"],
	["New balance", "1,000.00 USD"],
] as const;

// The panel shows the exact values the action will commit, aligned with the
// title. On a short screen it scrolls; the title and the actions stay.
export function ConfirmBalanceChange() {
	return (
		<AlertDialog>
			<AlertDialogTrigger
				render={<Button variant="outline">Change balance</Button>}
			/>
			<AlertDialogPopup>
				<AlertDialogHeader>
					<AlertDialogTitle>Change the balance?</AlertDialogTitle>
					<AlertDialogDescription>
						Check the values. The change is logged under your name.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogPanel>
					<PropertyList>
						{CHANGE.map(([label, value]) => (
							<PropertyListItem key={label}>
								<PropertyListLabel>{label}</PropertyListLabel>
								<PropertyListValue>{value}</PropertyListValue>
							</PropertyListItem>
						))}
					</PropertyList>
				</AlertDialogPanel>
				<AlertDialogFooter>
					<AlertDialogClose render={<Button variant="ghost">Cancel</Button>} />
					<AlertDialogClose render={<Button>Change balance</Button>} />
				</AlertDialogFooter>
			</AlertDialogPopup>
		</AlertDialog>
	);
}

export function ConfirmDiscard() {
	return (
		<AlertDialog>
			<AlertDialogTrigger
				render={<Button variant="destructive-outline">Discard draft</Button>}
			/>
			<AlertDialogPopup>
				<AlertDialogHeader>
					<AlertDialogTitle>Discard this draft?</AlertDialogTitle>
					<AlertDialogDescription>
						Your unsaved changes will be lost. You can keep editing or discard
						the draft and start again.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogClose
						render={<Button variant="ghost">Keep draft</Button>}
					/>
					<AlertDialogClose
						render={<Button variant="destructive">Discard</Button>}
					/>
				</AlertDialogFooter>
			</AlertDialogPopup>
		</AlertDialog>
	);
}
