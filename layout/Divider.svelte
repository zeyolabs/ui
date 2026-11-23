<script lang="ts">
	import Span from '../text/Span.svelte';

	/** A horizontal line. With a `label` it reads as a line, the label, then a line (e.g. "OR"). */
	let { label }: { label?: string } = $props();
</script>

{#if label}
	<div class="divider" role="separator">
		<Span color="tertiary" size="sm" uppercase>{label}</Span>
	</div>
{:else}
	<hr class="rule" />
{/if}

<style>
	.divider {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.divider::before,
	.divider::after {
		flex: 1;
		border-top: 1px solid var(--bd);
		content: '';
	}
	.rule {
		border: 0;
		border-top: 1px solid var(--bd);
	}
</style>
