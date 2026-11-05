<script generics="V" lang="ts">
	import type { Snippet } from 'svelte';

	import { getContext } from 'svelte';

	type TabCtx = {
		disabled: boolean;
		isActive: (v: unknown) => boolean;
		readonly: boolean;
		select: (v: unknown) => void;
	};

	type Props = {
		children: Snippet;
		value: V;
	};

	let { children, value }: Props = $props();

	const ctx = getContext<TabCtx>(Symbol.for('tab'));
</script>

<button
	class="tab-btn"
	data-state={ctx.isActive(value) ? 'active' : 'inactive'}
	onclick={() => {
		if (ctx.disabled || ctx.readonly) return;
		ctx.select(value);
	}}
	type="button"
>
	{@render children()}
</button>
