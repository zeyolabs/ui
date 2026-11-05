<script generics="Input extends RemoteFormInput, T, V extends number | string" lang="ts">
	import type { RemoteForm, RemoteFormInput } from '$app/server';
	import type { Component, Snippet } from 'svelte';
	import type { ZodType } from 'zod';

	import Check from '@lucide/svelte/icons/check';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import { Select } from 'bits-ui';

	import { createFormView, createLocalSelectView, type FieldView } from '../field-view.svelte.js';
	import FieldLabel from '../FieldLabel.svelte';

	interface Props {
		class?: string;
		form?: Omit<RemoteForm<Input, unknown>, 'for'> | RemoteForm<Input, unknown>;
		/** Unique string key per item — defaults to `String(item)`, fine for primitive `items`. */
		getKey?: (item: T) => string;
		/** Display text — defaults to `String(item)`. Only the typeahead/`aria-label` fallback
		 *  when `renderOption` is given. */
		getLabel?: (item: T) => string;
		/** The typed value written to the field — defaults to the item itself. */
		getValue?: (item: T) => V;
		icon?: Component;
		items: readonly T[];
		/** Field label text. */
		label?: string;
		name: keyof Input & string;
		nullable?: boolean;
		onchange?: (value: undefined | V) => void;
		optional?: boolean;
		placeholder: string;
		/** Rich per-item content (icon, badge, …) — rendered for both the menu row and the
		 *  closed trigger. Falls back to `getLabel` as plain text when omitted. */
		renderOption?: Snippet<[T]>;
		schema?: ZodType;
		/** Keep the panel open after a pick instead of closing like a native `<select>`. Implemented
		 *  as an internal `type="multiple"` Root — bits-ui only skips its auto-close for multi-select
		 *  — but `value` still resolves to a single `V | undefined`. */
		stayOpen?: boolean;
		value?: undefined | V;
	}

	let {
		class: className,
		form,
		getKey = (item: T) => String(item),
		getLabel = (item: T) => String(item),
		getValue = (item: T) => item as unknown as V,
		icon: Icon,
		items,
		label,
		name,
		nullable = false,
		onchange,
		optional,
		placeholder,
		renderOption,
		schema,
		stayOpen = false,
		value = $bindable(),
	}: Props = $props();

	// `as('select')` is reached only via the `form` branch; standalone uses local state — same
	// split `Combobox` uses.
	// svelte-ignore state_referenced_locally
	const view: FieldView = form
		? createFormView(form, name, 'select')
		: createLocalSelectView<undefined | V>({
				get: () => value,
				name,
				schema,
				write: (v) => (value = v),
			});

	const attrs = $derived(view.attrs);
	const required = $derived(!optional);
	const displayPlaceholder = $derived(
		label || required || !placeholder ? placeholder : `${placeholder} (Optional)`
	);

	const selectedKey = $derived(form ? String(attrs.value ?? '') : String(value ?? ''));
	const selectedItem = $derived(items.find((item) => getKey(item) === selectedKey));

	function handleChange(key: string) {
		const item = items.find((i) => getKey(i) === key);
		const typedValue = item === undefined ? undefined : getValue(item);
		view.set(typedValue);
		onchange?.(typedValue);
	}

	let transientKeys = $state<string[]>([]);
	function handleMultiChange(keys: string[]) {
		transientKeys = [];
		const key = keys[0];
		if (key !== undefined) handleChange(key);
	}

	const triggerClass = $derived(
		[
			'form-input',
			'form-select',
			Icon && 'form-input--with-icon',
			!selectedKey && 'form-select--placeholder',
			className,
		]
			.filter(Boolean)
			.join(' ')
	);
</script>

{#snippet triggerContent()}
	{#if Icon}
		<div class="form-input-icon"><Icon /></div>
	{/if}
	<span class="form-select-value">
		{#if selectedItem}
			<!-- Keyed on the selected item's own key — `renderOption` can render a per-item dynamic
			     component (e.g. an icon picked from a `Record<key, Component>` map); Svelte's
			     dynamic-tag diffing doesn't reliably detect "same slot, different component" across
			     a snippet re-invocation, so without this the old component can stick after a pick.
			     Forcing a full remount here is the one place that fixes every `renderOption` caller. -->
			{#key selectedKey}
				{#if renderOption}
					{@render renderOption(selectedItem)}
				{:else}
					{getLabel(selectedItem)}
				{/if}
			{/key}
		{:else}
			{displayPlaceholder}
		{/if}
	</span>
	<ChevronDown class="form-select-chevron" size={14} />
{/snippet}

{#snippet itemLabel(item: T, selected: boolean)}
	<span class="form-select-item-label">
		{#if renderOption}
			{@render renderOption(item)}
		{:else}
			{getLabel(item)}
		{/if}
	</span>
	{#if selected}<Check class="form-select-item-check" size={14} />{/if}
{/snippet}

<div class="form-field">
	{#if label}
		<FieldLabel for={attrs.name} {required}>{label}</FieldLabel>
	{/if}
	{#if stayOpen}
		<Select.Root
			allowDeselect={nullable}
			onValueChange={handleMultiChange}
			{required}
			type="multiple"
			value={transientKeys}
		>
			<Select.Trigger
				id={attrs.name}
				class={triggerClass}
				aria-invalid={attrs['aria-invalid'] as 'false' | 'true' | boolean | undefined}
			>
				{@render triggerContent()}
			</Select.Trigger>
			<Select.Portal>
				<Select.Content class="form-select-menu" sideOffset={4}>
					<Select.Viewport>
						{#each items as item (getKey(item))}
							<Select.Item class="form-select-item" label={getLabel(item)} value={getKey(item)}>
								{#snippet children({ selected }: { selected: boolean })}
									{@render itemLabel(item, selected)}
								{/snippet}
							</Select.Item>
						{/each}
					</Select.Viewport>
				</Select.Content>
			</Select.Portal>
		</Select.Root>
	{:else}
		<Select.Root
			allowDeselect={nullable}
			onValueChange={handleChange}
			{required}
			type="single"
			value={selectedKey}
		>
			<Select.Trigger
				id={attrs.name}
				class={triggerClass}
				aria-invalid={attrs['aria-invalid'] as 'false' | 'true' | boolean | undefined}
			>
				{@render triggerContent()}
			</Select.Trigger>
			<Select.Portal>
				<Select.Content class="form-select-menu" sideOffset={4}>
					<Select.Viewport>
						{#each items as item (getKey(item))}
							<Select.Item class="form-select-item" label={getLabel(item)} value={getKey(item)}>
								{#snippet children({ selected }: { selected: boolean })}
									{@render itemLabel(item, selected)}
								{/snippet}
							</Select.Item>
						{/each}
					</Select.Viewport>
				</Select.Content>
			</Select.Portal>
		</Select.Root>
	{/if}
	<!-- bits-ui `Select` has no native form control; this hidden input carries the
       selected value into FormData exactly as the old native <select name> did. -->
	<input name={attrs.name} type="hidden" value={selectedKey} />
	{#each view.issues() as issue (`${issue.path}`)}
		<p class="form-error">{issue.message}</p>
	{/each}
</div>
