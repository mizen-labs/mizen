"use client";

import {
	AreaChart,
	type AreaChartSeries,
	BarList,
	Card,
	CardHeader,
	CardPanel,
	CardTitle,
	Grid,
	MetricDelta,
	MetricTrend,
	Page,
	PageAction,
	PageDescription,
	PageHeader,
	PageTitle,
	SegmentedControl,
	SegmentedControlItem,
} from "@mizen-labs/ui";
import { useCallback, useState } from "react";

const month = (index: number) => Date.UTC(2026, index, 1);
const toPoints = (values: number[]) =>
	values.map((value, index) => ({ time: month(index), value }));

const VISITORS: AreaChartSeries[] = [
	{
		id: "organic",
		label: "Organic",
		points: toPoints([
			3100, 3300, 3500, 3400, 3800, 4100, 4300, 4200, 4600, 4800, 4700, 5100,
		]),
	},
	{
		id: "referral",
		label: "Referral",
		points: toPoints([
			1500, 1600, 1550, 1700, 1800, 1850, 2000, 2100, 2150, 2300, 2400, 2550,
		]),
	},
	{
		id: "paid",
		label: "Paid",
		points: toPoints([
			900, 850, 1100, 1000, 1200, 1300, 1250, 1500, 1550, 1600, 1700, 1850,
		]),
	},
];

const PAGES = [
	{ id: "pricing", label: "/pricing", value: 8420 },
	{ id: "home", label: "/", value: 6310 },
	{ id: "docs", label: "/docs/installation", value: 3980 },
	{ id: "blog", label: "/blog/launch", value: 2240 },
];

const RANGES = [
	["30d", "30 days"],
	["90d", "90 days"],
	["12m", "12 months"],
] as const;

// Traffic for a site: three figures, the trend behind them, and the pages
// that drew it. The range changes the description, as a real one would.
export function App() {
	const [range, setRange] = useState("12m");
	const pick = useCallback((next: string[]) => {
		if (next[0]) {
			setRange(next[0]);
		}
	}, []);
	const label = RANGES.find(([value]) => value === range)?.[1] ?? "12 months";
	return (
		<Page>
			<PageHeader>
				<PageTitle>Analytics</PageTitle>
				<PageDescription>
					Visitors to northstar.dev, last {label}.
				</PageDescription>
				<PageAction>
					<SegmentedControl
						aria-label="Range"
						onValueChange={pick}
						value={[range]}
					>
						{RANGES.map(([value, text]) => (
							<SegmentedControlItem key={value} value={value}>
								{text}
							</SegmentedControlItem>
						))}
					</SegmentedControl>
				</PageAction>
			</PageHeader>
			<Grid columns="auto-sm" gap="4">
				<MetricTrend
					delta={<MetricDelta appearance="soft" value={0.182} />}
					label="Visitors"
					value="114,920"
				/>
				<MetricTrend
					delta={<MetricDelta appearance="soft" value={0.064} />}
					label="Sign-ups"
					value="3,481"
				/>
				<MetricTrend
					delta={<MetricDelta appearance="soft" good="down" value={-0.021} />}
					label="Bounce rate"
					value="38.4%"
				/>
			</Grid>
			<Grid columns="2" gap="4">
				<Card>
					<CardHeader>
						<CardTitle>Visitors by source</CardTitle>
					</CardHeader>
					<CardPanel>
						<AreaChart
							aria-label="Monthly visitors by source"
							series={VISITORS}
							timeZone="UTC"
						/>
					</CardPanel>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Top pages</CardTitle>
					</CardHeader>
					<CardPanel>
						<BarList
							aria-label="Top pages"
							items={PAGES}
							valueLabel="Visitors"
						/>
					</CardPanel>
				</Card>
			</Grid>
		</Page>
	);
}
