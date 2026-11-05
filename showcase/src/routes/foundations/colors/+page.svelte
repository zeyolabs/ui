<script lang="ts">
	import Eyebrow from '@zeyolabs/ui/eyebrow/Eyebrow.svelte';
	import Grid from '@zeyolabs/ui/layout/Grid.svelte';
	import Section from '@zeyolabs/ui/layout/Section.svelte';
	import Stack from '@zeyolabs/ui/layout/Stack.svelte';
	import PageHero from '@zeyolabs/ui/page-hero/PageHero.svelte';

	import TokenSwatch from '#lib/showcase/TokenSwatch.svelte';

	const groups: {
		title: string;
		tokens: { dark: string; desc: string; light: string; name: string }[];
	}[] = [
		{
			title: 'Surface',
			tokens: [
				{ dark: '#0a0a0a', desc: 'Page background, card fill', light: '#ffffff', name: 'bg' },
				{
					dark: '#141414',
					desc: 'Subtle raised surface, hover fill',
					light: '#fafafa',
					name: 'sf',
				},
				{
					dark: '#1c1c1c',
					desc: 'Header/footer surface, one step up from sf',
					light: '#f4f2f0',
					name: 'sfh',
				},
				{
					dark: '#161311',
					desc: 'Warm accent surface (rare)',
					light: '#faf7f0',
					name: 'tertiary',
				},
			],
		},
		{
			title: 'Border',
			tokens: [
				{ dark: '#282828', desc: 'Default border', light: '#e8e6e3', name: 'bd' },
				{ dark: '#1c1c1c', desc: 'Subtle border (table rules)', light: '#f4f2f0', name: 'bds' },
			],
		},
		{
			title: 'Text',
			tokens: [
				{ dark: '#ffffff', desc: 'Primary text', light: '#1e1d26', name: 'tx' },
				{ dark: '#aaaaaa', desc: 'Secondary / muted text', light: '#6b7280', name: 'txs' },
				{ dark: '#666666', desc: 'Tertiary text, placeholders', light: '#9ca3af', name: 'txt' },
			],
		},
		{
			title: 'Status',
			tokens: [
				{ dark: '#22c55e', desc: 'Success', light: '#2f6e3d', name: 'ok' },
				{ dark: '#eab308', desc: 'Warning', light: '#b45309', name: 'w' },
				{ dark: '#ef4444', desc: 'Error / destructive', light: '#9b3838', name: 'err' },
				{ dark: '#3b82f6', desc: 'Informational', light: '#1e1d26', name: 'inf' },
				{ dark: '#ffffff', desc: 'Accent — dots, focus rings', light: '#1e1d26', name: 'acc' },
			],
		},
	];
</script>

<svelte:head>
	<title>Colors — Pure Leaves UI</title>
</svelte:head>

<PageHero
	eyebrow="Foundations"
	sub="Every surface/border/text color in the app should read from one of these — never a hardcoded hex. Toggle the theme switch in the top bar; every swatch below is live."
	title="Colors"
/>

<div class="note">
	Sourced from <code>@zeyolabs/ui/tokens.css</code> — the single <code>:root</code>/<code
		>.dark</code
	>
	block every app (<code>dashboard</code>, <code>admin</code>, <code>marketing</code>,
	<code>ui</code>) imports, rather than a per-app copy. A separate shadcn-style token set (<code
		>--background</code
	>, <code>--primary</code>, …) also exists per-app for a couple of Tailwind/shadcn utility classes
	— it's legacy and not shown here.
</div>

{#each groups as group (group.title)}
	<Section spacing="lg">
		<Stack gap="sm">
			<Eyebrow>{group.title}</Eyebrow>
			<Grid gap="sm" minColumnWidth="180px">
				{#each group.tokens as token (token.name)}
					<TokenSwatch {...token} />
				{/each}
			</Grid>
		</Stack>
	</Section>
{/each}

<style>
	.note {
		max-width: 720px;
		margin-bottom: var(--spacing-xl);
		padding: var(--spacing-sm) var(--spacing-md);
		font-size: 12px;
		line-height: 1.6;
		color: var(--txs);
		background: var(--sf);
		border: 1px solid var(--bd);
		border-radius: var(--radius-sm);
	}
	.note code {
		font-family: var(--font-mono);
		font-size: 11px;
		color: var(--tx);
	}
</style>
