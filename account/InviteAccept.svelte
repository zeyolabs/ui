<script lang="ts">
	import type { AuthLoads } from '@zeyolabs/kit/auth/sveltekit/loads';
	import type { Snippet } from 'svelte';

	import Text from '../text/Text.svelte';
	import AuthAlert from './AuthAlert.svelte';
	import AuthCard from './AuthCard.svelte';

	/**
	 * The invite page (`/invite?token=`): who is invited to which account, and the accept button,
	 * or why it can't be accepted. `data` is the page's `AuthLoads.invite` result.
	 */
	let {
		accent = false,
		brand,
		data,
		fullscreen = false,
	}: {
		accent?: boolean;
		brand?: Snippet;
		data: Awaited<ReturnType<typeof AuthLoads.invite>>;
		fullscreen?: boolean;
	} = $props();

	const mismatch = $derived(
		data.invite && data.signedInAs && data.invite.email !== data.signedInAs.toLowerCase()
	);
</script>

{#if !data.invite}
	<AuthCard {accent} {brand} {fullscreen} title="Invitation not found">
		<Text color="secondary">It has expired or was already used. Ask for a new one.</Text>
	</AuthCard>
{:else}
	<AuthCard {accent} {brand} {fullscreen} title="Join {data.invite.accountName}">
		<Text color="secondary">This invitation is for <strong>{data.invite.email}</strong>.</Text>
		{#if data.error || mismatch}
			<AuthAlert>
				{mismatch
					? `You are signed in as ${data.signedInAs}. Sign out and sign in as ${data.invite.email} to accept.`
					: 'This invitation could not be accepted.'}
			</AuthAlert>
		{:else}
			<form action="/auth/invite/accept" method="post">
				<input name="token" type="hidden" value={data.token} />
				<button class="btn default" type="submit">Accept invitation</button>
			</form>
		{/if}
	</AuthCard>
{/if}

<style>
	form :global(.btn) {
		width: 100%;
	}
</style>
