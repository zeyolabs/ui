<script lang="ts">
	import type { Snippet } from 'svelte';

	/** Sidebar+content app shell — replaces hand-rolled sidebar grids (gbox's unibox, the
	 * 4x-copy-pasted auth split) with one shared collapse point instead of each picking its own
	 * breakpoint. Stacks (sidebar above content, full width) below 1024px — CSS can't read a prop
	 * into a media query, so this is intentionally one fixed, shared threshold, not configurable. */
	let {
		content,
		sidebar,
		sidebarWidth = 260,
	}: {
		content: Snippet;
		sidebar: Snippet;
		sidebarWidth?: number;
	} = $props();
</script>

<div style:--split-sidebar-width="{sidebarWidth}px" class="split-shell">
	<aside class="split-sidebar">{@render sidebar()}</aside>
	<div class="split-content">{@render content()}</div>
</div>

<style>
	.split-shell {
		display: grid;
		grid-template-columns: var(--split-sidebar-width) 1fr;
		min-height: 0;
	}
	.split-sidebar {
		overflow-y: auto;
		border-right: 1px solid var(--bd);
	}
	.split-content {
		overflow-y: auto;
		min-width: 0;
	}
	@media (max-width: 1024px) {
		.split-shell {
			grid-template-columns: 1fr;
		}
		.split-sidebar {
			border-right: none;
			border-bottom: 1px solid var(--bd);
		}
	}
</style>
