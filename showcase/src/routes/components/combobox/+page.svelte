<script lang="ts">
	import { Plus } from '@lucide/svelte';
	import Boundary from '@zeyolabs/ui/boundary/Boundary.svelte';
	import { Button, Combobox, ComboboxAction, Form, Option, SelectField } from '@zeyolabs/ui/form';
	import PageHero from '@zeyolabs/ui/page-hero/PageHero.svelte';
	import SkeletonButton from '@zeyolabs/ui/skeleton/SkeletonButton.svelte';

	import { demoComboboxForm } from '#lib/remote/demo-combobox.remote.js';
	import {
		DEMO_COMBOBOX_FRAMEWORKS,
		DEMO_COMBOBOX_PRIORITIES,
		DEMO_COMBOBOX_TOPICS,
		DemoComboboxSchema,
	} from '#lib/schemas/demo-combobox.schema.js';
	import ShowcaseSection from '#lib/showcase/ShowcaseSection.svelte';

	const topicOptions = DEMO_COMBOBOX_TOPICS.map((value) => ({
		label: value === 'bug' ? 'Bug report' : value[0].toUpperCase() + value.slice(1),
		value,
	}));
	const frameworkOptions = DEMO_COMBOBOX_FRAMEWORKS.map((value) => ({
		label: value[0].toUpperCase() + value.slice(1),
		value,
	}));
	const priorityOptions = DEMO_COMBOBOX_PRIORITIES.map((value) => ({
		label: value[0].toUpperCase() + value.slice(1),
		value,
	}));

	let single = $state<string | undefined>(undefined);
	let multi = $state<string[]>([]);
	let withChrome = $state<string | undefined>(undefined);
	let plainTopic = $state<string | undefined>(undefined);
	let preselected = $state<string | undefined>('svelte');
	let boundaried = $state<string | undefined>(undefined);

	// Stand-in for an awaited remote query: the options arrive after a short delay.
	function loadFrameworks() {
		return new Promise<typeof frameworkOptions>((resolve) =>
			setTimeout(() => resolve(frameworkOptions), 1500)
		);
	}
</script>

<svelte:head>
	<title>Combobox — Pure Leaves UI</title>
</svelte:head>

<PageHero
	eyebrow="Components"
	sub="Combobox takes a declarative <Option> list as children; SelectField takes items/getKey/getLabel/getValue (a renderOption snippet covers rich per-item content). Combobox adds search (fuzzy match, as the first row inside the opened panel — the closed trigger is a button showing the selected value/chips as text, same as SelectField), multi-select chips, and header/footer panel snippets; SelectField is the plain, non-searchable version."
	title="Combobox & SelectField"
/>

<ShowcaseSection
	code={`<!-- 1. Give it a name, a placeholder, and <Option> children. -->
<Combobox name="framework" placeholder="Search frameworks…" bind:value={framework}>
  {#each frameworks as f (f.value)}
    <Option label={f.label} value={f.value}>{f.label}</Option>
  {/each}
</Combobox>

<!-- 2. Pass multiple + an array to pick several (chips in the trigger). -->
<Combobox multiple name="stack" placeholder="Add frameworks…" bind:value={stack}>…</Combobox>

<!-- 3. Bind to a remote form with form={...} and the keys are submitted as hidden inputs. -->
<Combobox name="topic" form={myForm} placeholder="Topic">…</Combobox>

<!-- 4. Optional extras: header / footer / empty snippets, nullable, bind:open. -->`}
	description="Closed, a Combobox is a button: it shows the selected label (or the placeholder), or chips when multiple. Click or press Enter / Space / ArrowDown and a panel opens under it, as wide as the trigger. The panel's first row is the search box, then a scrollable option list; header and footer snippets sit above and below. Each <Option> registers itself (key = String(value), plus its label) with the Combobox, which is how it finds the selected label, builds chips, and filters. The children are rendered once more, hidden, while the panel is closed, so every label is known at first render and a pre-selected value never flashes the placeholder. Typing updates a live query and every Option hides itself unless fuzzySearch(query, label) matches (not just substring). The query clears and the search box takes focus every time the panel opens. value is the typed V (a string or number) or V[] when multiple; onchange fires on each pick, and nullable lets picking the current value again clear it. With form + name, the selected key(s) go out as hidden inputs, so it posts like a native select."
	title="How it works & how to use it"
