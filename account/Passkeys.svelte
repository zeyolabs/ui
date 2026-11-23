<script lang="ts">
	import type { AuthLoads } from '@zeyolabs/kit/auth/loads';

	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import KeyRound from '@lucide/svelte/icons/key-round';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import { PasskeyClient, PasskeyClientError } from '@zeyolabs/kit/auth/sessions/passkeys/client';
	import { onMount } from 'svelte';

	import Card from '../card/Card.svelte';
	import Button from '../form/Button.svelte';
	import Input from '../form/primitives/Input.svelte';
	import Span from '../text/Span.svelte';
	import Text from '../text/Text.svelte';
	import Title from '../text/Title.svelte';
	import AuthAlert from './AuthAlert.svelte';

	/**
	 * The signed-in user's passkeys (`@zeyolabs/kit/auth`): list, remove, and add one in this
	 * browser. `fresh` and `passkeys` are the page's `AuthLoads.passkeys` result.
	 */
	let {
		fresh,
		passkeys,
		placeholder = 'Name, e.g. MacBook',
		title = 'Passkeys',
	}: Awaited<ReturnType<typeof AuthLoads.passkeys>> & {
		placeholder?: string;
		title?: string;
	} = $props();

	// Feature detection only runs in the browser.
	let supported = $state(false);
	onMount(() => (supported = PasskeyClient.supported()));

	let name = $state('');
	let message = $state<null | string>(null);
	let busy = $state(false);

	const day = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' });

	async function add() {
		message = null;
		busy = true;
		try {
			await PasskeyClient.add(name.trim() || 'Passkey');
			name = '';
			await invalidateAll();
		} catch (err) {
			if (err instanceof PasskeyClientError && err.reauth) {
				message = 'For security, sign out and back in, then add the passkey within 15 minutes.';
			} else if (!PasskeyClient.isCancel(err)) {
				message = err instanceof Error ? err.message : 'Could not add the passkey';
			}
		} finally {
			busy = false;
		}
	}
</script>

<Card gap="sm" padding="md">
	<Title level={2} size="xs">{title}</Title>
	<Text color="secondary" size="sm">
		Sign in with your fingerprint, face or device PIN instead of an email link.
	</Text>

	{#if passkeys.length}
		<ul class="keys">
			{#each passkeys as passkey (passkey.id)}
				<li>
					<KeyRound size={13} />
					<div class="who">
						<Span bold>{passkey.name}</Span>
						<Span color="tertiary" size="sm">
							Added {day.format(passkey.createdAt)}{passkey.lastUsedAt
								? `, last used ${day.format(passkey.lastUsedAt)}`
								: ''}
						</Span>
					</div>
					<form action="/auth/passkey/delete" method="post">
						<input name="id" type="hidden" value={passkey.id} />
						<input name="next" type="hidden" value={page.url.pathname} />
						<button
							class="btn ghost-destructive sm icon"
							aria-label="Remove {passkey.name}"
							title="Remove"
							type="submit"
						>
							<Trash2 size={13} />
						</button>
					</form>
				</li>
			{/each}
		</ul>
	{:else}
		<Text color="tertiary" size="sm">No passkeys yet.</Text>
	{/if}

	{#if supported}
		<div class="add">
			<Input aria-label="Passkey name" maxlength={60} {placeholder} size="sm" bind:value={name} />
			<Button disabled={busy} onclick={add} size="sm" variant="secondary">
				<KeyRound size={13} />
				{busy ? 'Waiting…' : 'Add passkey'}
			</Button>
		</div>
		{#if !fresh}
			<Text color="tertiary" size="sm">Adding one needs a sign-in from the last 15 minutes.</Text>
		{/if}
		{#if message}<AuthAlert>{message}</AuthAlert>{/if}
	{:else}
		<Text color="tertiary" size="sm">This browser does not support passkeys.</Text>
	{/if}
</Card>

<style>
	.keys {
		display: flex;
		flex-direction: column;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.keys li {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 6px 0;
		border-top: 1px solid var(--bds);
	}
	.who {
		display: flex;
		flex: 1;
		flex-direction: column;
		min-width: 0;
	}
	.add {
		display: flex;
		gap: 8px;
		max-width: 420px;
	}
</style>
