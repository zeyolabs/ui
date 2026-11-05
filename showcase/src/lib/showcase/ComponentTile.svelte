<script lang="ts">
	import type { Snippet } from 'svelte';

	/**
	 * One gallery tile — a live mini-preview + a link to the matching deep-dive section.
	 * Deliberately NOT one big <a> wrapping everything: previews render real, often
	 * interactive components (buttons, fields, dialog triggers), and a nested interactive
	 * element inside an <a> either fights the navigation or is invalid HTML. Only the name
	 * row links out; the preview area is inert as far as navigation goes.
	 */
	let {
		children,
		href,
		name,
	}: {
		children: Snippet;
		href: string;
		name: string;
	} = $props();
</script>

<div class="tile">
	<div class="tile-preview">
		{@render children()}
	</div>
	<a class="tile-name" {href}>{name}</a>
</div>

<style>
	/* Sharp corners, no gap between tiles (see Grid's gap="none") — each tile draws only its
	   right + bottom edge, so adjacent tiles share one hairline instead of doubling it up. The
	   sheet's own top/left edge is the wrapping container's job (see components/+page.svelte). */
	.tile {
		display: flex;
		flex-direction: column;
		aspect-ratio: 1;
		border-right: 1px solid var(--bd);
		border-bottom: 1px solid var(--bd);
		overflow: hidden;
	}
	.tile-preview {
		flex: 1;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		align-content: center;
		gap: var(--spacing-sm);
		min-height: 0;
		padding: var(--spacing-lg);
		background: var(--sf);
	}
	.tile-name {
		flex-shrink: 0;
		padding: var(--spacing-sm) var(--spacing-md);
		font-size: 10.5px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--txs);
		text-decoration: none;
		border-top: 1px solid var(--bd);
	}
	.tile-name:hover {
		color: var(--acc);
	}
</style>
