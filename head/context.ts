import { getContext, setContext } from 'svelte';

/** What every page's `<Head>` shares: set once in the app's root layout. */
export type HeadSite = {
	/** True for apps that must stay out of search results (admins, private tools). */
	noindex?: boolean;
	/** Goes between the page title and the site name. Default `' · '`. */
	separator?: string;
	/** Absolute URL of the picture link previews show, unless a page passes its own. */
	shareImage?: string;
	siteName: string;
	/** The public origin, e.g. `https://www.keycrox.co.uk`. Without it, no canonical or share tags. */
	siteUrl?: string;
};

const KEY = Symbol.for('@zeyolabs/ui/head');

/** The site's `<Head>` settings, for every page below this layout. */
export function setHeadContext(site: HeadSite): void {
	setContext(KEY, site);
}

export function headContext(): HeadSite {
	const site = getContext<HeadSite | undefined>(KEY);
	if (!site) throw new Error('@zeyolabs/ui/head: call setHeadContext() in the root layout');
	return site;
}
