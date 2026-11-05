/**
 * Shared page/loading state for a remote-queried, paginated results view. Owns only `page` /
 * `searching` / the seq-guard and the `totalPages` floor formula — never the row fetch itself, so
 * finders with different fetch strategies (flat per-page vs. chunked pool caching) can still
 * share this piece.
 */
export function createFinderPagination(opts: { rowsPerPage: () => number }) {
	let currentPage = $state(1);
	let searching = $state(false);
	let searchSeq = 0;

	/** Call at the very start of a page fetch — advances the seq, flips `searching` on, and
	 *  updates `page` immediately so the page number never lags behind the network round trip. */
	function begin(page: number): number {
		const seq = ++searchSeq;
		searching = true;
		currentPage = page;
		return seq;
	}

	/** Is `seq` still the most recent fetch, i.e. not superseded by a newer one. */
	function isCurrent(seq: number): boolean {
		return seq === searchSeq;
	}

	/** Call when a fetch settles — only clears `searching` if it wasn't superseded. */
	function end(seq: number) {
		if (isCurrent(seq)) searching = false;
	}

	/** Total pages floored by what's actually loaded so far, so a not-yet-resolved (or absent)
	 *  server count can never under- or over-shoot the real page count. */
	function totalPagesFor(loadedCount: number, totalCount: null | number, poolOffset = 0): number {
		const loadedPages = Math.ceil((poolOffset + loadedCount) / opts.rowsPerPage());
		return Math.max(1, loadedPages, Math.ceil((totalCount ?? 0) / opts.rowsPerPage()));
	}

	return {
		begin,
		end,
		isCurrent,
		get page() {
			return currentPage;
		},
		set page(v: number) {
			currentPage = v;
		},
		get searching() {
			return searching;
		},
		totalPagesFor,
	};
}

export type FinderPagination = ReturnType<typeof createFinderPagination>;
