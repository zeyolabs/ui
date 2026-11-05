<script lang="ts">
	/// <reference path="./flickity-fullscreen.d.ts" />
	import type Flickity from 'flickity';

	import { onMount } from 'svelte';
	import 'flickity-fullscreen/fullscreen.css';
	import 'flickity/css/flickity.css';

	type Image = { alt?: string; src: string };

	/**
	 * A product-style image gallery on Flickity: a swipeable slideshow with arrows and fullscreen,
	 * driven by a thumbnail strip. `src` is the final image URL; `name` is the fallback alt text.
	 */
	let { images, name }: { images: Image[]; name: string } = $props();

	let slideshow = $state<HTMLElement>();
	let thumbnails = $state<HTMLElement>();

	// Same setup as the legacy product page: a fullscreen-capable slideshow, driven by a thumbnail
	// strip. Flickity touches `window` on import, so it is only loaded in the browser.
	onMount(() => {
		let main: Flickity | undefined;
		let nav: Flickity | undefined;
		let cancelled = false;

		void (async () => {
			const { default: FlickityClass } = await import('flickity');
			await import('flickity-fullscreen');
			if (cancelled || !slideshow) return;
			main = new FlickityClass(slideshow, {
				fullscreen: true,
				imagesLoaded: true,
				pageDots: false,
			} as Flickity.Options);
			if (thumbnails) {
				nav = new FlickityClass(thumbnails, {
					asNavFor: slideshow,
					contain: true,
					freeScroll: true,
					imagesLoaded: true,
					pageDots: false,
					prevNextButtons: false,
				});
			}
		})();

		return () => {
			cancelled = true;
			nav?.destroy();
			main?.destroy();
		};
	});
</script>

{#if images.length > 0}
	<div class="gallery">
		<div bind:this={slideshow} class="slideshow" aria-label="{name} images">
			{#each images as image (image.src)}
				<div class="slide">
					<img alt={image.alt || name} src={image.src} />
				</div>
			{/each}
		</div>

		{#if images.length > 1}
			<div bind:this={thumbnails} class="thumbnails" aria-label="Choose an image">
				{#each images as image (image.src)}
					<div class="thumb"><img alt="" src={image.src} /></div>
				{/each}
			</div>
		{/if}
	</div>
{/if}

<style>
	/* Before Flickity starts (and without JavaScript) show the first slide, not a stacked column. */
	.slideshow:not(:global(.flickity-enabled)),
	.thumbnails:not(:global(.flickity-enabled)) {
		display: flex;
		overflow: hidden;
	}

	.slideshow {
		border: 1px solid var(--bd);
		border-radius: var(--radius-lg);
		margin-bottom: 0.75rem;
	}

	.slide {
		width: 100%;
		aspect-ratio: 1;
		background: var(--sf);
	}

	.slide img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	.thumb {
		width: 5rem;
		aspect-ratio: 1;
		margin-right: 0.5rem;
		border-radius: var(--radius-md);
		overflow: hidden;
		cursor: pointer;
		opacity: 0.65;
	}

	.thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.thumb:global(.is-selected),
	.thumb:global(.is-nav-selected) {
		opacity: 1;
		outline: 2px solid var(--primary-strong);
		outline-offset: -2px;
	}

	/* Flickity's own controls, in the shop's colours. */
	.gallery :global(.flickity-button) {
		color: var(--tx);
	}

	.gallery :global(.flickity-button:focus-visible) {
		box-shadow: 0 0 0 2px var(--primary-strong);
	}
</style>
