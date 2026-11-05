<script lang="ts">
	import Skeleton from './Skeleton.svelte';
	import SkeletonCircle from './SkeletonCircle.svelte';
	import SkeletonText from './SkeletonText.svelte';

	let {
		avatar = false,
		class: klass = '',
		lines = 2,
		variant = 'pulse',
	}: {
		/** Show a leading avatar header. */
		avatar?: boolean;
		class?: string;
		/** Body text lines. */
		lines?: number;
		variant?: 'pulse' | 'shimmer';
	} = $props();
</script>

<div class="sk-card {klass}">
	<div class="sk-card-head">
		{#if avatar}
			<SkeletonCircle size="md" {variant} />
		{/if}
		<Skeleton h="0.75rem" radius="xs" {variant} w="45%" />
	</div>
	<Skeleton h="1.75rem" radius="xs" {variant} w="60%" />
	{#if lines > 0}
		<SkeletonText lastLineWidth="50%" {lines} size="sm" {variant} />
	{/if}
</div>

<style>
	.sk-card {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 1rem;
		border: 1px solid var(--bd, #e5e3e0);
		border-radius: var(--radius-md);
		width: 100%;
	}
	.sk-card-head {
		display: flex;
		align-items: center;
		gap: 0.625rem;
	}
</style>
