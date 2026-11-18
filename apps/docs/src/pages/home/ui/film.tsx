"use client";

import {
	Badge,
	Button,
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
} from "@mizen-labs/ui";
import { props } from "@stylexjs/stylex";
import { Link } from "@tanstack/react-router";
import { type MouseEvent, useCallback, useRef, useState } from "react";
import {
	FILM_FIELDS,
	FILM_OPTIONS,
	FILM_THEMES,
	type FilmField,
	type FilmTheme,
	fileLines,
	filmTheme,
} from "../model/hero-theme";
import { filmStyles as s } from "./landing.styles";

const ORDERS = [
	["Aspen Lubin", "Shipped", "success", "$1,899"],
	["Kianna Vaccaro", "Waiting", "warning", "$145"],
	["John Clarkson", "Delivery failed", "destructive", "$3,412"],
	["Livia Saris", "Shipped", "success", "$708"],
] as const;

const MOVE_MS = 750;
const PRESS_MS = 140;
const AFTER_MS = 850;
const HOLD_MS = 2400;
const POSTER = FILM_THEMES[1] ?? FILM_THEMES[0];
// The poster marks the accent line: the change that shows most.
const POSTER_CHANGE: FilmField = "accent";

interface Pointer {
	pressed: boolean;
	x: number;
	y: number;
}

const sleep = (ms: number) => new Promise((done) => setTimeout(done, ms));
const reduced = () =>
	window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// The product: a window with a sidebar, a header and its action, three
