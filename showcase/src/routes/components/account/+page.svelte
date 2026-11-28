<script lang="ts">
	import AuthCard from '@zeyolabs/ui/account/AuthCard.svelte';
	import InviteAccept from '@zeyolabs/ui/account/InviteAccept.svelte';
	import Passkeys from '@zeyolabs/ui/account/Passkeys.svelte';
	import SignIn from '@zeyolabs/ui/account/SignIn.svelte';
	import PageHero from '@zeyolabs/ui/page-hero/PageHero.svelte';

	import ShowcaseSection from '#lib/showcase/ShowcaseSection.svelte';

	const login = {
		accessEmail: null,
		error: null,
		next: '/',
		sent: false,
		token: null,
		turnstileSiteKey: null,
	};
	const day = 24 * 60 * 60 * 1000;
	const passkeys = [
		{ createdAt: Date.now() - 30 * day, id: 'a', lastUsedAt: Date.now() - day, name: 'MacBook' },
		{ createdAt: Date.now() - 3 * day, id: 'b', lastUsedAt: null, name: 'iPhone' },
	];
	const invite = {
		error: null,
		invite: { accountName: 'Example Shop', email: 'sam@example.com' },
		signedInAs: 'sam@example.com',
		token: 'demo',
	};
</script>

<svelte:head>
	<title>Account — Zeyo UI</title>
</svelte:head>

<PageHero
	eyebrow="Components"
	sub="The sign-in, invite and passkey pages for apps on @zeyolabs/kit auth. Each takes the page's AuthLoads data."
	title="Account"
/>

<ShowcaseSection
	code={`<AuthCard title="Example Shop admin" accent>
	<SignIn {data} intro="Sign in with a passkey or an email link." />
</AuthCard>`}
	description="Passkey where the browser has one, else an emailed link. Errors and the link's 'finish signing in' step come from the load."
	title="Sign in"
>
	<AuthCard accent title="Example Shop admin">
		<SignIn data={login} intro="Sign in with a passkey or an email link." />
	</AuthCard>
</ShowcaseSection>

<ShowcaseSection
	code={`<InviteAccept {data} accent />`}
	description="Who is invited to which account, or why the invitation can't be accepted."
	title="Invitation"
>
	<InviteAccept accent data={invite} />
</ShowcaseSection>

<ShowcaseSection
	code={`<Passkeys fresh={data.fresh} passkeys={data.passkeys} />`}
	description="List, remove and add passkeys. Adding one needs a recent sign-in."
	title="Passkeys"
>
	<div style="width: 100%; max-width: 36rem;">
		<Passkeys fresh={false} {passkeys} />
	</div>
</ShowcaseSection>
