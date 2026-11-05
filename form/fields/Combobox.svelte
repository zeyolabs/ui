<script generics="Input extends RemoteFormInput, V extends number | string" lang="ts">
	import type { RemoteForm, RemoteFormInput } from '$app/server';
	import type { Component, Snippet } from 'svelte';
	import type { ZodType } from 'zod';

	import ChevronsUpDown from '@lucide/svelte/icons/chevrons-up-down';
	import Search from '@lucide/svelte/icons/search';
	import X from '@lucide/svelte/icons/x';
	import { fuzzySearch } from '@zeyolabs/kit/utils/strings/normalize';
	import { Combobox as ComboboxPrimitive } from 'bits-ui';
	import { setContext, tick } from 'svelte';
	import { SvelteMap } from 'svelte/reactivity';

	import { createFormView, createLocalSelectView, type FieldView } from '../field-view.svelte.js';
	import FieldLabel from '../FieldLabel.svelte';
	import OptionRegistrar from './OptionRegistrar.svelte';
	import {
		SELECT_FIELD_CONTEXT,
		type SelectFieldContext,
		type SelectFieldEntry,
	} from './select-field-context.js';

	type BaseProps<Input extends RemoteFormInput> = {
		/** The `<Option>` list — declarative, native `<select><option>`-style. */
		children: Snippet;
		class?: string;
		/** Overrides the "no results" row. Receives the current search query. */
		empty?: Snippet<[query: string]>;
		/** Rendered below the option list, inside the panel (e.g. an "add new…" action). */
		footer?: Snippet;
		form?: Omit<RemoteForm<Input, unknown>, 'for'> | RemoteForm<Input, unknown>;
		/** Rendered above the option list, inside the panel (e.g. a hint line). */
		header?: Snippet;
		icon?: Component;
		/** Field label text. Not `children` here — that's the option list. */
		label?: string;
		name: keyof Input & string;
		/** Only meaningful for single-select — ignored when `multiple`. */
		nullable?: boolean;
		onOpenChange?: (open: boolean) => void;
		/** Server-side search: called (debounced) as the user types, and with `''` when the panel
		 *  reopens. Turns off the built-in client filtering and the built-in "no results" row, so
		 *  the panel shows exactly the `<Option>`s you render — put your own empty state in the
		 *  children. */
		onSearch?: (query: string) => void;
		open?: boolean;
		optional?: boolean;
		placeholder: string;
		schema?: ZodType;
	};

	type Props<Input extends RemoteFormInput, V> =
		| (BaseProps<Input> & {
				multiple: true;
				onchange?: (value: V[]) => void;
				value?: V[];
		  })
		| (BaseProps<Input> & {
				multiple?: false;
				onchange?: (value: undefined | V) => void;
				value?: undefined | V;
		  });

	let {
		children,
		class: className,
		empty,
		footer,
		form,
		header,
		icon: Icon,
		label,
		multiple = false,
		name,
		nullable = false,
		onchange,
		onOpenChange,
		onSearch,
		open = $bindable(false),
		optional,
		placeholder,
		schema,
		value = $bindable(),
	}: Props<Input, V> = $props();

	const registry = new SvelteMap<string, SelectFieldEntry>();
	let query = $state('');
	const context: SelectFieldContext = {
		getQuery: () => (onSearch ? '' : query),
		register: (key, entry) => registry.set(key, entry),
		unregister: (key) => registry.delete(key),
	};
	setContext(SELECT_FIELD_CONTEXT, context);

	let inputEl = $state<HTMLInputElement | null>(null);
	let triggerEl = $state<HTMLElement | null>(null);

	// The search box only exists while the panel is open. Start every open with an empty query and
	// focus it — bits-ui writes the picked label into the input on select, so a stale value would
	// filter the list down to that one item.
	$effect(() => {
		if (!open) return;
		query = '';
		sendSearch('');
		tick().then(() => inputEl?.focus());
	});

	const SEARCH_DEBOUNCE_MS = 250;
	let searchTimer: ReturnType<typeof setTimeout> | undefined;
	let lastSearch = '';
	function sendSearch(value: string) {
		clearTimeout(searchTimer);
		if (!onSearch || value === lastSearch) return;
		lastSearch = value;
		onSearch(value);
	}
	function scheduleSearch(value: string) {
		clearTimeout(searchTimer);
		searchTimer = setTimeout(() => sendSearch(value), SEARCH_DEBOUNCE_MS);
	}

	// `as('select'|'select multiple')` is reached only via the `form` branch — SvelteKit's remote
	// forms natively support both (RemoteFormFieldType resolves 'select multiple' for a string[]
	// field), so no change to field-view.svelte.ts was needed for multi-select.
	// svelte-ignore state_referenced_locally
	const view: FieldView = form
		? createFormView(form, name, multiple ? 'select multiple' : 'select')
		: createLocalSelectView<undefined | V | V[]>({
				get: () => value,
				name,
				schema,
				write: (v) => (value = v as typeof value),
			});

	const attrs = $derived(view.attrs);
	const required = $derived(!optional);
	const displayPlaceholder = $derived(
		label || required || !placeholder ? placeholder : `${placeholder} (Optional)`
	);

	// bits-ui `Combobox` uses this {value,label} list for typeahead matching, same as `Select`.
	const bitsItems = $derived(
		[...registry.entries()].map(([key, entry]) => ({ label: entry.label, value: key }))
	);

	const hasVisibleOptions = $derived(
		!!onSearch ||
			[...registry.values()].some((entry) => query.trim() === '' || fuzzySearch(query, entry.label))
	);

	// Form mode stores the submitted key(s); standalone tracks the typed value(s), keyed the same
	// way `<Option>` derives its own key (`String(value)`) — same split `SelectField` uses, just
	// branched on `multiple`.
	const selectedKey = $derived(
		!multiple ? (form ? (attrs.value as string) : String(value ?? '')) : ''
	);
	const selectedKeys = $derived(
		multiple
			? form
				? ((attrs.value as string[] | undefined) ?? [])
				: ((value as undefined | V[]) ?? []).map((v) => String(v))
			: []
	);
	const selectedLabel = $derived(registry.get(selectedKey)?.label);
	const selectedChips = $derived(
		selectedKeys
			.map((key) => ({ key, label: registry.get(key)?.label ?? key }))
			.filter((chip) => chip.label)
	);

	function handleSingleChange(key: string) {
		const typedValue = registry.get(key)?.value as undefined | V;
		view.set(typedValue);
		(onchange as ((value: undefined | V) => void) | undefined)?.(typedValue);
		tick().then(() => (query = ''));
	}

	function handleMultiChange(keys: string[]) {
		const typedValues = keys
			.map((key) => registry.get(key)?.value)
			.filter((v): v is V => v !== undefined);
		view.set(typedValues);
		(onchange as ((value: V[]) => void) | undefined)?.(typedValues);
		tick().then(() => (query = ''));
	}

	function removeChip(key: string) {
		handleMultiChange(selectedKeys.filter((k) => k !== key));
	}
