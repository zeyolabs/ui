<script lang="ts">
	import { resolve } from '$app/paths';
	import Card from '@zeyolabs/ui/card/Card.svelte';
	import Eyebrow from '@zeyolabs/ui/eyebrow/Eyebrow.svelte';
	import Grid from '@zeyolabs/ui/layout/Grid.svelte';
	import Section from '@zeyolabs/ui/layout/Section.svelte';
	import Stack from '@zeyolabs/ui/layout/Stack.svelte';
	import PageHero from '@zeyolabs/ui/page-hero/PageHero.svelte';
	import Text from '@zeyolabs/ui/text/Text.svelte';
	import Title from '@zeyolabs/ui/text/Title.svelte';

	const groups: { desc: string; href: string; items: string[]; title: string }[] = [
		{
			desc: 'The design tokens every app should read from — colors, type scale, spacing, and the layout primitives built on top.',
			href: resolve('foundations/colors'),
			items: ['Colors', 'Typography', 'Layout'],
			title: 'Foundations',
		},
		{
			desc: '@zeyolabs/ui/form button variants, sizes, and the icon footprint — no hand-styled buttons.',
			href: resolve('components/buttons'),
			items: ['Buttons'],
			title: 'Buttons',
		},
		{
			desc: 'One status pill for every domain, a time-series row, and the uppercase kicker label.',
			href: resolve('components/badges-status'),
			items: ['Badge', 'StatusRow', 'Eyebrow'],
			title: 'Badges & status',
		},
		{
			desc: 'Cards and stat tiles.',
			href: resolve('components/cards-stats'),
			items: ['Card', 'Stat', 'MiniStat', 'PercentageRing'],
			title: 'Cards & data',
		},
		{
			desc: 'Sortable/sticky-column tables, GroupedGrid, empty & loading states, pagination.',
			href: resolve('components/tables'),
			items: ['Table', 'GroupedGrid', 'EmptyState', 'Pagination'],
			title: 'Tables',
		},
		{
			desc: 'Dialog, ConfirmDialog, Popover, and the tab primitives.',
			href: resolve('components/overlays'),
			items: ['Dialog', 'Popover', 'TabBlock'],
			title: 'Overlays & tabs',
		},
		{
			desc: 'Loading skeletons and toast notifications.',
			href: resolve('components/feedback'),
			items: ['Skeleton', 'Toast'],
			title: 'Feedback',
		},
		{
			desc: 'Form fields, the <Form> wrapper, file picker, select, and search.',
			href: resolve('components/forms'),
			items: ['TextField', 'SelectField', 'Combobox', 'SwitchField', 'FileField'],
			title: 'Forms',
		},
	];
</script>

<svelte:head>
	<title>Pure Leaves UI</title>
</svelte:head>

<PageHero
	eyebrow="ui.pureleaves.co.uk"
	sub="A living reference for @zeyolabs/ui, the component library behind the shop. Everything shown here renders the real components against the real design tokens, with the source underneath."
	title="Pure Leaves UI"
/>

<Section spacing="lg">
	<Grid gap="md" minColumnWidth="280px">
		<Card gap="xs" padding="md">
			<Eyebrow>What this is</Eyebrow>
			<Text color="secondary" size="sm">
				The old Pure Leaves site was built from one-off CSS and hand-rolled buttons. This app is the
				antidote: one place that renders the shared primitives live, so "does this exist already?"
				has a fast answer. The only Pure Leaves-specific part is the colour palette.
			</Text>
		</Card>
		<Card gap="xs" padding="md">
			<Eyebrow>What it is not</Eyebrow>
			<Text color="secondary" size="sm">
				No database, no auth, no shop logic — just UI plus a handful of no-op demo forms. If a page
				here needs a database, it's out of scope.
			</Text>
		</Card>
	</Grid>
</Section>

<Stack gap="sm">
	<Eyebrow>Browse</Eyebrow>
	<Grid gap="sm" minColumnWidth="260px">
		{#each groups as group (group.title)}
			<a class="group-card" href={group.href}>
				<Card gap="sm" hover padding="md">
					<Title level={6}>{group.title}</Title>
					<Text color="secondary" size="sm">{group.desc}</Text>
					<ul class="tag-list">
						{#each group.items as item (item)}
							<li>{item}</li>
						{/each}
					</ul>
				</Card>
			</a>
		{/each}
	</Grid>
</Stack>

<style>
	.group-card {
		text-decoration: none;
		color: inherit;
		display: block;
	}
	.tag-list {
		display: flex;
		flex-wrap: wrap;
		gap: 5px;
		padding: 0;
		list-style: none;
	}
	.tag-list li {
		font-size: 10.5px;
		font-weight: 500;
		color: var(--txs);
		background: var(--bg);
		border: 1px solid var(--bd);
		padding: 2px 7px;
		border-radius: var(--radius-xs);
	}
</style>
