<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children,
		class: cls = '',
		padding = 'sm',
	}: {
		children: Snippet;
		class?: string;
		padding?: 'lg' | 'md' | 'sm' | 'xs';
	} = $props();
</script>

<div class="card-header {cls}" data-padding={padding}>
	{@render children()}
</div>

<style>
	.card-header {
		flex-shrink: 0;
		border-bottom: 1px solid var(--bd);
	}
	.card-header[data-padding='xs'] {
		padding: var(--spacing-xs);
	}
	.card-header[data-padding='sm'] {
		padding: var(--spacing-sm);
	}
	.card-header[data-padding='md'] {
		padding: var(--spacing-md);
	}
	.card-header[data-padding='lg'] {
		padding: var(--spacing-lg);
	}
</style>
