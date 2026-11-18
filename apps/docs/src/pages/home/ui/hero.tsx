"use client";

import {
	Badge,
	Button,
	Inline,
	SegmentedControl,
	SegmentedControlItem,
	Switch,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableHeader,
	TableRow,
	Text,
	useCopyToClipboard,
} from "@mizen-labs/ui";
import { props } from "@stylexjs/stylex";
import { IconArrowRight } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { type ChangeEvent, useCallback, useState } from "react";
import {
	HERO_ACCENTS,
	HERO_RADII,
	type HeroAccent,
	type HeroRadius,
	heroTheme,
} from "../model/hero-theme";
import { homeStyles as s } from "./landing.styles";

const ORDERS = [
	["Aspen Lubin", "Shipped", "success"],
	["Kianna Vaccaro", "Waiting", "warning"],
	["John Clarkson", "Delivery failed", "destructive"],
] as const;

const INIT = "npx @mizen-labs/cli@latest init";
const LABELS = { copied: "Copied", failed: "Copy failed", idle: INIT };

// The product at its true size: a header, an action, a few orders.
function Fragment() {
	return (
		<div data-ui {...props(s.fragment)}>
			<div {...props(s.fragmentHead)}>
				<p {...props(s.fragmentTitle)}>Orders this week</p>
				<Inline gap="2" wrap={false}>
					<Button size="sm" variant="outline">
						Export
					</Button>
					<Button size="sm">New order</Button>
				</Inline>
			</div>
			<TableContainer aria-label="Orders this week">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead scope="col">Customer</TableHead>
							<TableHead scope="col">Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{ORDERS.map(([name, status, tone], index) => (
							<TableRow key={name} selected={index === 0}>
								<TableHead scope="row">{name}</TableHead>
								<TableCell nowrap>
									<Badge appearance="soft" variant={tone}>
										{status}
									</Badge>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<label htmlFor="hero-notify">
				<Inline gap="2" wrap={false}>
					<Switch defaultChecked id="hero-notify" />
					<Text size="ui">Tell me when an order fails</Text>
				</Inline>
			</label>
		</div>
	);
}

function ThemeControl({
	accent,
	radius,
	setAccent,
	setRadius,
}: {
	accent: HeroAccent;
	radius: HeroRadius;
	setAccent: (accent: HeroAccent) => void;
	setRadius: (radius: HeroRadius) => void;
}) {
	const pick = useCallback(
		(event: ChangeEvent<HTMLInputElement>) =>
			setAccent(event.currentTarget.value as HeroAccent),
		[setAccent]
	);
	const shape = useCallback(
		(next: string[]) => {
			if (next[0]) {
				setRadius(next[0] as HeroRadius);
			}
		},
		[setRadius]
	);
	const { code } = heroTheme(accent, radius);
	return (
		<div data-ui {...props(s.control)}>
			<fieldset {...props(s.swatches)}>
				<legend {...props(s.controlLabel)}>Accent</legend>
				{HERO_ACCENTS.map(([name, label, color]) => (
					<label key={name} title={label} {...props(s.swatch, s.color(color))}>
						<input
							aria-label={label}
							checked={accent === name}
							name="hero-accent"
							onChange={pick}
							type="radio"
							value={name}
							{...props(s.swatchInput)}
						/>
					</label>
				))}
			</fieldset>
			<div>
				<p id="hero-radius" {...props(s.controlLabel)}>
					Radius
				</p>
				<SegmentedControl
					aria-labelledby="hero-radius"
					onValueChange={shape}
					size="sm"
					value={[radius]}
				>
					{HERO_RADII.map(([name, label]) => (
						<SegmentedControlItem key={name} value={name}>
							{label}
						</SegmentedControlItem>
					))}
				</SegmentedControl>
			</div>
			<Link search={{ preset: code }} to="/create" {...props(s.code, s.link)}>
				Open {code} in Create
			</Link>
		</div>
	);
}

function CopyInit() {
	const { copy, status } = useCopyToClipboard();
	const run = useCallback(() => copy(INIT), [copy]);
	return (
		<Button onClick={run} size="lg" variant="outline">
			<span aria-live="polite">{LABELS[status]}</span>
		</Button>
	);
}

// The first screen: what Mizen is, how to start, and the product taking a
// theme in front of the reader.
export function Hero() {
	const [accent, setAccent] = useState<HeroAccent>("wine");
	const [radius, setRadius] = useState<HeroRadius>("default");
	const { css } = heroTheme(accent, radius);
	return (
		<section aria-labelledby="home-title" {...props(s.hero)}>
			<div {...props(s.heroText)}>
				<h1 id="home-title" {...props(s.title)}>
					Components that take your theme.
				</h1>
				<p {...props(s.lede)}>
					React components for dashboards, data, and agents. One CSS file themes
					every one of them.
				</p>
				<div {...props(s.actions)}>
					<Button
						nativeButton={false}
						render={
							<Link params={{ guide: "installation" }} to="/docs/$guide" />
						}
						role="link"
						size="lg"
					>
						Get started <IconArrowRight aria-hidden="true" size={18} />
					</Button>
					<CopyInit />
				</div>
			</div>
			<div data-hero-theme {...props(s.stage)}>
				<style>{css}</style>
				<Fragment />
				<ThemeControl
					accent={accent}
					radius={radius}
					setAccent={setAccent}
					setRadius={setRadius}
				/>
			</div>
		</section>
	);
}
