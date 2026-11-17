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
import {
	FRAMEWORKS,
	type Framework,
	initCommand,
	newProjectCommands,
	PACKAGE_MANAGERS,
	type PackageManager,
} from "../model/create";

function Choices<Value extends string>({
	label,
	onChange,
	options,
	value,
}: {
	label: string;
	onChange: (value: Value) => void;
	options: readonly (readonly [Value, string])[];
	value: Value;
}) {
	const change = useCallback(
		(next: Value[]) => {
			if (next[0]) {
				onChange(next[0]);
			}
		},
		[onChange]
	);
	return (
		<SegmentedControl
			aria-label={label}
			onValueChange={change}
			size="sm"
			value={[value]}
		>
			{options.map(([name, text]) => (
				<SegmentedControlItem key={name} value={name}>
					{text}
				</SegmentedControlItem>
			))}
		</SegmentedControl>
	);
}

const MANAGER_OPTIONS = PACKAGE_MANAGERS.map(([name]) => [name, name] as const);
const FRAMEWORK_OPTIONS = FRAMEWORKS.map(
	([name, label]) => [name, label] as const
);

// The code for the chosen theme: commands that start a new app with it or
// add it to an app already set up, or the theme file to paste.
export function GetCode({ choices }: { choices: ThemeChoices }) {
	const code = encodePreset(choices);
	const [manager, setManager] = useState<PackageManager>("npm");
	const [framework, setFramework] = useState<Framework>("next");
	const managers = (
		<Choices
			label="Package manager"
			onChange={setManager}
			options={MANAGER_OPTIONS}
			value={manager}
		/>
	);
	return (
		<Dialog>
			<DialogTrigger render={<Button>Get code</Button>} />
			<DialogPopup size="lg">
				<DialogHeader>
					<DialogTitle>Theme {code}</DialogTitle>
					<DialogDescription>
						Init sets up Mizen and writes mizen-theme.css with these choices.
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
									Start an app, then set it up with the theme.
								</Text>
								<Choices
									label="Framework"
									onChange={setFramework}
									options={FRAMEWORK_OPTIONS}
									value={framework}
								/>
								{managers}
								<SourceCode
									code={newProjectCommands(manager, framework, code)}
									label="Commands"
								/>
							</Stack>
						</TabsPanel>
						<TabsPanel value="existing">
							<Stack gap="3">
								<Text size="ui" tone="muted">
									Run it in a Next.js, Vite, or TanStack Start app. It adds the
									theme file and its import, and never replaces a
									mizen-theme.css you edited.
								</Text>
								{managers}
								<SourceCode code={initCommand(manager, code)} label="Command" />
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
