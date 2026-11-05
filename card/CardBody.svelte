<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		busy = false,
		children,
		class: cls = '',
		padding,
	}: {
		/** Frosts the content (blur + dim) and sets `aria-busy` while it reloads. */
		busy?: boolean;
		children: Snippet;
		class?: string;
		/** Omit for no padding. */
		padding?: 'lg' | 'md' | 'sm' | 'xs';
	} = $props();
</script>

<div class="card-body frosted {cls}" aria-busy={busy || undefined} data-padding={padding}>
	{@render children()}
</div>

<style>
	.card-body {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
	}
	.card-body[data-padding='xs'] {
		padding: var(--spacing-xs);
	}
	.card-body[data-padding='sm'] {
		padding: var(--spacing-sm);
	}
	.card-body[data-padding='md'] {
		padding: var(--spacing-md);
	}
	.card-body[data-padding='lg'] {
		padding: var(--spacing-lg);
	}
</style>
