"use client";

import {
	Button,
	Dialog,
	DialogDescription,
	DialogHeader,
	DialogPanel,
	DialogPopup,
	DialogTitle,
	DialogTrigger,
	SegmentedControl,
	SegmentedControlItem,
	Stack,
	Tabs,
	TabsIndicator,
	TabsList,
	TabsPanel,
	TabsTab,
	Text,
} from "@mizen-labs/ui";
import { useCallback, useState } from "react";
import {
	encodePreset,
	presetCss,
	type ThemeChoices,
} from "../../../../../../packages/cli/src/theme/create";
import { SourceCode } from "../../../shared/ui/source-code";
import { initCommand, PACKAGE_MANAGERS } from "../model/create";

function Command({ code }: { code: string }) {
	const [manager, setManager] = useState<string>("npm");
	const change = useCallback((next: string[]) => {
		if (next[0]) {
			setManager(next[0]);
		}
	}, []);
	const runner =
		PACKAGE_MANAGERS.find(([name]) => name === manager)?.[1] ?? "npx";
	return (
		<Stack gap="3">
			<SegmentedControl
				aria-label="Package manager"
				onValueChange={change}
				size="sm"
				value={[manager]}
			>
				{PACKAGE_MANAGERS.map(([name]) => (
					<SegmentedControlItem key={name} value={name}>
						{name}
					</SegmentedControlItem>
				))}
			</SegmentedControl>
			<SourceCode code={initCommand(runner, code)} label="Command" />
		</Stack>
	);
}

// The code for the chosen theme: a command for a new or an existing app, or
// the theme file to paste.
export function GetCode({ choices }: { choices: ThemeChoices }) {
	const code = encodePreset(choices);
	return (
		<Dialog>
			<DialogTrigger render={<Button>Get code</Button>} />
			<DialogPopup size="lg">
				<DialogHeader>
					<DialogTitle>Theme {code}</DialogTitle>
					<DialogDescription>
						init sets up Mizen and writes mizen-theme.css with these choices.
					</DialogDescription>
				</DialogHeader>
				<DialogPanel>
					<Tabs defaultValue="new">
						<TabsList aria-label="Where the theme goes">
							<TabsTab value="new">New project</TabsTab>
							<TabsTab value="existing">Existing project</TabsTab>
							<TabsTab value="css">CSS</TabsTab>
							<TabsIndicator />
						</TabsList>
						<TabsPanel value="new">
							<Stack gap="3">
								<Text size="ui" tone="muted">
									Run it in a Next, Vite, or TanStack Start app.
								</Text>
								<Command code={code} />
							</Stack>
						</TabsPanel>
						<TabsPanel value="existing">
							<Stack gap="3">
								<Text size="ui" tone="muted">
									In an app already set up, it adds the theme file and its
									import. It never replaces a mizen-theme.css you edited.
								</Text>
								<Command code={code} />
							</Stack>
						</TabsPanel>
						<TabsPanel value="css">
							<Stack gap="3">
								<Text size="ui" tone="muted">
									Save it as mizen-theme.css and import it after
									@mizen-labs/ui/styles.css.
								</Text>
								<SourceCode
									code={presetCss(choices)}
									label="mizen-theme.css"
									title="mizen-theme.css"
								/>
							</Stack>
						</TabsPanel>
					</Tabs>
				</DialogPanel>
			</DialogPopup>
		</Dialog>
	);
}
