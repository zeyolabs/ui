<script lang="ts">
	import { Button } from '@zeyolabs/ui/form';
	import Text from '@zeyolabs/ui/text/Text.svelte';

	let {
		label = 'Reload to update',
		message = 'A new version is available.',
		show,
	}: {
		label?: string;
		message?: string;
		/** Pass `updated.current` from `$app/state`: true once a newer deploy is live. */
		show: boolean;
	} = $props();
</script>

{#if show}
	<div
		class="fixed inset-0 z-99999 flex flex-col items-center justify-center gap-4 bg-black/80 p-6 text-center"
		aria-label={message}
		aria-modal="true"
		role="alertdialog"
	>
		<Text bold centered color="white">{message}</Text>
		<Button onclick={() => location.reload()}>{label}</Button>
	</div>
{/if}
