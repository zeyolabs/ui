<script lang="ts">
	import type { Component } from 'svelte';
	import type { HTMLInputAttributes, HTMLInputTypeAttribute } from 'svelte/elements';

	type InputType = Exclude<HTMLInputTypeAttribute, 'file'>;

	type Props = Omit<HTMLInputAttributes, 'files' | 'size' | 'type'> & {
		class?: string;
		icon?: Component;
		iconPosition?: 'center' | 'top';
		size?: 'sm';
		type?: InputType;
		value?: string;
	};

	let {
		class: className,
		icon,
		iconPosition = 'center',
		size,
		type = 'text',
		value = $bindable(),
		...rest
	}: Props = $props();
</script>

{#if icon}
	{@const Icon = icon}
	<div class="form-input-wrapper" class:sm={size === 'sm'}>
		<div class="form-input-icon" class:form-input-icon--top={iconPosition === 'top'}>
			<Icon />
		</div>
		<input
			class={['form-input', size, 'form-input--with-icon', className].filter(Boolean).join(' ')}
			{type}
			bind:value
			{...rest}
		/>
	</div>
{:else}
	<input
		class={['form-input', size, className].filter(Boolean).join(' ')}
		{type}
		bind:value
		{...rest}
	/>
{/if}
