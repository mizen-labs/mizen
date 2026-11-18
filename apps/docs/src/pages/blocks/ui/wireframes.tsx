import { props } from "@stylexjs/stylex";
import { wireStyles as w } from "./blocks.styles";

// Small drawings of each category, in the page's grays with one accent mark.
// They hint at the kind of screen, not at any one block.

function AppShell() {
	return (
		<div {...props(w.frame)}>
			<div {...props(w.sidebar)}>
				<i {...props(w.line, w.short)} />
				<i {...props(w.line)} />
				<i {...props(w.line, w.accent)} />
				<i {...props(w.line, w.short)} />
			</div>
			<div {...props(w.content)}>
				<i {...props(w.line, w.title)} />
				<i {...props(w.fill)} />
			</div>
		</div>
	);
}

function Dashboard() {
	return (
		<div {...props(w.column)}>
			<div {...props(w.row)}>
				<i {...props(w.fill, w.figure)} />
				<i {...props(w.fill, w.figure)} />
				<i {...props(w.fill, w.figure)} />
			</div>
			<svg
				aria-hidden="true"
				preserveAspectRatio="none"
				viewBox="0 0 100 30"
				{...props(w.chart)}
			>
				<path
					d="M0 26 C15 22 25 24 35 17 S60 12 70 8 S90 4 100 2 V30 H0Z"
					{...props(w.area)}
				/>
				<path
					d="M0 26 C15 22 25 24 35 17 S60 12 70 8 S90 4 100 2"
					vectorEffect="non-scaling-stroke"
					{...props(w.stroke)}
				/>
			</svg>
		</div>
	);
}

function Settings() {
	return (
		<div {...props(w.column)}>
			<i {...props(w.line, w.title)} />
			<i {...props(w.field)} />
			<div {...props(w.setting)}>
				<i {...props(w.line, w.short)} />
				<i {...props(w.toggle, w.accentFill)} />
			</div>
			<div {...props(w.setting)}>
				<i {...props(w.line, w.short)} />
				<i {...props(w.toggle)} />
			</div>
		</div>
	);
}

export const WIREFRAMES: Record<string, () => React.JSX.Element> = {
	"app-shell": AppShell,
	dashboard: Dashboard,
	settings: Settings,
};
