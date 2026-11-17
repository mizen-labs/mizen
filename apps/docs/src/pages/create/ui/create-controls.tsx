"use client";

import "@fontsource-variable/inter/wght.css";
import "@fontsource-variable/ibm-plex-sans/wght.css";
import "@fontsource-variable/manrope/wght.css";
import {
	Button,
	Menu,
	MenuPopup,
	MenuRadioGroup,
	MenuRadioItem,
	MenuTrigger,
	Tooltip,
	TooltipPopup,
	TooltipTrigger,
	useCopyToClipboard,
} from "@mizen-labs/ui";
import { props } from "@stylexjs/stylex";
import { IconDice5, IconLock, IconLockOpen } from "@tabler/icons-react";
import {
	Fragment,
	type RefObject,
	type SyntheticEvent,
	useCallback,
	useRef,
	useSyncExternalStore,
} from "react";
import {
	encodePreset,
	type ThemeChoices,
} from "../../../../../../packages/cli/src/theme/create";
import {
	densitySize,
	FIELD_LABELS,
	type Field,
	fontFamily,
	initCommand,
	MENU_ORDER,
	optionLabel,
	radiusFactor,
	swatch,
} from "../model/create";
import { createStyles } from "./create.styles";
import { GetCode } from "./get-code";

const WIDE_QUERY = "(min-width: 48rem)";

function subscribeWide(onChange: () => void) {
	const query = window.matchMedia(WIDE_QUERY);
	query.addEventListener("change", onChange);
	return () => query.removeEventListener("change", onChange);
}
const isWide = () => window.matchMedia(WIDE_QUERY).matches;
const wideOnServer = () => true;

interface GlyphProps {
	field: Field;
	name: string;
}

function Dot({ field, name }: GlyphProps) {
	return (
		<span
			{...props(
				createStyles.dot,
				createStyles.color(swatch(field as "accent", name))
			)}
		/>
	);
}

function FontSample({ name }: GlyphProps) {
	return (
		<span
			{...props(createStyles.fontSample, createStyles.family(fontFamily(name)))}
		>
			Aa
		</span>
	);
}

// A corner whose curve follows the radius.
function RadiusGlyph({ name }: GlyphProps) {
	const r = radiusFactor(name) * 7;
	return (
		<svg
			aria-hidden="true"
			fill="none"
			height="16"
			viewBox="0 0 16 16"
			width="16"
		>
			<path
				d={`M3 14V${3 + r}${r ? `Q3 3 ${3 + r} 3` : ""}H14`}
				stroke="currentColor"
				strokeLinecap="round"
				strokeWidth="1.75"
			/>
		</svg>
	);
}

// Three rows, spaced by the control height.
function DensityGlyph({ name }: GlyphProps) {
	const gap = (densitySize(name) - 1.5) * 4 + 1.5;
	return (
		<svg
			aria-hidden="true"
			fill="none"
			height="16"
			viewBox="0 0 16 16"
			width="16"
		>
			{[-gap, 0, gap].map((offset) => (
				<path
					d={`M3 ${8 + offset}H13`}
					key={offset}
					stroke="currentColor"
					strokeLinecap="round"
					strokeWidth="1.75"
				/>
			))}
		</svg>
	);
}

const GLYPHS = {
	accent: Dot,
	density: DensityGlyph,
	font: FontSample,
	neutral: Dot,
	radius: RadiusGlyph,
} as const;

function Indicator({ field, name }: GlyphProps) {
	const Glyph = GLYPHS[field];
	return (
		<span aria-hidden="true" {...props(createStyles.indicator)}>
			<Glyph field={field} name={name} />
		</span>
	);
}

export interface PickerProps {
	anchor: RefObject<HTMLElement | null>;
	choose: <F extends Field>(field: F, value: ThemeChoices[F]) => void;
	field: Field;
	locked: boolean;
	setHover: (hover: Partial<ThemeChoices> | null) => void;
	toggleLock: (field: Field) => void;
	value: string;
	wide: boolean;
}

