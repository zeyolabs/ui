<script lang="ts">
	import type { Snippet } from 'svelte';

	import { BG_CLASS, type Color, COLOR_CLASS } from './color';

	type Level = 1 | 2 | 3 | 4 | 5 | 6;

	let {
		bg,
		bold = false,
		centerBelow = false,
		centered = false,
		children,
		clamp,
		class: className = '',
		color,
		level,
		maxWidth,
		truncate = false,
	}: {
		/** Tinted chip background behind the text (e.g. flagging one invalid cell/value without
		 * tinting its whole row) — same `Color` set as `color`. */
		bg?: Color;
		bold?: boolean;
		/** text-align: center + margin-inline: auto below 960px — for a maxWidth heading that
		 * sits beside a side panel on desktop and should become a centered block once that
		 * layout stacks. */
		centerBelow?: boolean;
		centered?: boolean;
		children: Snippet;
		clamp?: number;
		class?: string;
		color?: Color;
		level: Level;
		maxWidth?: string;
		/** Single-line ellipsis. Needs a bounded width from context (a flex child needs its own
		 * `min-width: 0`/`flex: 1` via `class`, or pass `maxWidth`). Clips only the inline axis —
		 * unlike Tailwind's `truncate`, the vertical axis stays `visible` so descenders (DM Sans's
		 * glyph box is taller than the tight h1/h2 line-height) don't get cropped by the clip box. */
		truncate?: boolean;
	} = $props();

	const tag = $derived(`h${level}` as const);
	const inlineStyle = $derived(
		`${maxWidth ? `max-width:${maxWidth};` : ''}${clamp ? `display:-webkit-box;-webkit-line-clamp:${clamp};line-clamp:${clamp};-webkit-box-orient:vertical;overflow:hidden;` : ''}`
	);
</script>

<svelte:element
	this={tag}
	style={inlineStyle}
	class="{bold ? 'bold' : ''} {centered ? 'text-center' : ''} {color ? COLOR_CLASS[color] : ''} {bg
		? BG_CLASS[bg]
		: ''} {className}"
	class:center-below={centerBelow}
	class:truncate-title={truncate}
>
	{@render children()}
</svelte:element>

<style>
	@media (max-width: 960px) {
		.center-below {
			text-align: center;
			margin-inline: auto;
		}
	}

	.truncate-title {
		overflow-x: clip;
		overflow-y: visible;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
