<script lang="ts">
	import type { AuthLoads } from '@zeyolabs/kit/auth/loads';
	import type { Snippet } from 'svelte';

	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { PasskeyClient } from '@zeyolabs/kit/auth/sessions/passkeys/client';
	import { onMount } from 'svelte';

	import Button from '../form/Button.svelte';
	import Input from '../form/primitives/Input.svelte';
	import Divider from '../layout/Divider.svelte';
	import Span from '../text/Span.svelte';
	import Text from '../text/Text.svelte';
	import Turnstile from '../turnstile/Turnstile.svelte';
	import AuthAlert from './AuthAlert.svelte';

	/**
	 * Passwordless sign-in (`@zeyolabs/kit/auth`): a passkey where the browser supports one, else
	 * an emailed link, and the "finish signing in" step a link lands on. `data` is the page's
	 * `AuthLoads.login` result. Put it in an `AuthCard`, or under a page title.
	 */
	let {
		data,
		footer,
		intro,
	}: {
		data: Awaited<ReturnType<typeof AuthLoads.login>>;
		/** Below everything, e.g. the Access identity the app sees. */
		footer?: Snippet;
		intro?: string;
	} = $props();

	// Feature detection only runs in the browser; the server renders the email form alone.
	let supported = $state(false);
	onMount(() => (supported = PasskeyClient.supported()));

	// With Turnstile on (`data.turnstileSiteKey`), the email form waits for a solved token.
	let turnstileToken = $state('');

	let passkeyError = $state<null | string>(null);
	let busy = $state(false);

	async function usePasskey() {
		passkeyError = null;
		busy = true;
		try {
			// eslint-disable-next-line svelte/no-navigation-without-resolve -- server-checked same-site path
			await goto(await PasskeyClient.signIn({ next: data.next }), { invalidateAll: true });
		} catch (err) {
			if (!PasskeyClient.isCancel(err)) {
				passkeyError = err instanceof Error ? err.message : 'Passkey sign-in failed';
			}
		} finally {
			busy = false;
		}
	}
</script>

<div class="sign-in">
	{#if data.error}
		<AuthAlert>{data.error}</AuthAlert>
	{/if}

	{#if data.token}
		<Text color="secondary">Finish signing in on this device.</Text>
		<form action="/auth/verify" method="post">
			<input name="token" type="hidden" value={data.token} />
			<input name="next" type="hidden" value={data.next} />
			<button class="btn default" type="submit">Sign in</button>
		</form>
	{:else if data.sent}
		<Text>If that email may sign in, a link is on its way. It works once, for 15 minutes.</Text>
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- the page this sits on -->
		<a href={page.url.pathname}><Span>Use a different email</Span></a>
	{:else}
		{#if intro}<Text color="secondary">{intro}</Text>{/if}

		{#if supported}
			<Button disabled={busy} onclick={usePasskey}>
				{busy ? 'Waiting for passkey…' : 'Sign in with a passkey'}
			</Button>
			{#if passkeyError}<AuthAlert>{passkeyError}</AuthAlert>{/if}
			<Divider label="or" />
		{/if}

		<form action="/auth/email" method="post">
			<input name="next" type="hidden" value={data.next} />
			<label for="sign-in-email"><Span bold>Email</Span></label>
			<Input
				id="sign-in-email"
				name="email"
				autocomplete="email"
				required
				type="email"
				value={data.accessEmail ?? ''}
			/>
			{#if data.turnstileSiteKey}
				<Turnstile onToken={(token) => (turnstileToken = token)} siteKey={data.turnstileSiteKey} />
				<input name="turnstileToken" type="hidden" value={turnstileToken} />
			{/if}
			<button
				class="btn secondary"
				disabled={Boolean(data.turnstileSiteKey) && !turnstileToken}
				type="submit"
			>
				Email me a sign-in link
			</button>
		</form>
	{/if}

	{@render footer?.()}
</div>

<style>
	.sign-in,
	form {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	form {
		gap: 8px;
	}
	.sign-in :global(.btn) {
		width: 100%;
	}
	a {
		text-decoration: underline;
	}
</style>
