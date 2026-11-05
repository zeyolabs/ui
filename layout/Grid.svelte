<script lang="ts">
	import type { Snippet } from 'svelte';

	/** CSS grid wrapper — replaces both fixed grid-cols-N stat-card grids and inline
	 * grid-template-columns two-column splits with one prop.
	 *
	 * - `columns` as a number → `repeat(N, 1fr)`, equal columns.
	 * - `columns` as a string → used verbatim (e.g. "2fr 1fr" for an asymmetric split).
	 * - `minColumnWidth` set → ignores `columns`, uses `repeat(auto-fit, minmax(width, 1fr))`, so
	 *   the column count adapts continuously to available width with no breakpoint to hand-pick. */
	let {
		bg,
		children,
		class: cls = '',
		columns = 2,
		fill = false,
		gap = 'md',
		minColumnWidth,
		stack = false,
	}: {
		/** Omit for transparent (the historical default). 'rainbow' is the animated gradient
		 * panel used for feature/product-UI showcase blocks. */
		bg?: 'bg' | 'rainbow' | 'sf' | 'sfh' | 'tertiary';
		children: Snippet;
		/** Layout-only, same rule as Button/Text — margin, or a conditional class computed by
		 * the caller (e.g. `class={active ? 'row-active' : ''}`) for state Grid itself has no
		 * prop for. Don't sneak a color/gap override in through this — use the real props. */
		class?: string;
		columns?: number | string;
		/** In a flex column parent, takes the space left and lets the rows shrink to it, so cards
		 * with their own scrolling region scroll inside the grid instead of stretching it. */
		fill?: boolean;
		gap?: '2xl' | '3xl' | '4xl' | 'lg' | 'md' | 'none' | 'sm' | 'xl';
		minColumnWidth?: string;
		/** Collapse to a single column below 960px. */
		stack?: boolean;
	} = $props();

	const templateColumns = $derived(
		minColumnWidth
			? `repeat(auto-fit, minmax(${minColumnWidth}, 1fr))`
			: typeof columns === 'number'
				? `repeat(${columns}, 1fr)`
				: columns
	);
</script>

<div
	style:grid-template-columns={templateColumns}
	class="grid-layout {cls}"
	class:fill
	class:stack
	data-bg={bg}
	data-gap={gap}
>
	{@render children()}
</div>

<style>
	.grid-layout {
		display: grid;
	}
	.grid-layout.fill {
		flex: 1;
		min-height: 0;
	}
	.grid-layout[data-gap='none'] {
		gap: 0;
	}
	.grid-layout[data-gap='sm'] {
		gap: var(--spacing-sm);
	}
	.grid-layout[data-gap='md'] {
		gap: var(--spacing-md);
	}
	.grid-layout[data-gap='lg'] {
		gap: var(--spacing-lg);
	}
	.grid-layout[data-gap='xl'] {
		gap: var(--spacing-xl);
	}
	.grid-layout[data-gap='2xl'] {
		gap: var(--spacing-2xl);
	}
	.grid-layout[data-gap='3xl'] {
		gap: var(--spacing-3xl);
	}
	.grid-layout[data-gap='4xl'] {
		gap: var(--spacing-4xl);
	}
	.grid-layout[data-bg='bg'] {
		background: var(--bg);
	}
	.grid-layout[data-bg='sf'] {
		background: var(--sf);
	}
	.grid-layout[data-bg='sfh'] {
		background: var(--sfh);
	}
	.grid-layout[data-bg='tertiary'] {
		background: var(--tertiary);
	}
	.grid-layout[data-bg='rainbow'] {
		background-image: linear-gradient(160deg, #4f46e5, #3b82f6, #a855f7, #f59e0b, #ef4444, #0ea5e9);
		background-size: 200% 200%;
		animation: grid-rainbow-shift 12s ease infinite;
	}
	@keyframes grid-rainbow-shift {
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
	@media (max-width: 960px) {
		.grid-layout.stack {
			grid-template-columns: 1fr !important;
		}
		/* Grid items default to min-width: auto, so a track can never shrink below an
		   item's min-content width — one unbreakable child (an email, a fixed-width
		   panel) forces the single 1fr track wider than the viewport and the excess is
		   clipped. Let stacked children shrink to the column instead. */
		.grid-layout.stack > :global(*) {
			min-width: 0;
		}
	}
</style>
