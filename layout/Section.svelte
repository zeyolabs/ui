<script lang="ts">
	import type { Snippet } from 'svelte';

	/** A vertical block with a semantic bottom margin — replaces the mb-3/mb-3.5/mb-4/mb-7/mb-10
	 * guessing game between page sections. `padding` + `bg` turn it into a full-bleed page
	 * band (the colored, padded section every landing page reimplements slightly differently)
	 * — omit both for the plain spacer-only behavior this component started as. */
	let {
		bg,
		centered = false,
		children,
		class: cls = '',
		contentWidth,
		padding,
		ref = $bindable(null),
		spacing = 'md',
	}: {
		/** Omit for transparent (the historical default). 'rainbow' is the animated gradient
		 * panel used for feature/product-UI showcase blocks. */
		bg?: 'bg' | 'rainbow' | 'sf' | 'sfh' | 'tertiary';
		/** text-align: center on the section, cascading to children. */
		centered?: boolean;
		children: Snippet;
		/** Layout-only, same rule as Button/Text — margin, or a conditional class computed by
		 * the caller (e.g. `class={active ? 'row-active' : ''}`) for state Section itself has
		 * no prop for. Don't sneak a color/padding override in through this — use the real props. */
		class?: string;
		/** Caps + centers children in an inner wrapper — the max-width/margin:0 auto div every
		 * full-bleed section band needs. Omit for children filling the section's own width. */
		contentWidth?: string;
		/** Top/bottom padding — the section-band tier (2xl-4xl) is sized for this,
		 * component-internal gaps never need to reach this high. Setting this also applies
		 * the left/right padding every full-bleed section band already uses (var(--spacing-xl),
		 * dropping to var(--spacing-md) under 700px) — that horizontal/responsive half doesn't
		 * vary from section to section, only the vertical number does. Omit for no padding. */
		padding?: '2xl' | '3xl' | '4xl' | 'lg' | 'md' | 'sm' | 'xl';
		ref?: HTMLElement | null;
		/** 'none' — for a full-bleed bg band sitting flush against the next section, no gap
		 * between the two painted areas. */
		spacing?: 'lg' | 'md' | 'none' | 'sm';
	} = $props();
</script>

<section
	bind:this={ref}
	class={cls}
	class:centered
	data-bg={bg}
	data-padding={padding}
	data-spacing={spacing}
>
	{#if contentWidth}
		<div style:max-width={contentWidth} class="section-content">
			{@render children()}
		</div>
	{:else}
		{@render children()}
	{/if}
</section>

<style>
	.section-content {
		margin-inline: auto;
	}
	section.centered {
		text-align: center;
	}
	section[data-spacing='none'] {
		margin-bottom: 0;
	}
	section[data-spacing='sm'] {
		margin-bottom: var(--spacing-sm);
	}
	section[data-spacing='md'] {
		margin-bottom: var(--spacing-md);
	}
	section[data-spacing='lg'] {
		margin-bottom: var(--spacing-lg);
	}
	section[data-padding] {
		padding-left: var(--spacing-xl);
		padding-right: var(--spacing-xl);
	}
	section[data-padding='sm'] {
		padding-top: var(--spacing-sm);
		padding-bottom: var(--spacing-sm);
	}
	section[data-padding='md'] {
		padding-top: var(--spacing-md);
		padding-bottom: var(--spacing-md);
	}
	section[data-padding='lg'] {
		padding-top: var(--spacing-lg);
		padding-bottom: var(--spacing-lg);
	}
	section[data-padding='xl'] {
		padding-top: var(--spacing-xl);
		padding-bottom: var(--spacing-xl);
	}
	section[data-padding='2xl'] {
		padding-top: var(--spacing-2xl);
		padding-bottom: var(--spacing-2xl);
	}
	section[data-padding='3xl'] {
		padding-top: var(--spacing-3xl);
		padding-bottom: var(--spacing-3xl);
	}
	section[data-padding='4xl'] {
		padding-top: var(--spacing-4xl);
		padding-bottom: var(--spacing-4xl);
	}
	@media (max-width: 700px) {
		section[data-padding] {
			padding-left: var(--spacing-md);
			padding-right: var(--spacing-md);
		}
	}
	section[data-bg='bg'] {
		background: var(--bg);
	}
	section[data-bg='sf'] {
		background: var(--sf);
	}
	section[data-bg='sfh'] {
		background: var(--sfh);
	}
	section[data-bg='tertiary'] {
		background: var(--tertiary);
	}
	section[data-bg='rainbow'] {
		background-image: linear-gradient(160deg, #4f46e5, #3b82f6, #a855f7, #f59e0b, #ef4444, #0ea5e9);
		background-size: 200% 200%;
		animation: section-rainbow-shift 12s ease infinite;
	}
	@keyframes section-rainbow-shift {
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
