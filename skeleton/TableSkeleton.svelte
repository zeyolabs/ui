<script lang="ts">
	import Skeleton from './Skeleton.svelte';

	// Matches SelectAllTableCell/SelectRowTableCell's fixed column width.
	const CHECKBOX_COL_WIDTH = '40px';

	let {
		checkbox = false,
		cols = 2,
		rows = 6,
		variant = 'pulse',
	}: {
		/** Leading checkbox-shaped placeholder, for a table with a select column. Counts as one
		 * of `cols` — checkbox + cols=2 still shows 2 columns total, not 3. Always a fixed-width
		 * column, matching the real checkbox column it's standing in for. */
		checkbox?: boolean;
		/** Total number of columns per row, checkbox included. */
		cols?: number;
		rows?: number;
		variant?: 'pulse' | 'shimmer';
	} = $props();

	const barCols = $derived(checkbox ? cols - 1 : cols);
</script>

<div class="flex flex-col">
	<div
		style="background: var(--sf);"
		class="flex items-center gap-3 border-b border-(--bds) px-4 py-3.5"
	>
		{#if checkbox}
			<div style:width={CHECKBOX_COL_WIDTH} class="flex shrink-0 justify-center"></div>
		{/if}
		<div
			style:grid-template-columns="repeat({barCols}, 1fr)"
			class="grid flex-1 items-center gap-4"
		>
			{#each Array.from({ length: barCols }) as _, j (j)}
				<Skeleton h="0.5rem" radius="xs" {variant} w="40%" />
			{/each}
		</div>
	</div>
	{#each Array.from({ length: rows }) as _, i (i)}
		<div class="flex items-center gap-3 border-b border-(--bds) px-4 py-3.5 last:border-b-0">
			{#if checkbox}
				<div style:width={CHECKBOX_COL_WIDTH} class="flex shrink-0 justify-center">
					<Skeleton h="1rem" radius="xs" {variant} w="1rem" />
				</div>
			{/if}
			<div
				style:grid-template-columns="repeat({barCols}, 1fr)"
				class="grid flex-1 items-center gap-4"
			>
				{#each Array.from({ length: barCols }) as _, j (j)}
					<Skeleton h="0.75rem" radius="xs" {variant} />
				{/each}
			</div>
		</div>
	{/each}
</div>
