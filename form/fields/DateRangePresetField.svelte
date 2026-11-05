<script lang="ts" module>
	import type { CalendarDate } from '@internationalized/date';

	export type DateRangePresetOption<Value extends string = string> = {
		days: number;
		label: string;
		value: Value;
	};
	export type DateRangeValue<Preset extends string = string> =
		{ from: CalendarDate; kind: 'custom'; to: CalendarDate } | { kind: 'preset'; preset: Preset };
</script>

<script generics="P extends string" lang="ts">
	import { parseDate } from '@internationalized/date';
	import { Datetime, ServerDt } from '@zeyolabs/kit/utils/datetime';
	import { untrack } from 'svelte';

	import DateRangeField from './DateRangeField.svelte';
	import SelectField from './SelectField.svelte';

	interface Props {
		/** Preset selected on mount, and used as the fallback if a custom range is invalid.
		 *  Defaults to the first preset. */
		initial?: P;
		/** Widest span (in days) a custom range may cover. A wider pick has its start date pulled
		 *  forward to fit — the same silent-correction this field already applies to an inverted
		 *  range — so the emitted value never violates a matching server-side schema cap. */
		maxSpanDays?: number;
		presets: DateRangePresetOption<P>[];
		value?: DateRangeValue<P>;
	}

	let { initial, maxSpanDays, presets, value = $bindable() }: Props = $props();

	// svelte-ignore state_referenced_locally
	const fallback = (initial ?? presets[0]?.value) as P;
	let selected = $state<'custom' | P>(fallback);
	// svelte-ignore state_referenced_locally
	let customFrom = $state(
		Datetime.formatDateISO(ServerDt.today().subtract({ days: presets[0]?.days ?? 7 }))
	);
	let customTo = $state(Datetime.formatDateISO(ServerDt.today()));

	function applyPreset(v: 'custom' | P | undefined) {
		const preset = presets.find((p) => p.value === v);
		if (!preset) return;
		customTo = Datetime.formatDateISO(ServerDt.today());
		customFrom = Datetime.formatDateISO(ServerDt.today().subtract({ days: preset.days }));
	}

	const selectItems = $derived([
		...presets.map((p) => ({ label: p.label, value: p.value as 'custom' | P })),
		{ label: 'Custom range…', value: 'custom' as const },
	]);

	function sameRange(a: DateRangeValue<P> | undefined, b: DateRangeValue<P>): boolean {
		if (!a) return false;
		if (a.kind === 'preset') return b.kind === 'preset' && a.preset === b.preset;
		return b.kind === 'custom' && a.from.compare(b.from) === 0 && a.to.compare(b.to) === 0;
	}

	$effect(() => {
		let next: DateRangeValue<P>;
		if (selected === 'custom') {
			let from = parseDate(customFrom);
			const to = parseDate(customTo);
			if (from.compare(to) > 0) {
				next = { kind: 'preset', preset: fallback };
			} else {
				if (maxSpanDays !== undefined) {
					const clamped = Datetime.clampSpanStart(from, to, maxSpanDays);
					if (clamped.compare(from) !== 0) {
						from = clamped;
						// Reflect the applied start date in the field; the write settles on the next
						// effect run (the clamped span no longer exceeds the limit).
						customFrom = Datetime.formatDateISO(clamped);
					}
				}
				next = { from, kind: 'custom', to };
			}
		} else {
			next = { kind: 'preset', preset: selected };
		}
		// Write only on a real change. An identical-content write is still a NEW object, and
		// consumers deriving off the bound value re-run on identity — on mount that re-fired
		// every query keyed on the range even though it never changed.
		const current = untrack(() => value);
		if (!sameRange(current, next)) value = next;
	});
</script>

<div class="form-daterange-preset flex items-center gap-2">
	<div class="min-w-40">
		<SelectField
			name="rangePreset"
			getKey={(i) => i.value}
			getLabel={(i) => i.label}
			getValue={(i) => i.value}
			items={selectItems}
			onchange={applyPreset}
			placeholder="Date range"
			bind:value={selected}
		/>
	</div>
	{#if selected === 'custom'}
		<DateRangeField
			endName="to"
			startName="from"
			bind:startValue={customFrom}
			bind:endValue={customTo}
		/>
	{/if}
</div>

<style>
	.form-daterange-preset :global(.form-field) {
		margin: 0;
	}
</style>
