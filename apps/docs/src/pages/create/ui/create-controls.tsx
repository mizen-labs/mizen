"use client";

import "./fonts";
import {
	Button,
	Menu,
	MenuGroup,
	MenuGroupLabel,
	MenuPopup,
	MenuRadioGroup,
	MenuRadioItem,
	MenuSeparator,
	MenuTrigger,
	SegmentedControl,
	SegmentedControlItem,
	Tooltip,
	TooltipPopup,
	TooltipTrigger,
	useCopyToClipboard,
} from "@mizen-labs/ui";
import { props } from "@stylexjs/stylex";
import {
	IconChevronDown,
	IconDice5,
	IconLock,
	IconLockOpen,
} from "@tabler/icons-react";
import {
	type ChangeEvent,
	Fragment,
	type ReactNode,
	type RefObject,
	type SyntheticEvent,
	useCallback,
	useRef,
	useState,
	useSyncExternalStore,
} from "react";
import {
	encodePreset,
	type ThemeChoices,
} from "../../../../../../packages/cli/src/theme/create";
import {
	FIELD_LABELS,
	type Field,
	fontFamily,
	fontGroups,
	initCommand,
	MENU_ORDER,
	optionLabel,
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

export interface FieldProps {
	anchor: RefObject<HTMLElement | null>;
	choose: <F extends Field>(field: F, value: ThemeChoices[F]) => void;
	field: Field;
	locked: boolean;
	setHover: (hover: Partial<ThemeChoices> | null) => void;
	toggleLock: (field: Field) => void;
	value: string;
	wide: boolean;
}

// The option under the pointer or the keyboard shows in the preview until
// the pointer leaves; choosing commits it.
function usePreview({ field, setHover, wide }: FieldProps) {
	const show = useCallback(
		(event: SyntheticEvent<HTMLElement>) => {
			const { value } = event.currentTarget.dataset;
			if (value && wide) {
				setHover({ [field]: value } as Partial<ThemeChoices>);
			}
		},
		[field, setHover, wide]
	);
	const clear = useCallback(() => setHover(null), [setHover]);
	return { clear, show };
}

// A field's name, its chosen value, and a lock that keeps it through a
// shuffle.
function FieldHeader({
	field,
	locked,
	named,
	toggleLock,
}: Pick<FieldProps, "field" | "locked" | "toggleLock"> & {
	named?: string;
}) {
	const lock = useCallback(() => toggleLock(field), [field, toggleLock]);
	const label = FIELD_LABELS[field];
	const Glyph = locked ? IconLock : IconLockOpen;
	return (
		<div {...props(createStyles.fieldHeader)}>
			<span id={`${field}-label`} {...props(createStyles.fieldLabel)}>
				{label}
			</span>
			{named ? <span {...props(createStyles.fieldValue)}>{named}</span> : null}
			<span {...props(createStyles.lock, locked && createStyles.lockOn)}>
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

// Colors as a row of swatches: one click chooses, arrow keys move.
function SwatchField(control: FieldProps) {
	const { choose, field, value } = control;
	const { clear, show } = usePreview(control);
	const change = useCallback(
		(event: ChangeEvent<HTMLInputElement>) =>
			choose(field, event.currentTarget.value as never),
		[choose, field]
	);
	return (
		<div {...props(createStyles.field)}>
			<FieldHeader {...control} named={optionLabel(field, value)} />
			<fieldset
				aria-labelledby={`${field}-label`}
				onPointerLeave={clear}
				{...props(createStyles.swatches)}
			>
				{MENU_ORDER[field].map((name) => (
					<label
						data-value={name}
						key={name}
						onPointerEnter={show}
						title={optionLabel(field, name)}
						{...props(
							createStyles.swatch,
							createStyles.color(swatch(field as "accent", name))
						)}
					>
						<input
							aria-label={optionLabel(field, name)}
							checked={value === name}
							name={field}
							onChange={change}
							type="radio"
							value={name}
							{...props(createStyles.swatchInput)}
						/>
					</label>
				))}
			</fieldset>
		</div>
	);
}

// Sizes as a segmented control, smallest first.
function SegmentField(control: FieldProps) {
	const { choose, field, value } = control;
	const { clear, show } = usePreview(control);
	const change = useCallback(
		(next: string[]) => {
			if (next[0]) {
				choose(field, next[0] as never);
			}
		},
		[choose, field]
	);
	return (
		<div {...props(createStyles.field)}>
			<FieldHeader {...control} />
			<div onPointerLeave={clear} {...props(createStyles.segments)}>
				<SegmentedControl
					aria-labelledby={`${field}-label`}
					onValueChange={change}
					size="sm"
					value={[value]}
				>
					{MENU_ORDER[field].map((name) => (
						<SegmentedControlItem
							data-value={name}
							key={name}
							onPointerEnter={show}
							value={name}
						>
							{optionLabel(field, name)}
						</SegmentedControlItem>
					))}
				</SegmentedControl>
			</div>
		</div>
	);
}

// Fonts as a menu grouped by category; each name is set in its own font.
function FontField(control: FieldProps) {
	const { anchor, choose, field, value, wide } = control;
	const { clear, show } = usePreview(control);
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
	return (
		<div {...props(createStyles.field)}>
			<FieldHeader {...control} />
			<Menu onOpenChange={openChange}>
				<MenuTrigger
					aria-label={`${FIELD_LABELS[field]}: ${optionLabel(field, value)}`}
					render={<button type="button" {...props(createStyles.select)} />}
				>
					<span
						{...props(
							createStyles.selectValue,
							createStyles.family(fontFamily(value))
						)}
					>
						{optionLabel(field, value)}
					</span>
					<IconChevronDown aria-hidden="true" size={16} />
				</MenuTrigger>
				<MenuPopup
					align={wide ? "start" : "center"}
					anchor={wide ? undefined : anchor}
					aria-label={FIELD_LABELS[field]}
					onPointerLeave={clear}
					side={wide ? "inline-start" : "top"}
					sideOffset={12}
				>
					<MenuRadioGroup onValueChange={change} value={value}>
						{fontGroups(field as "font").map(({ label, names }, index) => (
							<Fragment key={label ?? "first"}>
								{index > 0 ? <MenuSeparator /> : null}
								<MenuGroup>
									{label ? <MenuGroupLabel>{label}</MenuGroupLabel> : null}
									{names.map((name) => (
										<MenuRadioItem
											closeOnClick={!wide}
											data-value={name}
											key={name}
											onFocus={show}
											onPointerMove={show}
											value={name}
										>
											<span {...props(createStyles.family(fontFamily(name)))}>
												{optionLabel(field, name)}
											</span>
										</MenuRadioItem>
									))}
								</MenuGroup>
							</Fragment>
						))}
					</MenuRadioGroup>
				</MenuPopup>
			</Menu>
		</div>
	);
}

const KINDS = {
	accent: SwatchField,
	density: SegmentField,
	font: FontField,
	heading: FontField,
	neutral: SwatchField,
	primary: SegmentField,
	radius: SegmentField,
} as const;

const SECTIONS: readonly [string, readonly Field[]][] = [
	["Color", ["accent", "primary", "neutral"]],
	["Type", ["font", "heading"]],
	["Shape", ["radius", "density"]],
];

// Copies the init command; the preset code is its face.
function CopyCommand({ code }: { code: string }) {
	const { copy, status } = useCopyToClipboard();
	const run = useCallback(() => copy(initCommand("npm", code)), [code, copy]);
	return (
		<span {...props(createStyles.footerWide)}>
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
						{status === "copied" ? "Copied" : `--preset ${code}`}
					</span>
				</TooltipTrigger>
				<TooltipPopup>Copy the init command</TooltipPopup>
			</Tooltip>
		</span>
	);
}

export interface PanelProps
	extends Pick<FieldProps, "choose" | "setHover" | "toggleLock"> {
	choices: ThemeChoices;
	locked: ReadonlySet<Field>;
	shuffle: () => void;
	toolbar: ReactNode;
	views: ReactNode;
}

// The inspector: the preview's view and history, the theme in sections for
// color, type, and shape, then the code, Shuffle, and Get code.
export function CreatePanel({
	choices,
	locked,
	shuffle,
	toolbar,
	views,
	...actions
}: PanelProps) {
	const anchor = useRef<HTMLElement>(null);
	const wide = useSyncExternalStore(subscribeWide, isWide, wideOnServer);
	const code = encodePreset(choices);
	// On a phone the sections fold away, so the preview keeps the screen.
	const [open, setOpen] = useState(false);
	const toggle = useCallback(() => setOpen((value) => !value), []);
	return (
		<aside aria-label="Theme" ref={anchor} {...props(createStyles.inspector)}>
			{toolbar}
			{views}
			<div {...props(createStyles.panel)}>
				<button
					aria-controls="create-sections"
					aria-expanded={open}
					onClick={toggle}
					type="button"
					{...props(createStyles.disclosure)}
				>
					Theme options
					<span
						{...props(createStyles.chevron, open && createStyles.chevronOpen)}
					>
						<IconChevronDown aria-hidden="true" size={16} />
					</span>
				</button>
				<div
					id="create-sections"
					{...props(
						createStyles.sections,
						!open && createStyles.sectionsClosed
					)}
				>
					{SECTIONS.map(([title, fields]) => (
						<section
							aria-label={title}
							key={title}
							{...props(createStyles.section)}
						>
							<h2 {...props(createStyles.sectionTitle)}>{title}</h2>
							{fields.map((field) => {
								const Kind = KINDS[field];
								return (
									<Kind
										{...actions}
										anchor={anchor}
										field={field}
										key={field}
										locked={locked.has(field)}
										value={choices[field]}
										wide={wide}
									/>
								);
							})}
						</section>
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
			</div>
		</aside>
	);
}
