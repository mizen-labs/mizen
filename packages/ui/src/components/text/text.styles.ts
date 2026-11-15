import { create } from "@stylexjs/stylex";
import { colors } from "../../styles/colors.stylex";

export const textStyles = create({
	base: { marginBlock: 0 },
	default: { color: colors.content },
	// Clamped to a number of lines, with an ellipsis on the last.
	lines: (count: number) => ({
		display: "-webkit-box",
		minWidth: 0,
		overflow: "hidden",
		overflowWrap: "anywhere",
		WebkitBoxOrient: "vertical",
		WebkitLineClamp: count,
	}),
	muted: { color: colors.mutedContent },
	// One line with an ellipsis. min-width lets it shrink in a flex row.
	truncate: {
		minWidth: 0,
		overflow: "hidden",
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
	},
});
