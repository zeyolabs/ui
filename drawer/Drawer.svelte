<script lang="ts">
	import type { Snippet } from 'svelte';

	import { setContext } from 'svelte';

	let {
		children,
		onClose,
		open = $bindable(false),
	}: {
		children: Snippet;
		/** Fired when the drawer is closed via X / Esc / backdrop / close(). */
		onClose?: () => void;
		open?: boolean;
	} = $props();

	setContext('drawer', {
		close: () => {
			open = false;
			onClose?.();
		},
		get isOpen() {
			return open;
		},
		open: () => {
			open = true;
		},
	});
</script>

{@render children()}
