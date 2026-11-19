<script lang="ts">
	import { onMount } from 'svelte';

	import { loadTurnstile } from './load';

	/**
	 * Cloudflare Turnstile, rendered explicitly once its script has loaded. `onToken` gets each
	 * solved token; an expired or timed-out challenge resets itself. Bind `reset` to start over
	 * after the token is spent. If the script never loads, nothing renders and the server-side
	 * check rejects the form.
	 */
	let {
		onToken,
		reset = $bindable(),
		siteKey,
		theme = 'auto',
	}: {
		onToken: (token: string) => void;
		reset?: () => void;
		siteKey: string;
		theme?: 'auto' | 'dark' | 'light';
	} = $props();

	let container: HTMLDivElement;

	onMount(() => {
		let removed = false;
		let remove = () => {};
		loadTurnstile().then((turnstile) => {
			if (removed || !turnstile) return;
			let widgetId: string | undefined;
			const restart = () => {
				if (widgetId) turnstile.reset(widgetId);
			};
			widgetId = turnstile.render(container, {
				callback: (token) => onToken(token),
				'expired-callback': restart,
				'response-field': false,
				sitekey: siteKey,
				theme,
				'timeout-callback': restart,
			});
			reset = restart;
			remove = () => {
				if (widgetId) turnstile.remove(widgetId);
			};
		});
		return () => {
			removed = true;
			remove();
		};
	});
</script>

<div bind:this={container}></div>
