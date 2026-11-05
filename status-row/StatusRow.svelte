<script lang="ts">
	import type { BackgroundColorClass, StatusColor } from '../schema';
	import type { StatusRowHeight, TickDensity, TickLabelSize } from './types';

	export type StatusRowSlotValue = {
		color: StatusColor;
		label?: string;
	};

	// Shared by every slot — real, empty, interactive, or not.
	const baseSlotClass = 'min-w-0 flex-1 rounded-[1px]';

	const heightClass: Record<StatusRowHeight, string> = {
		10: 'h-[10px]',
		20: 'h-[20px]',
		30: 'h-[30px]',
		40: 'h-[40px]',
		50: 'h-[50px]',
	};

	const tickLabelSizePresets: Record<TickLabelSize, { labelClass: string; spacingClass: string }> =
		{
			large: { labelClass: 'sm', spacingClass: 'mt-1.5' },
			medium: { labelClass: 'xs', spacingClass: 'mt-1' },
			small: { labelClass: 'xs', spacingClass: 'mt-0.5' },
		};

	const tickDensityPresets: Record<TickDensity, { markClass: string; tickCount: number }> = {
		dense: { markClass: 'h-1 w-px', tickCount: 8 },
		light: { markClass: 'h-1 w-px', tickCount: 3 },
		normal: { markClass: 'h-1.5 w-px', tickCount: 5 },
	};

	const range = (length: number) => [...Array(length).keys()];

	// Converts between a slot's array position and its actual key, anchored at `latestKey` (the
	// newest real key, at array position maxSlots - 1) and spaced by `slotInterval` — shared by slot
	// placement and tick-label computation so both agree on where a given timestamp falls.
	const indexToKey = (index: number, latestKey: number, slotInterval: number) =>
		latestKey - (maxSlots - 1 - index) * slotInterval;
	const keyToIndex = (key: number, latestKey: number, slotInterval: number) =>
		maxSlots - 1 - Math.round((latestKey - key) / slotInterval);

	/**
	 * A fixed-width row of `maxSlots` status-colored segments, right-aligned to the newest key, with
	 * an optional axis below. `slots`' keys must form an arithmetic sequence with common difference:
	 *
	 * `slotInterval` — key(i+1) = key(i) + slotInterval
	 *
	 *  A position with no matching key renders as an empty placeholder.
	 */
	let {
		backgroundClass = {
			error: 'bg-[var(--err)]',
			ok: 'bg-[var(--ok)]',
			warning: 'bg-[var(--w)]',
		},
		formatTick,
		height = 30,
		maxSlots = 100,
		onSelect,
		selected,
		slotInterval,
		slots,
		tickDensity = 'normal',
		tickLabelSize = 'medium',
	}: {
		// Override to point each status at different design tokens; see BackgroundColorClass.
		backgroundClass?: Record<StatusColor, BackgroundColorClass>;
		// slot key -> tick label
		// omit/null to render no axis at all
		formatTick?: ((key: number) => string) | null;
		height?: StatusRowHeight;
		maxSlots?: number;
		// slot key -> onSelect callback
		// omit/null to render slots as non-interactive
		onSelect?: ((key: number) => void) | null;
		selected?: number;
		// The expected gap between consecutive slot keys (e.g. the bucket interval in ms)
		slotInterval: number;
		// slot key -> (color, label)
		// the slot key should correspond exactly with onSelect and formatTick and does not imply the actual
		// relative position of the rendered slots due to potential gaps
		slots: Map<number, StatusRowSlotValue>;
		tickDensity?: TickDensity;
		tickLabelSize?: TickLabelSize;
	} = $props();

	const orderedSlots = $derived([...slots.entries()].sort(([a], [b]) => a - b));

	// One entry per rendered position (length `maxSlots`): undefined for empty positions (no history
	// yet, or a gap in the data), the real [key, value] pair everywhere else.
	const paddedSlots = $derived.by(() => {
		const result: ([number, StatusRowSlotValue] | undefined)[] = Array(maxSlots).fill(undefined);
		if (orderedSlots.length === 0) return result;
		const [latestKey] = orderedSlots[orderedSlots.length - 1];
		for (const entry of orderedSlots) {
			const arrayIndex = keyToIndex(entry[0], latestKey, slotInterval);
			if (arrayIndex >= 0 && arrayIndex < maxSlots) result[arrayIndex] = entry;
		}
		return result;
	});

	// `tickDensity`'s tick count, evenly spaced across the full `maxSlots` grid (including any empty
	// left-padding).
	const ticks = $derived.by(() => {
		const tickCount = tickDensityPresets[tickDensity].tickCount;
		if (!formatTick || orderedSlots.length === 0 || tickCount < 2 || maxSlots < 2) return [];
		const [latestKey] = orderedSlots[orderedSlots.length - 1];
		return range(tickCount).map((tickNumber) => {
			const fractionAcrossGrid = tickNumber / (tickCount - 1);
			const slotIndex = Math.round(fractionAcrossGrid * (maxSlots - 1));
			return {
				label: formatTick(indexToKey(slotIndex, latestKey, slotInterval)),
				positionPercent: (slotIndex / (maxSlots - 1)) * 100,
			};
		});
	});
</script>

<div>
	<div class="flex {heightClass[height]} items-stretch gap-px">
		{#each range(maxSlots) as index (index)}
			{@const slot = paddedSlots[index]}
			{#if slot}
				{@const [key, value] = slot}
				{@const isDeselected = selected !== undefined && selected !== key}
				{@const slotColor = backgroundClass[value.color]}
				{#if onSelect}
					<button
						class="{baseSlotClass} cursor-pointer {slotColor} transition-opacity hover:opacity-80"
						class:opacity-35={isDeselected}
						aria-label={value.label}
						onclick={() => onSelect(key)}
						type="button"
					></button>
				{:else}
					<div
						class="{baseSlotClass} {slotColor}"
						class:opacity-35={isDeselected}
						title={value.label}
					></div>
				{/if}
			{:else}
				<div class="{baseSlotClass} bg-[var(--bds)] opacity-40"></div>
			{/if}
		{/each}
	</div>
	<!-- Axis: tick marks + labels below the bar -->
	{#if ticks.length > 0}
		<div class="relative h-3 {tickLabelSizePresets[tickLabelSize].spacingClass}">
			{#each ticks as tick, index (index)}
				<!-- tick mark -->
				<span
					style="--tick-left: {tick.positionPercent}%;"
					class="absolute top-0 left-[var(--tick-left)] w-px -translate-x-1/2 bg-[var(--bd)] {tickDensityPresets[
						tickDensity
					].markClass}"
				></span>
				<!-- tick label -->
				<span
					style="--tick-left: {tick.positionPercent}%;"
					class="absolute top-2 left-[var(--tick-left)] tabular-nums whitespace-nowrap text-[var(--txt)] {tickLabelSizePresets[
						tickLabelSize
					].labelClass} {index === 0
						? 'translate-x-0'
						: index === ticks.length - 1
							? '-translate-x-full'
							: '-translate-x-1/2'}"
				>
					{tick.label}
				</span>
			{/each}
		</div>
	{/if}
</div>
