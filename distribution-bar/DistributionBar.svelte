<script lang="ts">
	import Bar from '@zeyolabs/ui/bar/Bar.svelte';
	import MiniStat from '@zeyolabs/ui/mini-stat/MiniStat.svelte';
	import Span from '@zeyolabs/ui/text/Span.svelte';

	let {
		class: className = '',
		emptyLabel = 'No data',
		segments,
		total,
	}: {
		class?: string;
		/** Shown instead of the bar when every segment is zero (e.g. nothing verified yet). */
		emptyLabel?: string;
		segments: { color: string; label: string; value: number }[];
		/** Forwarded to Bar — omit to size segments against their own sum (a full breakdown); pass
		 * an explicit total larger than the sum to read as a partial-progress bar instead. */
		total?: number;
	} = $props();

	const visible = $derived(segments.filter((s) => s.value > 0));
</script>

{#if visible.length > 0}
	<div class="w-full min-w-[220px] max-w-[380px] {className}">
		<Bar segments={visible.map((s) => ({ color: s.color, value: s.value }))} {total} />
		<div class="mt-1 flex flex-nowrap gap-x-3 whitespace-nowrap">
			{#each visible as seg (seg.label)}
				<MiniStat dot={seg.color} label={seg.label} value={seg.value.toLocaleString()} />
			{/each}
		</div>
	</div>
{:else}
	<div class="w-full min-w-[220px] max-w-[380px] {className}">
		<Span color="secondary" size="sm">{emptyLabel}</Span>
	</div>
{/if}
