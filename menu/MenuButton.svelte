<script lang="ts" module>
	import type { Component } from 'svelte';

	export type MenuItem = {
		/** Red text, for an action that deletes or discards. */
		destructive?: boolean;
		disabled?: boolean;
		icon?: Component<{ size?: number }>;
		label: string;
		onselect: () => void;
	};
</script>

<script lang="ts">
	import type { ComponentProps, Snippet } from 'svelte';

	import { ChevronDown } from '@lucide/svelte';
	import { Button } from '@zeyolabs/ui/form';
	import Popover from '@zeyolabs/ui/popover/Popover.svelte';

	/** A button with a chevron that opens a short menu of actions. For two or more related ways to
	 * do one thing (add with CSV or link a list); a single action is just a Button. Picking an
	 * item runs `onselect` and closes the menu. */
	let {
		align = 'right',
		children,
		disabled = false,
		items,
		open = $bindable(false),
		variant,
		width = 220,
	}: {
		align?: 'left' | 'right';
		/** The button's label. */
		children: Snippet;
		disabled?: boolean;
		items: MenuItem[];
		open?: boolean;
		variant?: ComponentProps<typeof Button>['variant'];
		/** Menu width in px. */
		width?: number;
	} = $props();
</script>

<div class="relative inline-block">
	<Button {disabled} onclick={() => (open = !open)} {variant}>
		{@render children()}
		<ChevronDown size={13} />
	</Button>
	<Popover {align} ariaLabel="Menu" {width} bind:open>
		{#each items as item (item.label)}
			<button
				class="menu-item"
				class:destructive={item.destructive}
				disabled={item.disabled}
				onclick={() => {
					open = false;
					item.onselect();
				}}
				type="button"
			>
				{#if item.icon}
					{@const Icon = item.icon}
					<Icon size={14} />
				{/if}
				<span>{item.label}</span>
			</button>
		{/each}
	</Popover>
</div>

<style>
	.menu-item {
		display: flex;
		align-items: center;
		gap: 8px;
		width: 100%;
		padding: 7px 10px;
		border-radius: var(--radius);
		background: transparent;
		border: none;
		font: inherit;
		font-size: 13px;
		color: var(--tx);
		text-align: left;
		cursor: pointer;
		transition: background 0.12s ease;
	}
	.menu-item:hover:not(:disabled),
	.menu-item:focus-visible {
		background: var(--sfh);
		outline: none;
	}
	.menu-item:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	.menu-item.destructive {
		color: var(--err, #9b3838);
	}
</style>
