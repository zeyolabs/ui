<script lang="ts">
	import type { Snippet } from 'svelte';

	import { ChevronDown, ChevronsUpDown, ChevronUp } from '@lucide/svelte';
	import { getContext } from 'svelte';

	let {
		align = 'left',
		children,
		colspan,
		compact = false,
		mono = false,
		muted = false,
		onSort,
		sortDirection = null,
		stickyLeft,
		stopPropagation = false,
		style = '',
		valign = 'middle',
	}: {
		align?: 'left' | 'right';
		children?: Snippet;
		colspan?: number;
		// Tighter padding for a dense data grid (e.g. a drill-down table) — opt in per usage, the
		// default stays the general-purpose spacing every other Table consumer already renders at.
		compact?: boolean;
		mono?: boolean;
		muted?: boolean;
		// Head cell only. Presence makes the header clickable; caller owns the actual sort
		// state/logic and passes the current direction back via `sortDirection`.
		onSort?: () => void;
		sortDirection?: 'asc' | 'desc' | null;
		// A CSS length (must be a px value, e.g. '0px'/'32px') — pins this cell via
		// position: sticky at that left offset. Apply to the matching header AND body cell for
		// a given column. See GroupedGrid's `sticky` column flag for automatic offset math.
		stickyLeft?: string;
		stopPropagation?: boolean;
		style?: string;
		valign?: 'middle' | 'top';
	} = $props();

	const isHead = getContext<boolean>('table:head');
	const isBoldHead = getContext<boolean>('table:head-bold');
	const sticky = $derived(stickyLeft != null);

	function handleClick(e: MouseEvent) {
		e.stopPropagation();
	}

	function handleHeadClick(e: MouseEvent) {
		if (stopPropagation) e.stopPropagation();
		onSort?.();
	}
</script>

{#if isHead}
	<th
		{style}
		style:left={stickyLeft}
		class:bold-head={isBoldHead}
		class:compact
		class:num={align === 'right'}
		class:sortable={!!onSort}
		class:sticky
		onclick={onSort || stopPropagation ? handleHeadClick : undefined}
	>
		{#if onSort}
			<span class="sort-label">
				{@render children?.()}
				{#if sortDirection === 'asc'}
					<ChevronUp size={11} />
				{:else if sortDirection === 'desc'}
					<ChevronDown size={11} />
				{:else}
					<span class="sort-icon-idle"><ChevronsUpDown size={11} /></span>
				{/if}
			</span>
		{:else}
			{@render children?.()}
		{/if}
	</th>
{:else}
	<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_noninteractive_element_interactions -->
	<td
		{style}
		style:left={stickyLeft}
		class:compact
		class:mono
		class:muted
		class:num={align === 'right'}
		class:sticky
		class:top={valign === 'top'}
		{colspan}
		onclick={stopPropagation ? handleClick : undefined}
	>
		{@render children?.()}
	</td>
{/if}

<style>
	th {
		text-align: left;
		font-size: 11px;
		font-weight: 400;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--txt);
		padding: 13px 18px;
		border-bottom: 1px solid var(--bds);
		background: var(--sf);
		white-space: nowrap;
	}
	th.num {
		text-align: right;
	}
	/* Same heading font/weight as `Title` (var(--font-heading)), scaled down for a table row —
	   for a header that needs to read as more prominent than the default small tracked-out
	   uppercase label. */
	th.bold-head {
		font-family: var(--font-heading);
		font-size: 15px;
		font-weight: 400;
		letter-spacing: normal;
		text-transform: none;
		color: var(--tx);
	}
	th.compact {
		padding: 7px 10px;
	}
	th.sortable {
		cursor: pointer;
		user-select: none;
	}
	th.sortable:hover {
		color: var(--tx);
	}
	.sort-label {
		display: inline-flex;
		align-items: center;
		gap: 3px;
	}
	.sort-icon-idle {
		display: inline-flex;
		opacity: 0.4;
	}
	th.sticky,
	td.sticky {
		position: sticky;
		z-index: 1;
	}
	th.sticky {
		z-index: 2;
		background: var(--sf);
	}
	td.sticky {
		background: var(--row-bg, var(--bg));
	}
	td {
		padding: 14px 18px;
		font-size: 13px;
		color: var(--tx);
		background: var(--row-bg, var(--bg));
		border-bottom: 1px solid var(--bds);
		vertical-align: middle;
	}
	td.compact {
		padding: 6px 10px;
	}
	td.top {
		vertical-align: top;
	}
	td.num {
		text-align: right;
		font-variant-numeric: tabular-nums;
	}
	td.muted {
		color: var(--txs);
		font-size: 13px;
	}
	td.mono {
		font-family: var(--font-mono);
		font-variant-numeric: tabular-nums;
		font-size: 13px;
	}
</style>
