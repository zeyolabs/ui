<script lang="ts">
	import type { Snippet } from 'svelte';

	/** Horizontal, wrapping flex row with a scale-backed gap — replaces the filter/toolbar row
	 * (flex items-center gap-2 flex-wrap) reimplemented with drifting gaps everywhere. */
	let {
		bg,
		children,
		class: cls = '',
		gap = 'sm',
		justify = 'start',
		nowrap = false,
	}: {
		/** Omit for transparent (the historical default). 'rainbow' is the animated gradient
		 * panel used for feature/product-UI showcase blocks. */
		bg?: 'bg' | 'rainbow' | 'sf' | 'sfh' | 'tertiary';
		children: Snippet;
		/** Layout-only, same rule as Button/Text — margin, or a conditional class computed by
		 * the caller (e.g. `class={active ? 'row-active' : ''}`) for state Cluster itself has
		 * no prop for. Don't sneak a color/gap override in through this — use the real props. */
		class?: string;
		gap?: 'md' | 'sm' | 'xs';
		justify?: 'between' | 'center' | 'end' | 'start';
		/** Keep every item on one line instead of wrapping (a row that truncates one item). */
		nowrap?: boolean;
	} = $props();

	const JUSTIFY: Record<'between' | 'center' | 'end' | 'start', string> = {
		between: 'space-between',
		center: 'center',
		end: 'flex-end',
		start: 'flex-start',
	};
</script>

<div
	style:justify-content={JUSTIFY[justify]}
	class="cluster {cls}"
	class:nowrap
	data-bg={bg}
	data-gap={gap}
>
	{@render children()}
</div>

<style>
	.cluster {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
	}
	.cluster.nowrap {
		flex-wrap: nowrap;
	}
	.cluster[data-gap='xs'] {
		gap: var(--spacing-xs);
	}
	.cluster[data-gap='sm'] {
		gap: var(--spacing-sm);
	}
	.cluster[data-gap='md'] {
		gap: var(--spacing-md);
	}
	.cluster[data-bg='bg'] {
		background: var(--bg);
	}
	.cluster[data-bg='sf'] {
		background: var(--sf);
	}
	.cluster[data-bg='sfh'] {
		background: var(--sfh);
	}
	.cluster[data-bg='tertiary'] {
		background: var(--tertiary);
	}
	.cluster[data-bg='rainbow'] {
		background-image: linear-gradient(160deg, #4f46e5, #3b82f6, #a855f7, #f59e0b, #ef4444, #0ea5e9);
		background-size: 200% 200%;
		animation: cluster-rainbow-shift 12s ease infinite;
	}
	@keyframes cluster-rainbow-shift {
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
