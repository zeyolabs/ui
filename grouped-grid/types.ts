import type { Snippet } from 'svelte';

export type GridGroup<T> = {
	key: string;
	label: string;
	rows: T[];
};

export type GridColumn<T> = {
	align?: 'left' | 'right';
	cell: Snippet<
		[row: T, context: { column: GridColumn<T>; group: GridGroup<T>; isFirstInGroup: boolean }]
	>;
	// Custom header content (e.g. an icon/badge alongside the label) — falls back to plain
	// `label` text when omitted. Receives the column itself, so one shared snippet can render
	// per-column data without a separate binding per instance.
	headerCell?: Snippet<[column: GridColumn<T>]>;
	key: string;
	label: string;
	// Pins this column via position: sticky at the cumulative left offset of the sticky
	// columns before it (declaration order in `columns`). Requires `width` to be a pixel
	// value ('160px', not '10rem'/'20%') so the offsets can be summed.
	sticky?: boolean;
	width?: string;
};
