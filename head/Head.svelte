<script lang="ts">
	import { page } from '$app/state';

	import { headContext } from './context';

	/**
	 * A page's `<head>` tags: title, description, canonical link and link-preview tags. The site's
	 * name, URL and share picture come from `setHeadContext` in the root layout. Renders nothing
	 * visible: the page's heading is its own `Title`.
	 */
	let {
		canonical,
		description,
		image,
		title,
	}: {
		/** Path (or absolute URL) search engines should treat as this page. Default: the path, no query. */
		canonical?: string;
		description?: string;
		/** This page's link-preview picture, instead of the site's. */
		image?: string;
		/** The page's own title; omitted, the tab shows the site name alone. */
		title?: string;
	} = $props();

	const site = headContext();
	const fullTitle = $derived(
		title ? `${title}${site.separator ?? ' · '}${site.siteName}` : site.siteName
	);
	const url = $derived.by(() => {
		if (!site.siteUrl) return null;
		const path = canonical ?? page.url.pathname;
		return /^https?:\/\//.test(path) ? path : `${site.siteUrl}${path}`;
	});
	const picture = $derived(image ?? site.shareImage);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	{#if description}
		<meta name="description" content={description} />
	{/if}
	{#if site.noindex}
		<meta name="robots" content="noindex" />
	{/if}
	{#if url}
		<link href={url} rel="canonical" />
		<meta content={site.siteName} property="og:site_name" />
		<meta content={title ?? site.siteName} property="og:title" />
		{#if description}
			<meta content={description} property="og:description" />
		{/if}
		<meta content={url} property="og:url" />
		<meta content="website" property="og:type" />
		{#if picture}
			<meta content={picture} property="og:image" />
		{/if}
	{/if}
</svelte:head>
