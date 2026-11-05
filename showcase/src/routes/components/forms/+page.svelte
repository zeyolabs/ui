<script lang="ts">
	import { Mail } from '@lucide/svelte';
	import { Button, Combobox, Form } from '@zeyolabs/ui/form';
	import {
		CheckboxField,
		EmailField,
		FileField,
		MessageField,
		NumberField,
		Option,
		RadioField,
		SelectField,
		SwitchField,
		TextField,
	} from '@zeyolabs/ui/form/fields';
	import { Input, SearchBar } from '@zeyolabs/ui/form/primitives';
	import PageHero from '@zeyolabs/ui/page-hero/PageHero.svelte';
	import InfoTip from '@zeyolabs/ui/popover/InfoTip.svelte';
	import Popover from '@zeyolabs/ui/popover/Popover.svelte';
	import Text from '@zeyolabs/ui/text/Text.svelte';

	import { demoContactForm } from '#lib/remote/demo.remote.js';
	import { DEMO_CONTACT_TOPICS, DemoContactSchema } from '#lib/schemas/demo-contact.schema.js';
	import ShowcaseSection from '#lib/showcase/ShowcaseSection.svelte';

	const topicOptions = DEMO_CONTACT_TOPICS.map((value) => ({
		label: value === 'bug' ? 'Bug report' : value[0].toUpperCase() + value.slice(1),
		value,
	}));

	let plan = $state<string | undefined>('growth');
	let priority = $state<string | undefined>('normal');
	const priorityOptions = [
		{ label: 'Low', value: 'low' },
		{ label: 'Normal', value: 'normal' },
		{ label: 'High', value: 'high' },
	];

	let campaignSearch = $state('');
	let campaignSearchOpen = $state(false);
	let debouncedSearch = $state('');
	const campaigns = ['Acme launch', 'Q3 follow-up', 'Warm re-engage', 'Holiday promo'];
	const filteredCampaigns = $derived(
		campaigns.filter((name) => name.toLowerCase().includes(campaignSearch.trim().toLowerCase()))
	);

	let emailValue = $state('');
</script>

<svelte:head>
	<title>Forms — Pure Leaves UI</title>
</svelte:head>

<PageHero
	eyebrow="Components"
	sub="Every field below runs through a real SvelteKit remote form (no database — it just returns a success message). This is the pattern every app form should follow, not a hand-rolled input + onsubmit."
	title="Forms"
/>

<ShowcaseSection
	code={`<Input placeholder="Default (35px)" />
<Input placeholder="Small (28px)" size="sm" />`}
	description="Omit size for the default 35px height. size='sm' is the one shorter footprint (28px) — for filter bars, dense panels, inline row editing. Same two-tier scale as Button."
	title="Sizes"
>
	<Input placeholder="Default (35px)" />
	<Input placeholder="Small (28px)" size="sm" />
</ShowcaseSection>

<ShowcaseSection
	code={`<Form form={demoContactForm} schema={DemoContactSchema}>
  <TextField name="name" form={demoContactForm}>Name</TextField>
  <EmailField name="email" form={demoContactForm}>Email</EmailField>
  <SelectField
    name="topic"
    form={demoContactForm}
    getKey={(opt) => opt.value}
    getLabel={(opt) => opt.label}
    getValue={(opt) => opt.value}
    items={topicOptions}
    label="Topic"
    placeholder="Topic"
  />
  <NumberField name="seats" form={demoContactForm} optional>Seats (optional)</NumberField>
  <MessageField name="message" form={demoContactForm} optional>Message (optional)</MessageField>
  <SwitchField name="urgent" form={demoContactForm} optional variant="onoff">Urgent</SwitchField>
  <CheckboxField name="subscribe" form={demoContactForm} optional>Subscribe to updates</CheckboxField>
  <Button form={demoContactForm}>Send</Button>
</Form>`}
	description="<Form> + field components + <Button form>, wired to src/lib/remote/demo.remote.ts. The success message is toasted automatically — no onSuccess wiring needed just to surface it. Field schemas come from @zeyolabs/kit/utils/form (formText, formEmail, nullable(...), …), never raw zod."
	title="A complete form"
