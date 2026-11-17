// @vitest-environment happy-dom
import { act, createElement, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { describe, expect, it, vi } from "vite-plus/test";
import {
	ContextMenu,
	ContextMenuCheckboxItem,
	ContextMenuPopup,
	ContextMenuRadioGroup,
	ContextMenuRadioItem,
	ContextMenuTrigger,
} from "../../../packages/ui/src/components/context-menu/context-menu";
import {
	Menu,
	MenuCheckboxItem,
	MenuPopup,
	MenuRadioGroup,
	MenuRadioItem,
	MenuTrigger,
} from "../../../packages/ui/src/components/menu/menu";

const h = createElement;
Reflect.set(globalThis, "IS_REACT_ACT_ENVIRONMENT", true);
vi.mock("@stylexjs/stylex", () => ({
	create: <T extends object>(styles: T): T => styles,
	defineConsts: <T extends object>(constants: T): T => constants,
	defineMarker: () => ({}),
	defineVars: <T extends object>(variables: T): T => variables,
	keyframes: <T extends object>(frames: T): T => frames,
	props: () => ({}),
	when: { ancestor: () => ":where(*)" },
}));

// The text of each item's children, in DOM order, with the indicator marked.
function order(selector: string) {
	return [...document.body.querySelectorAll(selector)].map((item) =>
		[...item.children].map((child) =>
			child.textContent ? "label" : "indicator"
		)
	);
}

function render(element: ReactNode) {
	const container = document.body.appendChild(document.createElement("div"));
	const root = createRoot(container);
	act(() => root.render(element));
	return () => {
		act(() => root.unmount());
		container.remove();
	};
}

// A checked item ends with its check or dot, as Select does, so labels line
// up at the start of every row.
describe("selection indicators end the row", () => {
	it("in Menu", () => {
		const unmount = render(
			h(
				Menu,
				{ open: true },
				h(MenuTrigger, null, "Open"),
				h(
					MenuPopup,
					null,
					h(MenuCheckboxItem, { defaultChecked: true }, "Show archived"),
					h(
						MenuRadioGroup,
						{ defaultValue: "compact" },
						h(MenuRadioItem, { value: "compact" }, "Compact")
					)
				)
			)
		);
		expect(
			order('[data-slot="menu-checkbox-item"], [data-slot="menu-radio-item"]')
		).toEqual([
			["label", "indicator"],
			["label", "indicator"],
		]);
		unmount();
	});

	it("in Context Menu", () => {
		const unmount = render(
			h(
				ContextMenu,
				{ open: true },
				h(ContextMenuTrigger, null, "Surface"),
				h(
					ContextMenuPopup,
					null,
					h(ContextMenuCheckboxItem, { defaultChecked: true }, "Track"),
					h(
						ContextMenuRadioGroup,
						{ defaultValue: "strict" },
						h(ContextMenuRadioItem, { value: "strict" }, "Strict")
					)
				)
			)
		);
		expect(
			order(
				'[data-slot="context-menu-checkbox-item"], [data-slot="context-menu-radio-item"]'
			)
		).toEqual([
			["label", "indicator"],
			["label", "indicator"],
		]);
		unmount();
	});
});
