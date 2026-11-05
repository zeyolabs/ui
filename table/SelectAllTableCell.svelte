<script lang="ts">
	import SelectAllCell from './SelectAllCell.svelte';
	import TableCell from './TableCell.svelte';

	/**
	 * SelectAllCell pre-wrapped in its own fixed-width <TableCell> — drop directly inside
	 * <TableRow head>, no manual width/padding needed. Use SelectAllCell directly instead only
	 * inside a GroupedGrid column (its headerCell already provides the TableCell wrapper).
	 */
	let {
		allSelected,
		onToggleAll,
		someSelected = false,
		stickyLeft = '0px',
	}: {
		allSelected: boolean;
		onToggleAll: () => void;
		someSelected?: boolean;
		stickyLeft?: string;
	} = $props();
</script>

<TableCell style="width: 40px; padding: 0 8px 0 16px;" {stickyLeft}>
	<SelectAllCell {allSelected} {onToggleAll} {someSelected} />
</TableCell>
