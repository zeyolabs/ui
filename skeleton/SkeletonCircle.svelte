<script lang="ts">
	import Skeleton from './Skeleton.svelte';

	type Size = 'lg' | 'md' | 'sm';

	let {
		class: klass = '',
		size = 'md',
		variant = 'pulse',
	}: {
		class?: string;
		/** Diameter preset, or any CSS length for a custom size. */
		size?: Size | string;
		variant?: 'pulse' | 'shimmer';
	} = $props();

	const PRESETS: Record<Size, string> = {
		lg: '3.5rem',
		md: '2.5rem',
		sm: '1.5rem',
	};
	const d = $derived((PRESETS as Record<string, string>)[size] ?? size);
</script>

<Skeleton class={klass} h={d} radius="full" {variant} w={d} />
