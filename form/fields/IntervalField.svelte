<script lang="ts">
	import type { Snippet } from 'svelte';

	import { untrack } from 'svelte';

	import FieldLabel from '../FieldLabel.svelte';
	import NumberField from './NumberField.svelte';
	import SelectField from './SelectField.svelte';

	export type IntervalUnit = 'days' | 'hours' | 'minutes';

	const UNIT_SECONDS: Record<IntervalUnit, number> = { days: 86_400, hours: 3600, minutes: 60 };
	const UNIT_LABELS: Record<IntervalUnit, string> = {
		days: 'Days',
		hours: 'Hours',
		minutes: 'Minutes',
	};
	const UNIT_ORDER: IntervalUnit[] = ['days', 'hours', 'minutes']; // coarsest first

	/** Coarsest unit (among `units`) that divides `totalSeconds` exactly, so e.g. a stored 86400
	 *  shows as "1 Days" rather than "1440 Minutes". Falls back to minutes (rounded) — not just
	 *  "whatever's last in `units`" — for zero/blank or a value that doesn't divide evenly into
	 *  any of the allowed units; falls back further to the first allowed unit if minutes itself
	 *  isn't offered. */
	function secondsToParts(
		totalSeconds: number,
		units: IntervalUnit[]
	): { amount: number; unit: IntervalUnit } {
		for (const unit of UNIT_ORDER) {
			if (!units.includes(unit)) continue;
			if (totalSeconds > 0 && totalSeconds % UNIT_SECONDS[unit] === 0) {
				return { amount: totalSeconds / UNIT_SECONDS[unit], unit };
			}
		}
		const fallback = units.includes('minutes') ? 'minutes' : units[0];
		return { amount: Math.round(totalSeconds / UNIT_SECONDS[fallback]), unit: fallback };
	}

	let {
		children,
		disabled = false,
		name,
		optional,
		units = ['days', 'hours', 'minutes'],
		value = $bindable(0),
	}: {
		children?: Snippet;
		disabled?: boolean;
		/** Renders a hidden `<input>` under this name (the composed seconds value) so a real
		 *  `<Form>` picks it up on submit — omit for pure standalone `bind:value` use. */
		name?: string;
		optional?: boolean;
		/** Which units are offered, coarsest first (last one is the fallback when a value
		 *  doesn't divide evenly). Default: days/hours/minutes. */
		units?: IntervalUnit[];
		/** The composed interval, in seconds. */
		value?: number;
	} = $props();

	// `untrack` — only the initial `value` seeds the split; after that, local edits are the
	// source of truth and push back out via the `$effect` below (same seed-in/push-out shape as
	// `WarmupFields.svelte`'s local warmup state).
	const seeded = untrack(() => secondsToParts(value, units));
	let amount = $state(seeded.amount);
	let unit = $state<IntervalUnit>(seeded.unit);

	$effect(() => {
		if (amount < 0) amount = 0;
	});

	const seconds = $derived(Math.max(0, Math.trunc(amount || 0)) * UNIT_SECONDS[unit]);
	$effect(() => {
		value = seconds;
	});

	const fieldId = $derived(name ?? 'interval');
</script>

<div class="form-field">
	{#if children}
		<FieldLabel for="{fieldId}_amount" required={!optional}>{@render children()}</FieldLabel>
	{/if}
	<div class="flex gap-2">
		<div class="w-24">
			<NumberField name="{fieldId}_amount" {disabled} bind:value={amount} />
		</div>
		<div class="min-w-0 flex-1">
			<SelectField
				name="{fieldId}_unit"
				getLabel={(u) => UNIT_LABELS[u]}
				items={units}
				placeholder="Unit…"
				bind:value={unit}
			/>
		</div>
	</div>
	{#if name}
		<input {name} type="hidden" value={seconds} />
	{/if}
</div>
