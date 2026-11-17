import { space } from "@mizen-labs/ui/spacing.stylex";
import { create } from "@stylexjs/stylex";

export const sheetStyles = create({
	// A wide table scrolls inside its card instead of stretching it.
	card: {
		breakInside: "avoid",
		display: "grid",
		gridTemplateColumns: "minmax(0, 1fr)",
		marginBlockEnd: space["4"],
	},
	// Cards flow down columns, so cards of any height pack without gaps.
	columns: {
		columnGap: space["4"],
		columnWidth: "20rem",
	},
	skeletonAvatar: { blockSize: "2.5rem", inlineSize: "2.5rem" },
	skeletonLine: (inlineSize: string) => ({ inlineSize }),
	skeletonRow: {
		alignItems: "center",
		display: "grid",
		gap: space["3"],
		gridTemplateColumns: "auto minmax(0, 1fr)",
	},
});
