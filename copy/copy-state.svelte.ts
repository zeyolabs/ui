export function createCopyState(resetAfterMilliseconds: number) {
	let copied = $state(false);
	let resetTimer: ReturnType<typeof setTimeout> | undefined;

	async function copy(clipboardText: () => Promise<string>) {
		if (!navigator?.clipboard) return;
		try {
			await navigator.clipboard.writeText(await clipboardText());
			copied = true;
			clearTimeout(resetTimer);
			resetTimer = setTimeout(() => (copied = false), resetAfterMilliseconds);
		} catch (error) {
			console.error('Failed to copy:', error);
		}
	}

	return {
		get copied() {
			return copied;
		},
		copy,
	};
}
