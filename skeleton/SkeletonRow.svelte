<script lang="ts">
	import Skeleton from './Skeleton.svelte';
	import SkeletonCircle from './SkeletonCircle.svelte';

	let {
		avatar = true,
		class: klass = '',
		cols = 2,
		variant = 'pulse',
	}: {
		/** Show a leading avatar/circle. */
		avatar?: boolean;
		class?: string;
		/** Number of text columns after the avatar. */
		cols?: number;
		variant?: 'pulse' | 'shimmer';
	} = $props();

	// Decreasing widths so columns look like name / detail / value.
	const WIDTHS = ['40%', '24%', '16%', '12%'];
</script>

<div class="sk-row {klass}">
	{#if avatar}
		<SkeletonCircle size="sm" {variant} />
	{/if}
	<div class="sk-row-cols">
		{#each Array.from({ length: cols }) as _, i (i)}
			<Skeleton h="0.75rem" radius="xs" {variant} w={WIDTHS[i] ?? '20%'} />
		{/each}
	</div>
</div>

<style>
	.sk-row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		width: 100%;
	}
	.sk-row-cols {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex: 1;
	}
</style>
