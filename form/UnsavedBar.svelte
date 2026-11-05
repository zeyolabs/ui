<script lang="ts">
	import type { Snippet } from 'svelte';

	import Span from '@zeyolabs/ui/text/Span.svelte';

	interface Props {
		/** Action buttons (Save, plus any secondary actions like Pause/Resume). */
		children: Snippet;
		show: boolean;
	}

	let { children, show }: Props = $props();
</script>

{#if show}
	<div
		class="sticky bottom-0 z-10 flex items-center justify-end gap-2.5 border-t border-(--bds) bg-(--bg) px-6 py-3.5"
	>
		<Span class="mr-auto" color="warning" size="sm">Unsaved changes</Span>
		{@render children()}
	</div>
{/if}
