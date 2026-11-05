<script lang="ts">
	import Stack from '../layout/Stack.svelte';
	import Skeleton from './Skeleton.svelte';
	import SkeletonButton from './SkeletonButton.svelte';

	let {
		labelWidth = '6rem',
		variant = 'pulse',
	}: {
		/** Width of the label placeholder above the field. */
		labelWidth?: string;
		variant?: 'pulse' | 'shimmer';
	} = $props();
</script>

<Stack gap="xs">
	<Skeleton h="0.7rem" radius="xs" {variant} w={labelWidth} />
	<SkeletonButton {variant} w="100%" />
</Stack>
