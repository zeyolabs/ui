<script lang="ts">
	import type { Snippet } from 'svelte';

	import Text from '../text/Text.svelte';
	import Title from '../text/Title.svelte';
	import Cluster from './Cluster.svelte';

	/**
	 * A page's header row: its title (and an optional line under it) on the left, the page's
	 * actions (buttons, filters) on the right. The actions wrap below the title on narrow screens.
	 */
	let {
		actions,
		class: className = '',
		description,
		level = 1,
		size,
		title,
	}: {
		/** Buttons, filters or a menu, right-aligned. */
		actions?: Snippet;
		class?: string;
		description?: string;
		level?: 1 | 2 | 3 | 4 | 5 | 6;
		size?: 'lg' | 'md' | 'sm' | 'xl' | 'xs';
		title: string;
	} = $props();
</script>

<Cluster class={className} gap="md" justify="between">
	<div class="min-w-0">
		<Title {level} {size}>{title}</Title>
		{#if description}
			<Text color="secondary" size="sm">{description}</Text>
		{/if}
	</div>
	{#if actions}
		<Cluster gap="sm">{@render actions()}</Cluster>
	{/if}
</Cluster>
