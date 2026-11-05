<script lang="ts">
	import type { Snippet } from 'svelte';

	import { Info } from '@lucide/svelte';

	// A small info icon whose tooltip shows on hover or keyboard focus. Meant for a short
	// explanation next to a label or column header. `align` picks which edge of the icon the
	// tooltip lines up with, so one placed in the last column can open leftwards.
	let {
		align = 'left',
		children,
		label,
	}: {
		align?: 'left' | 'right';
		children: Snippet;
		/** Accessible name for the icon button. */
		label: string;
	} = $props();
</script>

<button
	class="group relative inline-flex cursor-help border-0 bg-transparent p-0 align-middle text-(--txs)"
	aria-label={label}
	type="button"
>
	<Info size={12} />
	<span
		class="pointer-events-none absolute top-full z-50 mt-1.5 w-64 rounded-md bg-(--tx) px-2.5 py-2 text-left tracking-normal whitespace-normal text-(--bg) normal-case opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 {align ===
		'right'
			? 'right-0'
			: 'left-0'}"
		role="tooltip"
	>
		{@render children()}
	</span>
</button>
