<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	/** Square 26px icon button for the sidebar footer (theme toggle, sign out). Pass `aria-label`. */
	let {
		children,
		type = 'button',
		...rest
	}: HTMLButtonAttributes & { children: Snippet } = $props();
</script>

<button class="sidebar-btn" {type} {...rest}>{@render children()}</button>

<style>
	.sidebar-btn {
		display: grid;
		place-items: center;
		width: 26px;
		height: 26px;
		border-radius: var(--radius-sm);
		border: none;
		background: none;
		color: var(--txs);
		cursor: pointer;
	}
	.sidebar-btn:hover {
		background: var(--sfh);
		color: var(--tx);
	}
</style>
