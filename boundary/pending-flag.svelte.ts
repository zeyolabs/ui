/**
 * Whether `source` has stayed true for longer than `delay` ms. The delay stops a fast load from
 * flashing a loading state.
 */
export function delayedFlag(source: () => boolean, delay = 150): { readonly current: boolean } {
	let shown = $state(false);

	$effect(() => {
		if (!source()) {
			shown = false;
			return;
		}
		const timer = setTimeout(() => (shown = true), delay);
		return () => clearTimeout(timer);
	});

	return {
		get current() {
			return shown;
		},
	};
}

/**
 * Whether the surrounding `<svelte:boundary>` has been re-fetching for longer than `delay` ms.
 * The boundary's `pending` snippet only covers the first load; after that Svelte keeps the old
 * content on screen while a changed `await` resolves, so this is how a component rendered inside
 * the boundary knows to show a loading state.
 */
export function pendingFlag(delay = 150): { readonly current: boolean } {
	const inFlight = $derived($effect.pending());
	return delayedFlag(() => inFlight > 0, delay);
}
