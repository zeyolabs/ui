<script lang="ts">
	import type { Snippet } from 'svelte';

	import { getContext } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	let {
		canClose = () => true,
		children,
		side = 'right',
		size = 'md',
	}: {
		canClose?: () => boolean;
		children: Snippet;
		side?: 'left' | 'right';
		/** 360px / 420px / 560px, capped at 92vw. */
		size?: 'lg' | 'md' | 'sm';
	} = $props();

	const ctx = getContext<{ close: () => void; isOpen: boolean }>('drawer');

	function close() {
		if (canClose()) ctx.close();
	}

	const widthClass = $derived(
		size === 'sm'
			? 'w-[min(360px,92vw)]'
			: size === 'lg'
				? 'w-[min(560px,92vw)]'
				: 'w-[min(420px,92vw)]'
	);
</script>

{#if ctx.isOpen}
	<div
		class="fixed inset-0 z-9000 bg-(--ov)"
		aria-label="Close"
		onclick={close}
		onkeydown={(e) => e.key === 'Escape' && close()}
		role="button"
		tabindex="-1"
		transition:fade={{ duration: 120 }}
	></div>

	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		class="fixed inset-y-0 {side === 'right'
			? 'right-0'
			: 'left-0'} z-9001 {widthClass} bg-(--bg) border-(--bd) {side === 'right'
			? 'border-l'
			: 'border-r'} shadow-[0_16px_48px_-16px_rgba(20,18,24,0.2)] flex flex-col"
		aria-modal="true"
		onkeydown={(e) => e.key === 'Escape' && close()}
		role="dialog"
		tabindex="-1"
		transition:fly={{ duration: 180, x: side === 'right' ? 40 : -40 }}
	>
		{@render children()}
	</div>
{/if}
