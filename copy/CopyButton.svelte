<script lang="ts">
	import { Check, Copy } from '@lucide/svelte';

	import type { CopyButtonSize } from './types';

	import { createCopyState } from './copy-state.svelte';

	export type CopyButtonLabel = {
		copied: string;
		idle: string;
	};

	const sizePresets: Record<CopyButtonSize, { iconSize: number; textClass: string }> = {
		large: { iconSize: 16, textClass: '' },
		medium: { iconSize: 12, textClass: 'sm' },
		small: { iconSize: 10, textClass: 'sm' },
		tiny: { iconSize: 8, textClass: 'xs' },
	};

	/**
	 * A clipboard-copy button that owns its own "copied" confirmation state, resetting after
	 * `resetAfterMilliseconds`. `clipboardText` is only called at click time, not on every render, so
	 * an expensive payload (e.g. a JSON blob) is fine to build lazily; a static string can be wrapped
	 * as `async () => value`.
	 */
	let {
		clipboardText,
		label = { copied: 'Copied!', idle: 'Copy' },
		resetAfterMilliseconds = 2000,
		size = 'medium',
	}: {
		clipboardText: () => Promise<string>;
		// null renders icon-only, with no visible text at all.
		label?: CopyButtonLabel | null;
		resetAfterMilliseconds?: number;
		size?: CopyButtonSize;
	} = $props();

	// svelte-ignore state_referenced_locally
	const copyState = createCopyState(resetAfterMilliseconds);
</script>

<button
	class="flex cursor-pointer items-center gap-1.5 text-[var(--txs)] transition-opacity hover:opacity-80 {sizePresets[
		size
	].textClass}"
	aria-label={copyState.copied ? (label?.copied ?? 'Copied!') : (label?.idle ?? 'Copy')}
	onclick={() => copyState.copy(clipboardText)}
	type="button"
>
	{#if copyState.copied}
		<Check size={sizePresets[size].iconSize} />
	{:else}
		<Copy size={sizePresets[size].iconSize} />
	{/if}
	{#if label}
		{copyState.copied ? label.copied : label.idle}
	{/if}
</button>
