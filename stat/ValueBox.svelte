<!--
  Button-height bordered box showing one value, optionally captioned — sits inline beside a
  Button (a payout amount, a countdown). `emphasis` draws it as the selected/result value.
-->
<script lang="ts">
	import Span from '../text/Span.svelte';

	let {
		emphasis = false,
		label,
		value,
	}: {
		emphasis?: boolean;
		/** Small uppercase caption under the value. */
		label?: string;
		value: string;
	} = $props();
</script>

<div
	class="flex flex-col items-center justify-center h-10 px-3.5 rounded-md box-border select-none {label
		? 'min-w-24'
		: 'min-w-32'} {emphasis ? 'border-2 border-(--tx) bg-(--ch)' : 'border border-(--bd)'}"
>
	{#if label}
		<Span class="tracking-[-0.2px] leading-[1.2] tabular-nums">{value}</Span>
		<Span class="xs uppercase tracking-wider leading-[1.2]" color="tertiary">{label}</Span>
	{:else}
		<Span
			class="tracking-[-0.3px] tabular-nums"
			bold={emphasis}
			color={emphasis ? undefined : 'secondary'}
			size="lg"
		>
			{value}
		</Span>
	{/if}
</div>
