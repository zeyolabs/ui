<script lang="ts">
	import type { Snippet } from 'svelte';

	import { Button } from '@zeyolabs/ui/form';
	import { getContext } from 'svelte';

	type Variant = 'default' | 'destructive' | 'ghost' | 'ghost-destructive';

	let {
		children,
		class: className = '',
		disabled = false,
		variant = 'ghost',
	}: {
		children?: Snippet;
		class?: string;
		disabled?: boolean;
		variant?: Variant;
	} = $props();

	const ctx = getContext<undefined | { close: () => void }>('dialog');
</script>

<Button class={className} {disabled} onclick={() => ctx?.close()} {variant}>
	{@render children?.()}
</Button>
