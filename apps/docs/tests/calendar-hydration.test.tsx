// @vitest-environment happy-dom
import { act, createElement as h } from "react";
import { hydrateRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import { Calendar } from "../../../packages/ui/src/components/calendar/calendar";

vi.mock("@stylexjs/stylex", () => ({
	create: <T extends object>(s: T): T => s,
	createTheme: <T extends object>(_variables: T, overrides: object): object =>
		overrides,
	defineConsts: <T extends object>(c: T): T => c,
	defineMarker: () => ({}),
	defineVars: <T extends object>(v: T): T => v,
	keyframes: <T extends object>(k: T): T => k,
	props: () => ({}),
	when: { ancestor: () => ":where(*)" },
}));

Reflect.set(globalThis, "IS_REACT_ACT_ENVIRONMENT", true);

const today = (container: HTMLElement) =>
	[...container.querySelectorAll("[data-today]")].map(
		(cell) => cell.textContent
	);

afterEach(() => {
	vi.useRealTimers();
});

// The server and the reader can be on different days, by time zone or by a
// page cached overnight. The reader's own day is today.
describe("Calendar hydration", () => {
	it.each(["single", "range"] as const)(
		"marks the reader's today in %s mode, not the server's",
		(mode) => {
			const calendar = h(Calendar, {
				defaultMonth: new Date(2026, 10, 1),
				mode,
			});
			vi.useFakeTimers({ toFake: ["Date"] });
			vi.setSystemTime(new Date(2026, 10, 18, 12));
			const container = document.createElement("div");
			container.innerHTML = renderToString(calendar);
			document.body.append(container);
			expect(today(container)).toEqual(["18"]);

			vi.setSystemTime(new Date(2026, 10, 5, 12));
			let root: Root | undefined;
			act(() => {
				root = hydrateRoot(container, calendar);
			});
			expect(today(container)).toEqual(["5"]);
			expect(
				container.querySelector('[aria-label^="Today"]')?.textContent
			).toBe("5");
			act(() => root?.unmount());
			container.remove();
		}
	);
});
