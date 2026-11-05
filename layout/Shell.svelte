<script lang="ts">
	import type { Snippet } from 'svelte';

	/** Page max-width wrapper. `full` = no max-width/padding, for edge-to-edge app shells. `fill` = a
	 * padded column exactly the height of the viewport under the 3rem TopBar, for screens whose panes
	 * scroll inside themselves instead of the page. */
	let {
		children,
		variant = 'wide',
	}: {
		children: Snippet;
		variant?: 'fill' | 'full' | 'narrow' | 'wide' | 'xwide';
	} = $props();

	const maxWidth = {
		fill: 'max-w-none',
		full: 'max-w-none',
		narrow: 'max-w-[720px]',
		wide: 'max-w-[1200px]',
		xwide: 'max-w-[1600px]',
	};
</script>

<div
	class="mx-auto w-full {maxWidth[variant]} {variant === 'fill'
		? 'flex h-[calc(100vh-3rem)] flex-col gap-(--spacing-sm) p-(--spacing-sm)'
		: variant === 'full'
			? 'p-0'
			: 'px-[var(--spacing-lg)] pt-[var(--spacing-lg)] pb-[var(--spacing-2xl)]'}"
>
	{@render children()}
</div>
