<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children,
		class: cls = '',
		leading,
		muted = false,
		onclick,
		selected = false,
	}: {
		children: Snippet;
		class?: string;
		/** Slot before the content, outside the click target, so it can hold a control such as a
		 * checkbox as well as an icon or status mark. */
		leading?: Snippet;
		/** Tinted background, so the other rows stand out (e.g. read vs unread). */
		muted?: boolean;
		onclick?: () => void;
		/** Marks the current row with a bar on its left edge. */
		selected?: boolean;
	} = $props();
</script>

<div class="list-row {cls}" data-muted={muted || undefined} data-selected={selected || undefined}>
	{#if leading}
		<div class="list-row-leading">{@render leading()}</div>
	{/if}
	<button class="list-row-body" aria-current={selected || undefined} {onclick} type="button">
		{@render children()}
	</button>
</div>

<style>
	.list-row {
		display: flex;
		width: 100%;
		background: var(--bg);
		border-bottom: 1px solid var(--bds);
		/* Reserved so the selected bar doesn't shift the content. */
		border-left: 3px solid transparent;
		transition: background 0.06s ease;
	}
	.list-row:hover {
		background: var(--bg-page);
	}
	.list-row[data-muted] {
		background: var(--bg-page);
	}
	.list-row[data-muted]:hover {
		background: color-mix(in srgb, var(--tx) 4%, var(--bg-page));
	}
	.list-row[data-selected] {
		border-left-color: var(--tx);
	}
	.list-row-leading {
		flex-shrink: 0;
		/* Net of the 3px selected-bar border, so a leading control lines up with a card header's
		   --spacing-sm padding. */
		padding: calc(var(--spacing-sm) + 2px) 0 var(--spacing-sm) calc(var(--spacing-sm) - 3px);
		color: var(--txs);
	}
	.list-row-body {
		flex: 1;
		min-width: 0;
		padding: var(--spacing-sm);
		text-align: left;
		color: inherit;
		background: none;
		border: none;
		cursor: pointer;
		font-family: inherit;
	}
	.list-row-leading + .list-row-body {
		padding-left: var(--spacing-xs);
	}
</style>
