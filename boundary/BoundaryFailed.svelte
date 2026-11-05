<script lang="ts">
	import { getHttpStatus } from '@zeyolabs/kit/utils/errors';
	import { Button } from '@zeyolabs/ui/form';
	import Text from '@zeyolabs/ui/text/Text.svelte';

	let {
		error,
		message = 'Something went wrong loading this.',
		reset,
		statusMessages = {},
	}: {
		error: unknown;
		/** Fallback copy for any status not covered by `statusMessages`/the built-in 404+429 text. */
		message?: string;
		reset: () => void;
		/** Per-status copy overrides, e.g. `{ 403: 'No access to this batch.' }` — 404 already has a
		 *  built-in default ('Not found.'), override it only for a more specific noun. */
		statusMessages?: Partial<Record<number, string>>;
	} = $props();

	const status = $derived(getHttpStatus(error));
	const text = $derived(
		(status !== null && statusMessages[status]) ||
			(status === 404
				? 'Not found.'
				: status === 429
					? 'Too many requests — try again shortly.'
					: message)
	);
	// A 404 means the thing just doesn't exist — retrying re-runs the same lookup for the same
	// (non-)result, so the button is only useful for a transient failure.
	const retryable = $derived(status !== 404);
</script>

<div class="flex flex-col items-center gap-3 p-10">
	<Text centered color="secondary">{text}</Text>
	{#if retryable}
		<Button onclick={() => reset()} variant="secondary">Try again</Button>
	{/if}
</div>
