<script lang="ts">
	import type { Snippet } from 'svelte';

	import { LoaderCircle } from '@lucide/svelte';
	import { tick } from 'svelte';

	import Button from '../form/Button.svelte';
	import Popover from '../popover/Popover.svelte';

	let {
		applyDisabled = false,
		children,
		clearDisabled = false,
		error,
		loading = false,
		onApply,
		onCancel,
		onClear,
		open = $bindable(false),
		side = 'right',
		title,
		width = 320,
	}: {
		applyDisabled?: boolean;
		children: Snippet;
		clearDisabled?: boolean;
		error?: string;
		loading?: boolean;
		onApply: () => void;
		onCancel?: () => void;
		onClear: () => void;
		open?: boolean;
		side?: 'bottom' | 'right';
		title: string;
		width?: number;
	} = $props();

	let bodyEl: HTMLDivElement | undefined = $state();
	let restoreTo: Element | null = null;

	$effect(() => {
		if (!open) {
			if (restoreTo instanceof HTMLElement) restoreTo.focus();
			restoreTo = null;
			return;
		}
		restoreTo = document.activeElement;
		void tick().then(() => {
			const target = bodyEl?.querySelector<HTMLElement>('input, button, [tabindex]');
			(target ?? bodyEl)?.focus();
		});
	});

	function apply() {
		onApply();
		open = false;
	}
</script>

<Popover ariaLabel={title} maxHeight={480} onClose={() => onCancel?.()} {side} {width} bind:open>
	<div class="header">{title}</div>
	<div bind:this={bodyEl} class="body" tabindex="-1">
		{#if loading}
			<div class="state"><LoaderCircle class="spin" size={16} /></div>
		{:else if error}
			<div class="state error">{error}</div>
		{:else}
			{@render children()}
		{/if}
	</div>
	<div class="footer">
		<Button disabled={clearDisabled} onclick={onClear} size="sm" variant="ghost">Clear</Button>
		<Button disabled={applyDisabled} onclick={apply} size="sm">Apply</Button>
	</div>
</Popover>

<style>
	.header {
		padding: 8px 8px 4px;
		font-size: 13px;
		font-weight: 500;
		color: var(--tx);
	}
	.body {
		display: flex;
		flex-direction: column;
		gap: 12px;
		max-height: 300px;
		overflow-y: auto;
		padding: 4px 8px 8px;
		outline: none;
	}
	/* The body scrolls; its children must keep their full height rather than shrink to fit. */
	.body > :global(*) {
		flex-shrink: 0;
	}
	.state {
		display: flex;
		justify-content: center;
		padding: 16px 0;
		font-size: 12px;
		color: var(--txs);
	}
	.state.error {
		color: var(--err);
	}
	.state :global(.spin) {
		animation: spin 0.8s linear infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	.footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 8px 8px 2px;
		border-top: 1px solid var(--bd);
	}
</style>
