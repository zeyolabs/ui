<script lang="ts">
	import { Button } from '@zeyolabs/ui/form';

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
		aria-labelledby="update-overlay-message"
		aria-modal="true"
		role="alertdialog"
	>
		<p id="update-overlay-message" class="text-base font-medium text-white">{message}</p>
		<Button onclick={() => location.reload()}>{label}</Button>
	</div>
{/if}
