<script lang="ts">
	import type { Snippet } from 'svelte';

	import SelectionBar from './SelectionBar.svelte';

	/**
	 * Bulk-action bar that floats ON TOP of a Table's header row once something's selected —
	 * pass it as `<Table>`'s `overlay` snippet. Because the header row stays in the DOM
	 * underneath, column widths never shift when selection toggles. Renders nothing while
	 * `count` is 0, matching `SelectionBar`'s own self-gating.
	 *
	 * The 40px left offset matches `SelectAllTableCell`'s fixed checkbox-column width exactly
	 * (skips it so the header checkbox stays clickable); the 41px height matches a default,
	 * non-compact `TableCell` head row (13px padding × 2 + text). `pointer-events` is `none` on
	 * the wrapper and re-enabled only on its rendered content — the wrapper's own box still spans
	 * the full row width for layout purposes, and without this a click anywhere the wrapper covers
	 * but has nothing drawn (including that 40px checkbox column) would get swallowed instead of
	 * reaching the header checkbox underneath.
	 */
	let {
		allMatchingSelected = false,
		children,
		count,
		onClear,
		onSelectAllMatching,
		sticky = false,
		totalCount,
	}: {
		allMatchingSelected?: boolean;
		children: Snippet;
		count: number;
		onClear: () => void;
		onSelectAllMatching?: () => void;
		/** Set when the table underneath pins its header via `TableRow`'s/`GroupedGrid`'s
		 *  `sticky`/`stickyHeader` — switches from `position: absolute` (out of flow — fine for a
		 *  plain non-scrolling table) to `position: sticky` (tracks the same scroll boundary as the
		 *  header row, so this stays pinned alongside it instead of scrolling out from under it;
		 *  `margin-bottom` cancels the flow height it then occupies, so the table underneath still
		 *  never shifts when selection toggles). */
		sticky?: boolean;
		totalCount?: number;
	} = $props();
</script>

{#if count > 0}
	<div class="overlay" class:sticky>
		<SelectionBar {allMatchingSelected} {count} {onClear} {onSelectAllMatching} {totalCount}>
			{@render children()}
		</SelectionBar>
	</div>
{/if}

<style>
	.overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		z-index: 5;
		display: flex;
		align-items: center;
		height: 41px;
		margin-left: 40px;
		padding: 0 var(--spacing-md);
		background: var(--sf);
		/* The <th> underneath bakes in uppercase + letter-spacing via the global table
		   styles, and SelectionBar/the caller's own buttons render content this component
		   has no classes for — only a wildcard selector can strip that cascade. */
		font-size: 13px;
		font-weight: 400;
		color: var(--tx);
		pointer-events: none;
	}
	.overlay :global(*) {
		text-transform: none;
		letter-spacing: 0;
		pointer-events: auto;
	}
	.overlay.sticky {
		position: sticky;
		margin-bottom: -41px;
	}
</style>
