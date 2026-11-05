<script lang="ts">
	import { FileUp, Link, ListFilter, MoreHorizontal } from '@lucide/svelte';
	import ConfirmDialog from '@zeyolabs/ui/dialog/ConfirmDialog.svelte';
	import Dialog from '@zeyolabs/ui/dialog/Dialog.svelte';
	import DialogBody from '@zeyolabs/ui/dialog/DialogBody.svelte';
	import DialogCloseButton from '@zeyolabs/ui/dialog/DialogCloseButton.svelte';
	import DialogFooter from '@zeyolabs/ui/dialog/DialogFooter.svelte';
	import DialogTrigger from '@zeyolabs/ui/dialog/DialogTrigger.svelte';
	import { createFilterDraft } from '@zeyolabs/ui/filter/filter-draft.svelte';
	import FilterChipGroup from '@zeyolabs/ui/filter/FilterChipGroup.svelte';
	import FilterOptionList from '@zeyolabs/ui/filter/FilterOptionList.svelte';
	import FilterPopover from '@zeyolabs/ui/filter/FilterPopover.svelte';
	import { Button } from '@zeyolabs/ui/form';
	import MenuButton from '@zeyolabs/ui/menu/MenuButton.svelte';
	import PageHero from '@zeyolabs/ui/page-hero/PageHero.svelte';
	import Popover from '@zeyolabs/ui/popover/Popover.svelte';
	import TabBlock from '@zeyolabs/ui/tabs/TabBlock.svelte';
	import TabButton from '@zeyolabs/ui/tabs/TabButton.svelte';
	import Text from '@zeyolabs/ui/text/Text.svelte';
	import { toast } from 'svelte-sonner';

	import ShowcaseSection from '#lib/showcase/ShowcaseSection.svelte';

	let dialogOpen = $state(false);
	let popoverOpen = $state(false);
	let filterOpen = $state(false);
	let applied = $state<string[]>([]);
	const draft = createFilterDraft(
		() => applied,
		(values) => (applied = values)
	);
	const popular = [
		'Stripe',
		'Notion',
		'Linear',
		'Figma',
		'Vercel',
		'Shopify',
		'Slack',
		'Airbnb',
	].map((c) => ({ label: c, value: c }));
	const companies = [
		...['Stripe', 'Notion', 'Linear', 'Figma', 'Vercel', 'Shopify'].map((label, i) => ({
			count: 40 - i * 5,
			group: 'Software',
			label,
			value: label,
		})),
		...['Airbnb', 'Booking', 'Expedia', 'Uber', 'Lyft', 'DoorDash'].map((label, i) => ({
			count: 30 - i * 4,
			group: 'Consumer',
			label,
			value: label,
		})),
	];
	function toggleDraft(value: string) {
		draft.values = draft.values.includes(value)
			? draft.values.filter((v) => v !== value)
			: [...draft.values, value];
	}

	let singleOpen = $state(false);
	let single = $state<string[]>([]);
	let showLoading = $state(false);
	let showError = $state(false);
	let tab = $state('overview');

	const tabPanels: Record<string, string> = {
		activity: 'Activity panel — most recent events for this record.',
		overview: 'Overview panel — the default, high-level summary.',
		settings: 'Settings panel — per-record configuration.',
	};
</script>

<svelte:head>
	<title>Overlays &amp; tabs — Zeyo UI</title>
</svelte:head>

<PageHero
	eyebrow="Components"
	sub="Dialog for a modal task, ConfirmDialog for a destructive one-liner, Popover for an anchored menu, TabBlock for in-page sections."
	title="Overlays & tabs"
/>

<ShowcaseSection
	code={`<Dialog bind:open>
  <DialogTrigger><Button>Open dialog</Button></DialogTrigger>
  <DialogBody title="Invite teammate" description="They'll get an email with a join link.">
    <DialogFooter>
      <DialogCloseButton>Cancel</DialogCloseButton>
      <Button onclick={sendInvite}>Send invite</Button>
    </DialogFooter>
  </DialogBody>
</Dialog>`}
	description="A composed, context-driven modal — Dialog owns open state, DialogTrigger/DialogBody/DialogFooter read it via context."
	title="Dialog"
