<script lang="ts">
	import { getContext, type Snippet } from 'svelte';

	import BoundaryFailed from './BoundaryFailed.svelte';
	import { BOUNDARY_PENDING_CONTEXT_KEY, type BoundaryPendingTracker } from './pending-context';
	import PendingTracker from './PendingTracker.svelte';
	import { reportBoundaryError } from './report-boundary-error';

	/**
	 * The standard `<svelte:boundary>` for an awaited remote query, used directly by every app —
	 * no per-app wrapper needed. Reports unexpected errors + redirects to login on 401
	 * (`onerror` defaults to `reportBoundaryError`, overridable per call), renders a status-aware
	 * retry card (`BoundaryFailed`) on failure, and — if the app `setContext`'d
	 * `BOUNDARY_PENDING_CONTEXT_KEY` in its root layout (see `pending-context.ts`) — reports when
	 * `pending` mounts/unmounts, for an app-wide SPA nav-guard. Pages only supply `pending` + the
	 * awaited content.
	 *
	 * If a nested prop-snippet (e.g. a `SelectionOverlay`'s `overlay` snippet) needs to read a
	 * top-level `{let}`/`{@const}` boundary value, this wrapper can't be used directly — that
	 * cross-snippet visibility is compiler magic tied to the literal `<svelte:boundary>` element
	 * and doesn't survive being wrapped in a plain component. In that case, write the real
	 * `<svelte:boundary onerror={reportBoundaryError}>` yourself and delegate just the failure UI:
	 * `{#snippet failed(error, reset)}<BoundaryFailed {error} {reset} message="..." />{/snippet}`
	 * (import both from `@zeyolabs/ui/boundary/BoundaryFailed.svelte` / `@zeyolabs/ui/boundary/report-boundary-error.ts`).
	 */
	let {
		children,
		message = 'Something went wrong loading this.',
		onerror = reportBoundaryError,
		pending,
		statusMessages = {},
	}: {
		children: Snippet;
		/** Fallback copy for any status not covered by `statusMessages`/the built-in 429 text. */
		message?: string;
		/** `<svelte:boundary>` error handler — defaults to `reportBoundaryError`. */
		onerror?: (error: unknown) => void;
		pending: Snippet;
		/** Per-status copy overrides, e.g. `{ 403: 'No access to this batch.', 404: 'Batch not found.' }`. */
		statusMessages?: Partial<Record<number, string>>;
	} = $props();

	const pendingTracker = getContext<BoundaryPendingTracker | undefined>(
		BOUNDARY_PENDING_CONTEXT_KEY
	);
</script>

<svelte:boundary {onerror} pending={trackedPending}>
	{@render children()}

	{#snippet failed(error, reset)}
		<BoundaryFailed {error} {message} {reset} {statusMessages} />
	{/snippet}
</svelte:boundary>

{#snippet trackedPending()}
	<PendingTracker onEnd={pendingTracker?.onPendingEnd} onStart={pendingTracker?.onPendingStart} />
	{@render pending()}
{/snippet}
