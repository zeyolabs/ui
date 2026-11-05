<script lang="ts">
	import Text from '@zeyolabs/ui/text/Text.svelte';

	let {
		dark,
		desc,
		light,
		name,
	}: {
		dark: string;
		desc: string;
		light: string;
		name: string;
	} = $props();
</script>

<div class="swatch">
	<div style="background: var(--{name});" class="swatch-color"></div>
	<div class="swatch-meta">
		<code>--{name}</code>
		<Text class="swatch-desc" color="secondary" size="sm">{desc}</Text>
		<div class="swatch-values">
			<span>{light}</span>
			<span>{dark}</span>
		</div>
	</div>
</div>

<style>
	.swatch {
		display: flex;
		flex-direction: column;
		border: 1px solid var(--bd);
		border-radius: var(--radius-sm);
		overflow: hidden;
		background: var(--bg);
	}
	.swatch-color {
		height: 56px;
		border-bottom: 1px solid var(--bd);
	}
	.swatch-meta {
		padding: var(--spacing-sm);
	}
	code {
		font-family: var(--font-mono);
		font-size: 11.5px;
		font-weight: 600;
		color: var(--tx);
	}
	:global(.swatch-desc) {
		margin: 4px 0 var(--spacing-xs);
	}
	.swatch-values {
		display: flex;
		justify-content: space-between;
		font-family: var(--font-mono);
		font-size: 10px;
		color: var(--txt);
	}
</style>
