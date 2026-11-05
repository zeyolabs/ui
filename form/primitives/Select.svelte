<script generics="I, V, K extends number | string" lang="ts">
	import type { Component } from 'svelte';

	import Check from '@lucide/svelte/icons/check';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import { Select as BitsSelect } from 'bits-ui';

	import IconInputWrapper from './IconInputWrapper.svelte';

	type Props = {
		'aria-describedby'?: string;
		'aria-invalid'?: 'true';
		'aria-required'?: 'true';
		class?: string;
		getKey: (item: I) => K;
		getLabel: (item: I) => string;
		getValue: (item: I) => V;
		icon?: Component;
		id?: string;
		items: readonly I[];
		label?: string;
		name?: string;
		onchange?: (value: undefined | V) => void;
		placeholder: string;
		value?: V;
	};
	let {
		class: className,
		getKey: _getKey,
		getLabel,
		getValue,
		icon,
		items,
		label,
		onchange,
		placeholder,
		value = $bindable(undefined),
		...rest
	}: Props = $props();

	function getKey(item: I): string {
		return _getKey(item).toString();
	}

	let keyToItem: Map<string, I> = $derived(
		new Map(items.map((item) => [getKey(item), item] as const))
	);
	let valueToKey: Map<V, string> = $derived(
		new Map(items.map((item) => [getValue(item), getKey(item)] as const))
	);

	// bits-ui `Select` uses this {value,label} list for typeahead + autofill matching.
	let bitsItems = $derived(items.map((item) => ({ label: getLabel(item), value: getKey(item) })));

	let selectedKey: string = $derived(value === undefined ? '' : (valueToKey.get(value) ?? ''));
	let selectedItem: I | undefined = $derived(selectedKey ? keyToItem.get(selectedKey) : undefined);
	let selectedLabel: string | undefined = $derived(
		selectedItem === undefined ? undefined : getLabel(selectedItem)
	);

	function handleChange(key: string) {
		const item = keyToItem.get(key);
		const newValue = item === undefined ? undefined : getValue(item);
		value = newValue;
		onchange?.(newValue);
	}
</script>

<IconInputWrapper {icon}>
	{#snippet children({ class: iconClass })}
		<BitsSelect.Root
			items={bitsItems}
			onValueChange={handleChange}
			type="single"
			value={selectedKey}
		>
			<BitsSelect.Trigger
				class={[
					'form-input',
					'form-select',
					iconClass,
					!selectedKey && 'form-select--placeholder',
					className,
				]
					.filter(Boolean)
					.join(' ')}
				{...rest}
			>
				<span class="form-select-value">{selectedLabel ?? placeholder}</span>
				<ChevronDown class="form-select-chevron" size={14} />
			</BitsSelect.Trigger>
			<BitsSelect.Portal>
				<BitsSelect.Content class="form-select-menu" sideOffset={4}>
					<BitsSelect.Viewport>
						{#if label}
							<BitsSelect.Group>
								<BitsSelect.GroupHeading class="form-select-group-heading">
									{label}
								</BitsSelect.GroupHeading>
								{#each items as item (getKey(item))}
									<BitsSelect.Item
										class="form-select-item"
										label={getLabel(item)}
										value={getKey(item)}
									>
										{#snippet children({ selected })}
											<span class="form-select-item-label">{getLabel(item)}</span>
											{#if selected}
												<Check class="form-select-item-check" size={14} />
											{/if}
										{/snippet}
									</BitsSelect.Item>
								{/each}
							</BitsSelect.Group>
						{:else}
							{#each items as item (getKey(item))}
								<BitsSelect.Item
									class="form-select-item"
									label={getLabel(item)}
									value={getKey(item)}
								>
									{#snippet children({ selected })}
										<span class="form-select-item-label">{getLabel(item)}</span>
										{#if selected}
											<Check class="form-select-item-check" size={14} />
										{/if}
									{/snippet}
								</BitsSelect.Item>
							{/each}
						{/if}
					</BitsSelect.Viewport>
				</BitsSelect.Content>
			</BitsSelect.Portal>
		</BitsSelect.Root>
		{#if rest.name}
			<input name={rest.name as string} type="hidden" value={selectedKey} />
		{/if}
	{/snippet}
</IconInputWrapper>
