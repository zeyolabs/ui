<script lang="ts">
	import type { Snippet } from 'svelte';

	import { Button } from '@zeyolabs/ui/form';

	/**
	 * Bulk-action bar for a selectable table/list — "N selected" + caller-supplied action
	 * buttons + a built-in Clear. Renders nothing while `count` is 0. Positioning (inline in a
	 * toolbar, an overlay on the header row, ...) is the caller's call — this only owns content.
	 *
	 * `totalCount`/`allMatchingSelected`/`onSelectAllMatching` are optional — omit all three for
	 * a page with no pagination (or that doesn't need the distinction), where `count` already
	 * covers everything selectable. Pass them once `count` can be less than the full matching set
	 * (a paginated list) to offer "select all N matching" as a follow-up to selecting a page.
	 */
	let {
		allMatchingSelected = false,
		children,
		count,
		onClear,
		onSelectAllMatching,
		totalCount,
	}: {
		allMatchingSelected?: boolean;
		children: Snippet;
		count: number;
		onClear: () => void;
		onSelectAllMatching?: () => void;
		totalCount?: number;
	} = $props();
</script>

{#if count > 0}
	<div class="selection-bar">
		<span class="count">
			<strong>{count}</strong> selected
		</span>
		{#if !allMatchingSelected && totalCount != null && count < totalCount && onSelectAllMatching}
			<Button onclick={onSelectAllMatching} variant="link">
				Select all {totalCount} matching
			</Button>
		{/if}
		<div class="actions">
			{@render children()}
		</div>
		<Button onclick={onClear} variant="link">Clear</Button>
	</div>
{/if}

<style>
	.selection-bar {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.count {
		font-size: 13px;
		color: var(--tx);
	}
	.count strong {
		font-weight: 400;
	}
	.actions {
		display: flex;
		align-items: center;
		gap: 6px;
	}
</style>
