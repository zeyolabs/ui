/**
 * Optional Svelte context key an app can `setContext` once (its root layout) to have every
 * `Boundary.svelte` in that subtree automatically report when its `pending`
 * snippet mounts/unmounts — without each call site passing `onPendingStart`/`onPendingEnd`
 * itself. Built for apps with an `ssr = false` route tree that need to know a boundary's async
 * content is still resolving, not just whether a SvelteKit navigation is in flight (dashboard's
 * `navigation.ts` `navigationInFlight` guard against ENG-71's spam-click SPA-nav hang). An app
 * that doesn't set this context (e.g. admin, which has no such guard) gets a no-op default.
 */
export const BOUNDARY_PENDING_CONTEXT_KEY = Symbol('boundary-pending-tracker');

export interface BoundaryPendingTracker {
	onPendingEnd: () => void;
	onPendingStart: () => void;
}
