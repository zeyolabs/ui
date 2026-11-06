<script lang="ts">
	import type { Snippet } from 'svelte';

	/** A titled list of SidebarItems. `href` makes the uppercase title a link (e.g. a project). */
	let { children, href, label }: { children: Snippet; href?: string; label: string } = $props();
</script>

<section>
	{#if href}
		<a class="sidebar-group-label sidebar-group-label--link" {href}>{label}</a>
	{:else}
		<span class="sidebar-group-label">{label}</span>
	{/if}
	<ul>{@render children()}</ul>
</section>

<style>
	ul {
		display: flex;
		flex-direction: column;
		gap: 1px;
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.sidebar-group-label {
		display: block;
		padding: 2px 8px;
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--txt);
		text-decoration: none;
	}
	.sidebar-group-label--link:hover {
		color: var(--tx);
	}
</style>
