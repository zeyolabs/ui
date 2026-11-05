<script generics="T" lang="ts">
	import type { Snippet } from 'svelte';

	import { getHttpStatus } from '@zeyolabs/kit/utils/errors';

	import SkeletonRow from '../skeleton/SkeletonRow.svelte';

	/**
	 * The standard load/error/ready gate for a remote `query`. Renders `children(data)` once the
	 * query resolves, a muted error line on failure, and a skeleton while loading — so pages stop
	 * re-implementing the `{#if current}{:else if error}{:else}` boilerplate.
	 */
	let {
		children,
		errorMessage,
		failed = 'Failed to load.',
		loading,
		query,
		skeletonCols = 2,
	}: {
		children: Snippet<[T]>;
		/** Status-aware error text, e.g. distinguishing a 404 from a 500. Overrides `failed`. */
		errorMessage?: (status: null | number) => string;
		failed?: string;
		/** Custom loading state; defaults to a skeleton row. */
		loading?: Snippet;
		query: { current: T | undefined; error?: unknown };
		skeletonCols?: number;
	} = $props();
</script>

{#if query.current !== undefined}
	{@render children(query.current)}
{:else if query.error}
	<div style="color: var(--txs);" class="py-10 text-center">
		{errorMessage ? errorMessage(getHttpStatus(query.error)) : failed}
	</div>
{:else if loading}
	{@render loading()}
{:else}
	<div class="py-6"><SkeletonRow avatar={false} cols={skeletonCols} /></div>
{/if}
