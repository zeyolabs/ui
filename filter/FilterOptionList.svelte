<script lang="ts">
	import { Check, Search } from '@lucide/svelte';
	import { tick } from 'svelte';

	import Input from '../form/primitives/Input.svelte';

	let {
		emptyText = 'No matches.',
		filterLocally = true,
		multiple = true,
		options,
		query = $bindable(''),
		searchable = false,
		searchPlaceholder = 'Search…',
		selected = $bindable(),
	}: {
		emptyText?: string;
		filterLocally?: boolean;
		multiple?: boolean;
		options: { count?: number | string; group?: string; label: string; value: string }[];
		query?: string;
		searchable?: boolean;
		searchPlaceholder?: string;
		selected: string[];
	} = $props();

	const uid = $props.id();
	let activeIndex = $state(0);

	const visible = $derived(
		searchable && filterLocally && query
			? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
			: options
	);
	const optionId = (i: number) => `${uid}-opt-${i}`;

	$effect(() => {
		void visible;
		activeIndex = 0;
	});

	function toggle(value: string) {
		if (multiple) {
			selected = selected.includes(value)
				? selected.filter((v) => v !== value)
				: [...selected, value];
		} else {
			selected = selected.includes(value) ? [] : [value];
		}
	}

	function move(index: number) {
		activeIndex = Math.max(0, Math.min(visible.length - 1, index));
		void tick().then(() =>
			document.getElementById(optionId(activeIndex))?.scrollIntoView({ block: 'nearest' })
		);
	}

	function onkeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowDown') move(activeIndex + 1);
		else if (e.key === 'ArrowUp') move(activeIndex - 1);
		else if (e.key === 'Home') move(0);
		else if (e.key === 'End') move(visible.length - 1);
		else if (e.key === 'Enter' || (e.key === ' ' && !(e.target instanceof HTMLInputElement))) {
			if (!visible[activeIndex]) return;
			toggle(visible[activeIndex].value);
		} else return;
		e.preventDefault();
	}
</script>

<!-- Key events from the search input and the listbox both bubble to this wrapper. -->
<div class="wrap" {onkeydown} role="presentation">
	{#if searchable}
		<Input
			aria-activedescendant={visible.length ? optionId(activeIndex) : undefined}
			icon={Search}
			placeholder={searchPlaceholder}
			size="sm"
			bind:value={query}
		/>
	{/if}
	<div
		class="list"
		aria-activedescendant={visible.length ? optionId(activeIndex) : undefined}
		aria-multiselectable={multiple}
		role="listbox"
		tabindex="0"
	>
		{#each visible as option, i (option.value)}
			{@const on = selected.includes(option.value)}
			{#if option.group && option.group !== visible[i - 1]?.group}
				<div class="group">{option.group}</div>
			{/if}
			<div
				id={optionId(i)}
				class="row"
				class:active={i === activeIndex}
				class:on
				aria-selected={on}
				onclick={() => {
					activeIndex = i;
					toggle(option.value);
				}}
				onkeydown={null}
				role="option"
				tabindex="-1"
			>
				<span class="box"
					>{#if on}<Check size={10} />{/if}</span
				>
				<span class="text">{option.label}</span>
				{#if option.count !== undefined}<span class="count">{option.count}</span>{/if}
			</div>
		{:else}
			<div class="empty">{emptyText}</div>
		{/each}
	</div>
</div>

<style>
	.wrap {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.list {
		display: flex;
		flex-direction: column;
		outline: none;
	}
	.group {
		padding: 6px 6px 2px;
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--txs);
	}
	.row {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 5px 6px;
		font-size: 12px;
		color: var(--tx);
		border-radius: var(--radius-xs);
		cursor: pointer;
	}
	.row:hover,
	.row.active {
		background: var(--sf);
	}
	.row.on {
		font-weight: 500;
	}
	.box {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex: none;
		width: 14px;
		height: 14px;
		color: var(--bg);
		border: 1px solid var(--bd);
		border-radius: var(--radius-xs);
	}
	.on .box {
		background: var(--tx);
		border-color: var(--tx);
	}
	.text {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.count {
		font-size: 11px;
		color: var(--txs);
	}
	.empty {
		padding: 8px 6px;
		font-size: 12px;
		color: var(--txs);
	}
</style>
