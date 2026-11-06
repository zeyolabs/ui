<script lang="ts">
	import type { Component, Snippet } from 'svelte';

	/** One 26px sidebar row (renders its own `<li>`). `current` tints it and sets
	 * aria-current="page"; the caller decides what counts as current. */
	let {
		children,
		current = false,
		href,
		icon: Icon,
		iconSize = 14,
	}: {
		children: Snippet;
		current?: boolean;
		href: string;
		icon?: Component<{ size?: number }>;
		iconSize?: number;
	} = $props();
</script>

<li>
	<a class="sidebar-item" aria-current={current ? 'page' : undefined} {href}>
		{#if Icon}<Icon size={iconSize} />{/if}
		{@render children()}
	</a>
</li>

<style>
	.sidebar-item {
		display: flex;
		align-items: center;
		gap: 6px;
		height: 26px;
		padding: 0 8px;
		border-radius: var(--radius-sm);
		color: var(--txs);
		text-decoration: none;
	}
	.sidebar-item:hover {
		background: var(--sfh);
		color: var(--tx);
	}
	.sidebar-item[aria-current='page'] {
		background: color-mix(in srgb, var(--primary) 16%, transparent);
		color: var(--primary);
		font-weight: 500;
	}
</style>
