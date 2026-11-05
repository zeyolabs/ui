<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		bordered = false,
		children,
		minWidth = '700px',
		overlay,
	}: {
		/** Adds a vertical rule between columns (a full grid, spreadsheet-style). */
		bordered?: boolean;
		children: Snippet;
		minWidth?: string;
		/** A `SelectionOverlay` (or any absolutely-positioned overlay) anchored to the header
		 * row — can't go inside `children` since a `<table>` only accepts row/section markup. */
		overlay?: Snippet;
	} = $props();
</script>

<div class="overflow">
	{@render overlay?.()}
	<table style="min-width: {minWidth};" class:bordered>
		{@render children()}
	</table>
</div>

<style>
	.overflow {
		position: relative;
		overflow-x: auto;
		border: 1px solid var(--bd);
		border-radius: var(--radius-lg);
	}
	/* Inside a Card the Card already draws the rounded frame — a second border here reads as a
	   doubled edge. Keep the radius (minus the Card's 1px border) so the header row's
	   background still clips to the Card's corners. */
	:global(.card) .overflow {
		border: none;
		border-radius: calc(var(--radius-lg) - 1px);
	}
	table {
		width: 100%;
		/* Not `collapse` — a sticky header row (see TableRow's `sticky`) loses its collapsed
		   borders in Chrome, since collapsed-border painting doesn't track sticky repositioning.
		   `separate` + zero spacing paints each cell's own border independently, immune to that,
		   and looks identical here since adjacent cells never declare conflicting borders. */
		border-collapse: separate;
		border-spacing: 0;
	}
	:global(tr:last-child td) {
		border-bottom: none;
	}
	:global(tr.elevated > td) {
		position: relative;
		z-index: 9999;
	}
	:global(table.bordered th),
	:global(table.bordered td) {
		border-right: 1px solid var(--bd);
	}
	:global(table.bordered tr > :last-child) {
		border-right: none;
	}
</style>
