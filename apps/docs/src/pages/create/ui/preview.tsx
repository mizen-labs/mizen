"use client";

import "@fontsource-variable/inter/wght.css";
import "@fontsource-variable/ibm-plex-sans/wght.css";
import "@fontsource-variable/manrope/wght.css";
import { darkTheme } from "@mizen-labs/ui";
import { props } from "@stylexjs/stylex";
import { useCallback, useState } from "react";
import { presetCss } from "../../../../../../packages/cli/src/theme/create";
import { apps } from "../../../entities/documentation/ui/apps";
import {
	choicesFrom,
	isPreviewMessage,
	type PreviewMessage,
} from "../model/create";
import { ComponentsPreview } from "./components-preview";

const DARK_CLASSES = String(props(darkTheme).className ?? "")
	.split(" ")
	.filter(Boolean);

// The preview owns its document's theme, so the Create page around it keeps
// its own. Setting the attribute and the classes directly leaves the
// stored preference alone.
function applyDark(dark: boolean) {
	const root = document.documentElement;
	root.setAttribute("data-theme", dark ? "dark" : "light");
	for (const name of DARK_CLASSES) {
		root.classList.toggle(name, dark);
	}
	root.style.colorScheme = dark ? "dark" : "light";
}

// Keys the Create page answers, forwarded while the preview has focus.
function forwardKey(event: KeyboardEvent) {
	const target = event.target as HTMLElement | null;
	if (target?.closest("input, textarea, select, [contenteditable='true']")) {
		return;
	}
	window.parent.postMessage(
		{
			key: event.key,
			meta: event.metaKey || event.ctrlKey,
			shift: event.shiftKey,
			type: "mizen-create-key",
		},
		window.location.origin
	);
}

function subscribe(onChange: (message: PreviewMessage) => void) {
	const receive = (event: MessageEvent) => {
		if (
			event.origin === window.location.origin &&
			isPreviewMessage(event.data)
		) {
			onChange(event.data);
		}
	};
	window.addEventListener("message", receive);
	window.addEventListener("keydown", forwardKey);
	return () => {
		window.removeEventListener("message", receive);
		window.removeEventListener("keydown", forwardKey);
	};
}

export default function CreatePreview({
	initial,
}: {
	initial: PreviewMessage;
}) {
	const [state, setState] = useState(initial);
	// Messages replace the state; the first render uses the URL's.
	const listen = useCallback(
		(element: HTMLDivElement | null) => {
			if (!element) {
				return;
			}
			applyDark(initial.dark);
			return subscribe((message) => {
				applyDark(message.dark);
				setState(message);
			});
		},
		[initial.dark]
	);
	const { App } = apps.dashboard;
	return (
		<div data-slot="app-preview" ref={listen}>
			<style>{presetCss(choicesFrom(state.preset))}</style>
			{state.view === "app" && App ? <App /> : <ComponentsPreview />}
		</div>
	);
}
