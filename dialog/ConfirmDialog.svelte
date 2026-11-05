<script lang="ts">
	import type { Snippet } from 'svelte';

	import { Button } from '@zeyolabs/ui/form';

	import Dialog from './Dialog.svelte';
	import DialogBody from './DialogBody.svelte';
	import DialogCloseButton from './DialogCloseButton.svelte';
	import DialogFooter from './DialogFooter.svelte';
	import DialogTrigger from './DialogTrigger.svelte';

	let {
		body,
		cancelLabel = 'Cancel',
		confirmLabel = 'Yes',
		description,
		destructive = true,
		onConfirm,
		title = 'Are you sure?',
		trigger,
	}: {
		/** Extra content above the buttons, for a consequence a one-line `description` can't carry. */
		body?: Snippet;
		cancelLabel?: string;
		confirmLabel?: string;
		description?: string;
		destructive?: boolean;
		onConfirm: () => Promise<void> | void;
		title?: string;
		trigger: Snippet;
	} = $props();

	let open = $state(false);
	let busy = $state(false);

	async function confirm() {
		if (busy) return;
		busy = true;
		try {
			await onConfirm();
			open = false;
		} finally {
			busy = false;
		}
	}
</script>

<Dialog bind:open>
	<DialogTrigger>{@render trigger()}</DialogTrigger>

	<DialogBody canClose={() => !busy} {description} size="sm" {title}>
		{@render body?.()}

		<DialogFooter>
			<DialogCloseButton disabled={busy}>{cancelLabel}</DialogCloseButton>
			<Button loading={busy} onclick={confirm} variant={destructive ? 'destructive' : 'default'}>
				{confirmLabel}
			</Button>
		</DialogFooter>
	</DialogBody>
</Dialog>
