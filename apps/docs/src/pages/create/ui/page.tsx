"use client";

import {
	Button,
	Inline,
	SegmentedControl,
	SegmentedControlItem,
	Tooltip,
	TooltipPopup,
	TooltipTrigger,
} from "@mizen-labs/ui";
import { props } from "@stylexjs/stylex";
import {
	IconArrowBackUp,
	IconArrowForwardUp,
	IconMoon,
	IconRestore,
	IconSun,
} from "@tabler/icons-react";
import { useCallback, useMemo, useState } from "react";
import {
	encodePreset,
	type ThemeChoices,
} from "../../../../../../packages/cli/src/theme/create";
import type { PreviewMessage, PreviewView } from "../model/create";
import { useCreate } from "../model/use-create";
import { createStyles } from "./create.styles";
import { CreatePanel } from "./create-controls";

interface Actions {
	dark: () => void;
	redo: () => void;
	reset: () => void;
	shuffle: () => void;
	undo: () => void;
}

interface KeyPress {
	key: string;
	meta: boolean;
	shift: boolean;
}

function act(actions: Actions, { key, meta, shift }: KeyPress): boolean {
	const lower = key.toLowerCase();
	if (meta && lower === "z") {
		(shift ? actions.redo : actions.undo)();
		return true;
	}
	if (meta) {
		return false;
	}
	const plain: Record<string, () => void> = {
		d: actions.dark,
		r: shift ? actions.reset : actions.shuffle,
	};
	plain[lower]?.();
	return lower in plain;
}

const APPLE = /Mac|iPhone|iPad/u;
// The undo key as the reader's keyboard names it. Tooltips mount on hover,
// so the server never renders it.
const modifier = () =>
	typeof navigator !== "undefined" && APPLE.test(navigator.platform)
		? "⌘"
		: "Ctrl+";

const EDITABLE =
	"input, textarea, select, [contenteditable='true'], [role='listbox']";

// r shuffles, ⇧R resets, d switches the preview to dark, ⌘Z and ⇧⌘Z undo
// and redo. They act only while focus is in the page or its preview, never
// in a field or an open menu, so typing elsewhere cannot trigger them.
function useShortcuts(actions: Actions) {
	return useCallback(
		(element: HTMLElement | null) => {
			if (!element) {
				return;
			}
			const keydown = (event: KeyboardEvent) => {
				const target = event.target as HTMLElement | null;
				if (!(target && element.contains(target)) || target.closest(EDITABLE)) {
					return;
				}
				const press = {
					key: event.key,
					meta: event.metaKey || event.ctrlKey,
					shift: event.shiftKey,
				};
				if (act(actions, press)) {
					event.preventDefault();
				}
			};
			const forwarded = (event: MessageEvent) => {
				if (
					event.origin === window.location.origin &&
					event.data?.type === "mizen-create-key"
				) {
					act(actions, event.data as KeyPress);
				}
			};
			window.addEventListener("keydown", keydown);
			window.addEventListener("message", forwarded);
			return () => {
				window.removeEventListener("keydown", keydown);
				window.removeEventListener("message", forwarded);
			};
		},
		[actions]
	);
}

function PreviewFrame({ message }: { message: PreviewMessage }) {
	// The frame loads once; later choices reach it as messages.
	const [src] = useState(
		() => `/create/preview?preset=${message.preset}&view=${message.view}`
	);
	const send = useCallback(
		(frame: HTMLIFrameElement | null) => {
			if (!frame) {
				return;
			}
			const post = () =>
				frame.contentWindow?.postMessage(message, window.location.origin);
			post();
			frame.addEventListener("load", post);
			return () => frame.removeEventListener("load", post);
		},
		[message]
	);
	return (
		<iframe
			ref={send}
			src={src}
			title="Theme preview"
			{...props(createStyles.frame)}
		/>
	);
}

function IconAction({
	children,
	disabled = false,
	hint,
	label,
	onClick,
	shortcut,
}: {
	children: React.ReactNode;
	disabled?: boolean;
	hint: string;
	label: string;
	onClick: () => void;
	shortcut: string;
}) {
	return (
		<Tooltip>
			<TooltipTrigger
				render={
					<Button
						aria-keyshortcuts={shortcut}
						aria-label={label}
						disabled={disabled}
						onClick={onClick}
						size="icon-sm"
						variant="ghost"
					/>
				}
			>
				{children}
			</TooltipTrigger>
			<TooltipPopup>
				{label} · {hint}
			</TooltipPopup>
		</Tooltip>
	);
}

// Mizen Create: pick a theme, see it on a whole app or on components, and
// take the code that sets it up.
export default function CreatePage({
	initial,
	onChange,
}: {
	initial: ThemeChoices;
	onChange: (code: string) => void;
}) {
	const create = useCreate(initial, onChange);
	const undo = useCallback(() => create.step("undo"), [create]);
	const redo = useCallback(() => create.step("redo"), [create]);
	const actions = useMemo(
		() => ({
			dark: create.toggleDark,
			redo,
			reset: create.reset,
			shuffle: create.shuffle,
			undo,
		}),
		[create.reset, create.shuffle, create.toggleDark, redo, undo]
	);
	const shortcuts = useShortcuts(actions);
	const changeView = useCallback(
		(next: string[]) => {
			if (next[0]) {
				create.setView(next[0] as PreviewView);
			}
		},
		[create]
	);
	const message = useMemo<PreviewMessage>(
		() => ({
			dark: create.dark,
			preset: encodePreset(create.shown),
			type: "mizen-create",
			view: create.view,
		}),
		[create.dark, create.shown, create.view]
	);
	return (
		<main id="docs-content" ref={shortcuts} {...props(createStyles.page)}>
			<CreatePanel
				choices={create.choices}
				choose={create.choose}
				locked={create.locked}
				setHover={create.setHover}
				shuffle={create.shuffle}
				toggleLock={create.toggleLock}
			/>
			<section aria-label="Preview" {...props(createStyles.preview)}>
				<div {...props(createStyles.toolbar)}>
					<Inline gap="1" wrap={false}>
						<IconAction
							disabled={!create.canUndo}
							hint={`${modifier()}Z`}
							label="Undo"
							onClick={undo}
							shortcut="Meta+Z"
						>
							<IconArrowBackUp aria-hidden="true" />
						</IconAction>
						<IconAction
							disabled={!create.canRedo}
							hint={`⇧${modifier()}Z`}
							label="Redo"
							onClick={redo}
							shortcut="Meta+Shift+Z"
						>
							<IconArrowForwardUp aria-hidden="true" />
						</IconAction>
						<IconAction
							hint="⇧R"
							label="Reset to the default theme"
							onClick={create.reset}
							shortcut="Shift+R"
						>
							<IconRestore aria-hidden="true" />
						</IconAction>
						<IconAction
							hint="D"
							label={create.dark ? "Light preview" : "Dark preview"}
							onClick={create.toggleDark}
							shortcut="D"
						>
							{create.dark ? (
								<IconSun aria-hidden="true" />
							) : (
								<IconMoon aria-hidden="true" />
							)}
						</IconAction>
					</Inline>
					<SegmentedControl
						aria-label="Preview"
						onValueChange={changeView}
						size="sm"
						value={[create.view]}
					>
						<SegmentedControlItem value="app">App</SegmentedControlItem>
						<SegmentedControlItem value="components">
							Components
						</SegmentedControlItem>
					</SegmentedControl>
				</div>
				<PreviewFrame message={message} />
			</section>
		</main>
	);
}
