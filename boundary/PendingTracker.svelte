<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	/**
	 * Instantiated inside `Boundary.svelte`'s `pending` snippet, never on its own — its own
	 * mount/unmount lifecycle only spans exactly as long as that snippet is shown, which is what
	 * lets `onStart`/`onEnd` track "this boundary's content is still resolving" (see
	 * `pending-context.ts`).
	 */
	let { onEnd, onStart }: { onEnd?: () => void; onStart?: () => void } = $props();

	onMount(() => onStart?.());
	onDestroy(() => onEnd?.());
</script>
