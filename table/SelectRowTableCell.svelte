<script lang="ts">
	import SelectRowCell from './SelectRowCell.svelte';
	import TableCell from './TableCell.svelte';

	/**
	 * SelectRowCell pre-wrapped in its own fixed-width <TableCell> — drop directly inside
	 * <TableRow>, no manual width/padding needed. Use SelectRowCell directly instead only
	 * inside a GroupedGrid column (its cell already provides the TableCell wrapper).
	 */
	let {
		label = 'row',
		onToggle,
		selected,
		stickyLeft = '0px',
	}: {
		label?: string;
		onToggle: () => void;
		selected: boolean;
		stickyLeft?: string;
	} = $props();
</script>

<TableCell style="width: 40px; padding: 0 8px 0 16px;" {stickyLeft} stopPropagation>
	<SelectRowCell {label} {onToggle} {selected} />
</TableCell>
