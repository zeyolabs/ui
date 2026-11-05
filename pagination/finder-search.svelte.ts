import type { RemoteQuery } from '$app/server';

import { createFinderPagination, type FinderPagination } from './finder-pagination.svelte';

/**
 * Force a real network re-fetch of a cached remote `query()` instead of trusting SvelteKit's
 * function+args client cache (see docs/sveltekit-remote.md "Plain client `.refresh()`") — a
 * `RemoteQuery<T>` is itself a `Promise<T>` whose `refresh()` re-fetches and mutates that same
 * cached instance in place, so awaiting it afterward is guaranteed to yield the fresh value.
 */
export async function refetch<T>(q: RemoteQuery<T>): Promise<T> {
	await q.refresh();
	return q;
}

async function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
	let timer: ReturnType<typeof setTimeout>;
	const timeout = new Promise<never>((_, reject) => {
		timer = setTimeout(() => reject(new Error(`${label} timed out`)), ms);
	});
	try {
		return await Promise.race([p, timeout]);
	} finally {
		clearTimeout(timer!);
	}
}

export type FinderSearchOpts<Row, Params> = {
	/** Page-specific: build the params for a given target page. Called once per attempt and
	 *  frozen — every count-fetch closure below only ever sees this snapshot, never live filter
	 *  state, so a filter edit mid-debounce can never desync a count from the rows on screen. */
	buildParams: (page: number) => Params;
	/** Debounce before counts are (re)fetched after a successful new-search row fetch. Default 250. */
	countDebounceMs?: number;
	countsTimeoutMs?: number;
	/** One entry per independently-displayed count (e.g. `{ total: ... }` for local-leads,
	 *  `{ net: ..., gross: ... }` for companies/people). Omit for a page with no count. */
	fetchCounts?: Record<string, (params: Params) => RemoteQuery<number>>;
	/** Return the bare `RemoteQuery` (don't await it) — this module calls `refetch()` on it. */
	fetchRows: (params: Params) => RemoteQuery<Row[]>;
	/** Whether current filter state has any include-filter set — mirrors each page's own
	 *  `hasIncludeFilters`. When false, `search()`/`immediate()` clear rows+counts and never hit
	 *  the network. */
	hasIncludeFilters: () => boolean;
	/** Fires on every successful row fetch (any page, including pure pagination) — the hook for
	 *  page-specific bookkeeping that isn't generic (chunk-pool caching, stats resets, etc). */
	onRows?: (rows: Row[], params: Params) => void;
	/** Fires only when a successful *new search* (not a pure page turn) completes — e.g. pushing
	 *  a recent-search entry. */
	onSearched?: (params: Params) => void;
	rowsPerPage: () => number;
	rowsTimeoutMs?: number;
	/** Debounce before a `search()` actually fires. Default 250. */
	searchDebounceMs?: number;
};

export type FinderSearch<Row> = {
	/** Names of counts whose last fetch rejected (or timed out) for the current filter set. */
	get countErrors(): ReadonlySet<string>;
	get countLoading(): boolean;
	get counts(): Record<string, null | number>;
	/** `max(0, counts[a] - counts[b])`, or `null` if either named count is still unresolved. */
	derivedCount: (a: string, b: string) => null | number;
	/** `0` before any search, `'—'` if that count's fetch failed, `'···'` while it's still
	 *  unresolved, else the formatted number — the shared `MiniStat` display contract. */
	displayCount: (name: string) => number | string;
	get error(): unknown;
	/** Pure pagination — explicit page, no debounce, no "filters changed" semantics. */
	goto: (page: number) => Promise<void>;
	get hasSearched(): boolean;
	/** Undebounced "filters changed" trigger — recent-search apply, AI apply, lookalike, reveal
	 *  refresh, rows-per-page/sort change. Always resets to page 1. */
	immediate: () => Promise<void>;
	readonly pagination: FinderPagination;
	/** Re-run exactly the last attempted action — for the error EmptyState's Retry button. */
	retry: () => Promise<void>;
	/** Re-fetch only the counts for the current filter set (e.g. after a failed count fetch). */
	retryCounts: () => void;
	get rows(): Row[];
	set rows(v: Row[]);
	/** Debounced "filters changed" trigger. Always resets to page 1. */
	search: () => Promise<void>;
	get searchFailed(): boolean;
};

/**
 * Shared debounce → seq-guard → row-fetch → count-fetch(es) orchestration for a finder page
 * (company-finder, local-leads-finder, lead-finder). Composes `createFinderPagination` for the
 * page/seq/searching bookkeeping; this module owns everything layered on top of it. See
 * packages/ui/CLAUDE.md and docs/sveltekit-remote.md for the conventions this follows.
 */
