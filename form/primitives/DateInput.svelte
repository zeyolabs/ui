<script lang="ts">
	import type { Component } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	import { CalendarDate } from '@internationalized/date';
	import { Datetime } from '@zeyolabs/kit/utils/datetime';

	import IconInputWrapper from './IconInputWrapper.svelte';
	import Input from './Input.svelte';

	type Props = Omit<HTMLInputAttributes, 'files' | 'size' | 'type' | 'value'> & {
		class?: string;
		icon?: Component;
		showDate?: boolean;
		value?: CalendarDate;
	};
	let { class: className, icon, showDate = false, value = $bindable(), ...rest }: Props = $props();

	function get(): string {
		if (!value) return '';
		const yyyy = String(value.year).padStart(4, '0');
		const mm = String(value.month).padStart(2, '0');
		const dd = String(value.day).padStart(2, '0');
		return `${yyyy}-${mm}-${dd}`;
	}

	function set(raw: string) {
		if (!raw) {
			value = undefined;
			return;
		}
		const [yyyy, mm, dd] = raw.split('-').map(Number);
		if (yyyy && mm && dd) {
			value = new CalendarDate(yyyy, mm, dd);
		}
	}
</script>

<IconInputWrapper {icon}>
	{#snippet children({ class: iconClass })}
		<Input
			class={[iconClass, className].filter(Boolean).join(' ')}
			type="date"
			bind:value={get, set}
			{...rest}
		/>
	{/snippet}
</IconInputWrapper>
{#if showDate && value !== undefined}
	<p class="text-[13px] italic">{Datetime.formatDateFull(value)}</p>
{/if}
