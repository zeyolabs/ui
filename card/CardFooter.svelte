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

<div class="card-footer {cls}" data-padding={padding}>
	{@render children()}
</div>

<style>
	.card-footer {
		flex-shrink: 0;
		border-top: 1px solid var(--bd);
	}
	.card-footer[data-padding='xs'] {
		padding: var(--spacing-xs);
	}
	.card-footer[data-padding='sm'] {
		padding: var(--spacing-sm);
	}
	.card-footer[data-padding='md'] {
		padding: var(--spacing-md);
	}
	.card-footer[data-padding='lg'] {
		padding: var(--spacing-lg);
	}
</style>
