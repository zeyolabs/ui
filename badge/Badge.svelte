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
			bg: 'color-mix(in srgb, #DC2626 7%, transparent)',
			border: 'color-mix(in srgb, #DC2626 25%, transparent)',
			c: '#DC2626',
		},
		info: {
			bg: 'color-mix(in srgb, #2563EB 7%, transparent)',
			border: 'color-mix(in srgb, #2563EB 25%, transparent)',
			c: '#2563EB',
		},
		// Higher-contrast than `secondary` — full-strength text + a real border, for a chip that
		// needs to stay legible (e.g. an active-filter value), not a subtle status indicator.
		neutral: { bg: 'var(--sf)', border: 'var(--bd)', c: 'var(--tx)' },
		purple: {
			bg: 'color-mix(in srgb, #7C3AED 7%, transparent)',
			border: 'color-mix(in srgb, #7C3AED 25%, transparent)',
			c: '#7C3AED',
		},
		secondary: { bg: 'var(--sf)', border: 'var(--bd)', c: 'var(--txt)' },
		success: {
			bg: 'color-mix(in srgb, #059669 7%, transparent)',
			border: 'color-mix(in srgb, #059669 25%, transparent)',
			c: '#059669',
		},
		warning: {
			bg: 'color-mix(in srgb, #D97706 7%, transparent)',
			border: 'color-mix(in srgb, #D97706 25%, transparent)',
			c: '#D97706',
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
