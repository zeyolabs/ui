<script lang="ts">
	import type { Snippet } from 'svelte';

	import type { BadgeColor } from './color';

	let {
		children,
		color = 'secondary',
		dot = true,
		plain = false,
	}: {
		children: Snippet;
		color?: BadgeColor;
		/** The small color dot before the label; pass `false` for a plain pill. */
		dot?: boolean;
		/** Dot + label with no pill: no background, border or padding, and the label keeps the
		 *  surrounding text color — only the dot carries the badge color. */
		plain?: boolean;
	} = $props();

	// v2-parity pill shape: a translucent tint of `c` (not a solid pastel) plus a border at
	// partial opacity of the same color — see color-mix usage below. `neutral`/`secondary` keep
	// their existing theme-aware surface since they're not a "status" color to tint.
	const styles: Record<BadgeColor, { bg: string; border: string; c: string }> = {
		error: {
			bg: 'color-mix(in srgb, var(--badge-error) 7%, transparent)',
			border: 'color-mix(in srgb, var(--badge-error) 25%, transparent)',
			c: 'var(--badge-error)',
		},
		info: {
			bg: 'color-mix(in srgb, var(--badge-info) 7%, transparent)',
			border: 'color-mix(in srgb, var(--badge-info) 25%, transparent)',
			c: 'var(--badge-info)',
		},
		// Higher-contrast than `secondary` — full-strength text + a real border, for a chip that
		// needs to stay legible (e.g. an active-filter value), not a subtle status indicator.
		neutral: { bg: 'var(--sf)', border: 'var(--bd)', c: 'var(--tx)' },
		purple: {
			bg: 'color-mix(in srgb, var(--badge-purple) 7%, transparent)',
			border: 'color-mix(in srgb, var(--badge-purple) 25%, transparent)',
			c: 'var(--badge-purple)',
		},
		secondary: { bg: 'var(--sf)', border: 'var(--bd)', c: 'var(--txt)' },
		success: {
			bg: 'color-mix(in srgb, var(--badge-success) 7%, transparent)',
			border: 'color-mix(in srgb, var(--badge-success) 25%, transparent)',
			c: 'var(--badge-success)',
		},
		warning: {
			bg: 'color-mix(in srgb, var(--badge-warning) 7%, transparent)',
			border: 'color-mix(in srgb, var(--badge-warning) 25%, transparent)',
			c: 'var(--badge-warning)',
		},
	};

	const st = $derived(styles[color]);
</script>

{#if plain}
	<span class="inline-flex items-center gap-1.5 whitespace-nowrap">
		{#if dot}<span style="background: {st.c};" class="size-1.5 shrink-0 rounded-full"></span>{/if}
		{@render children()}
	</span>
{:else}
	<span
		style="background: {st.bg}; color: {st.c}; letter-spacing: -0.01em; border: 1px solid {st.border};"
		class="inline-flex items-center gap-1 px-[7px] py-[1.75px] text-[11px] rounded-full whitespace-nowrap"
	>
		{#if dot}<span style="background: {st.c};" class="w-1.25 h-1.25 shrink-0 rounded-full"
			></span>{/if}
		{@render children()}
	</span>
{/if}
