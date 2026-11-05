<script lang="ts">
	import type { Component, Snippet } from 'svelte';

	/**
	 * Centered placeholder for a table/list/panel with zero rows — title + optional
	 * description + optional action (a <Button> passed as children). Drop it inside a
	 * <td colspan={N}> to fill a table body, or standalone above/instead of the table.
	 */
	let {
		children,
		description,
		fill = false,
		icon: Icon,
		title,
	}: {
		/** Typically a single <Button>, e.g. "Clear filters" or "Create list". */
		children?: Snippet;
		description?: string;
		/** Grow to fill a flex-column parent and centre vertically — for an empty pane. */
		fill?: boolean;
		icon?: Component;
		title: string;
	} = $props();
</script>

<div class="empty-state" class:fill>
	{#if Icon}
		<Icon class="empty-state-icon" size={22} />
	{/if}
	<p class="empty-state-title">{title}</p>
	{#if description}
		<p class="empty-state-description">{description}</p>
	{/if}
	{#if children}
		<div class="empty-state-actions">
			{@render children()}
		</div>
	{/if}
</div>

<style>
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 56px 32px;
		text-align: center;
	}
	.empty-state.fill {
		flex: 1;
		justify-content: center;
	}
	:global(.empty-state-icon) {
		color: var(--txt);
		margin-bottom: 10px;
	}
	.empty-state-title {
		margin: 0;
		font-size: 15px;
		font-weight: 400;
		color: var(--tx);
		letter-spacing: -0.01em;
	}
	.empty-state-description {
		margin: 8px 0 0;
		max-width: 420px;
		font-size: 13px;
		line-height: 1.6;
		color: var(--txs);
	}
	.empty-state-actions {
		margin-top: 16px;
	}
</style>