export function createFinderSearch<Row, Params>(
	opts: FinderSearchOpts<Row, Params>
): FinderSearch<Row> {
	const pagination = createFinderPagination({ rowsPerPage: opts.rowsPerPage });
	const searchDebounceMs = opts.searchDebounceMs ?? 250;
	const countDebounceMs = opts.countDebounceMs ?? 250;

	let rows = $state<Row[]>([]);
	let counts = $state<Record<string, null | number>>({});
	let countLoading = $state(false);
	let hasSearched = $state(false);
	let searchFailed = $state(false);
	let error = $state<unknown>(null);
	let countErrors = $state<ReadonlySet<string>>(new Set());

	// Separate from `pagination`'s per-fetch seq: a pure page turn (`goto`) must never invalidate
	// a still-pending count fetch for the current filter set, but a real new search must.
	let filtersGen = 0;
	let searchDebounce: null | ReturnType<typeof setTimeout> = null;
	let countDebounce: null | ReturnType<typeof setTimeout> = null;
	let lastAttempt: { isNewSearch: boolean; page: number } = { isNewSearch: true, page: 1 };
	// What `retryCounts()` re-issues.
	let lastCountParams: null | { gen: number; params: Params } = null;

	function resetCounts(): void {
		const next: Record<string, null | number> = {};
		for (const name of Object.keys(opts.fetchCounts ?? {})) next[name] = null;
		counts = next;
		countErrors = new Set();
	}

	function scheduleCounts(gen: number, params: Params): void {
		if (countDebounce) clearTimeout(countDebounce);
		const entries = Object.entries(opts.fetchCounts ?? {});
		if (entries.length === 0) return;
		lastCountParams = { gen, params };
		resetCounts();
		countLoading = true;
		countDebounce = setTimeout(() => {
			countDebounce = null;
			// A genuinely new search superseded this one — drop it. A pure page turn never
			// bumps filtersGen, so it can't orphan this fetch the way the old per-page-only
			// `if (offset === 0)` gate used to.
			if (gen !== filtersGen) return;
			Promise.allSettled(
				entries.map(([name, fn]) => {
					const fetched = opts.countsTimeoutMs
						? withTimeout(refetch(fn(params)), opts.countsTimeoutMs, `Count (${name})`)
						: refetch(fn(params));
					return fetched.then(
						(n) => {
							if (gen !== filtersGen) return;
							counts = { ...counts, [name]: Number(n ?? 0) };
						},
						(e) => {
							// Otherwise the count stays `null` and renders '···' forever.
							if (gen !== filtersGen) return;
							countErrors = new Set([...countErrors, name]);
							console.error(`Count (${name}) fetch failed:`, e);
						}
					);
				})
			).finally(() => {
				if (gen === filtersGen) countLoading = false;
			});
		}, countDebounceMs);
	}

	async function run(page: number, seq: number, gen: number, isNewSearch: boolean): Promise<void> {
		lastAttempt = { isNewSearch, page };
		const params = opts.buildParams(page);
		try {
			const fetched = opts.rowsTimeoutMs
				? withTimeout(refetch(opts.fetchRows(params)), opts.rowsTimeoutMs, 'Search')
				: refetch(opts.fetchRows(params));
			const rowsOut = await fetched;
			if (!pagination.isCurrent(seq)) return;
			rows = rowsOut;
			hasSearched = true;
			searchFailed = false;
			error = null;
			opts.onRows?.(rowsOut, params);
			if (isNewSearch) {
				opts.onSearched?.(params);
				scheduleCounts(gen, params);
			}
		} catch (e) {
			if (pagination.isCurrent(seq)) {
				rows = [];
				hasSearched = true;
				searchFailed = true;
				error = e;
			}
		} finally {
			pagination.end(seq);
		}
	}

	function runEmpty(): void {
		rows = [];
		resetCounts();
		countLoading = false;
		hasSearched = false;
		searchFailed = false;
		error = null;
		// begin()+end() (not a bare `pagination.page = 1`) — this is the only place that settles
		// `searching` for this path, since no further fetch follows to resolve it.
		pagination.end(pagination.begin(1));
	}

	function retryCounts(): void {
		if (!lastCountParams || lastCountParams.gen !== filtersGen) return;
		scheduleCounts(lastCountParams.gen, lastCountParams.params);
	}

	function search(): Promise<void> {
		if (searchDebounce) clearTimeout(searchDebounce);
		if (!opts.hasIncludeFilters()) {
			searchDebounce = null;
			runEmpty();
			return Promise.resolve();
		}
		const seq = pagination.begin(1);
		const gen = ++filtersGen;
		return new Promise((resolve) => {
			searchDebounce = setTimeout(() => {
				searchDebounce = null;
				resolve(run(1, seq, gen, true));
			}, searchDebounceMs);
		});
	}

	function immediate(): Promise<void> {
		if (searchDebounce) clearTimeout(searchDebounce);
		searchDebounce = null;
		if (!opts.hasIncludeFilters()) {
			runEmpty();
			return Promise.resolve();
		}
		const seq = pagination.begin(1);
		const gen = ++filtersGen;
		return run(1, seq, gen, true);
	}

	function goto(page: number): Promise<void> {
		const seq = pagination.begin(page);
		return run(page, seq, filtersGen, false);
	}

	function retry(): Promise<void> {
		const { isNewSearch, page } = lastAttempt;
		const seq = pagination.begin(page);
		const gen = isNewSearch ? ++filtersGen : filtersGen;
		return run(page, seq, gen, isNewSearch);
	}

	return {
		get countErrors() {
			return countErrors;
		},
		get countLoading() {
			return countLoading;
		},
		get counts() {
			return counts;
		},
		derivedCount(a, b) {
			const av = counts[a];
			const bv = counts[b];
			if (av == null || bv == null) return null;
			return Math.max(0, av - bv);
		},
		displayCount(name) {
			if (!hasSearched) return 0;
			const v = counts[name];
			if (v == null) return countErrors.has(name) ? '—' : '···';
			return v.toLocaleString();
		},
		get error() {
			return error;
		},
		goto,
		get hasSearched() {
			return hasSearched;
		},
		immediate,
		pagination,
		retry,
		retryCounts,
		get rows() {
			return rows;
		},
		set rows(v: Row[]) {
			rows = v;
		},
		search,
		get searchFailed() {
			return searchFailed;
		},
	};
}
