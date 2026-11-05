export function createFilterDraft<T>(getCommitted: () => T[], commit: (values: T[]) => void) {
	let values = $state<T[]>([...getCommitted()]);

	return {
		apply() {
			commit([...values]);
		},
		clear() {
			values = [];
		},
		get dirty() {
			const committed = getCommitted();
			return values.length !== committed.length || !values.every((v) => committed.includes(v));
		},
		reset() {
			values = [...getCommitted()];
		},
		get values() {
			return values;
		},
		set values(next: T[]) {
			values = next;
		},
	};
}
