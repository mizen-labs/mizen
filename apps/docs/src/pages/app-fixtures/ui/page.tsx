"use client";

import { App } from "../../../entities/documentation/ui/apps/dashboard/app";
import { type FixtureName, fixtures } from "./fixtures";

const NAMES: FixtureName[] = ["demo", "worst", "empty", "one", "many"];
const LABELS: Record<FixtureName, string> = {
	demo: "Demo data",
	empty: "Empty",
	many: "1,000 rows",
	one: "One",
	worst: "Worst case",
};

// The dashboard app with each dataset, for testing edge cases by eye. The
// switch is test chrome, not part of the design under test.
export default function AppFixturesPage({ data }: { data: FixtureName }) {
	return (
		<div data-slot="app-preview">
			<App data={fixtures[data]} key={data} />
			<nav
				aria-label="Dataset"
				style={{
					background: "#e5e5e5",
					borderRadius: 999,
					bottom: 12,
					display: "flex",
					font: "12px system-ui",
					gap: 2,
					left: "50%",
					padding: 2,
					position: "fixed",
					transform: "translateX(-50%)",
					zIndex: 1000,
				}}
			>
				{NAMES.map((name) => (
					<a
						aria-current={name === data ? "page" : undefined}
						href={`?data=${name}`}
						key={name}
						style={{
							background: name === data ? "#fff" : "transparent",
							borderRadius: 999,
							color: "#111",
							padding: "4px 10px",
							textDecoration: "none",
							whiteSpace: "nowrap",
						}}
					>
						{LABELS[name]}
					</a>
				))}
			</nav>
		</div>
	);
}
