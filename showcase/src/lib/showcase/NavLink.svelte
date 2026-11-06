<script lang="ts">
	import type { Component } from 'svelte';

	import { page } from '$app/state';

	let {
		href,
		icon: Icon,
		label,
	}: { href: string; icon?: Component<{ size?: number }>; label: string } = $props();

	const active = $derived(page.url.pathname === href);
</script>

<li>
	<a class="item" aria-current={active ? 'page' : undefined} {href}>
		{#if Icon}<Icon size={14} />{/if}
		{label}
	</a>
</li>

<style>
	.item {
		display: flex;
		align-items: center;
		gap: 6px;
		height: 26px;
		padding: 0 8px;
		border-radius: var(--radius-sm);
		color: var(--txs);
		text-decoration: none;
	}
	.item:hover {
		background: var(--sfh);
		color: var(--tx);
	}
	.item[aria-current='page'] {
		background: color-mix(in srgb, var(--primary) 16%, transparent);
		color: var(--primary);
		font-weight: 500;
	}
</style>
