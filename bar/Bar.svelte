<script lang="ts">
	// Segmented horizontal bar — one or more colored fills against a track. A single
	// segment with an explicit `total` (> sum of segment values) reads as a plain
	// progress bar; multiple segments summing to the full width (the default `total`)
	// read as a distribution, e.g. verification-status breakdown. `indeterminate` ignores
	// `segments`/`total` and shows a sliding stripe instead, for progress with no known total yet.
	let {
		height = 6,
		indeterminate = false,
		segments = [],
		total,
	}: {
		height?: number;
		indeterminate?: boolean;
		segments?: { color: string; value: number }[];
		total?: number;
	} = $props();

	const sum = $derived(segments.reduce((s, seg) => s + seg.value, 0));
	const denom = $derived(total ?? sum);
</script>

<div style="height: {height}px;" class="bar">
	{#if indeterminate}
		<div class="seg indeterminate"></div>
	{:else}
		{#each segments as seg, i (i)}
			{#if seg.value > 0}
				<div
					style="width: {denom > 0 ? (seg.value / denom) * 100 : 0}%; background: {seg.color};"
					class="seg"
				></div>
			{/if}
		{/each}
	{/if}
</div>

<style>
	.bar {
		display: flex;
		width: 100%;
		border-radius: var(--radius);
		overflow: hidden;
		background: var(--sfh);
		box-shadow: inset 0 0 0 1px var(--bd);
	}
	.seg {
		height: 100%;
	}
	.seg.indeterminate {
		width: 40%;
		background: var(--tx);
		animation: bar-indet 1.1s ease-in-out infinite;
	}
	@keyframes bar-indet {
		0% {
			margin-left: -40%;
		}
		100% {
			margin-left: 100%;
		}
	}
</style>
