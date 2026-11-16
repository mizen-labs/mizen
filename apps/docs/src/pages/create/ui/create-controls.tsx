"use client";

import {
	Button,
	SegmentedControl,
	SegmentedControlItem,
	Select,
	SelectItem,
	SelectPopup,
	SelectTrigger,
	SelectValue,
	Stack,
} from "@mizen-labs/ui";
import { props } from "@stylexjs/stylex";
import { IconLock, IconLockOpen } from "@tabler/icons-react";
import {
	type ChangeEvent,
	type PointerEvent,
	useCallback,
	useMemo,
} from "react";
import {
	ORDER,
	type ThemeChoices,
} from "../../../../../../packages/cli/src/theme/create";
import { FIELD_LABELS, type Field, optionLabel, swatch } from "../model/create";
import { createStyles } from "./create.styles";

export interface ControlProps {
	choose: <F extends Field>(field: F, value: ThemeChoices[F]) => void;
	field: Field;
	locked: boolean;
	setHover: (hover: Partial<ThemeChoices> | null) => void;
	toggleLock: (field: Field) => void;
	value: string;
}

// Hovering an option previews it; leaving the control restores the choice.
function usePreviewOption(field: Field, setHover: ControlProps["setHover"]) {
	const enter = useCallback(
		(event: PointerEvent<HTMLElement>) => {
			const { value } = event.currentTarget.dataset;
			if (value) {
				setHover({ [field]: value } as Partial<ThemeChoices>);
			}
		},
		[field, setHover]
	);
	const leave = useCallback(() => setHover(null), [setHover]);
	return { enter, leave };
}

function Swatches({ choose, field, setHover, value }: ControlProps) {
	const { enter, leave } = usePreviewOption(field, setHover);
	const change = useCallback(
		(event: ChangeEvent<HTMLInputElement>) =>
			choose(field, event.currentTarget.value as never),
		[choose, field]
	);
	return (
		<fieldset
			aria-labelledby={`${field}-label`}
			onPointerLeave={leave}
			{...props(createStyles.swatches)}
		>
			{ORDER[field].map((name) => (
				<label
					data-value={name}
					key={name}
					onPointerEnter={enter}
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
	);
}

function Segments({ choose, field, setHover, value }: ControlProps) {
	const { enter, leave } = usePreviewOption(field, setHover);
	const change = useCallback(
		(next: string[]) => {
			if (next[0]) {
				choose(field, next[0] as never);
			}
		},
		[choose, field]
	);
	return (
		<SegmentedControl
			aria-label={FIELD_LABELS[field]}
			onPointerLeave={leave}
			onValueChange={change}
			size="sm"
			value={[value]}
		>
			{ORDER[field].map((name) => (
				<SegmentedControlItem
					data-value={name}
					key={name}
					onPointerEnter={enter}
					value={name}
				>
					{optionLabel(field, name)}
				</SegmentedControlItem>
			))}
		</SegmentedControl>
	);
}

function Choice({ choose, field, setHover, value }: ControlProps) {
	const { enter, leave } = usePreviewOption(field, setHover);
	const items = useMemo(
		() =>
			Object.fromEntries(
				ORDER[field].map((name) => [name, optionLabel(field, name)])
			),
		[field]
	);
	const change = useCallback(
		(next: unknown) => {
			setHover(null);
			if (typeof next === "string") {
				choose(field, next as never);
			}
		},
		[choose, field, setHover]
	);
	return (
		<Select items={items} onValueChange={change} value={value}>
			<SelectTrigger aria-label={FIELD_LABELS[field]}>
				<SelectValue />
			</SelectTrigger>
			<SelectPopup onPointerLeave={leave}>
				{ORDER[field].map((name) => (
					<SelectItem
						data-value={name}
						key={name}
						onPointerEnter={enter}
						value={name}
					>
						{optionLabel(field, name)}
					</SelectItem>
				))}
			</SelectPopup>
		</Select>
	);
}

const KINDS = {
	accent: Swatches,
	density: Segments,
	font: Choice,
	neutral: Swatches,
	radius: Segments,
} as const;

// One theme field: its name, a lock that keeps it through a shuffle, and its
// options.
export function ControlField(control: ControlProps) {
	const { field, locked, toggleLock } = control;
	const toggle = useCallback(() => toggleLock(field), [field, toggleLock]);
	const Kind = KINDS[field];
	const Glyph = locked ? IconLock : IconLockOpen;
	return (
		<Stack gap="2">
			<div {...props(createStyles.fieldHeader)}>
				<p id={`${field}-label`} {...props(createStyles.fieldLabel)}>
					{FIELD_LABELS[field]}
				</p>
				<Button
					aria-label={`Keep ${FIELD_LABELS[field].toLowerCase()} when shuffling`}
					aria-pressed={locked}
					onClick={toggle}
					size="icon-xs"
					variant="ghost"
				>
					<Glyph aria-hidden="true" />
				</Button>
			</div>
			<Kind {...control} />
		</Stack>
	);
}
