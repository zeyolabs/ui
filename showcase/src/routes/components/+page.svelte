<script lang="ts">
	import { resolve } from '$app/paths';
	import { MoreHorizontal } from '@lucide/svelte';
	import { slugify } from '@zeyolabs/kit/utils/strings/normalize';
	import Badge from '@zeyolabs/ui/badge/Badge.svelte';
	import PromoBadge from '@zeyolabs/ui/badge/PromoBadge.svelte';
	import Card from '@zeyolabs/ui/card/Card.svelte';
	import CardBody from '@zeyolabs/ui/card/CardBody.svelte';
	import CardFooter from '@zeyolabs/ui/card/CardFooter.svelte';
	import CardHeader from '@zeyolabs/ui/card/CardHeader.svelte';
	import ConfirmDialog from '@zeyolabs/ui/dialog/ConfirmDialog.svelte';
	import Dialog from '@zeyolabs/ui/dialog/Dialog.svelte';
	import DialogBody from '@zeyolabs/ui/dialog/DialogBody.svelte';
	import DialogFooter from '@zeyolabs/ui/dialog/DialogFooter.svelte';
	import DialogTrigger from '@zeyolabs/ui/dialog/DialogTrigger.svelte';
	import DistributionBar from '@zeyolabs/ui/distribution-bar/DistributionBar.svelte';
	import EmptyState from '@zeyolabs/ui/empty-state/EmptyState.svelte';
	import Eyebrow from '@zeyolabs/ui/eyebrow/Eyebrow.svelte';
	import FAQList from '@zeyolabs/ui/faq/FAQList.svelte';
	import FilterChipGroup from '@zeyolabs/ui/filter/FilterChipGroup.svelte';
	import FilterPopover from '@zeyolabs/ui/filter/FilterPopover.svelte';
	import { Button, Combobox } from '@zeyolabs/ui/form';
	import {
		CheckboxField,
		EmailField,
		FileField,
		Option,
		SwitchField,
		TextField,
	} from '@zeyolabs/ui/form/fields';
	import { SearchBar } from '@zeyolabs/ui/form/primitives';
	import GroupedGrid from '@zeyolabs/ui/grouped-grid/GroupedGrid.svelte';
	import Grid from '@zeyolabs/ui/layout/Grid.svelte';
	import Section from '@zeyolabs/ui/layout/Section.svelte';
	import ListRow from '@zeyolabs/ui/list-row/ListRow.svelte';
	import MiniStat from '@zeyolabs/ui/mini-stat/MiniStat.svelte';
	import PageHero from '@zeyolabs/ui/page-hero/PageHero.svelte';
	import Pagination from '@zeyolabs/ui/pagination/Pagination.svelte';
	import PercentageRing from '@zeyolabs/ui/percentage-ring/PercentageRing.svelte';
	import Popover from '@zeyolabs/ui/popover/Popover.svelte';
	import { toPercentage } from '@zeyolabs/ui/schema';
	import Skeleton from '@zeyolabs/ui/skeleton/Skeleton.svelte';
	import SkeletonButton from '@zeyolabs/ui/skeleton/SkeletonButton.svelte';
	import SkeletonCircle from '@zeyolabs/ui/skeleton/SkeletonCircle.svelte';
	import TableSkeleton from '@zeyolabs/ui/skeleton/TableSkeleton.svelte';
	import Stat from '@zeyolabs/ui/stat/Stat.svelte';
	import StatusRow from '@zeyolabs/ui/status-row/StatusRow.svelte';
	import Table from '@zeyolabs/ui/table/Table.svelte';
	import TableCell from '@zeyolabs/ui/table/TableCell.svelte';
	import TableRow from '@zeyolabs/ui/table/TableRow.svelte';
	import TabBlock from '@zeyolabs/ui/tabs/TabBlock.svelte';
	import TabButton from '@zeyolabs/ui/tabs/TabButton.svelte';
	import Text from '@zeyolabs/ui/text/Text.svelte';
	import { toast } from 'svelte-sonner';

	import { demoContactForm } from '#lib/remote/demo.remote.js';
	import ComponentTile from '#lib/showcase/ComponentTile.svelte';

	// Interactive tiles need somewhere to hold their local state, same as the deep-dive
	// pages they link into — this page just renders a smaller instance of the same live
	// component, not a static illustration of one.
	let dialogOpen = $state(false);
	let popoverOpen = $state(false);
	let filterOpen = $state(false);
	let filterChips = $state<string[]>([]);
	let tab = $state('overview');
	let comboValue = $state<string | undefined>(undefined);
	let comboMultiValue = $state<string[]>([]);
	const comboItems = [
		{ label: 'Low', value: 'low' },
		{ label: 'Normal', value: 'normal' },
		{ label: 'High', value: 'high' },
	];

	const statusRowSlots = new Map([
		[0, { color: 'ok' as const, label: '0:00 — ok' }],
		[1, { color: 'ok' as const, label: '1:00 — ok' }],
		[2, { color: 'warning' as const, label: '2:00 — warning' }],
		[3, { color: 'ok' as const, label: '3:00 — ok' }],
		[4, { color: 'error' as const, label: '4:00 — error' }],
		[5, { color: 'ok' as const, label: '5:00 — ok' }],
	]);
	const statusRowSlots2 = new Map([
		[0, { color: 'ok' as const, label: '0:00 — ok' }],
		[1, { color: 'error' as const, label: '1:00 — error' }],
		[2, { color: 'ok' as const, label: '2:00 — ok' }],
		[3, { color: 'ok' as const, label: '3:00 — ok' }],
		[4, { color: 'warning' as const, label: '4:00 — warning' }],
		[5, { color: 'ok' as const, label: '5:00 — ok' }],
	]);

	type GalleryCampaign = { name: string; sent: number; status: string };
	const galleryCampaigns: GalleryCampaign[] = [
		{ name: 'Acme launch', sent: 4820, status: 'active' },
		{ name: 'Q3 follow-up', sent: 1240, status: 'active' },
		{ name: 'Warm re-engage', sent: 610, status: 'paused' },
	];

	// One slug() closure per category page — keeps every href below to `slug(sectionTitle)`,
	// no repeated resolve()+slugify() boilerplate per tile.
	function categoryOf(href: string): (title: string) => string {
		return (title: string) => `${href}#${slugify(title)}`;
	}
	const buttons = categoryOf(resolve('components/buttons'));
	const badgesStatus = categoryOf(resolve('components/badges-status'));
	const cardsStats = categoryOf(resolve('components/cards-stats'));
	const tables = categoryOf(resolve('components/tables'));
	const overlays = categoryOf(resolve('components/overlays'));
	const feedback = categoryOf(resolve('components/feedback'));
	const forms = categoryOf(resolve('components/forms'));
	const combobox = categoryOf(resolve('components/combobox'));
