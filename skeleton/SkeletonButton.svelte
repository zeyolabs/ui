<script lang="ts">
	import Skeleton from './Skeleton.svelte';

	/** Mirrors `<Button size>`: omit for the default 35px button. */
	type Size = 'sm' | 'xs';

	let {
		class: klass = '',
		size,
		variant = 'pulse',
		w = '6rem',
	}: {
		class?: string;
		size?: Size;
		variant?: 'pulse' | 'shimmer';
		/** Button width — any CSS length. */
		w?: string;
	} = $props();

	const HEIGHTS: Record<Size, string> = {
		sm: 'var(--control-h-sm)',
		xs: '20px',
	};
	const h = $derived(size ? HEIGHTS[size] : 'var(--control-h)');
</script>

<Skeleton class={klass} {h} radius="md" {variant} {w} />
