<script lang="ts">
	import { resolve } from '$app/paths';
	import BackButton from '@zeyolabs/ui/back-button/BackButton.svelte';
	import CopyArea from '@zeyolabs/ui/copy/CopyArea.svelte';
	import CopyButton from '@zeyolabs/ui/copy/CopyButton.svelte';
	import Section from '@zeyolabs/ui/layout/Section.svelte';
	import Stack from '@zeyolabs/ui/layout/Stack.svelte';
	import PageHero from '@zeyolabs/ui/page-hero/PageHero.svelte';
	import Table from '@zeyolabs/ui/table/Table.svelte';
	import TableCell from '@zeyolabs/ui/table/TableCell.svelte';
	import TableRow from '@zeyolabs/ui/table/TableRow.svelte';
	import Text from '@zeyolabs/ui/text/Text.svelte';
	import Title from '@zeyolabs/ui/text/Title.svelte';

	import ShowcaseSection from '#lib/showcase/ShowcaseSection.svelte';

	type RefEntry = { component: string; import: string; note: string };
	type RefGroup = { entries: RefEntry[]; reason: string; title: string };

	const groups: RefGroup[] = [
		{
			entries: [
				{
					component: 'QueryState',
					import: '@zeyolabs/ui/query-state/QueryState.svelte',
					note: 'Renders the pending/error/empty states of a real remote query() instance.',
				},
			],
			reason: 'Needs a live app context this static showcase doesn’t have',
			title: 'App-specific',
		},
		{
			entries: [
				{
					component: 'DateField / TimeField / DateRangeField',
					import: '@zeyolabs/ui/form/fields',
					note: 'Built on @internationalized/date — see docs/datetime.md for the CalendarDate/ZonedDateTime convention.',
				},
				{
					component: 'PinField / HexColorField / PasswordField',
					import: '@zeyolabs/ui/form/fields',
					note: 'Same Field pattern as TextField/EmailField shown in Components → Forms.',
				},
				{
					component: 'PhoneField',
					import: '@zeyolabs/ui/form/PhoneField.svelte',
					note: 'Wraps libphonenumber-js for validated phone input.',
				},
			],
			reason: 'Same Field pattern already shown — not repeated for every variant',
			title: 'More form fields',
		},
		{
			entries: [
				{
					component: 'Choice / ChoiceMulti / WeekdayChoice(Multi)',
					import: '@zeyolabs/ui/form/primitives',
					note: 'Segmented single/multi picker, generic over item type.',
				},
				{
					component: 'ContextMenu + Content/Item/Separator/Trigger',
					import: '@zeyolabs/ui/form/primitives',
					note: 'Right-click menu primitives.',
				},
				{
					component: 'Draggable / Dropzone / DragManager',
					import: '@zeyolabs/ui/form/primitives',
					note: 'Drag-and-drop primitives.',
				},
				{
					component: 'DateInput',
					import: '@zeyolabs/ui/form/primitives',
					note: 'Raw date input, lower-level than DateField.',
				},
			],
			reason: 'Exist and are used elsewhere, just not yet demoed here',
			title: 'More form primitives',
		},
		{
			entries: [
				{
					component: 'ErrorPage',
					import: '@zeyolabs/ui/error/ErrorPage.svelte',
					note: 'Full-page error state, meant for a route’s +error.svelte.',
				},
			],
			reason: 'Simple, but need real data/route context to look right',
			title: 'A few more',
		},
	];
</script>

<svelte:head>
	<title>Reference — Pure Leaves UI</title>
</svelte:head>

<PageHero
	eyebrow="More"
	sub="Everything in @zeyolabs/ui, for completeness — including the handful this showcase doesn't render live, and why."
	title="Full reference"
/>

<ShowcaseSection
	code={`<BackButton href={resolve('components/buttons')} label="Buttons" />
<CopyButton clipboardText={async () => 'npm install @zeyolabs/ui'} />
<CopyArea clipboardText={async () => 'pureleaves'}>
  {#snippet children({ copied, onclick })}
    <button {onclick}>{copied ? 'Copied!' : 'pureleaves'}</button>
  {/snippet}
</CopyArea>`}
	description="Three small pieces that didn't earn their own page. CopyButton is already doing real work — it's what renders the copy button on every code block on this site."
	title="A few more, live"
>
	<BackButton href={resolve('components/buttons')} label="Buttons" />
	<CopyButton clipboardText={() => Promise.resolve('npm install @zeyolabs/ui')} />
	<CopyArea clipboardText={() => Promise.resolve('pureleaves')}>
		{#snippet children({ copied, onclick, onkeydown })}
			<button class="copy-area-demo" {onclick} {onkeydown} type="button">
				{copied ? 'Copied!' : 'pureleaves'}
			</button>
		{/snippet}
	</CopyArea>
</ShowcaseSection>

{#each groups as group (group.title)}
	<Section spacing="lg">
		<Stack gap="xs">
			<Title level={6}>{group.title}</Title>
			<Text color="secondary" size="sm">{group.reason}</Text>
			<div class="table-wrap">
				<Table>
					<TableRow head>
						<TableCell>Component</TableCell>
						<TableCell>Import</TableCell>
						<TableCell>Note</TableCell>
					</TableRow>
					{#each group.entries as entry (entry.component)}
						<TableRow>
							<TableCell>{entry.component}</TableCell>
							<TableCell mono muted>{entry.import}</TableCell>
							<TableCell muted>{entry.note}</TableCell>
						</TableRow>
					{/each}
				</Table>
			</div>
		</Stack>
	</Section>
{/each}

<div class="note">
	Found while building this: <code>packages/ui/package.json</code> exports
	<code>./typing-dots/*</code>, but no <code>typing-dots</code> directory exists in
	<code>packages/ui</code> and nothing in the repo imports it — a dead export worth removing.
</div>

<div class="note">
	Also found: <code>@zeyolabs/ui/table/Table.svelte</code> renders <code>&lt;TableRow&gt;</code>
	(a <code>&lt;tr&gt;</code>) as a direct child of <code>&lt;table&gt;</code>, with no
	<code>&lt;tbody&gt;</code> — every consumer (this app's Table/GroupedGrid demos included) logs a
	Svelte <code>node_invalid_placement_ssr</code> hydration warning in dev, even though the browser
	auto-corrects it and the rendered table looks right. Cosmetic today, but wrapping
	<code>children</code> in a <code>&lt;tbody&gt;</code> inside <code>Table.svelte</code> would clear it
	repo-wide in one place.
</div>

<style>
	.copy-area-demo {
		padding: var(--spacing-xs) var(--spacing-sm);
		font-size: 12px;
		font-family: var(--font-mono);
		color: var(--tx);
		background: var(--bg);
		border: 1px solid var(--bd);
		border-radius: var(--radius-sm);
		cursor: pointer;
	}
	.table-wrap {
		border: 1px solid var(--bd);
		overflow: hidden;
	}
	.note {
		max-width: 720px;
		margin-top: var(--spacing-xs);
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
