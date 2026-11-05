<script lang="ts">
	import { ChevronDown } from '@lucide/svelte';

	import Text from '../text/Text.svelte';

	let { items }: { items: { answer: string; question: string }[] } = $props();

	const id = $props.id();
	let openIdx = $state<null | number>(null);
</script>

<div class="faq-list">
	{#each items as item, i (item.question)}
		{@const open = openIdx === i}
		<div class="faq-item" class:faq-open={open}>
			<button
				class="faq-q"
				aria-controls="{id}-a-{i}"
				aria-expanded={open}
				onclick={() => (openIdx = open ? null : i)}
				type="button"
			>
				<span>{item.question}</span>
				<ChevronDown class="faq-chev" size={20} />
			</button>
			{#if open}
				<div id="{id}-a-{i}" class="faq-a">
					<Text color="secondary" size="lg">{item.answer}</Text>
				</div>
			{/if}
		</div>
	{/each}
</div>

<style>
	.faq-list {
		display: flex;
		flex-direction: column;
	}
	.faq-item {
		padding: var(--spacing-md) 0;
		border-top: 1px solid var(--bd);
	}
	.faq-item:last-child {
		border-bottom: 1px solid var(--bd);
	}
	.faq-q {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 16px;
		width: 100%;
		text-align: left;
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
		font-family: var(--font-heading);
		font-size: 18px;
		font-weight: 400;
		color: var(--tx);
		letter-spacing: -0.01em;
	}
	.faq-q :global(.faq-chev) {
		color: var(--txt);
		flex-shrink: 0;
		transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
	}
	.faq-open .faq-q :global(.faq-chev) {
		transform: rotate(180deg);
	}
	.faq-a {
		margin-top: var(--spacing-sm);
		padding-right: 36px;
	}
	.faq-a :global(p) {
		line-height: 1.7;
	}

	@media (max-width: 640px) {
		.faq-q {
			font-size: 18px;
		}
		.faq-a {
			padding-right: 24px;
		}
		.faq-a :global(p) {
			font-size: 15px;
		}
	}
</style>
