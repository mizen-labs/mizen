import { defineConsts } from "@stylexjs/stylex";

export const applicationStructure = defineConsts({
	// The lead column of a MetricTrend card is narrower than 14rem.
	narrowMetric: "@container mizen-metric (max-width: 14rem)",
	wideShell: "@container mizen-app-shell (min-width: 48rem)",
});
