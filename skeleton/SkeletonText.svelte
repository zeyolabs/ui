<script lang="ts">
	import Skeleton from './Skeleton.svelte';

	type Size = 'lg' | 'md' | 'sm';

	let {
		class: klass = '',
		gap = '0.5rem',
		lastLineWidth = '60%',
		lines = 1,
		size = 'md',
		variant = 'pulse',
	}: {
		class?: string;
		/** Vertical gap between lines. */
		gap?: string;
		/** Width of the final line (ragged-edge effect). Ignored when lines === 1. */
		lastLineWidth?: string;
		/** Number of text lines. */
		lines?: number;
		/** Line height preset. */
		size?: Size;
		variant?: 'pulse' | 'shimmer';
	} = $props();

	const HEIGHTS: Record<Size, string> = {
		lg: '1.25rem',
		md: '0.875rem',
		sm: '0.625rem',
	};
	const h = $derived(HEIGHTS[size]);
</script>

<span style="gap: {gap};" class="sk-text {klass}">
	{#each Array.from({ length: lines }) as _, i (i)}
		<Skeleton {h} radius="xs" {variant} w={lines > 1 && i === lines - 1 ? lastLineWidth : '100%'} />
	{/each}
</span>

<style>
	.sk-text {
		display: flex;
		flex-direction: column;
		width: 100%;
	}
</style>
