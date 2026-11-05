<script lang="ts">
	import type { Snippet } from 'svelte';

	import { createCopyState } from './copy-state.svelte';

	/**
	 * Headless click-to-copy — renders nothing itself, and hands back the interaction handlers plus
	 * copied state so the caller can apply them to whatever element fits (e.g. a <tr>, which a
	 * wrapping <div> couldn't legally contain). Shares the same copy/reset mechanism as CopyButton.
	 */
	let {
		children,
		clipboardText,
		resetAfterMilliseconds = 2000,
	}: {
		children: Snippet<
			[{ copied: boolean; onclick: () => void; onkeydown: (event: KeyboardEvent) => void }]
		>;
		clipboardText: () => Promise<string>;
		resetAfterMilliseconds?: number;
	} = $props();

	// svelte-ignore state_referenced_locally
	const copyState = createCopyState(resetAfterMilliseconds);

	function handleKeydown(event: KeyboardEvent) {
		if (event.key !== 'Enter' && event.key !== ' ') return;
		event.preventDefault();
		copyState.copy(clipboardText);
	}
</script>

{@render children({
	copied: copyState.copied,
	onclick: () => copyState.copy(clipboardText),
	onkeydown: handleKeydown,
})}
