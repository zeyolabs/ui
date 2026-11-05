<script generics="T" lang="ts">
	import type { Snippet } from 'svelte';

	import type { GridColumn, GridGroup } from './types';

	import Table from '../table/Table.svelte';
	import TableCell from '../table/TableCell.svelte';
	import TableRow from '../table/TableRow.svelte';

	/**
	 * A real <table> (not CSS grid), so column widths sync across rows natively. Supply either `rows`
	 * (flat, no groups), `rows` + `groupBy` (flat rows the component buckets itself), or pre-built
	 * `groups` (full control over bucketing/sorting, e.g. merging two row sources). `columns` and their
	 * `cell` snippets decide everything about content — this component only owns table/grouping mechanics.
	 */
	let {
		bordered = false,
		columns,
		compact = false,
		empty,
		groupBy,
		groupMarker,
		groups,
		overlay,
		rowKey,
		rows,
		rowSelected,
		rowWarning,
		showHeader = true,
		stickyHeader = false,
	}: {
		// Vertical rules between columns — see Table's `bordered`.
		bordered?: boolean;
		columns: GridColumn<T>[];
		// Tighter row padding for a dense drill-down grid — see TableCell's `compact`.
		compact?: boolean;
		// Rendered as a single row spanning every column when there are no rows at all.
		empty?: Snippet;
		groupBy?: (row: T) => string;
		// Rendered once per row (not per group), so a caller's own decoration (e.g. a colored left
		// border) reads as continuous down a group's rows via plain CSS.
		groupMarker?: Snippet<[group: GridGroup<T>]>;
		groups?: GridGroup<T>[];
		// A `SelectionOverlay` anchored to the header row — see Table's own `overlay`.
		overlay?: Snippet;
		// Independent of which columns are shown — a row's identity can't depend on what's visible.
		rowKey: (row: T) => string;
		rows?: T[];
		// Highlights a row (see TableRow's `selected`) — caller decides what "selected" means.
		rowSelected?: (row: T) => boolean;
		// Tints a row (see TableRow's `warning`) — caller decides what "warning" means.
		rowWarning?: (row: T) => boolean;
		showHeader?: boolean;
		// Pins the header row — see TableRow's `sticky`.
		stickyHeader?: boolean;
	} = $props();

	const colspan = $derived(columns.length + (groupMarker ? 1 : 0));

	const effectiveGroups = $derived.by((): GridGroup<T>[] => {
		if (groups) return groups;
		const source = rows ?? [];
		if (!groupBy) return [{ key: '__ungrouped__', label: '', rows: source }];
		const rowsByKey = new Map<string, T[]>();
		for (const row of source) {
			const key = groupBy(row);
			const existing = rowsByKey.get(key);
			if (existing) existing.push(row);
			else rowsByKey.set(key, [row]);
		}
		return [...rowsByKey.entries()].map(([key, groupRows]) => ({
			key,
			label: key,
			rows: groupRows,
		}));
	});

	const isEmpty = $derived(effectiveGroups.every((group) => group.rows.length === 0));

	// Cumulative left offset for each sticky column, in declaration order — `width` must be a
	// pixel value for a sticky column so these sum meaningfully.
	const stickyLefts = $derived.by(() => {
		let offset = 0;
		const map = new Map<string, string>();
		for (const column of columns) {
			if (!column.sticky) continue;
			map.set(column.key, `${offset}px`);
			offset += parseFloat(column.width ?? '0');
		}
		return map;
	});
</script>

<Table {bordered} {overlay}>
	{#if showHeader}
		<TableRow head sticky={stickyHeader}>
			{#if groupMarker}
				<TableCell style="padding: 0; width: 6px;" {compact} />
			{/if}
			{#each columns as column (column.key)}
				<TableCell
					style={column.width ? `width: ${column.width};` : ''}
					align={column.align ?? 'left'}
					{compact}
					stickyLeft={stickyLefts.get(column.key)}
				>
					{#if column.headerCell}
						{@render column.headerCell(column)}
					{:else}
						{column.label}
					{/if}
				</TableCell>
			{/each}
		</TableRow>
	{/if}
	{#each effectiveGroups as group (group.key)}
		{#each group.rows as row, index (rowKey(row))}
			<TableRow selected={rowSelected?.(row) ?? false} warning={rowWarning?.(row) ?? false}>
				{#if groupMarker}
					<TableCell style="padding: 0;" {compact}>
						{@render groupMarker(group)}
					</TableCell>
				{/if}
				{#each columns as column (column.key)}
					<TableCell
						align={column.align ?? 'left'}
						{compact}
						stickyLeft={stickyLefts.get(column.key)}
					>
						{@render column.cell(row, { column, group, isFirstInGroup: index === 0 })}
					</TableCell>
				{/each}
			</TableRow>
		{/each}
	{/each}
	{#if isEmpty && empty}
		<TableRow>
			<TableCell style="text-align: center;" {colspan}>
				{@render empty()}
			</TableCell>
		</TableRow>
	{/if}
</Table>
