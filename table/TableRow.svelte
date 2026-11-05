<script lang="ts">
	import type { Snippet } from 'svelte';

	import { setContext } from 'svelte';

	let {
		boldHeader = false,
		children,
		elevated = false,
		head = false,
		hoverable = false,
		onclick,
		selected = false,
		sticky = false,
		warning = false,
	}: {
		/** Head row only — renders column labels in the shared heading font/weight (same
		 *  treatment as `Title`) instead of the default small uppercase tracked-out label,
		 *  for a table whose header needs to read as more prominent. Opt-in — every existing
		 *  Table keeps the default label style unless it asks for this. */
		boldHeader?: boolean;
		children: Snippet;
		elevated?: boolean;
		head?: boolean;
		hoverable?: boolean;
		onclick?: () => void;
		selected?: boolean;
		/** Head row only — pins it via position: sticky while the table body scrolls past.
		 *  Each TableCell head cell already renders an opaque background, so no extra
		 *  backdrop is needed here. */
		sticky?: boolean;
		/** Row-wide tint (e.g. "this row has invalid data") via a `--row-bg` custom property
		 *  every TableCell's background reads — unlike `selected`, this DOES need to paint
		 *  through, including sticky cells, so it's a custom property rather than a `tr`
		 *  background: a `td`'s own opaque background would otherwise hide a plain `tr` tint. */
		warning?: boolean;
	} = $props();

	// svelte-ignore state_referenced_locally
	setContext('table:head', head);
	// svelte-ignore state_referenced_locally
	setContext('table:head-bold', boldHeader);
</script>

<tr
	class:clickable={!!onclick}
	class:elevated
	class:hoverable={!onclick && hoverable}
	class:selected
	class:sticky
	class:warning
	{onclick}
>
	{@render children()}
</tr>

<style>
	tr.clickable,
	tr.hoverable {
		transition: background 0.1s ease;
	}
	tr.clickable {
		cursor: pointer;
	}
	tr.clickable:hover,
	tr.hoverable:hover {
		background: var(--sf);
	}
	/* No background tint on `.selected` — a sticky checkbox column (TableCell's `td.sticky`)
	   always paints its own opaque `var(--bg)` so pinned content stays readable while scrolling,
	   which can't pick up a semi-transparent row tint sitting behind it. Tinting the rest of the
	   row while that one cell stayed plain background looked like a rendering bug, not a design
	   choice — the checkbox's own checked state already communicates "selected" on its own. */
	tr.elevated {
		position: relative;
		z-index: 9999;
	}
	tr.sticky {
		position: sticky;
		top: 0;
		z-index: 3;
	}
	tr.warning {
		--row-bg: color-mix(in srgb, var(--w) 10%, var(--bg));
	}
</style>
