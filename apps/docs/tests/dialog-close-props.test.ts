// @vitest-environment happy-dom

import { Dialog, DialogPopup, DialogTitle } from "@mizen-labs/ui/dialog";
import { act, createElement as h } from "react";
import { createRoot } from "react-dom/client";
import { expect, it } from "vite-plus/test";

Reflect.set(globalThis, "IS_REACT_ACT_ENVIRONMENT", true);

it("names the default close button through closeProps", () => {
	const container = document.body.appendChild(document.createElement("div"));
	const root = createRoot(container);
	act(() =>
		root.render(
			h(
				Dialog,
				{ defaultOpen: true },
				h(
					DialogPopup,
					{ closeProps: { "aria-label": "Закрыть" } },
					h(DialogTitle, null, "Title")
				)
			)
		)
	);
	expect(
		document.body
			.querySelector('[data-slot="dialog-default-close"]')
			?.getAttribute("aria-label")
	).toBe("Закрыть");
	act(() => root.unmount());
	container.remove();
});