</script>

{#snippet galleryCampaignName(row: GalleryCampaign)}
	{row.name}
{/snippet}
{#snippet galleryCampaignSent(row: GalleryCampaign)}
	{row.sent.toLocaleString()}
{/snippet}

<svelte:head>
	<title>Components — Pure Leaves UI</title>
</svelte:head>

<PageHero
	eyebrow="Components"
	sub="Every component demoed in this showcase, at a glance — live, not a screenshot. Click a tile to jump to its full write-up: variants, sizes, states, code."
	title="Components"
/>

<div class="tile-sheet">
	<Grid columns={3} gap="none">
		<ComponentTile name="Button" href={buttons('Variants')}>
			<Button>Default</Button>
			<Button variant="secondary">Secondary</Button>
			<Button variant="ghost">Ghost</Button>
			<Button variant="destructive">Destructive</Button>
		</ComponentTile>
		<ComponentTile name="Badge" href={badgesStatus('Badge')}>
			<Badge color="success">Active</Badge>
			<Badge color="warning">Paused</Badge>
			<Badge color="info">Completed</Badge>
			<Badge color="error">Failed</Badge>
		</ComponentTile>
		<ComponentTile name="Eyebrow" href={badgesStatus('Eyebrow')}>
			<div class="stack-xs-center">
				<Eyebrow>Support ticket</Eyebrow>
				<Eyebrow>Team</Eyebrow>
			</div>
		</ComponentTile>
		<ComponentTile name="PromoBadge" href={badgesStatus('PromoBadge')}>
			<div class="stack-xs w-full">
				<PromoBadge label="New" variant="light">Find leads with AI</PromoBadge>
				<PromoBadge label="Pricing" labelColor="black" variant="light">Pay per use</PromoBadge>
			</div>
		</ComponentTile>
		<ComponentTile name="StatusRow" href={badgesStatus('StatusRow')}>
			<div class="stack-xs w-full">
				<StatusRow maxSlots={6} slotInterval={1} slots={statusRowSlots} />
				<StatusRow maxSlots={6} slotInterval={1} slots={statusRowSlots2} />
			</div>
		</ComponentTile>
		<ComponentTile name="Card" href={cardsStats('Card')}>
			<Card padding="md"><Text size="sm">Plain</Text></Card>
			<Card hover padding="md"><Text size="sm">Hover</Text></Card>
		</ComponentTile>
		<ComponentTile name="Card parts" href={cardsStats('Card parts')}>
			<Card class="h-24 w-40" clip gap="none">
				<CardHeader padding="xs">
					<Text size="sm">Header</Text>
				</CardHeader>
				<CardBody padding="xs">
					<Text color="secondary" size="sm">Body</Text>
				</CardBody>
				<CardFooter padding="xs">
					<Text color="secondary" size="sm">Footer</Text>
				</CardFooter>
			</Card>
		</ComponentTile>
		<ComponentTile name="List row" href={cardsStats('List row')}>
			<Card class="w-40" clip gap="none">
				<ListRow muted><Text size="sm">Muted</Text></ListRow>
				<ListRow selected><Text size="sm">Selected</Text></ListRow>
			</Card>
		</ComponentTile>
		<ComponentTile name="Card loading" href={cardsStats('Card loading')}>
			<Card class="w-40" loading padding="md"><Text size="sm">Reloading</Text></Card>
		</ComponentTile>
		<ComponentTile name="Stat" href={cardsStats('Stat')}>
			<Stat>
				{#snippet label()}Sent{/snippet}
				{#snippet value()}48,204{/snippet}
			</Stat>
			<Stat>
				{#snippet label()}Reply rate{/snippet}
				{#snippet value()}6.4%{/snippet}
			</Stat>
		</ComponentTile>
		<ComponentTile name="MiniStat" href={cardsStats('MiniStat')}>
			<div class="stack-xs-center">
				<MiniStat dot="var(--ok)" label="delivered" value={4820} />
				<MiniStat dot="var(--err)" label="bounced" value={212} />
				<MiniStat label="pending" value={38} />
			</div>
		</ComponentTile>
		<ComponentTile name="DistributionBar" href={cardsStats('DistributionBar')}>
			<DistributionBar
				segments={[
					{ color: 'var(--ok)', label: 'valid', value: 142 },
					{ color: 'var(--w)', label: 'risky', value: 38 },
					{ color: 'var(--inf)', label: 'catch-all', value: 21 },
					{ color: 'var(--err)', label: 'invalid', value: 14 },
				]}
			/>
		</ComponentTile>
		<ComponentTile name="PercentageRing" href={cardsStats('PercentageRing')}>
			<PercentageRing color="var(--acc)" percentage={toPercentage(40)} size="tiny" />
			<PercentageRing color="var(--acc)" percentage={toPercentage(72)} size="small" />
			<PercentageRing color="var(--acc)" percentage={toPercentage(91)} size="medium" />
		</ComponentTile>
		<ComponentTile name="FAQList" href={cardsStats('FAQList')}>
			<div class="w-full">
				<FAQList
					items={[
						{ answer: 'Yes, with free credits.', question: 'Is there a free plan?' },
						{ answer: 'One at a time.', question: 'How many open at once?' },
					]}
				/>
			</div>
		</ComponentTile>
		<ComponentTile name="Table" href={tables('Table')}>
			<div class="w-full">
				<Table minWidth="0">
					<TableRow head>
						<TableCell compact>Campaign</TableCell>
						<TableCell align="right" compact>Sent</TableCell>
					</TableRow>
					<TableRow>
						<TableCell compact>Acme launch</TableCell>
						<TableCell align="right" compact>4,820</TableCell>
					</TableRow>
					<TableRow>
						<TableCell compact>Q3 follow-up</TableCell>
						<TableCell align="right" compact>1,240</TableCell>
					</TableRow>
				</Table>
			</div>
		</ComponentTile>
		<ComponentTile name="TableSkeleton" href={tables('TableSkeleton')}>
			<div class="w-full">
				<TableSkeleton cols={2} rows={2} />
			</div>
		</ComponentTile>
		<ComponentTile name="GroupedGrid" href={tables('GroupedGrid — grouping')}>
			<div class="w-full">
				<GroupedGrid
					columns={[
						{ cell: galleryCampaignName, key: 'name', label: 'Campaign' },
						{ align: 'right', cell: galleryCampaignSent, key: 'sent', label: 'Sent' },
					]}
					compact
					groupBy={(c: GalleryCampaign) => c.status}
					rowKey={(c: GalleryCampaign) => c.name}
					rows={galleryCampaigns}
				/>
			</div>
		</ComponentTile>
		<ComponentTile name="EmptyState" href={tables('Empty state')}>
			<div class="w-full">
				<EmptyState description="Try a different search." title="No results" />
			</div>
		</ComponentTile>
		<ComponentTile name="Pagination" href={tables('Pagination')}>
			<div class="stack-xs-center">
				<Pagination onPage={() => {}} page={0} totalPages={3} />
				<Pagination onPage={() => {}} page={4} totalPages={5} />
			</div>
		</ComponentTile>
		<ComponentTile name="Dialog" href={overlays('Dialog')}>
			<Dialog bind:open={dialogOpen}>
				<DialogTrigger><Button variant="secondary">Open</Button></DialogTrigger>
				<DialogBody title="Invite teammate">
					<DialogFooter>
						<Button onclick={() => (dialogOpen = false)}>Close</Button>
					</DialogFooter>
				</DialogBody>
			</Dialog>
		</ComponentTile>
		<ComponentTile name="ConfirmDialog" href={overlays('ConfirmDialog')}>
			<ConfirmDialog description="This can't be undone." onConfirm={() => {}} title="Delete?">
				{#snippet trigger()}
					<Button variant="ghost-destructive">Delete</Button>
				{/snippet}
			</ConfirmDialog>
		</ComponentTile>
		<ComponentTile name="Popover" href={overlays('Popover')}>
			<div class="popover-anchor">
				<Button onclick={() => (popoverOpen = !popoverOpen)} variant="secondary">
					<MoreHorizontal size={13} /> Options
				</Button>
				<Popover width={160} bind:open={popoverOpen}>
					<button class="popover-item" onclick={() => (popoverOpen = false)} type="button"
						>Rename</button
					>
					<button class="popover-item" onclick={() => (popoverOpen = false)} type="button"
						>Archive</button
					>
				</Popover>
			</div>
		</ComponentTile>
		<ComponentTile name="FilterPopover" href={overlays('FilterPopover')}>
			<div class="popover-anchor">
				<Button onclick={() => (filterOpen = !filterOpen)} variant="secondary">Filter</Button>
				<FilterPopover
					onApply={() => {}}
					onClear={() => (filterChips = [])}
					title="Company"
					bind:open={filterOpen}
				>
					<FilterChipGroup
						chips={[
							{ label: 'Stripe', value: 'Stripe' },
							{ label: 'Notion', value: 'Notion' },
						]}
						label="Popular"
						onToggle={(v) =>
							(filterChips = filterChips.includes(v)
								? filterChips.filter((c) => c !== v)
								: [...filterChips, v])}
						selected={filterChips}
					/>
				</FilterPopover>
			</div>
		</ComponentTile>
		<ComponentTile name="TabBlock" href={overlays('TabBlock')}>
			<TabBlock bind:value={tab}>
				<TabButton value="overview">Overview</TabButton>
				<TabButton value="activity">Activity</TabButton>
				<TabButton value="settings">Settings</TabButton>
			</TabBlock>
		</ComponentTile>
		<ComponentTile name="Skeleton" href={feedback('Primitives')}>
			<div class="stack-xs w-full">
				<Skeleton h="0.9rem" w="100%" />
				<div class="skeleton-row">
					<SkeletonCircle size="sm" />
					<SkeletonButton size="sm" />
				</div>
			</div>
		</ComponentTile>
		<ComponentTile name="Toast" href={feedback('Toast')}>
			<Button onclick={() => toast.success('Campaign sent.')} variant="secondary">Success</Button>
			<Button onclick={() => toast.error('Could not save.')} variant="secondary">Error</Button>
		</ComponentTile>
		<ComponentTile name="TextField" href={forms('A complete form')}>
			<div class="w-full max-w-48 stack-xs">
				<TextField name="name" form={demoContactForm} placeholder="Jane Doe">Name</TextField>
				<EmailField name="email" form={demoContactForm} placeholder="jane@company.com">
					Email
				</EmailField>
			</div>
		</ComponentTile>
		<ComponentTile name="SwitchField" href={forms('A complete form')}>
			<SwitchField name="urgent" form={demoContactForm} optional variant="onoff">Urgent</SwitchField
			>
		</ComponentTile>
		<ComponentTile name="CheckboxField" href={forms('A complete form')}>
			<CheckboxField name="subscribe" form={demoContactForm} optional>Subscribe</CheckboxField>
		</ComponentTile>
		<ComponentTile name="SearchBar" href={forms('Search')}>
			<div class="w-full max-w-48">
				<SearchBar defaultValue="" onChange={() => {}} placeholder="Search…" />
			</div>
		</ComponentTile>
		<ComponentTile name="FileField" href={forms('FileField')}>
			<div class="w-full max-w-48 stack-xs">
				<FileField onSelect={() => {}} variant="button">Attachment</FileField>
				<FileField onSelect={() => {}} variant="dropzone">Attachment</FileField>
			</div>
		</ComponentTile>
		<ComponentTile name="Combobox" href={combobox('Single-select, searchable')}>
			<div class="w-full max-w-48 stack-xs">
				<Combobox name="galleryCombo" placeholder="Priority" bind:value={comboValue}>
					{#each comboItems as opt (opt.value)}
						<Option label={opt.label} value={opt.value}>{opt.label}</Option>
					{/each}
				</Combobox>
				<Combobox name="galleryComboMulti" multiple placeholder="Tags" bind:value={comboMultiValue}>
					{#each comboItems as opt (opt.value)}
						<Option label={opt.label} value={opt.value}>{opt.label}</Option>
					{/each}
				</Combobox>
			</div>
		</ComponentTile>
	</Grid>
</div>

<Section spacing="lg">
	<Card class="max-w-145" gap="xs" padding="md">
		<Eyebrow>More</Eyebrow>
		<Text color="secondary" size="sm">
			Not every primitive is demoed live here — some need real app context this static showcase
			doesn't have (a route tree, a live session, a WebSocket). <a href={resolve('reference')}
				>See the full reference</a
			> for the rest.
		</Text>
	</Card>
</Section>

<style>
	/* Closes the blueprint sheet's outer edge — each tile only draws its own right + bottom
	   border (see ComponentTile.svelte), so the sheet itself owns the top-left edge. */
	.tile-sheet {
		border-top: 1px solid var(--bd);
		border-left: 1px solid var(--bd);
	}
	/* The root layout's <main> caps every page at 1040px (a reading width, right for prose —
	   wrong for a tile grid meant to use all available space). Opt this one page out instead
	   of touching that shared default; :has() scopes the override to pages that actually have
	   a .tile-sheet, so every other showcase page keeps its normal reading width. !important
	   because main's own rule and this one tie on specificity (both element + one class-level
	   selector) — without it, source order alone doesn't reliably win in dev's HMR-injected
	   stylesheet order. */
	:global(main:has(.tile-sheet)) {
		max-width: none !important;
	}
	/* Stretch (the flex default) — for content that needs to fill the available width to render
	   at all, e.g. StatusRow's flex-1 segments collapse to zero width without it. */
	.stack-xs {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	/* Centered — for small inline content (a label, a stat) that should sit centered as a
	   group rather than stretch to the tile's full width. */
	.stack-xs-center {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}
	.skeleton-row {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
	}
	.popover-anchor {
		position: relative;
		display: inline-block;
	}
	:global(.popover-item) {
		display: flex;
		align-items: center;
		width: 100%;
		padding: var(--spacing-xs) var(--spacing-sm);
		font-size: 12px;
		font-weight: 500;
		color: var(--tx);
		background: transparent;
		border: none;
		text-align: left;
		cursor: pointer;
	}
	:global(.popover-item:hover) {
		background: var(--sf);
	}
</style>
