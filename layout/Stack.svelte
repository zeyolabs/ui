<script lang="ts">
	import type { Snippet } from 'svelte';

	/** Vertical flex list with a scale-backed gap — replaces flex flex-col gap-X repeated with a
	 * different X every time. */
	let {
		align = 'stretch',
		bg,
		children,
		class: cls = '',
		gap = 'md',
	}: {
		align?: 'center' | 'end' | 'start' | 'stretch';
		/** Omit for transparent (the historical default). 'rainbow' is the animated gradient
		 * panel used for feature/product-UI showcase blocks. */
		bg?: 'bg' | 'rainbow' | 'sf' | 'sfh' | 'tertiary';
		children: Snippet;
		/** Layout-only, same rule as Button/Text — margin, or a conditional class computed by
		 * the caller (e.g. `class={active ? 'row-active' : ''}`) for state Stack itself has no
		 * prop for. Don't sneak a color/gap override in through this — use the real props. */
		class?: string;
		gap?: 'lg' | 'md' | 'none' | 'sm' | 'xs';
	} = $props();
</script>

<div style:align-items={align} class="stack {cls}" data-bg={bg} data-gap={gap}>
	{@render children()}
</div>

<style>
	.stack {
		display: flex;
		flex-direction: column;
	}
	.stack[data-gap='none'] {
		gap: 0;
	}
	.stack[data-gap='xs'] {
		gap: var(--spacing-xs);
	}
	.stack[data-gap='sm'] {
		gap: var(--spacing-sm);
	}
	.stack[data-gap='md'] {
		gap: var(--spacing-md);
	}
	.stack[data-gap='lg'] {
		gap: var(--spacing-lg);
	}
	.stack[data-bg='bg'] {
		background: var(--bg);
	}
	.stack[data-bg='sf'] {
		background: var(--sf);
	}
	.stack[data-bg='sfh'] {
		background: var(--sfh);
	}
	.stack[data-bg='tertiary'] {
		background: var(--tertiary);
	}
	.stack[data-bg='rainbow'] {
		background-image: linear-gradient(160deg, #4f46e5, #3b82f6, #a855f7, #f59e0b, #ef4444, #0ea5e9);
		background-size: 200% 200%;
		animation: stack-rainbow-shift 12s ease infinite;
	}
	@keyframes stack-rainbow-shift {
		0% {
			background-position: 0% 0%;
		}
		50% {
			background-position: 100% 100%;
		}
		100% {
			background-position: 0% 0%;
		}
	}
</style>
