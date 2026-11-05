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
		href,
		maxWidth,
		mono = false,
		rel,
		size = 'default',
		target,
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
		/** Renders as an `<a>` instead of `<p>` when set. */
		href?: string;
		maxWidth?: string;
		/** Monospace font. */
		mono?: boolean;
		rel?: string;
		size?: Size;
		target?: string;
		/** Native tooltip. */
		title?: string;
		/** Single-line ellipsis. Needs a bounded width from context (a flex child needs its own
		 * `min-width: 0`/`flex: 1` via `class`, or pass `maxWidth`). When `href` is set (renders
		 * `<a>`, `inline` by default), `truncate` also forces `display: inline-block` so the
		 * width constraint actually takes effect — inline elements ignore max-width entirely. */
		truncate?: boolean;
		/** Uppercase + widened letter-spacing — the eyebrow-label pairing. For the fuller
		 * kicker-above-a-heading pattern, prefer `@zeyolabs/ui/eyebrow/Eyebrow.svelte`. */
		uppercase?: boolean;
	} = $props();

	const tag = $derived(href ? 'a' : 'p');
	const sizeClass = $derived(size === 'default' ? '' : size);
	const inlineStyle = $derived(
		`${maxWidth ? `max-width:${maxWidth};` : ''}${clamp ? `display:-webkit-box;-webkit-line-clamp:${clamp};line-clamp:${clamp};-webkit-box-orient:vertical;overflow:hidden;` : ''}`
	);
</script>

<svelte:element
	this={tag}
	style={inlineStyle}
	class="{sizeClass} {bold ? 'bold' : ''} {centered ? 'text-center' : ''} {color
		? COLOR_CLASS[color]
		: ''} {bg ? BG_CLASS[bg] : ''} {className}"
	class:center-below={centerBelow}
	class:font-mono={mono}
	class:inline-block={truncate && !!href}
	class:tracking-wider={uppercase}
	class:truncate
	class:uppercase
	{href}
	{rel}
	{target}
	{title}
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
</style>
