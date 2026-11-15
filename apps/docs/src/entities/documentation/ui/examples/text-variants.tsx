import { Avatar, AvatarFallback, Inline, Stack } from "@mizen-labs/ui";
import { Text, type TextProps } from "@mizen-labs/ui/text";
import { props } from "@stylexjs/stylex";
import { pageStyles } from "../page.styles";

const runtimeRoleProbeProps: TextProps & { readonly role: "status" } = {
	role: "status",
};
export function TextReleaseNotesExample1() {
	return (
		<Stack gap="4">
			<div {...props(pageStyles.typographySpecimen)}>
				<Text {...runtimeRoleProbeProps}>
					Mizen helps teams compose interfaces with consistent tokens,
					accessible markup, and theme-driven styles.
				</Text>
				<Text size="body">
					Body text sets the primary reading size for cards, articles, dialog
					descriptions, and settings panels.
				</Text>
				<Text size="ui" tone="muted">
					Helper copy and supporting details remain readable in dense sidebars,
					table rows, and form fields.
				</Text>
				<Text size="caption">Updated 2 minutes ago by Sam.</Text>
				<Text>
					When an explanation runs long on small screens, the paragraph wraps
					naturally to maintain a comfortable reading flow and keep surrounding
					spacing tidy.
				</Text>
			</div>
		</Stack>
	);
}

// Long text from data stays in its box: truncate keeps one line, lines clamps
// to a count. While the text is cut, its full content shows as a tooltip.
export function TextLongValuesExample2() {
	return (
		<Stack gap="4">
			<Inline gap="2" wrap={false}>
				<Avatar size="sm">
					<AvatarFallback>NI</AvatarFallback>
				</Avatar>
				<Text size="ui" truncate>
					Northwind Industries Holdings International
				</Text>
			</Inline>
			<Text lines={2} size="ui" tone="muted">
				Senior Product Design Engineer, Platform Infrastructure and Developer
				Experience, responsible for the design system, the component library,
				and the documentation site.
			</Text>
		</Stack>
	);
}
