<script generics="V" lang="ts">
	import type { Snippet } from 'svelte';

	import { setContext } from 'svelte';

	type Props = {
		'aria-invalid'?: 'false' | 'true' | boolean;
		children: Snippet;
		class?: string;
		disabled?: boolean;
		onChange?: (value: V) => void;
		readonly?: boolean;
		value?: V;
		vertical?: boolean;
	};

	let {
		'aria-invalid': ariaInvalid,
		children,
		class: className,
		disabled = false,
		onChange,
		readonly = false,
		value = $bindable(undefined),
		vertical = false,
	}: Props = $props();

	setContext(Symbol.for('tab'), {
		get disabled() {
			return disabled;
		},
		isActive: (v: unknown) => value === v,
		get readonly() {
			return readonly;
		},
		select(v: unknown) {
			value = v as V;
			onChange?.(v as V);
		},
	});
</script>

<div
	class={[
		'tab',
		vertical && 'tab--vertical',
		disabled && 'tab--disabled',
		!disabled && readonly && 'tab--readonly',
		ariaInvalid && 'tab--invalid',
		className,
	]
		.filter(Boolean)
		.join(' ')}
>
	{@render children()}
</div>