// figures, and the orders behind them. Filler stays at the edges.
function Product() {
	return (
		<div {...props(s.window)}>
			<div {...props(s.titlebar)}>
				<span {...props(s.lights)}>
					<i {...props(s.light)} />
					<i {...props(s.light)} />
					<i {...props(s.light)} />
				</span>
				<span {...props(s.windowTitle)}>Northstar</span>
			</div>
			<div {...props(s.body)}>
				<div aria-hidden="true" {...props(s.sidebar)}>
					<span {...props(s.navItem, s.navCurrent)}>Orders</span>
					<span {...props(s.navItem)}>Customers</span>
					<i {...props(s.filler, s.fillerWide)} />
					<i {...props(s.filler)} />
					<i {...props(s.filler, s.fillerWide)} />
				</div>
				<div {...props(s.main)}>
					<div {...props(s.mainHead)}>
						<span {...props(s.mainTitle)}>Orders</span>
						<Button size="sm">New order</Button>
					</div>
					<div {...props(s.figures)}>
						{[
							["Revenue", "$48,290"],
							["Orders", "312"],
							["Refunds", "$640"],
						].map(([label, value]) => (
							<div key={label} {...props(s.figure)}>
								<span {...props(s.figureLabel)}>{label}</span>
								<span {...props(s.figureValue)}>{value}</span>
							</div>
						))}
					</div>
					<TableContainer aria-label="Orders">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead scope="col">Customer</TableHead>
									<TableHead scope="col">Status</TableHead>
									<TableHead align="end" scope="col">
										Total
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{ORDERS.map(([name, status, tone, total], index) => (
									<TableRow key={name} selected={index === 0}>
										<TableHead scope="row">{name}</TableHead>
										<TableCell nowrap>
											<Badge appearance="soft" variant={tone}>
												{status}
											</Badge>
										</TableCell>
										<TableCell align="end" nowrap>
											{total}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
					<span {...props(s.switchRow)}>
						<Switch aria-label="Email me failed orders" defaultChecked />
						Email me failed orders
					</span>
				</div>
			</div>
		</div>
	);
}

// The theme panel: what the c‍ursor uses, and what a reader can use too.
// The theme file: three lines, the one just changed marked, its value
// rolling in. It is why the product changed.
function ThemeFile({
	changed,
	shown,
}: {
	changed: FilmField | null;
	shown: FilmTheme;
}) {
	return (
		<div aria-hidden="true" {...props(s.file)}>
			<span {...props(s.fileName)}>mizen-theme.css</span>
			{fileLines(shown).map(([field, name, value]) => (
				<span
					key={field}
					{...props(s.fileLine, changed === field && s.fileLineChanged)}
				>
					<span {...props(s.fileName)}>{name}:</span>{" "}
					<span key={value} {...props(s.fileValue)}>
						{value}
					</span>
				</span>
			))}
		</div>
	);
}

function Panel({
	changed,
	choose,
	shown,
}: {
	changed: FilmField | null;
	choose: (field: FilmField, value: string) => void;
	shown: FilmTheme;
}) {
	const pick = useCallback(
		(field: FilmField) => (next: string[]) => {
			if (next[0]) {
				choose(field, next[0]);
			}
		},
		[choose]
	);
	const accent = useCallback(
		(event: MouseEvent<HTMLButtonElement>) =>
			choose("accent", event.currentTarget.dataset.value ?? "wine"),
		[choose]
	);
	const { code } = filmTheme(shown);
	return (
		<div {...props(s.panel)}>
			<fieldset {...props(s.fieldset)}>
				<legend {...props(s.panelLabel)}>Accent</legend>
				<div {...props(s.swatches)}>
					{FILM_OPTIONS.accent.map(([name, label, color]) => (
						<button
							aria-label={label}
							aria-pressed={shown.accent === name}
							data-film-target={`accent:${name}`}
							data-value={name}
							key={name}
							onClick={accent}
							type="button"
							{...props(s.swatch, s.color(color))}
						/>
					))}
				</div>
			</fieldset>
			{(["radius", "density"] as const).map((field) => (
				<div key={field} {...props(s.panelField)}>
					<span id={`film-${field}`} {...props(s.panelLabel)}>
						{field === "radius" ? "Radius" : "Density"}
					</span>
					<SegmentedControl
						aria-labelledby={`film-${field}`}
						onValueChange={pick(field)}
						size="sm"
						value={[shown[field]]}
					>
						{FILM_OPTIONS[field].map(([name, label]) => (
							<SegmentedControlItem
								data-film-target={`${field}:${name}`}
								key={name}
								value={name}
							>
								{label}
							</SegmentedControlItem>
						))}
					</SegmentedControl>
				</div>
			))}
			<ThemeFile changed={changed} shown={shown} />
			<Link search={{ preset: code }} to="/create" {...props(s.code)}>
				--preset {code}
			</Link>
		</div>
	);
}

function Pointer({ pointer }: { pointer: Pointer | null }) {
	if (!pointer) {
		return null;
	}
	return (
		<svg
			aria-hidden="true"
			fill="none"
			height="22"
			viewBox="0 0 16 22"
			width="16"
			{...props(s.pointer, s.at(pointer.x, pointer.y, pointer.pressed))}
		>
			<path
				d="M1 1v16l4.5-4.2 3 6.7 2.6-1.2-3-6.6H14z"
				fill="#111"
				stroke="#fff"
				strokeLinejoin="round"
				strokeWidth="1.4"
			/>
		</svg>
	);
}

interface Cast {
	setChanged: (field: FilmField | null) => void;
	setPointer: (update: (current: Pointer | null) => Pointer | null) => void;
	setShown: (update: (current: FilmTheme) => FilmTheme) => void;
	taken: { current: boolean };
}

// Where a target's center sits inside the stage.
function centerOf(stage: HTMLElement, target: string) {
	const element = stage.querySelector(`[data-film-target="${target}"]`);
	const box = element?.getBoundingClientRect();
	const frame = stage.getBoundingClientRect();
	return box
		? {
				x: box.left - frame.left + box.width / 2,
				y: box.top - frame.top + box.height / 2,
			}
		: { x: 0, y: 0 };
}

// One beat: move to the option, press it, and let the change land. It
// gives way the moment the reader takes the panel, even mid-beat.
async function beat(
	stage: HTMLElement,
	cast: Cast,
	field: FilmField,
	value: string
) {
	const press = (pressed: boolean) =>
		cast.setPointer((current) => current && { ...current, pressed });
	cast.setPointer(() => ({
		...centerOf(stage, `${field}:${value}`),
		pressed: false,
	}));
	await sleep(MOVE_MS);
	press(true);
	await sleep(PRESS_MS);
	if (cast.taken.current) {
		cast.setPointer(() => null);
		return;
	}
	cast.setChanged(field);
	cast.setShown((current) => ({ ...current, [field]: value }));
	press(false);
	await sleep(AFTER_MS);
}

// Plays the beats round after round while the stage is seen, until it is
// unmounted or the reader takes the panel. Returns the cleanup.
function runFilm(stage: HTMLElement, cast: Cast) {
	// The observer and the cleanup change these between beats.
	const state: { stopped: boolean; visible: boolean } = {
		stopped: false,
		visible: false,
	};
	const observer = new IntersectionObserver(([entry]) => {
		state.visible = Boolean(entry?.isIntersecting);
	});
	observer.observe(stage);
	const waitUntilSeen = async () => {
		while (!(state.visible || state.stopped) || document.hidden) {
			// biome-ignore lint/performance/noAwaitInLoops: the film waits until it is seen.
			await sleep(400);
		}
	};
	const play = async () => {
		for (let round = 1; ; round += 1) {
			const next = FILM_THEMES[round % FILM_THEMES.length] ?? POSTER;
			for (const field of FILM_FIELDS) {
				// biome-ignore lint/performance/noAwaitInLoops: beats play in order.
				await waitUntilSeen();
				if (state.stopped || cast.taken.current) {
					return;
				}
				await beat(stage, cast, field, next[field]);
			}
			await sleep(HOLD_MS);
		}
	};
	play();
	return () => {
		state.stopped = true;
		observer.disconnect();
	};
}

// The film: a c‍ursor sets accent, radius, and density on a live product,
// one beat each, then holds on the result. It plays while in view, stops
// for good when the reader takes the panel, and shows the result as a still
// under reduced motion.
export function Film() {
	const [shown, setShown] = useState<FilmTheme>(FILM_THEMES[0] ?? POSTER);
	const [pointer, setPointer] = useState<Pointer | null>(null);
	const [changed, setChanged] = useState<FilmField | null>(POSTER_CHANGE);
	const taken = useRef(false);

	const choose = useCallback((field: FilmField, value: string) => {
		taken.current = true;
		setPointer(null);
		setChanged(field);
		setShown((current) => ({ ...current, [field]: value }));
	}, []);

	const play = useCallback((stage: HTMLDivElement | null) => {
		if (!stage) {
			return;
		}
		if (reduced()) {
			setShown(POSTER);
			return;
		}
		return runFilm(stage, { setChanged, setPointer, setShown, taken });
	}, []);

	const { css } = filmTheme(shown);
	return (
		<div data-film-theme ref={play} {...props(s.stage)}>
			<style>{css}</style>
			<Product />
			<Panel changed={changed} choose={choose} shown={shown} />
			<Pointer pointer={pointer} />
		</div>
	);
}
