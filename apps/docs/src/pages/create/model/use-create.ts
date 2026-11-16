import { useCallback, useMemo, useState } from "react";
import {
	DEFAULT_CHOICES,
	encodePreset,
	type ThemeChoices,
} from "../../../../../../packages/cli/src/theme/create";
import { type Field, type PreviewView, randomize } from "./create";

interface History {
	future: ThemeChoices[];
	past: ThemeChoices[];
	present: ThemeChoices;
}

// The Create page's state: the choices with undo and redo, the fields the
// reader locked, an option the pointer rests on, and how the preview shows.
// onChange receives each new code, so the page can keep it in the URL.
export function useCreate(
	initial: ThemeChoices,
	onChange: (code: string) => void
) {
	const [history, setHistory] = useState<History>({
		future: [],
		past: [],
		present: initial,
	});
	const [locked, setLocked] = useState<ReadonlySet<Field>>(new Set());
	const [hover, setHover] = useState<Partial<ThemeChoices> | null>(null);
	const [dark, setDark] = useState(false);
	const [view, setView] = useState<PreviewView>("app");

	const commit = useCallback(
		(next: ThemeChoices) => {
			setHistory((current) =>
				encodePreset(next) === encodePreset(current.present)
					? current
					: {
							future: [],
							past: [...current.past, current.present].slice(-50),
							present: next,
						}
			);
			onChange(encodePreset(next));
		},
		[onChange]
	);

	const choose = useCallback(
		<F extends Field>(field: F, value: ThemeChoices[F]) => {
			setHover(null);
			commit({ ...history.present, [field]: value });
		},
		[commit, history.present]
	);

	const step = useCallback(
		(direction: "redo" | "undo") => {
			const from = direction === "undo" ? history.past : history.future;
			const target = from.at(-1);
			if (!target) {
				return;
			}
			setHistory({
				future:
					direction === "undo"
						? [...history.future, history.present]
						: history.future.slice(0, -1),
				past:
					direction === "undo"
						? history.past.slice(0, -1)
						: [...history.past, history.present],
				present: target,
			});
			onChange(encodePreset(target));
		},
		[history, onChange]
	);

	const toggleLock = useCallback((field: Field) => {
		setLocked((current) => {
			const next = new Set(current);
			if (!next.delete(field)) {
				next.add(field);
			}
			return next;
		});
	}, []);

	const shuffle = useCallback(
		() => commit(randomize(history.present, locked)),
		[commit, history.present, locked]
	);
	const reset = useCallback(() => commit(DEFAULT_CHOICES), [commit]);
	const toggleDark = useCallback(() => setDark((value) => !value), []);

	// The preview shows the option under the pointer without choosing it.
	const shown = useMemo(
		() => ({ ...history.present, ...hover }),
		[history.present, hover]
	);

	return {
		canRedo: history.future.length > 0,
		canUndo: history.past.length > 0,
		choices: history.present,
		choose,
		dark,
		locked,
		reset,
		setHover,
		setView,
		shown,
		shuffle,
		step,
		toggleDark,
		toggleLock,
		view,
	};
}
