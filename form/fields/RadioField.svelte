<script lang="ts">
	import type { Snippet } from 'svelte';

	import FieldLabel from '../FieldLabel.svelte';

	// One radio option. Radios that share a `name` form a group: the browser keeps only one selected
	// and moves between them with the arrow keys. `group` holds the selected option's `value`, so a
	// parent can render the options anywhere (in a table row, next to other content), not only
	// inside one wrapper. Looks and spaces like `CheckboxField`.
	interface Props {
		children?: Snippet;
		description?: string;
		disabled?: boolean;
		/** The selected option's `value` in this group. */
		group?: string;
		/** Group name shared by every option. */
		name: string;
		onChange?: (value: string) => void;
		/** This option's value. */
		value: string;
	}

	let {
		children,
		description,
		disabled,
		group = $bindable(),
		name,
		onChange,
		value,
	}: Props = $props();

	const id = $derived(`${name}-${value}`);
</script>

<div class="form-checkbox-wrapper">
	<div class="form-checkbox-row">
		<input
			{id}
			{name}
			class="form-radio"
			checked={group === value}
			{disabled}
			onchange={() => {
				group = value;
				onChange?.(value);
			}}
			type="radio"
			{value}
		/>
		{#if children}
			<FieldLabel class="form-checkbox-label" for={id} required={false}>
				{@render children()}
			</FieldLabel>
		{/if}
	</div>
	{#if description}
		<p class="form-description form-description--indented">{description}</p>
	{/if}
</div>
