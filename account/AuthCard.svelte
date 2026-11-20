<script lang="ts">
	import type { Snippet } from 'svelte';

	import Card from '../card/Card.svelte';
	import Title from '../text/Title.svelte';

	/**
	 * The narrow centred card the sign-in and invite pages sit in. `fullscreen` centres it in the
	 * viewport, for an app with no header around its auth pages.
	 */
	let {
		accent = false,
		brand,
		children,
		fullscreen = false,
		title,
	}: {
		/** The title in the brand's accent colour. */
		accent?: boolean;
		/** A logo mark above the title. */
		brand?: Snippet;
		children: Snippet;
		fullscreen?: boolean;
		title: string;
	} = $props();
</script>

<div class="auth-card" class:fullscreen>
	<Card gap="sm" padding="lg">
		{@render brand?.()}
		<Title color={accent ? 'accent' : undefined} level={1} size="md">{title}</Title>
		{@render children()}
	</Card>
</div>

<style>
	.auth-card {
		width: 100%;
		max-width: 24rem;
		margin: 4rem auto 0;
	}
	.fullscreen {
		display: grid;
		place-items: center;
		max-width: none;
		min-height: 100vh;
		margin: 0;
		padding: 24px;
	}
	.fullscreen > :global(*) {
		width: 100%;
		max-width: 24rem;
	}
</style>
