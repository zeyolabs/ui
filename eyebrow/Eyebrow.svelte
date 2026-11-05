<script lang="ts">
	import type { Snippet } from 'svelte';

	/** A small uppercase kicker label that sits above a heading (e.g. "SUPPORT TICKET"). */
	let { children }: { children: Snippet } = $props();
</script>

<p class="sm tracking-wider uppercase mb-1 text-(--txs)">
	{@render children()}
</p>