// One theme field: its name and value, a menu of its options that previews
// the option under the pointer or the keyboard, and a lock that keeps it
// through a shuffle.
function Picker({
	anchor,
	choose,
	field,
	locked,
	setHover,
	toggleLock,
	value,
	wide,
}: PickerProps) {
	const show = useCallback(
		(event: SyntheticEvent<HTMLElement>) => {
			const { value: name } = event.currentTarget.dataset;
			if (name && wide) {
				setHover({ [field]: name } as Partial<ThemeChoices>);
			}
		},
		[field, setHover, wide]
	);
	const clear = useCallback(() => setHover(null), [setHover]);
	const change = useCallback(
		(next: unknown) => {
			if (typeof next === "string") {
				choose(field, next as never);
			}
		},
		[choose, field]
	);
	const openChange = useCallback(
		(open: boolean) => {
			if (!open) {
				clear();
			}
		},
		[clear]
	);
	const lock = useCallback(() => toggleLock(field), [field, toggleLock]);
	const label = FIELD_LABELS[field];
	const Glyph = locked ? IconLock : IconLockOpen;
	return (
		<div {...props(createStyles.picker)}>
			<Menu onOpenChange={openChange}>
				<MenuTrigger
					render={<button type="button" {...props(createStyles.trigger)} />}
				>
					<span {...props(createStyles.triggerText)}>
						<span {...props(createStyles.triggerLabel)}>{label}</span>
						<span {...props(createStyles.triggerValue)}>
							{optionLabel(field, value)}
						</span>
					</span>
					<Indicator field={field} name={value} />
				</MenuTrigger>
				<MenuPopup
					align={wide ? "start" : "center"}
					anchor={wide ? undefined : anchor}
					aria-label={label}
					onPointerLeave={clear}
					side={wide ? "inline-end" : "top"}
					sideOffset={8}
				>
					<MenuRadioGroup onValueChange={change} value={value}>
						{MENU_ORDER[field].map((name) => (
							<MenuRadioItem
								closeOnClick={!wide}
								data-value={name}
								key={name}
								onFocus={show}
								onPointerMove={show}
								value={name}
							>
								<span {...props(createStyles.option)}>
									<Indicator field={field} name={name} />
									{optionLabel(field, name)}
								</span>
							</MenuRadioItem>
						))}
					</MenuRadioGroup>
				</MenuPopup>
			</Menu>
			<span {...props(createStyles.lock)}>
				<Button
					aria-label={`Keep ${label.toLowerCase()} when shuffling`}
					aria-pressed={locked}
					onClick={lock}
					size="icon-xs"
					variant="ghost"
				>
					<Glyph aria-hidden="true" />
				</Button>
			</span>
		</div>
	);
}

const GROUPS: readonly (readonly Field[])[] = [
	["accent", "neutral"],
	["font"],
	["radius", "density"],
];

// Copies the init command; the preset code is its face.
function CopyCommand({ code }: { code: string }) {
	const { copy, status } = useCopyToClipboard();
	const run = useCallback(() => copy(initCommand("npm", code)), [code, copy]);
	return (
		<span {...props(createStyles.codeButton)}>
			<Tooltip>
				<TooltipTrigger
					render={
						<Button
							aria-label={`Copy the init command for ${code}`}
							onClick={run}
							variant="outline"
						/>
					}
				>
					<span {...props(createStyles.code)}>
						{status === "copied" ? (
							"Copied"
						) : (
							<>
								<span {...props(createStyles.codePrefix)}>--preset </span>
								{code}
							</>
						)}
					</span>
				</TooltipTrigger>
				<TooltipPopup>Copy the init command</TooltipPopup>
			</Tooltip>
		</span>
	);
}

export interface PanelProps
	extends Pick<PickerProps, "choose" | "setHover" | "toggleLock"> {
	choices: ThemeChoices;
	locked: ReadonlySet<Field>;
	shuffle: () => void;
}

// The theme panel: a picker per field, grouped by color, type and shape,
// then the code, Shuffle and Get code.
export function CreatePanel({
	choices,
	locked,
	shuffle,
	...actions
}: PanelProps) {
	const anchor = useRef<HTMLElement>(null);
	const wide = useSyncExternalStore(subscribeWide, isWide, wideOnServer);
	const code = encodePreset(choices);
	return (
		<section aria-label="Theme" ref={anchor} {...props(createStyles.panel)}>
			<div {...props(createStyles.pickers)}>
				{GROUPS.map((fields, index) => (
					<Fragment key={fields.join()}>
						{index > 0 ? <hr {...props(createStyles.separator)} /> : null}
						{fields.map((field) => (
							<Picker
								{...actions}
								anchor={anchor}
								field={field}
								key={field}
								locked={locked.has(field)}
								value={choices[field]}
								wide={wide}
							/>
						))}
					</Fragment>
				))}
			</div>
			<div {...props(createStyles.footer)}>
				<CopyCommand code={code} />
				<span {...props(createStyles.footerAction)}>
					<Tooltip>
						<TooltipTrigger
							render={
								<Button
									aria-keyshortcuts="R"
									onClick={shuffle}
									variant="outline"
								/>
							}
						>
							<IconDice5 aria-hidden="true" />
							Shuffle
						</TooltipTrigger>
						<TooltipPopup>Shuffle the unlocked fields · R</TooltipPopup>
					</Tooltip>
				</span>
				<span {...props(createStyles.footerAction)}>
					<GetCode choices={choices} />
				</span>
			</div>
		</section>
	);
}
