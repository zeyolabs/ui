<script lang="ts">
	import type { Snippet } from 'svelte';

	/** App sidebar column: brand on top, fixed primary links, a scrolling body of groups, and a
	 * footer row (user, theme toggle, sign out). Fills its parent's height; pair with SplitShell. */
	let {
		brand,
		children,
		foot,
		label = 'Main',
		links,
	}: {
		brand?: Snippet;
		children?: Snippet;
		foot?: Snippet;
		label?: string;
		links?: Snippet;
	} = $props();
</script>

<nav class="sidebar" aria-label={label}>
	{@render brand?.()}

	{#if links}
		<ul class="sidebar-links">{@render links()}</ul>
	{/if}

	{#if children}
		<div class="sidebar-body" class:sidebar-body--ruled={!!links}>{@render children()}</div>
	{/if}

	{#if foot}
		<div class="sidebar-foot">{@render foot()}</div>
	{/if}
</nav>

<style>
	.sidebar {
		display: flex;
		flex-direction: column;
		gap: 10px;
		height: 100%;
		padding: 10px 8px;
		background: var(--sf);
	}
	.sidebar-links {
		display: flex;
		flex-direction: column;
		gap: 1px;
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.sidebar-body {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.sidebar-body--ruled {
		padding-top: 6px;
		border-top: 1px solid var(--bds);
	}
	.sidebar-foot {
		display: flex;
		align-items: center;
		gap: 4px;
		padding-top: 8px;
		border-top: 1px solid var(--bds);
	}
</style>
