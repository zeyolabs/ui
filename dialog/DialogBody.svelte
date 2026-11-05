<script lang="ts">
	import type { Snippet } from 'svelte';

	import { X } from '@lucide/svelte';
	import { getContext } from 'svelte';

	let {
		canClose = () => true,
		children,
		description,
		padded = true,
		size = 'md',
		title,
	}: {
		canClose?: () => boolean;
		children: Snippet;
		description?: string;
		/** Wrap children in standard body padding. Set false for full-bleed/custom-scroll content. */
		padded?: boolean;
		size?: 'lg' | 'md' | 'sm' | 'xl';
		title?: string;
	} = $props();

	const ctx = getContext<{ close: () => void; isOpen: boolean }>('dialog');

	function close() {
		if (!canClose()) return;
		ctx.close();
	}

	const widthClass = $derived(
		size === 'sm'
			? 'w-[380px]'
			: size === 'lg'
				? 'w-[600px]'
				: size === 'xl'
					? 'w-[760px]'
					: 'w-[420px]'
	);
	const tallSizes = $derived(size === 'lg' || size === 'xl');
</script>

{#if ctx.isOpen}
	<div
		class="fixed inset-0 z-9999 flex items-center justify-center bg-[rgba(20,18,24,0.42)] backdrop-blur-sm"
		aria-label="Close dialog"
		onclick={close}
		onkeydown={(e) => e.key === 'Escape' && close()}
		role="button"
		tabindex="-1"
	>
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<div
			class="max-w-[92vw] bg-(--bg) text-(--tx) border border-(--bd) rounded-lg overflow-hidden shadow-[0_24px_64px_-12px_rgba(20,18,24,0.22),0_8px_24px_rgba(20,18,24,0.08)] {widthClass} {tallSizes
				? 'max-h-[85vh] flex flex-col'
				: ''}"
			aria-modal="true"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
			role="dialog"
			tabindex="-1"
		>
			{#if title}
				<div class="relative px-5.5 pt-5 pb-4 border-b border-(--bds) text-center">
					<h6 class="mx-auto max-w-full">
						{title}
					</h6>
					{#if description}<p class="small text-(--txs) mt-1">{description}</p>{/if}
					<button
						class="absolute top-3 right-3 inline-flex items-center justify-center w-6.5 h-6.5 bg-transparent border border-transparent rounded-md text-(--txs) cursor-pointer shrink-0 transition-[background,border-color,color] duration-120 hover:bg-(--sf) hover:border-(--bd) hover:text-(--tx)"
						aria-label="Close"
						onclick={close}
						type="button"
					>
						<X size={13} />
					</button>
				</div>
			{/if}
			{#if padded}
				<div class="px-5.5 pt-4.5 pb-5.5 {tallSizes ? 'flex-1 min-h-0 overflow-y-auto' : ''}">
					{@render children()}
				</div>
			{:else}
				{@render children()}
			{/if}
		</div>
	</div>
{/if}
