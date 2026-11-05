<script lang="ts">
	import { Inbox, ListPlus } from '@lucide/svelte';
	import EmptyState from '@zeyolabs/ui/empty-state/EmptyState.svelte';
	import { Button } from '@zeyolabs/ui/form';
	import GroupedGrid from '@zeyolabs/ui/grouped-grid/GroupedGrid.svelte';
	import PageHero from '@zeyolabs/ui/page-hero/PageHero.svelte';
	import Pagination from '@zeyolabs/ui/pagination/Pagination.svelte';
	import SkeletonRow from '@zeyolabs/ui/skeleton/SkeletonRow.svelte';
	import TableSkeleton from '@zeyolabs/ui/skeleton/TableSkeleton.svelte';
	import SelectAllTableCell from '@zeyolabs/ui/table/SelectAllTableCell.svelte';
	import SelectionBar from '@zeyolabs/ui/table/SelectionBar.svelte';
	import SelectRowTableCell from '@zeyolabs/ui/table/SelectRowTableCell.svelte';
	import Table from '@zeyolabs/ui/table/Table.svelte';
	import TableCell from '@zeyolabs/ui/table/TableCell.svelte';
	import TableRow from '@zeyolabs/ui/table/TableRow.svelte';

	import ShowcaseSection from '#lib/showcase/ShowcaseSection.svelte';

	type Campaign = { name: string; replies: number; sent: number; status: string };
	const campaigns: Campaign[] = [
		{ name: 'Acme launch', replies: 62, sent: 4820, status: 'active' },
		{ name: 'Q3 follow-up', replies: 18, sent: 1240, status: 'active' },
		{ name: 'Warm re-engage', replies: 9, sent: 610, status: 'paused' },
		{ name: 'Holiday promo', replies: 210, sent: 9040, status: 'completed' },
	];

	// Row-state demo: which row is "selected".
	let selectedRow = $state<null | string>('Q3 follow-up');

	// Selection demo: SelectAllCell/SelectRowCell (checkbox column content) + SelectionBar
	// (the bulk-action bar) — same trio used by My Lists, campaigns, inboxes, and the
	// lead/company finder tables instead of five hand-rolled checkbox implementations.
	let selectedIds = $state<Set<string>>(new Set());
	const allSelected = $derived(selectedIds.size > 0 && selectedIds.size === campaigns.length);
	const someSelected = $derived(selectedIds.size > 0 && !allSelected);
	function toggleSelectAll() {
		selectedIds = allSelected ? new Set() : new Set(campaigns.map((c) => c.name));
	}
	function toggleSelect(id: string) {
		const s = new Set(selectedIds);
		if (s.has(id)) s.delete(id);
		else s.add(id);
		selectedIds = s;
	}

	// Sortable-header demo — TableCell owns the click target + arrow icon, the caller owns
	// the actual sort state and comparator.
	let sortKey = $state<keyof Campaign>('sent');
	let sortDir = $state<'asc' | 'desc'>('desc');
	function toggleSort(key: keyof Campaign) {
		if (sortKey === key) {
			sortDir = sortDir === 'asc' ? 'desc' : 'asc';
		} else {
			sortKey = key;
			sortDir = 'desc';
		}
	}
	const sortedCampaigns = $derived(
		[...campaigns].sort((a, b) => {
			const dir = sortDir === 'asc' ? 1 : -1;
			const av = a[sortKey];
			const bv = b[sortKey];
			return typeof av === 'string' && typeof bv === 'string'
				? av.localeCompare(bv) * dir
				: ((av as number) - (bv as number)) * dir;
		})
	);

	// Sticky-column demo — a wider contact list, first column pinned. Wrapped in a narrow
	// container below so the horizontal scroll (and the pin) is actually visible.
	type Contact = {
		company: string;
		email: string;
		location: string;
		name: string;
		title: string;
	};
	const contacts: Contact[] = [
		{
			company: 'Acme Inc',
			email: 'jane@acme.com',
			location: 'Austin, TX',
			name: 'Jane Cooper',
			title: 'VP Sales',
		},
		{
			company: 'Globex',
			email: 'mo@globex.com',
			location: 'Remote',
			name: 'Mo Ahmed',
			title: 'Head of Growth',
		},
		{
			company: 'Initech',
			email: 'priya@initech.com',
			location: 'Toronto, ON',
			name: 'Priya Shah',
			title: 'RevOps Lead',
		},
	];

	// Pagination demo.
	let page = $state(0);