>
	<Dialog bind:open={dialogOpen}>
		<DialogTrigger><Button variant="secondary">Open dialog</Button></DialogTrigger>
		<DialogBody description="They'll get an email with a join link." title="Invite teammate">
			<DialogFooter>
				<DialogCloseButton>Cancel</DialogCloseButton>
				<Button
					onclick={() => {
						dialogOpen = false;
						toast.success('Invite sent (demo only).');
					}}
				>
					Send invite
				</Button>
			</DialogFooter>
		</DialogBody>
	</Dialog>
</ShowcaseSection>

<ShowcaseSection
	code={`<ConfirmDialog title="Delete campaign?" description="This can't be undone." onConfirm={deleteCampaign}>
  {#snippet trigger()}
    <Button variant="ghost-destructive">Delete campaign</Button>
  {/snippet}
</ConfirmDialog>`}
	description="The Dialog + confirm/cancel pattern collapsed into one component — pass a trigger snippet and an onConfirm handler."
	title="ConfirmDialog"
>
	<ConfirmDialog
		description="This can't be undone."
		onConfirm={() => {
			toast.success('Campaign deleted (demo only).');
		}}
		title="Delete campaign?"
	>
		{#snippet trigger()}
			<Button variant="ghost-destructive">Delete campaign</Button>
		{/snippet}
	</ConfirmDialog>
</ShowcaseSection>

<ShowcaseSection
	code={`<div style="position: relative;">
  <button onclick={() => (open = !open)}>Options</button>
  <Popover bind:open width={200}>
    <button class="item">Rename</button>
    <button class="item">Archive</button>
  </Popover>
</div>`}
	description="Anchored under its own parent element (position: relative), escapes ancestor overflow-clip via position: fixed."
	title="Popover"
>
	<div class="popover-anchor">
		<button class="popover-trigger" onclick={() => (popoverOpen = !popoverOpen)} type="button">
			<MoreHorizontal size={14} />
			Options
		</button>
		<Popover width={190} bind:open={popoverOpen}>
			<button class="popover-item" onclick={() => (popoverOpen = false)} type="button">
				Rename
			</button>
			<button class="popover-item" onclick={() => (popoverOpen = false)} type="button">
				Archive
			</button>
			<button class="popover-item" onclick={() => (popoverOpen = false)} type="button">
				Duplicate
			</button>
		</Popover>
	</div>
</ShowcaseSection>

<ShowcaseSection
	code={`<div style="position: relative;">
  <button onclick={() => { draft.reset(); open = true; }}>Company</button>
  <FilterPopover
    bind:open
    title="Company"
    side="right"
    onApply={draft.apply}
    onClear={draft.clear}
    onCancel={draft.reset}
  >
    <FilterChipGroup label="Popular" chips={popular} selected={draft.values} onToggle={toggle} />
    <FilterOptionList searchable options={companies} bind:selected={draft.values} />
  </FilterPopover>
</div>`}
	description="Compact filter panel with Clear and Apply. The draft only commits on Apply; Esc or an outside click discards it."
	title="FilterPopover"
>
	<div class="popover-anchor">
		<button
			class="popover-trigger"
			onclick={() => {
				draft.reset();
				filterOpen = !filterOpen;
			}}
			type="button"
		>
			<ListFilter size={14} />
			Company
		</button>
		<FilterPopover
			onApply={draft.apply}
			onCancel={draft.reset}
			onClear={draft.clear}
			side="right"
			title="Company"
			bind:open={filterOpen}
		>
			<FilterChipGroup
				chips={popular}
				label="Popular"
				onToggle={toggleDraft}
				selected={draft.values}
			/>
			<FilterOptionList options={companies} searchable bind:selected={draft.values} />
		</FilterPopover>
	</div>
	<Text color="secondary" size="sm">Applied: {applied.length ? applied.join(', ') : 'none'}</Text>
</ShowcaseSection>

<ShowcaseSection
	code={`<FilterPopover bind:open title="Company" {loading} {error} ...>
  <FilterOptionList multiple={false} options={companies} bind:selected />
</FilterPopover>`}
	description="Single-select list, plus the loading and error body states."
	title="FilterPopover — single select, loading and error"
>
	<div class="popover-anchor">
		<button class="popover-trigger" onclick={() => (singleOpen = !singleOpen)} type="button">
			<ListFilter size={14} />
			Company
		</button>
		<FilterPopover
			error={showError ? 'Could not load companies.' : undefined}
			loading={showLoading}
			onApply={() => {}}
			onClear={() => (single = [])}
			title="Company"
			bind:open={singleOpen}
		>
			<FilterOptionList multiple={false} options={companies} bind:selected={single} />
		</FilterPopover>
	</div>
	<Button onclick={() => (showLoading = !showLoading)} size="sm" variant="secondary">
		Loading: {showLoading ? 'on' : 'off'}
	</Button>
	<Button onclick={() => (showError = !showError)} size="sm" variant="secondary">
		Error: {showError ? 'on' : 'off'}
	</Button>
</ShowcaseSection>

<ShowcaseSection
	code={`<MenuButton
  items={[
    { icon: FileUp, label: 'Add with CSV', onselect: addCsv },
    { icon: Link, label: 'Link an existing list', onselect: linkList },
    { label: 'Clear leads', destructive: true, onselect: clear },
  ]}
>
  Add leads
</MenuButton>`}
	description="A button with a chevron that opens a short menu — for two or more related ways to do one thing. Wraps Button + Popover; picking an item runs onselect and closes it. destructive makes an item red."
	title="MenuButton"
>
	<MenuButton
		items={[
			{ icon: FileUp, label: 'Add with CSV', onselect: () => toast.info('Add with CSV') },
			{ icon: Link, label: 'Link an existing list', onselect: () => toast.info('Link a list') },
			{ destructive: true, label: 'Clear leads', onselect: () => toast.info('Clear leads') },
		]}
	>
		Add leads
	</MenuButton>
</ShowcaseSection>

<ShowcaseSection
	code={`<TabBlock bind:value={tab}>
  <TabButton value="overview">Overview</TabButton>
  <TabButton value="activity">Activity</TabButton>
  <TabButton value="settings">Settings</TabButton>
</TabBlock>`}
	description="Context-driven tab strip — TabBlock owns the active value, TabButton reads/sets it. Pair with your own conditional to render the panel."
	title="TabBlock"
>
	<div class="tabs-demo">
		<TabBlock bind:value={tab}>
			<TabButton value="overview">Overview</TabButton>
			<TabButton value="activity">Activity</TabButton>
			<TabButton value="settings">Settings</TabButton>
		</TabBlock>
		<Text class="tab-panel" color="secondary" size="sm">{tabPanels[tab]}</Text>
	</div>
</ShowcaseSection>

<style>
	.popover-anchor {
		position: relative;
		display: inline-block;
	}
	.popover-trigger {
		display: inline-flex;
		align-items: center;
		gap: var(--spacing-xs);
		height: 34px;
		padding: 0 var(--spacing-sm);
		font-size: 12px;
		font-weight: 500;
		color: var(--tx);
		background: var(--bg);
		border: 1px solid var(--bd);
		border-radius: var(--radius-sm);
		cursor: pointer;
	}
	:global(.popover-item) {
		display: flex;
		align-items: center;
		padding: var(--spacing-xs) var(--spacing-sm);
		font-size: 12px;
		font-weight: 500;
		color: var(--tx);
		background: transparent;
		border: none;
		border-radius: var(--radius-xs);
		text-align: left;
		cursor: pointer;
	}
	:global(.popover-item:hover) {
		background: var(--sf);
	}
	.tabs-demo {
		width: 100%;
	}
	:global(.tab-panel) {
		margin: var(--spacing-sm) 0 0;
	}
</style>
