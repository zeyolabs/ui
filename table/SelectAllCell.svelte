<script lang="ts">
	import { Checkbox } from '@zeyolabs/ui/form/primitives';

	/**
	 * Content for a table's select-all header cell — place inside a <TableCell> (or a
	 * GroupedGrid column's `headerCell`, which already provides one). Pair with `SelectRowCell`.
	 */
	let {
		allSelected,
		onToggleAll,
		someSelected = false,
	}: {
		allSelected: boolean;
		onToggleAll: () => void;
		someSelected?: boolean;
	} = $props();
</script>

<div class="select-cell">
	<Checkbox
		aria-label="Select all rows"
		checked={allSelected}
		indeterminate={!allSelected && someSelected}
		onCheckedChange={onToggleAll}
	/>
</div>

<style>
	.select-cell {
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