>
	<Form class="demo-form" form={demoContactForm} schema={DemoContactSchema}>
		<TextField name="name" form={demoContactForm} placeholder="Jane Doe">Name</TextField>
		<EmailField name="email" form={demoContactForm} placeholder="jane@company.com">
			Email
		</EmailField>
		<SelectField
			name="topic"
			form={demoContactForm}
			getKey={(opt) => opt.value}
			getLabel={(opt) => opt.label}
			getValue={(opt) => opt.value}
			items={topicOptions}
			label="Topic"
			placeholder="Topic"
		/>
		<NumberField name="seats" form={demoContactForm} optional placeholder="e.g. 5">
			Seats (optional)
		</NumberField>
		<MessageField name="message" form={demoContactForm} optional placeholder="Anything else?">
			Message (optional)
		</MessageField>
		<SwitchField name="urgent" form={demoContactForm} optional variant="onoff">Urgent</SwitchField>
		<CheckboxField name="subscribe" form={demoContactForm} optional>
			Subscribe to updates
		</CheckboxField>
		<Button class="mt-1" form={demoContactForm}>Send</Button>
	</Form>
</ShowcaseSection>

<ShowcaseSection
	code={`<RadioField name="plan" value="starter" bind:group={plan}>Starter</RadioField>
<RadioField name="plan" value="growth" bind:group={plan}>Growth</RadioField>
<RadioField name="plan" value="scale" disabled bind:group={plan}>Scale</RadioField>`}
	description="@zeyolabs/ui/form/fields: one radio option. Options that share a name form a group, and group holds the selected value, so the options can sit anywhere (a table row, beside other content), not only inside one wrapper. Styled and spaced like CheckboxField."
	title="RadioField"
>
	<div class="flex flex-col gap-3">
		<RadioField name="plan" value="starter" bind:group={plan}>Starter</RadioField>
		<RadioField
			name="plan"
			description="Rows with the same value count as one lead."
			value="growth"
			bind:group={plan}
		>
			Growth
		</RadioField>
		<RadioField name="plan" disabled value="scale" bind:group={plan}
			>Scale (not available)</RadioField
		>
		<Text color="secondary" size="sm">Selected: {plan}</Text>
	</div>
</ShowcaseSection>

<ShowcaseSection
	code={`<InfoTip label="About matching leads">
  Rows with the same value count as the same lead.
</InfoTip>`}
	description="@zeyolabs/ui/popover — a small info icon whose tooltip shows on hover or keyboard focus. Use it for a short explanation next to a label or column header. align='right' makes the tooltip open leftwards, for one placed in the last column."
	title="InfoTip"
>
	<div class="flex items-center gap-1.5">
		<Text>Match leads by</Text>
		<InfoTip label="About matching leads">
			Rows with the same value in this column count as the same lead, so each lead is only added
			once.
		</InfoTip>
	</div>
</ShowcaseSection>

<ShowcaseSection
	code={`<Combobox name="priorityDemo" placeholder="Priority" bind:value={priority}>
  {#each priorityOptions as opt (opt.value)}
    <Option label={opt.label} value={opt.value}>{opt.label}</Option>
  {/each}
</Combobox>`}
	description="@zeyolabs/ui/form — type to filter (fuzzy match). See the dedicated Combobox page for multi-select, header/footer snippets, and form-bound usage; SelectField's items/getKey/getLabel/getValue array (also on that page) is the non-searchable alternative."
	title="Combobox"
