<script lang="ts">
	import type { Snippet } from 'svelte';

	import Title from '../text/Title.svelte';

	let {
		children,
		// v2-parity: v2's page headers are a single compact inline title with no eyebrow label
		// above it, so `eyebrow` is no longer rendered here. Kept as an accepted prop (every call
		// site still passes one) rather than ripping it out of every page's markup in this same
		// PR — that's a content/call-site change, not a heading-style one.
		eyebrow: _eyebrow,
		sub,
		title,
	}: {
		children?: Snippet;
		eyebrow?: string;
		sub?: string;
		title: string;
	} = $props();
</script>

<header class="flex items-end justify-between gap-6 mb-4 flex-wrap">
	<div class="min-w-0">
		<Title level={3}>{title}</Title>
		{#if sub}
			<p class="mt-1 text-[13px] text-(--txs)">
				{sub}
			</p>
		{/if}
	</div>
	{#if children}
		{@render children()}
	{/if}
</header>