</script>

<div class="form-field">
	{#if label}
		<FieldLabel for={attrs.name} {required}>{label}</FieldLabel>
	{/if}

	{#snippet panel()}
		<ComboboxPrimitive.Portal>
			<ComboboxPrimitive.Content
				class="form-select-menu form-combobox-menu"
				customAnchor={triggerEl}
				sideOffset={4}
			>
				<div class="form-combobox-search">
					<Search class="form-combobox-search-icon" size={14} />
					<ComboboxPrimitive.Input bind:ref={inputEl}>
						{#snippet child({ props })}
							<input
								{...props}
								class="form-combobox-search-input"
								oninput={(e) => {
									query = e.currentTarget.value;
									scheduleSearch(query);
									(props.oninput as ((e: Event) => void) | undefined)?.(e);
								}}
								placeholder="Search…"
								value={query}
							/>
						{/snippet}
					</ComboboxPrimitive.Input>
				</div>
				{#if header}<div class="form-combobox-header">{@render header()}</div>{/if}
				<ComboboxPrimitive.Viewport class="form-combobox-list">
					{@render children()}
					{#if !hasVisibleOptions}
						{#if empty}
							{@render empty(query)}
						{:else}
							<div class="form-select-empty">No results for "{query}"</div>
						{/if}
					{/if}
				</ComboboxPrimitive.Viewport>
				{#if footer}<div class="form-combobox-footer">{@render footer()}</div>{/if}
			</ComboboxPrimitive.Content>
		</ComboboxPrimitive.Portal>
	{/snippet}

	{#if multiple}
		<ComboboxPrimitive.Root
			items={bitsItems}
			{onOpenChange}
			onValueChange={(keys) => handleMultiChange(keys)}
			{required}
			type="multiple"
			value={selectedKeys}
			bind:open
		>
			<OptionRegistrar {context}>{@render children()}</OptionRegistrar>
			<ComboboxPrimitive.Trigger bind:ref={triggerEl}>
				{#snippet child({ props })}
					<div
						{...props}
						class={['form-input', 'form-select', 'form-combobox', 'form-combobox-multi', className]
							.filter(Boolean)
							.join(' ')}
						role="combobox"
						tabindex="0"
					>
						{#if Icon}<Icon class="form-input-icon" />{/if}
						<div class="form-combobox-chips">
							{#each selectedChips as chip (chip.key)}
								<span class="form-combobox-chip">
									{chip.label}
									<button
										class="form-combobox-chip-remove"
										aria-label="Remove {chip.label}"
										onclick={(e) => {
											e.stopPropagation();
											removeChip(chip.key);
										}}
										onpointerdown={(e) => e.stopPropagation()}
										type="button"
									>
										<X size={11} />
									</button>
								</span>
							{/each}
							{#if selectedChips.length === 0}
								<span class="form-select-value form-select--placeholder">{displayPlaceholder}</span>
							{/if}
						</div>
						<ChevronsUpDown class="form-select-chevron" size={14} />
					</div>
				{/snippet}
			</ComboboxPrimitive.Trigger>
			{@render panel()}
		</ComboboxPrimitive.Root>
		{#each selectedKeys as key (key)}
			<input name={attrs.name} type="hidden" value={key} />
		{/each}
	{:else}
		<ComboboxPrimitive.Root
			allowDeselect={nullable}
			items={bitsItems}
			{onOpenChange}
			onValueChange={(key) => handleSingleChange(key)}
			{required}
			type="single"
			value={selectedKey}
			bind:open
		>
			<OptionRegistrar {context}>{@render children()}</OptionRegistrar>
			<ComboboxPrimitive.Trigger
				class={[
					'form-input',
					'form-select',
					'form-combobox',
					!selectedLabel && 'form-select--placeholder',
					className,
				]
					.filter(Boolean)
					.join(' ')}
				bind:ref={triggerEl}
			>
				{#if Icon}<Icon class="form-input-icon" />{/if}
				<span class="form-select-value">{selectedLabel ?? displayPlaceholder}</span>
				<ChevronsUpDown class="form-select-chevron" size={14} />
			</ComboboxPrimitive.Trigger>
			{@render panel()}
		</ComboboxPrimitive.Root>
		<input name={attrs.name} type="hidden" value={selectedKey} />
	{/if}

	{#each view.issues() as issue (`${issue.path}`)}
		<p class="form-error">{issue.message}</p>
	{/each}
</div>
