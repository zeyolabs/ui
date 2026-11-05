<script lang="ts">
	import CopyButton from '@zeyolabs/ui/copy/CopyButton.svelte';

	let { code }: { code: string } = $props();
</script>

<div class="showcase-code">
	<div style="--txs: #9490a0;" class="showcase-code-bar">
		<span>Code</span>
		<CopyButton clipboardText={() => Promise.resolve(code)} label={null} size="small" />
	</div>
	<pre><code>{code}</code></pre>
</div>

<style>
	.showcase-code {
		overflow: hidden;
		background: #17151c;
		border: 1px solid var(--bd);
		border-top: none;
		border-radius: 0 0 var(--radius-lg) var(--radius-lg);
	}
	.showcase-code-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--spacing-xs) var(--spacing-sm);
		font-size: 10.5px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: #9490a0;
		border-bottom: 1px solid #2a2732;
	}
	pre {
		margin: 0;
		padding: var(--spacing-md);
		overflow-x: auto;
		font-family: var(--font-mono);
		font-size: 12px;
		line-height: 1.7;
		color: #e4e1ea;
	}
</style>
