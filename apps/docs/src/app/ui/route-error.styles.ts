import { conditions } from "@mizen-labs/ui/conditions.stylex";
import { space } from "@mizen-labs/ui/spacing.stylex";
import { create } from "@stylexjs/stylex";
import { header } from "../../shared/styles/header.stylex";

export const routeErrorStyles = create({
	notice: { maxWidth: "32rem", width: "100%" },
	// The notice sits in the middle of the window below the header.
	page: {
		alignItems: "center",
		boxSizing: "border-box",
		display: "grid",
		justifyItems: "center",
		minHeight: `calc(100svh - ${header.offset})`,
		paddingBlock: space["10"],
		paddingInline: { default: space["4"], [conditions.md]: space["10"] },
	},
});
