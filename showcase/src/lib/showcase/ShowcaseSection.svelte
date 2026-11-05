<script lang="ts">
	import type { Snippet } from 'svelte';

	import { slugify } from '@zeyolabs/kit/utils/strings/normalize';
	import Text from '@zeyolabs/ui/text/Text.svelte';
	import Title from '@zeyolabs/ui/text/Title.svelte';

	import ShowcaseCode from './ShowcaseCode.svelte';

	let {
		children,
		code,
		description,
		title,
	}: {
		children: Snippet;
		code?: string;
		description?: string;
		title: string;
	} = $props();

	const id = $derived(slugify(title));
</script>

<section {id} class="showcase-block">
	<Title class="showcase-title" level={6}>{title}</Title>
	{#if description}
		<Text class="showcase-desc" color="secondary" size="sm">{description}</Text>
	{/if}

	<div class="showcase-preview" class:with-code={!!code}>
		{@render children()}
	</div>

	{#if code}
		<ShowcaseCode {code} />
	{/if}
</section>

<style>
	.showcase-block {
		margin-bottom: var(--spacing-xl);
		scroll-margin-top: 76px;
	}
	:global(.showcase-title) {
		margin: 0 0 3px;
	}
	:global(.showcase-desc) {
		margin-bottom: var(--spacing-sm);
		max-width: 620px;
	}
	.showcase-preview {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--spacing-sm);
		padding: var(--spacing-lg);
		background: var(--sf);
		border: 1px solid var(--bd);
		border-radius: var(--radius-lg);
	}
	.showcase-preview.with-code {
		border-radius: var(--radius-lg) var(--radius-lg) 0 0;
		border-bottom: none;
	}
</style>
