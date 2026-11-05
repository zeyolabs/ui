<script lang="ts">
	import type { CssVariable, Opacity, Percentage } from '../schema';
	import type { PercentageRingSize } from './types';

	import { toOpacity } from '../schema';

	const sizePresets: Record<PercentageRingSize, { size: number; strokeWidth: number }> = {
		large: { size: 160, strokeWidth: 18 },
		medium: { size: 108, strokeWidth: 14 },
		small: { size: 56, strokeWidth: 8 },
		tiny: { size: 24, strokeWidth: 4 },
	};

	/**
	 * A bare ring: a dimmed track plus a filled arc for `percentage`, with formatted text centered
	 * inside.
	 */
	let {
		color,
		formatPercentage = (percentage) => `${Math.round(percentage)}%`,
		percentage,
		size = 'medium',
		trackColor = 'var(--bd)',
		trackOpacity = toOpacity(0.25),
	}: {
		color: CssVariable;
		// null hides the label entirely; omit for the default round-and-% format.
		formatPercentage?: ((percentage: Percentage) => string) | null;
		percentage: Percentage;
		size?: PercentageRingSize;
		trackColor?: CssVariable;
		trackOpacity?: Opacity;
	} = $props();

	const resolvedSize = $derived(sizePresets[size].size);
	const strokeWidth = $derived(sizePresets[size].strokeWidth);
	const center = $derived(resolvedSize / 2);
	const radius = $derived((resolvedSize - strokeWidth) / 2);
	const circumference = $derived(2 * Math.PI * radius);
	// Scales with `resolvedSize` so the label stays proportionate at any ring size.
	const fontSize = $derived(resolvedSize * (24 / 108));
</script>

<svg height={resolvedSize} viewBox="0 0 {resolvedSize} {resolvedSize}" width={resolvedSize}>
	<circle
		cx={center}
		cy={center}
		fill="none"
		opacity={trackOpacity}
		r={radius}
		stroke={trackColor}
		stroke-width={strokeWidth}
	/>
	<circle
		cx={center}
		cy={center}
		fill="none"
		r={radius}
		stroke={color}
		stroke-dasharray="{(percentage / 100) * circumference} {circumference}"
		stroke-linecap="round"
		stroke-width={strokeWidth}
		transform="rotate(-90 {center} {center})"
	/>
	{#if formatPercentage}
		<text
			style="fill: var(--tx); font-size: {fontSize}px; font-weight: 400;"
			dominant-baseline="central"
			text-anchor="middle"
			x="50%"
			y="50%"
		>
			{formatPercentage(percentage)}
		</text>
	{/if}
</svg>
