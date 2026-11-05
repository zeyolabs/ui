<script lang="ts">
	import type { Snippet } from 'svelte';

	import { BG_CLASS, type Color, COLOR_CLASS } from './color';

	type Size = 'default' | 'lg' | 'sm' | 'xl' | 'xs';

	let {
		bg,
		bold = false,
		centerBelow = false,
		centered = false,
		children,
		clamp,
		class: className = '',
		color,
		maxWidth,
		mono = false,
		size = 'default',
		title,
		truncate = false,
		uppercase = false,
	}: {
		/** Tinted chip background behind the text (e.g. flagging one invalid cell/value without
		 * tinting its whole row) — same `Color` set as `color`. */
		bg?: Color;
		bold?: boolean;
		/** text-align: center + margin-inline: auto below 960px — for a maxWidth block that
		 * sits beside a side panel on desktop and should become a centered block once that
		 * layout stacks. */
		centerBelow?: boolean;
		centered?: boolean;
		children: Snippet;
		clamp?: number;
		class?: string;
		color?: Color;
		maxWidth?: string;
		/** Monospace font. */
		mono?: boolean;
		size?: Size;
		/** Native tooltip. */
		title?: string;
		/** Single-line ellipsis. Needs a bounded width from context (a flex child needs its own
		 * `min-width: 0`/`flex: 1` via `class`, or pass `maxWidth`). Also forces
		 * `display: inline-block` — a plain `<span>` is `inline` and ignores `max-width`
		 * entirely, so without it the width constraint (and thus the ellipsis) would be a no-op.
		 * Harmless when this `Span` is itself a flex/grid item — those get blockified either way. */
		truncate?: boolean;
		/** Uppercase + widened letter-spacing — the eyebrow-label pairing. For the fuller
		 * kicker-above-a-heading pattern, prefer `@zeyolabs/ui/eyebrow/Eyebrow.svelte`. */
		uppercase?: boolean;
	} = $props();

	const sizeClass = $derived(size === 'default' ? '' : size);
	const inlineStyle = $derived(
		`${maxWidth ? `max-width:${maxWidth};` : ''}${clamp ? `display:-webkit-box;-webkit-line-clamp:${clamp};line-clamp:${clamp};-webkit-box-orient:vertical;overflow:hidden;` : ''}`
	);
</script>

<span
	style={inlineStyle}
	class="{sizeClass} {bold ? 'bold' : ''} {centered ? 'text-center' : ''} {color
		? COLOR_CLASS[color]
		: ''} {bg ? BG_CLASS[bg] : ''} {className}"
	class:center-below={centerBelow}
	class:font-mono={mono}
	class:inline-block={truncate}
	class:tracking-wider={uppercase}
	class:truncate
	class:uppercase
	{title}
>
	{@render children()}
</span>

<style>
	@media (max-width: 960px) {
		.center-below {
			text-align: center;
			margin-inline: auto;
		}
	}
</style>