>
	<Combobox name="howItWorksDemo" placeholder="Try it — open and type…" bind:value={single}>
		{#each frameworkOptions as opt (opt.value)}
			<Option label={opt.label} value={opt.value}>{opt.label}</Option>
		{/each}
	</Combobox>
</ShowcaseSection>

<ShowcaseSection
	code={`<Combobox name="favoriteFramework" placeholder="Search frameworks…" bind:value={single}>
  {#each frameworkOptions as opt (opt.value)}
    <Option label={opt.label} value={opt.value}>{opt.label}</Option>
  {/each}
</Combobox>`}
	description="Type to filter (fuzzy match, not just substring) — each <Option> filters itself against the live query, so the list stays declarative even with search. The search box lives inside the opened panel, above the option list; the closed trigger just shows the selected value as text."
	title="Single-select, searchable"
>
	<Combobox name="favoriteFramework" placeholder="Search frameworks…" bind:value={single}>
		{#each frameworkOptions as opt (opt.value)}
			<Option label={opt.label} value={opt.value}>{opt.label}</Option>
		{/each}
	</Combobox>
</ShowcaseSection>

<ShowcaseSection
	code={`let value = $state('svelte');

<Combobox name="preselectedDemo" placeholder="Search frameworks…" bind:value>
  {#each frameworkOptions as opt (opt.value)}
    <Option label={opt.label} value={opt.value}>{opt.label}</Option>
  {/each}
</Combobox>`}
	description="A value that's already selected on first render (e.g. the current row's saved value) shows its label straight away, with the panel closed. The <Option> children are rendered once, hidden, so every option registers its label up front — there is nothing extra to pass. One rule: if there's a value, its <Option> must be among the children (when a list is paged or searched on the server, merge the selected item in)."
	title="Pre-selected value"
>
	<Combobox name="preselectedDemo" placeholder="Search frameworks…" bind:value={preselected}>
		{#each frameworkOptions as opt (opt.value)}
			<Option label={opt.label} value={opt.value}>{opt.label}</Option>
		{/each}
	</Combobox>
</ShowcaseSection>

<ShowcaseSection
	code={`<Boundary message="Could not load frameworks.">
  {let frameworks = $derived(await getFrameworksRQ())}
  <Combobox name="framework" placeholder="Search frameworks…" bind:value={framework}>
    {#each frameworks as f (f.value)}
      <Option label={f.label} value={f.value}>{f.label}</Option>
    {/each}
  </Combobox>
  {#snippet pending()}<SkeletonButton w="100%" />{/snippet}
</Boundary>`}
	description="Options that come from an awaited query: wrap the Combobox in a Boundary and give it a pending snippet — the Combobox only renders once the data is there, and a failure gets the standard retry card. This is how the dashboard's account switcher is built. Reload the page to see the skeleton (the demo's options take 1.5s)."
	title="Loading — wrap it in a Boundary"
>
	<div class="w-full max-w-100">
		<Boundary message="Could not load frameworks.">
			{let frameworks = $derived(await loadFrameworks())}
			<Combobox name="boundaryDemo" placeholder="Search frameworks…" bind:value={boundaried}>
				{#each frameworks as opt (opt.value)}
					<Option label={opt.label} value={opt.value}>{opt.label}</Option>
				{/each}
			</Combobox>

			{#snippet pending()}
				<SkeletonButton w="100%" />
			{/snippet}
		</Boundary>
	</div>
</ShowcaseSection>

<ShowcaseSection
	code={`<Combobox multiple name="stackDemo" placeholder="Add frameworks…" bind:value={multi}>
  {#each frameworkOptions as opt (opt.value)}
    <Option label={opt.label} value={opt.value}>{opt.label}</Option>
  {/each}
</Combobox>`}
	description="multiple renders selections as removable chips inside the trigger — search still opens in the panel, same as single-select. Same <Option> children, just multiple + value: V[]."
	title="Multi-select, chips"
>
	<div class="w-full max-w-100">
		<Combobox name="stackDemo" multiple placeholder="Add frameworks…" bind:value={multi}>
			{#each frameworkOptions as opt (opt.value)}
				<Option label={opt.label} value={opt.value}>{opt.label}</Option>
			{/each}
		</Combobox>
	</div>
</ShowcaseSection>

<ShowcaseSection
	code={`<Combobox name="withChromeDemo" placeholder="Search…" bind:value={withChrome}>
  {#each frameworkOptions as opt (opt.value)}
    <Option label={opt.label} value={opt.value}>{opt.label}</Option>
  {/each}
  {#snippet header()}
    <span>{frameworkOptions.length} frameworks — pick your favorite</span>
  {/snippet}
  {#snippet footer()}
    <ComboboxAction icon={Plus} onclick={requestNewFramework}>Request a framework</ComboboxAction>
  {/snippet}
</Combobox>`}
	description="header/footer snippets render inside the panel, above/below the option list — this is the escape hatch SelectField deliberately doesn't have. ComboboxAction is the canonical footer/header action row (icon + label, no hand-rolled button)."
	title="Header & footer"
>
	<Combobox name="withChromeDemo" placeholder="Search…" bind:value={withChrome}>
		{#each frameworkOptions as opt (opt.value)}
			<Option label={opt.label} value={opt.value}>{opt.label}</Option>
		{/each}
		{#snippet header()}
			<span>{frameworkOptions.length} frameworks — pick your favorite</span>
		{/snippet}
		{#snippet footer()}
			<ComboboxAction icon={Plus} onclick={() => {}}>Request a framework</ComboboxAction>
		{/snippet}
	</Combobox>
</ShowcaseSection>

<ShowcaseSection
	code={`<Form form={demoComboboxForm} schema={DemoComboboxSchema}>
  <Combobox name="topic" form={demoComboboxForm} placeholder="Topic">
    {#each topicOptions as opt}<Option label={opt.label} value={opt.value}>{opt.label}</Option>{/each}
  </Combobox>
  <Combobox multiple name="stack" form={demoComboboxForm} placeholder="Stack">
    {#each frameworkOptions as opt}<Option label={opt.label} value={opt.value}>{opt.label}</Option>{/each}
  </Combobox>
  <SelectField
    name="priority"
    form={demoComboboxForm}
    getKey={(opt) => opt.value}
    getLabel={(opt) => opt.label}
    getValue={(opt) => opt.value}
    items={priorityOptions}
    label="Priority"
    placeholder="Priority"
  />
  <Button form={demoComboboxForm}>Save</Button>
</Form>`}
	description="Real form submission — Combobox and SelectField plug into the same createFormView/createLocalSelectView machinery (SvelteKit's remote forms already support 'select multiple' natively, no changes needed there)."
	title="Form-bound"
>
	<Form class="demo-form" form={demoComboboxForm} schema={DemoComboboxSchema}>
		<Combobox name="topic" form={demoComboboxForm} label="Topic" placeholder="Topic">
			{#each topicOptions as opt (opt.value)}
				<Option label={opt.label} value={opt.value}>{opt.label}</Option>
			{/each}
		</Combobox>
		<Combobox name="stack" form={demoComboboxForm} label="Stack" multiple placeholder="Stack">
			{#each frameworkOptions as opt (opt.value)}
				<Option label={opt.label} value={opt.value}>{opt.label}</Option>
			{/each}
		</Combobox>
		<SelectField
			name="priority"
			form={demoComboboxForm}
			getKey={(opt) => opt.value}
			getLabel={(opt) => opt.label}
			getValue={(opt) => opt.value}
			items={priorityOptions}
			label="Priority"
			placeholder="Priority"
		/>
		<Button class="mt-1" form={demoComboboxForm}>Save</Button>
	</Form>
</ShowcaseSection>

<ShowcaseSection
	code={`<SelectField
  name="priorityDemo"
  getKey={(opt) => opt.value}
  getLabel={(opt) => opt.label}
  getValue={(opt) => opt.value}
  items={priorityOptions}
  label="Priority"
  placeholder="Pick a priority"
  bind:value={plainTopic}
>
  {#snippet renderOption(opt)}
    {opt.value === 'high' ? '🔥 ' : ''}{opt.label}
  {/snippet}
</SelectField>`}
	description="The non-searchable option — no form prop here (standalone), but it works form-bound too (see above). renderOption is a plain snippet prop, not a lazily-mounted child, so rich per-item content (the 🔥) renders correctly in both the option row and the closed trigger from first render — same first-render guarantee Combobox gets from rendering its <Option> children once, hidden."
	title="SelectField — custom option rendering"
>
	<SelectField
		name="priorityDemo"
		getKey={(opt) => opt.value}
		getLabel={(opt) => opt.label}
		getValue={(opt) => opt.value}
		items={priorityOptions}
		label="Priority"
		placeholder="Pick a priority"
		bind:value={plainTopic}
	>
		{#snippet renderOption(opt)}
			{opt.value === 'high' ? '🔥 ' : ''}{opt.label}
		{/snippet}
	</SelectField>
</ShowcaseSection>

<style>
	:global(.demo-form) {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
		width: 100%;
		max-width: 420px;
	}
</style>
