<script lang="ts">
	import { X } from '@lucide/svelte';

	let {
		chips,
		label,
		onToggle,
		removable = false,
		selected = [],
	}: {
		chips: { label: string; value: string }[];
		label?: string;
		onToggle: (value: string) => void;
		removable?: boolean;
		selected?: string[];
	} = $props();
</script>

{#if chips.length > 0}
	<div class="group">
		{#if label}<div class="label">{label}</div>{/if}
		<div class="chips">
			{#each chips as chip (chip.value)}
				{@const on = selected.includes(chip.value)}
				<button
					class="chip"
					class:on
					aria-pressed={on}
					onclick={() => onToggle(chip.value)}
					type="button"
				>
					{chip.label}
					{#if removable}<X size={11} />{/if}
				</button>
			{/each}
		</div>
	</div>
{/if}

<style>
	.group {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.label {
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--txs);
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}
	.chip {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		padding: 3px 10px;
		font-size: 12px;
		color: var(--tx);
		background: var(--bg);
		border: 1px solid var(--bd);
		border-radius: var(--radius-full);
		cursor: pointer;
	}
	.chip:hover {
		background: var(--sf);
	}
	.chip.on {
		color: var(--bg);
		background: var(--tx);
		border-color: var(--tx);
	}
</style>
