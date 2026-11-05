<script lang="ts">
	import type { Snippet } from 'svelte';

	import Card from '@zeyolabs/ui/card/Card.svelte';

	let {
		chart,
		class: className = '',
		delta,
		label,
		loading = false,
		numerals = 'display',
		sub,
		value,
	}: {
		/** Small visual under the value/sub — a sparkline SVG, typically. */
		chart?: Snippet;
		class?: string;
		/** Up/down/neutral change badge next to the value — owns its own color coding, so
		 * callers don't each reimplement the up=green/down=red/neutral=muted logic. */
		delta?: { dir: 'down' | 'neutral' | 'up'; pct: string };
		label: Snippet;
		/** Loading ring on the card while its value reloads; drive it from `pendingFlag()`. */
		loading?: boolean;
		/** Type treatment for the value. `display` (default) is the DM Sans heading face; `plain`
		 * keeps the body sans at a slightly smaller size, for dense metric grids where a row of
		 * display numerals reads too loud. */
		numerals?: 'display' | 'plain';
		sub?: Snippet;
		value: Snippet;
	} = $props();
</script>

<Card class="flex flex-col gap-3.5 min-h-27 py-5 px-5.5 {className}" hover {loading}>
	<div class="eyebrow">{@render label()}</div>
	<div class="stat-num-row">
		<div class="stat-num" data-numerals={numerals}>{@render value()}</div>
		{#if delta}
			<span class="stat-delta" data-dir={delta.dir}>{delta.pct}</span>
		{/if}
	</div>
	{#if sub}<div class="stat-sub">{@render sub()}</div>{/if}
	{#if chart}<div class="stat-chart">{@render chart()}</div>{/if}
</Card>

<style>
	.eyebrow {
		font-size: 11px;
		font-weight: 400;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--txs);
		line-height: 1;
	}
	.stat-num-row {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--spacing-sm);
	}
	.stat-num {
		font-family: var(--font-heading);
		font-size: 32px;
		font-weight: 400;
		letter-spacing: -1px;
		color: var(--tx);
		line-height: 1;
		font-variant-numeric: tabular-nums;
	}
	.stat-num[data-numerals='plain'] {
		font-family: inherit;
		font-size: 32px;
		font-weight: 400;
		letter-spacing: -0.01em;
	}
	.stat-sub {
		font-size: 11px;
		font-weight: 400;
		color: var(--txs);
		font-variant-numeric: tabular-nums;
		letter-spacing: -0.005em;
	}
	.stat-delta {
		font-size: 11px;
		font-weight: 400;
		padding: 2px 6px;
		border-radius: var(--radius-full);
		letter-spacing: -0.005em;
		background: var(--sf);
		color: var(--txt);
	}
	.stat-delta[data-dir='up'] {
		background: #ecfdf5;
		color: var(--ok);
	}
	.stat-delta[data-dir='down'] {
		background: #fef2f2;
		color: var(--err);
	}
	.stat-chart {
		margin-top: var(--spacing-xs);
	}
</style>
