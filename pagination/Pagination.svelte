<!-- Simple page control: Prev · "Page X of Y" · Next. Hidden when only one page. -->
<script lang="ts">
	import { ChevronLeft, ChevronRight } from '@lucide/svelte';
	import { Button } from '@zeyolabs/ui/form';

	let {
		class: className = 'mt-4',
		disabled = false,
		onPage,
		page,
		totalPages,
	}: {
		/** Layout classes on the wrapper — defaults to a top margin; pass `''` inside a footer
		 *  that already provides its own spacing. */
		class?: string;
		disabled?: boolean;
		onPage: (p: number) => void;
		page: number;
		totalPages: number;
	} = $props();

	// The buttons' `disabled` attribute alone can't prevent overshoot: a fast click burst
	// fires handlers against a stale `page` before the re-render disables the button, so
	// clamp here so `onPage` never receives a value outside [0, totalPages - 1].
	function goTo(p: number) {
		onPage(Math.min(Math.max(p, 0), totalPages - 1));
	}
</script>

{#if totalPages > 1}
	<div class="flex items-center justify-center gap-3 {className}">
		<Button disabled={disabled || page <= 0} onclick={() => goTo(page - 1)} variant="ghost">
			<ChevronLeft size={13} /> Prev
		</Button>
		<span class="text-(--txs)">Page {page + 1} of {totalPages}</span>
		<Button
			disabled={disabled || page >= totalPages - 1}
			onclick={() => goTo(page + 1)}
			variant="ghost"
		>
			Next <ChevronRight size={13} />
		</Button>
	</div>
{/if}
