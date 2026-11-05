<script lang="ts">
	import { Checkbox } from '@zeyolabs/ui/form/primitives';

	/**
	 * Content for a table's select-row body cell — place inside a <TableCell> (or a
	 * GroupedGrid column's `cell`, which already provides one). Pair with `SelectAllCell`.
	 */
	let {
		label = 'row',
		onToggle,
		selected,
	}: {
		/** Used in the checkbox's aria-label, e.g. "Select {label}" — pass something identifying
		 *  (a name, an id) when available; falls back to a generic "row". */
		label?: string;
		onToggle: () => void;
		selected: boolean;
	} = $props();
</script>

<div class="select-cell">
	<Checkbox aria-label={`Select ${label}`} checked={selected} onCheckedChange={onToggle} />
</div>

<style>
	.select-cell {
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