</script>

{#snippet contactName(row: Contact)}
	{row.name}
{/snippet}
{#snippet contactEmail(row: Contact)}
	<span class="mono">{row.email}</span>
{/snippet}
{#snippet contactCompany(row: Contact)}
	{row.company}
{/snippet}
{#snippet contactTitle(row: Contact)}
	{row.title}
{/snippet}
{#snippet contactLocation(row: Contact)}
	{row.location}
{/snippet}

{#snippet campaignName(row: Campaign)}
	{row.name}
{/snippet}
{#snippet campaignSent(row: Campaign)}
	{row.sent.toLocaleString()}
{/snippet}

<svelte:head>
	<title>Tables — Zeyo UI</title>
</svelte:head>

<PageHero
	eyebrow="Components"
	sub="Table/TableRow/TableCell are the primitive; GroupedGrid adds automatic column/grouping mechanics on top. This page is the full surface — including sortable headers, sticky columns, empty/loading states, and pagination, all recent additions."
	title="Tables"
/>

<ShowcaseSection
	code={`<Table>
  <TableRow head>
    <TableCell>Campaign</TableCell>
    <TableCell align="right">Sent</TableCell>
  </TableRow>
  {#each campaigns as c}
    <TableRow>
      <TableCell>{c.name}</TableCell>
      <TableCell align="right">{c.sent.toLocaleString()}</TableCell>
    </TableRow>
  {/each}
</Table>`}
	description="A real <table> (not CSS grid), so column widths sync natively across rows. Table just owns the scroll wrapper + <table> tag — TableRow/TableCell own everything else."
	title="Table"
>
	<div class="table-demo">
		<Table>
			<TableRow head>
				<TableCell>Campaign</TableCell>
				<TableCell align="right">Sent</TableCell>
			</TableRow>
			{#each campaigns as c (c.name)}
				<TableRow>
					<TableCell>{c.name}</TableCell>
					<TableCell align="right">{c.sent.toLocaleString()}</TableCell>
				</TableRow>
			{/each}
		</Table>
	</div>
</ShowcaseSection>

<ShowcaseSection
	code={`<TableCell align="right">Right-aligned, tabular-nums</TableCell>
<TableCell compact>Tighter padding — dense grids</TableCell>
<TableCell mono>font-mono, for ids/emails</TableCell>
<TableCell muted>Secondary text, smaller</TableCell>`}
	description="Four independent flags — combine freely (align + mono is common for a numeric id column)."
	title="Cell variants"
>
	<div class="table-demo">
		<Table>
			<TableRow head>
				<TableCell>Default</TableCell>
				<TableCell align="right">Align right</TableCell>
				<TableCell>Compact</TableCell>
				<TableCell>Mono</TableCell>
				<TableCell>Muted</TableCell>
			</TableRow>
			<TableRow>
				<TableCell>Row label</TableCell>
				<TableCell align="right">4,820</TableCell>
				<TableCell compact>Tight</TableCell>
				<TableCell mono>evt_8f21ac</TableCell>
				<TableCell muted>Secondary text</TableCell>
			</TableRow>
		</Table>
	</div>
</ShowcaseSection>

<ShowcaseSection
	code={`<!-- compact on every cell, not just one column -->
<Table>
  <TableRow head>
    <TableCell compact>Campaign</TableCell>
    <TableCell compact align="right">Sent</TableCell>
  </TableRow>
  {#each campaigns as c}
    <TableRow>
      <TableCell compact>{c.name}</TableCell>
      <TableCell compact align="right">{c.sent.toLocaleString()}</TableCell>
    </TableRow>
  {/each}
</Table>`}
	description="compact on every cell (not just one column) is the built-in dense-table option — 6-10px padding, tighter than most hand-rolled 'compact' tables in the app already get by copy-pasting their own padding values. Reach for this before inventing new padding."
	title="Compact table"
>
	<div class="table-demo">
		<Table>
			<TableRow head>
				<TableCell compact>Campaign</TableCell>
				<TableCell align="right" compact>Sent</TableCell>
			</TableRow>
			{#each campaigns as c (c.name)}
				<TableRow>
					<TableCell compact>{c.name}</TableCell>
					<TableCell align="right" compact>{c.sent.toLocaleString()}</TableCell>
				</TableRow>
			{/each}
		</Table>
	</div>
</ShowcaseSection>

<ShowcaseSection
	code={`<TableRow hoverable>...</TableRow>
<TableRow onclick={() => openRow(id)}>...</TableRow>
<TableRow selected={row.id === selectedId}>...</TableRow>`}
	description="hoverable alone just highlights on :hover. Passing onclick makes the whole row a click target (cursor + hover both follow automatically) — hoverable is then redundant. selected applies a persistent tint, independent of hover/click."
	title="Row states"
>
	<div class="table-demo">
		<Table>
			<TableRow head>
				<TableCell>Campaign</TableCell>
				<TableCell align="right">Sent</TableCell>
			</TableRow>
			{#each campaigns as c (c.name)}
				<TableRow
					onclick={() => (selectedRow = selectedRow === c.name ? null : c.name)}
					selected={selectedRow === c.name}
				>
					<TableCell>{c.name}</TableCell>
					<TableCell align="right">{c.sent.toLocaleString()}</TableCell>
				</TableRow>
			{/each}
		</Table>
	</div>
</ShowcaseSection>

<ShowcaseSection
	code={`let selectedIds = $state(new Set());
const allSelected = $derived(selectedIds.size > 0 && selectedIds.size === campaigns.length);
const someSelected = $derived(selectedIds.size > 0 && !allSelected);

function toggleSelectAll() {
  selectedIds = allSelected ? new Set() : new Set(campaigns.map((c) => c.name));
}
function toggleSelect(id) {
  const s = new Set(selectedIds);
  if (s.has(id)) s.delete(id);
  else s.add(id);
  selectedIds = s;
}

{#if selectedIds.size > 0}
  <SelectionBar count={selectedIds.size} onClear={() => (selectedIds = new Set())}>
    <Button variant="ghost-destructive">Delete {selectedIds.size}</Button>
  </SelectionBar>
{/if}

<Table>
  <TableRow head>
    <SelectAllTableCell {allSelected} {someSelected} onToggleAll={toggleSelectAll} />
    <TableCell>Campaign</TableCell>
  </TableRow>
  {#each campaigns as c}
    <TableRow selected={selectedIds.has(c.name)}>
      <SelectRowTableCell label={c.name} selected={selectedIds.has(c.name)} onToggle={() => toggleSelect(c.name)} />
      <TableCell>{c.name}</TableCell>
    </TableRow>
  {/each}
</Table>`}
	description="SelectAllTableCell/SelectRowTableCell are the checkbox column, pre-wrapped in a fixed-width TableCell — drop them directly inside TableRow, no manual width/padding. Use the bare SelectAllCell/SelectRowCell instead only inside a GroupedGrid column (its headerCell/cell already supplies the TableCell wrapper). SelectionBar is the matching bulk-action bar: renders nothing while count is 0, otherwise 'N selected' + your action buttons + a built-in Clear. This trio replaces what used to be five separate hand-rolled checkbox implementations across My Lists, campaigns, inboxes, and the lead/company finder tables."
	title="Selection"
>
	<div class="table-demo">
		{#if selectedIds.size > 0}
			<div class="selection-bar-demo">
				<SelectionBar count={selectedIds.size} onClear={() => (selectedIds = new Set())}>
					<Button variant="ghost-destructive">Delete {selectedIds.size}</Button>
				</SelectionBar>
			</div>
		{/if}
		<Table>
			<TableRow head>
				<SelectAllTableCell {allSelected} onToggleAll={toggleSelectAll} {someSelected} />
				<TableCell>Campaign</TableCell>
			</TableRow>
			{#each campaigns as c (c.name)}
				<TableRow selected={selectedIds.has(c.name)}>
					<SelectRowTableCell
						label={c.name}
						onToggle={() => toggleSelect(c.name)}
						selected={selectedIds.has(c.name)}
					/>
					<TableCell>{c.name}</TableCell>
				</TableRow>
			{/each}
		</Table>
	</div>
</ShowcaseSection>

<ShowcaseSection
	code={`let sortKey = $state('sent');
let sortDir = $state('desc');
function toggleSort(key) {
  if (sortKey === key) sortDir = sortDir === 'asc' ? 'desc' : 'asc';
  else { sortKey = key; sortDir = 'desc'; }
}
const sorted = $derived([...campaigns].sort(/* by sortKey/sortDir */));

<TableCell onSort={() => toggleSort('sent')} sortDirection={sortKey === 'sent' ? sortDir : null}>
  Sent
</TableCell>`}
	description="onSort makes a head cell clickable and renders the arrow; sortDirection (null when this isn't the active column) decides which arrow. TableCell has no sort logic of its own — the caller owns the comparator and state, same headless split as everywhere else in this design system."
	title="Sortable headers"
>
	<div class="table-demo">
		<Table>
			<TableRow head>
				<TableCell
					onSort={() => toggleSort('name')}
					sortDirection={sortKey === 'name' ? sortDir : null}
				>
					Campaign
				</TableCell>
				<TableCell
					align="right"
					onSort={() => toggleSort('sent')}
					sortDirection={sortKey === 'sent' ? sortDir : null}
				>
					Sent
				</TableCell>
				<TableCell
					align="right"
					onSort={() => toggleSort('replies')}
					sortDirection={sortKey === 'replies' ? sortDir : null}
				>
					Replies
				</TableCell>
			</TableRow>
			{#each sortedCampaigns as c (c.name)}
				<TableRow>
					<TableCell>{c.name}</TableCell>
					<TableCell align="right">{c.sent.toLocaleString()}</TableCell>
					<TableCell align="right">{c.replies}</TableCell>
				</TableRow>
			{/each}
		</Table>
	</div>
</ShowcaseSection>

<ShowcaseSection
	code={`<GroupedGrid
  columns={[
    { cell: nameCell, key: 'name', label: 'Name', sticky: true, width: '140px' },
    { cell: emailCell, key: 'email', label: 'Email', width: '180px' },
    { cell: companyCell, key: 'company', label: 'Company', width: '140px' },
    { cell: titleCell, key: 'title', label: 'Title', width: '140px' },
    { cell: locationCell, key: 'location', label: 'Location', width: '140px' },
  ]}
  {rows}
  rowKey={(r) => r.email}
/>`}
	description="sticky: true on a GridColumn pins it via position: sticky — GroupedGrid computes each sticky column's left offset for you from the (pixel) widths of the sticky columns before it. Scroll the table below sideways; Name stays put. Width must be a px value on a sticky column so the offsets can be summed."
	title="Sticky columns"
>
	<div class="table-demo sticky-demo">
		<GroupedGrid
			columns={[
				{ cell: contactName, key: 'name', label: 'Name', sticky: true, width: '140px' },
				{ cell: contactEmail, key: 'email', label: 'Email', width: '180px' },
				{ cell: contactCompany, key: 'company', label: 'Company', width: '140px' },
				{ cell: contactTitle, key: 'title', label: 'Title', width: '140px' },
				{ cell: contactLocation, key: 'location', label: 'Location', width: '140px' },
			]}
			rowKey={(r) => r.email}
			rows={contacts}
		/>
	</div>
</ShowcaseSection>

<ShowcaseSection
	code={`<GroupedGrid
  columns={[...]}
  {rows}
  groupBy={(r) => r.status}
  rowKey={(r) => r.name}
/>`}
	description="Same table mechanics as Table, plus automatic bucketing by groupBy — pass rows + groupBy, or pre-built groups for full control over sorting/merging two row sources."
	title="GroupedGrid — grouping"
>
	<div class="table-demo">
		<GroupedGrid
			columns={[
				{ cell: campaignName, key: 'name', label: 'Campaign' },
				{ align: 'right', cell: campaignSent, key: 'sent', label: 'Sent' },
			]}
			groupBy={(c: Campaign) => c.status}
			rowKey={(c: Campaign) => c.name}
			rows={campaigns}
		/>
	</div>
</ShowcaseSection>

<ShowcaseSection
	code={`{#each Array.from({ length: 6 }) as _, i (i)}
  <SkeletonRow avatar={false} cols={4} />
{/each}`}
	description="SkeletonRow is the single-row primitive — drop it in anywhere a loading state needs one row's worth of bars (a ticket/conversation loading, a single inline placeholder). For a repeated list of table rows, reach for TableSkeleton below instead — it wraps this same idea in the row loop + border/padding a real table body uses."
	title="Loading state — single row"
>
	<div class="table-demo skeleton-demo">
		{#each Array.from({ length: 4 }) as _, i (i)}
			<SkeletonRow avatar={false} cols={3} />
		{/each}
	</div>
</ShowcaseSection>

<ShowcaseSection
	code={`<TableSkeleton checkbox cols={2} rows={4} />`}
	description="The loading-state convention for a table awaiting data: a bordered run of skeleton rows at the same padding a real row uses. checkbox adds one leading checkbox-shaped placeholder, for a table with a select column. This is what campaigns, inboxes, and email-finder's recent-finds table use instead of three divergent hand-rolled skeletons."
	title="TableSkeleton"
>
	<div class="table-demo">
		<TableSkeleton checkbox cols={2} rows={4} />
	</div>
</ShowcaseSection>

<ShowcaseSection
	code={`<EmptyState title="No campaigns yet" description="Create your first campaign to start sending." />

<EmptyState title="No results" description="Try a different search or clear your filters.">
  <Button variant="secondary" onclick={clearFilters}>Clear filters</Button>
</EmptyState>`}
	description="Drop inside a <td colspan='N'> to fill a table body, or standalone above/instead of the table. children is typically one <Button> action. icon is optional."
	title="Empty state"
>
	<div class="empty-demo">
		<div class="table-demo">
			<EmptyState
				description="Create your first campaign to start sending."
				icon={Inbox}
				title="No campaigns yet"
			/>
		</div>
		<div class="table-demo">
			<EmptyState description="Try a different search or clear your filters." title="No results">
				<Button variant="secondary">
					<ListPlus size={13} />
					Clear filters
				</Button>
			</EmptyState>
		</div>
	</div>
</ShowcaseSection>

<ShowcaseSection
	code={`let page = $state(0);

<Pagination {page} totalPages={5} onPage={(p) => (page = p)} />`}
	description="Prev · Page X of Y · Next. Renders nothing when totalPages is 1 — safe to always mount alongside a table."
	title="Pagination"
>
	<Pagination onPage={(p) => (page = p)} {page} totalPages={5} />
</ShowcaseSection>

<style>
	.table-demo {
		width: 100%;
		background: var(--bg);
		border: 1px solid var(--bd);
		overflow: hidden;
	}
	.sticky-demo {
		max-width: 480px;
	}
	.selection-bar-demo {
		padding: var(--spacing-sm) var(--spacing-md);
		border-bottom: 1px solid var(--bd);
		background: var(--sf);
	}
	.skeleton-demo {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
		padding: var(--spacing-md);
	}
	.empty-demo {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
		width: 100%;
	}
	.mono {
		font-family: var(--font-mono);
		font-size: 12.5px;
	}
</style>
