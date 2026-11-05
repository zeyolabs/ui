/**
 * Shared row-selection state for a paginated, selectable list — exclusion-based so "select all N
 * matching" never materializes the full matching set into memory. `scope: 'ids'` is the ordinary
 * case (`ids` holds the selected rows); `scope: 'allMatching'` means "everything the current
 * filter matches, except `ids`" — so `ids` stays small (only what's been manually deselected)
 * regardless of how big the matching set actually is.
 *
 * In `'allMatching'` scope the header checkbox (`toggleAll`) is a master toggle: any click clears
 * the whole selection rather than excluding just the visible page. Per-row checkboxes (`toggle`)
 * are how individual rows get excluded while the rest of the matching set stays selected.
 */
export function createSelectionState() {
	let scope = $state<'allMatching' | 'ids'>('ids');
	let ids = $state(new Set<string>());

	function toggle(id: string) {
		const next = new Set(ids);
		if (next.has(id)) next.delete(id);
		else next.add(id);
		ids = next;
	}

	function toggleAll(pageIds: string[]) {
		if (scope === 'allMatching') {
			// The header checkbox is a master toggle once everything matching is already selected —
			// there's nothing "more" to select, so any click on it means "give up the whole
			// selection," not "toggle just the visible page." Per-row checkboxes (toggle()) remain
			// the way to exclude specific rows while keeping the rest of the matching set selected.
			clear();
			return;
		}
		const allSelected = pageIds.length > 0 && pageIds.every((id) => ids.has(id));
		ids = allSelected
			? new Set([...ids].filter((id) => !pageIds.includes(id)))
			: new Set([...ids, ...pageIds]);
	}

	function selectAllMatching() {
		scope = 'allMatching';
		ids = new Set();
	}

	function clear() {
		scope = 'ids';
		ids = new Set();
	}

	/** Selected count given the total matching the current filter — feeds straight into
	 *  `SelectionBar`/`SelectionOverlay`'s `count` prop. */
	function countGiven(total: number): number {
		return scope === 'ids' ? ids.size : Math.max(0, total - ids.size);
	}

	/** Is a given row currently selected, given whether it's part of the matching set at all
	 *  (always true for a row actually rendered on a page that matches the active filter). */
	function has(id: string): boolean {
		return scope === 'ids' ? ids.has(id) : !ids.has(id);
	}

	return {
		get allMatchingSelected() {
			return scope === 'allMatching';
		},
		clear,
		countGiven,
		has,
		get ids() {
			return ids;
		},
		get scope() {
			return scope;
		},
		selectAllMatching,
		toggle,
		toggleAll,
	};
}

export type SelectionState = ReturnType<typeof createSelectionState>;
