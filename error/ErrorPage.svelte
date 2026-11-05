<script lang="ts" module>
	const DEFAULT_MESSAGE: Record<number, string> = {
		403: 'You do not have access to this page.',
		404: 'This page could not be found.',
		500: 'Something went wrong on our end.',
	};
</script>

<script lang="ts">
	import type { Page } from '@sveltejs/kit';
	import type { Snippet } from 'svelte';

	import { House } from '@lucide/svelte';
	import { Button } from '@zeyolabs/ui/form';

	let {
		children,
		home,
		page,
	}: {
		/** Extra action(s) rendered beside the home button. */
		children?: Snippet;
		/** Primary action; omit to render no button. */
		home?: { href: string; label: string };
		/** SvelteKit's `page` from `$app/state` — status + error message come from here. */
		page: Page;
	} = $props();

	const status = $derived(page.status);
	const message = $derived(page.error?.message);
</script>

<svelte:head><title>{status}</title></svelte:head>

<div
	style="background: var(--bg); color: var(--tx);"
	class="flex min-h-svh items-center justify-center px-6 py-12"
>
	<div class="w-full max-w-md text-center">
		<h1 class="text-9xl">{status}</h1>
		<div style="background: var(--bd);" class="my-6 mx-auto h-px w-24"></div>
		<p style="color: var(--txs);" class="text-xl">
			{message ?? DEFAULT_MESSAGE[status] ?? 'An error occurred.'}
		</p>
		{#if home || children}
			<div class="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
				{#if home}
					<Button href={home.href}><House size={18} /> {home.label}</Button>
				{/if}
				{@render children?.()}
			</div>
		{/if}
	</div>
</div>
