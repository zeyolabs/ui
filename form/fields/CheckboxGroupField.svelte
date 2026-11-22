<script generics="Input extends RemoteFormInput, T" lang="ts">
	import type { RemoteForm, RemoteFormInput } from '$app/server';

	import CheckIcon from '@lucide/svelte/icons/check';
	import { Checkbox } from 'bits-ui';

	import { type FieldIssue, formChangeListener } from '../field-view.svelte.js';
	import FieldLabel from '../FieldLabel.svelte';

	/**
	 * A list of checkboxes for one `string[]` field of a remote form: the ticked items' values are
	 * submitted as the list (none ticked: the field is absent, so give the schema a `.default([])`).
	 */
	interface Props {
		description?: string;
		disabled?: boolean;
		form: Omit<RemoteForm<Input, unknown>, 'for'> | RemoteForm<Input, unknown>;
		getKey: (item: T) => string;
		getLabel: (item: T) => string;
		getValue: (item: T) => string;
		items: readonly T[];
		label?: string;
		name: keyof Input & string;
	}

	let { description, disabled, form, getKey, getLabel, getValue, items, label, name }: Props =
		$props();

	type ListField = {
		as(type: 'checkbox', value: string): Record<string, unknown> & { name: string };
		issues(): FieldIssue[] | undefined;
		set(input: string[]): unknown;
		value(): string[] | undefined;
	};

	const field = $derived((form.fields as unknown as Record<string, ListField>)[name]);
	const notifyChange = formChangeListener();

	function toggle(value: string, on: boolean) {
		const current = field.value() ?? [];
		field.set(on ? [...new Set([...current, value])] : current.filter((v) => v !== value));
		notifyChange?.();
	}
</script>

<fieldset class="form-checkbox-group" {disabled}>
	{#if label}
		<legend class="form-label">{label}</legend>
	{/if}
	{#each items as item (getKey(item))}
		{const value = $derived(getValue(item))}
		{const attrs = $derived(field.as('checkbox', value))}
		{const id = $derived(`${attrs.name}-${getKey(item)}`)}
		<div class="form-checkbox-row">
			<Checkbox.Root
				{id}
				name={attrs.name}
				class="form-checkbox"
				checked={attrs.checked as boolean}
				{disabled}
				onCheckedChange={(v) => toggle(value, v === true)}
				{value}
			>
				{#snippet children({ checked })}
					{#if checked}
						<CheckIcon class="form-checkbox-icon" />
					{/if}
				{/snippet}
			</Checkbox.Root>
			<FieldLabel class="form-checkbox-label" for={id}>{getLabel(item)}</FieldLabel>
		</div>
	{/each}
	{#if description}
		<p class="form-description">{description}</p>
	{/if}
	{#each field.issues() ?? [] as issue (`${issue.path}`)}
		<p class="form-error">{issue.message}</p>
	{/each}
</fieldset>

<style>
	.form-checkbox-group {
		display: grid;
		gap: 6px;
		border: 0;
		margin: 0;
		padding: 0;
	}
</style>
