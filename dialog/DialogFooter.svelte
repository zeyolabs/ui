<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		border = false,
		children,
		class: className = '',
	}: {
		/** Full-bleed bordered footer — use with <DialogBody padded={false}>. */
		border?: boolean;
		children: Snippet;
		class?: string;
	} = $props();
</script>

<!-- Buttons always stretch to equal full width across the footer. -->
<div
	class="flex gap-2 *:flex-1 {border
		? 'px-5.5 py-3.5 border-t border-(--bds)'
		: 'mt-5'} {className}"
>
	{@render children()}
</div>