>
	<Combobox name="priorityDemo" placeholder="Priority" bind:value={priority}>
		{#each priorityOptions as opt (opt.value)}
			<Option label={opt.label} value={opt.value}>{opt.label}</Option>
		{/each}
	</Combobox>
</ShowcaseSection>

<ShowcaseSection
	code={`let query = $state('');
let open = $state(false);
const filtered = $derived(
  campaigns.filter((name) => name.toLowerCase().includes(query.trim().toLowerCase()))
);

<div style="position: relative;">
  <SearchBar
    defaultValue={query}
    onChange={(v) => { query = v; open = v.trim() !== ''; }}
    placeholder="Search…"
  />
  <Popover align="left" width={296} bind:open>
    {#each filtered as name}<div>{name}</div>{/each}
  </Popover>
</div>

<SearchBar debounce={300} onChange={(v) => (query = v)} placeholder="Debounced (300ms)…" />`}
	description="@zeyolabs/ui/form/primitives — an Input with a search icon baked in. onChange is required; SearchBar doesn't own the filter state itself, the parent does. Matches render in a Popover anchored underneath — position: fixed, so it overlays the page instead of inline content that pushes everything else down as the result count changes. For a search that hits the server, pass debounce (ms) so onChange waits until typing stops — the second field uses debounce={300}."
	title="Search"
>
	<div class="search-demo">
		<SearchBar
			defaultValue={campaignSearch}
			onChange={(v) => {
				campaignSearch = v;
				campaignSearchOpen = v.trim() !== '';
			}}
			placeholder="Search campaigns…"
		/>
		<Popover align="left" ariaLabel="Campaign matches" width={296} bind:open={campaignSearchOpen}>
			{#each filteredCampaigns as name (name)}
				<div class="search-result-row">{name}</div>
			{:else}
				<div class="search-result-empty">No campaigns match "{campaignSearch}".</div>
			{/each}
		</Popover>
	</div>
	<div class="search-demo">
		<SearchBar
			debounce={300}
			onChange={(v) => (debouncedSearch = v)}
			placeholder="Debounced (300ms)…"
		/>
		<Text class="mt-2" color="secondary" size="sm">Committed: "{debouncedSearch}"</Text>
	</div>
</ShowcaseSection>

<ShowcaseSection
	code={`<Input bind:value placeholder="Plain text" />
<Input bind:value icon={Mail} placeholder="jane@company.com" type="email" />`}
	description="The standalone, non-form counterpart to TextField — same .form-input styling, plain bindable value. SearchBar is just this with a Search icon and type='search' baked in. Reach for this for any local-state input a remote form doesn't own (filters, modal-local fields, dynamically-named fields a static Field name can't express)."
	title="Input"
>
	<div class="input-demo">
		<Input placeholder="Plain text" />
		<Input icon={Mail} placeholder="jane@company.com" type="email" bind:value={emailValue} />
	</div>
</ShowcaseSection>

<ShowcaseSection
	code={`<FileField onSelect={(files) => console.log(files)} variant="button" />
<FileField onSelect={(files) => console.log(files)} variant="dropzone" />`}
	description="Not wired to a form — reads the file for client-side use (preview, direct upload to R2, …) instead of submitting through FormData."
	title="FileField"
>
	<div class="filepicker-demo">
		<FileField onSelect={() => {}} variant="button">Attachment</FileField>
		<FileField onSelect={() => {}} variant="dropzone">Attachment (dropzone)</FileField>
	</div>
</ShowcaseSection>

<style>
	:global(.demo-form) {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
		width: 100%;
		max-width: 420px;
	}
	.filepicker-demo {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
		width: 100%;
		max-width: 360px;
	}
	.search-demo {
		position: relative;
		width: 100%;
		max-width: 320px;
	}
	.search-result-row {
		padding: var(--spacing-xs) var(--spacing-sm);
		font-size: 12.5px;
		color: var(--tx);
	}
	.search-result-empty {
		padding: var(--spacing-sm);
		font-size: 12px;
		color: var(--txs);
		text-align: center;
	}
	.input-demo {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
		width: 100%;
		max-width: 320px;
	}
</style>
