<script lang="ts">
	import type { Snippet } from 'svelte';

	import { getContext } from 'svelte';

	let { children }: { children?: Snippet } = $props();

	const ctx = getContext<undefined | { open: () => void }>('dialog');
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<span style="display: contents" onclick={() => ctx?.open()}>
	{@render children?.()}
</span>
