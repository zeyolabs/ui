<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		bg,
		children,
		class: cls = '',
		clip = false,
		gap,
		hover = false,
		href,
		loading = false,
		padding,
	}: {
		/** Omit for the default surface (var(--bg)). 'rainbow' is the animated gradient panel
		 * used for feature/product-UI showcase cards. */
		bg?: 'bg' | 'rainbow' | 'sf' | 'sfh' | 'tertiary';
		children: Snippet;
		class?: string;
		/** Clips children to the rounded corners and lets the card shrink inside a flex/grid parent
		 * — for a card that holds its own scrolling region (a list, a thread): lay it out with
		 * `gap="none"` and CardHeader / CardBody / CardFooter. */
		clip?: boolean;
		/** Stacks direct children in a column with this gap — so a heading before some content
		 * doesn't need its own margin just to space itself from what follows. `'none'` stacks
		 * them with no gap. Omit for plain block layout (the historical default). */
		gap?: 'lg' | 'md' | 'none' | 'sm' | 'xs';
		hover?: boolean;
		/** Renders as an `<a>` instead of `<div>` and implies `hover`. */
		href?: string;
		/** Spinning gradient ring on the border plus a glow outside it while content reloads; drive it
		 * from `pendingFlag()`. A clipping parent needs ~12px of room around the card for the glow.
		 * Not applied to `bg="rainbow"`. */
		loading?: boolean;
		/** Omit for no padding (the historical default — every existing usage adds its own). */
		padding?: 'lg' | 'md' | 'sm';
	} = $props();

	const tag = $derived(href ? 'a' : 'div');

	let lingering = $state(false);
	let wasLoading = false;
	$effect(() => {
		if (loading) {
			wasLoading = true;
			lingering = true;
			return;
		}
		if (!wasLoading) return;
		const timer = setTimeout(() => (lingering = false), 1000);
		return () => clearTimeout(timer);
	});
</script>

<svelte:element
	this={tag}
	class="card {cls}"
	class:hoverable={hover || !!href}
	aria-busy={loading || undefined}
	data-active={loading || lingering || undefined}
	data-bg={bg}
	data-clip={clip || undefined}
	data-gap={gap}
	data-loading={loading || undefined}
	data-padding={padding}
	{href}
>
	{@render children()}
</svelte:element>

<style>
	/* In Tailwind's `components` layer so utility classes passed via `class` (flex, gap-*, p-*,
	   overflow-*) override these defaults — unlayered component CSS would otherwise beat every
	   utility, silently turning `<Card class="flex flex-col gap-3">` back into a block.
	   The statement repeats Tailwind's own layer order: this stylesheet can load before app.css,
	   and a layer is ordered by where it first appears — without it `components` would land
	   below `base`, and preflight's `border: 0` would wipe the Card border. */
	@layer properties, theme, base, components, utilities;

	@property --card-loading-angle {
		syntax: '<angle>';
		initial-value: 0deg;
		inherits: false;
	}
	@property --card-ring-a {
		syntax: '<number>';
		initial-value: 0;
		inherits: false;
	}
	@property --card-glow-a {
		syntax: '<number>';
		initial-value: 0;
		inherits: false;
	}

	@layer components {
		.card {
			position: relative;
			display: block;
			background: var(--bg);
			border: 1px solid var(--bd);
			border-radius: var(--radius-lg);
			color: inherit;
			text-decoration: none;
		}
		.card[data-bg='bg'] {
			--card-surface: var(--bg);
			background: var(--bg);
		}
		.card[data-bg='sf'] {
			--card-surface: var(--sf);
			background: var(--sf);
		}
		.card[data-bg='sfh'] {
			--card-surface: var(--sfh);
			background: var(--sfh);
		}
		.card[data-bg='tertiary'] {
			--card-surface: var(--tertiary);
			background: var(--tertiary);
		}
		.card[data-bg='rainbow'] {
			background-image: linear-gradient(
				160deg,
				#4f46e5,
				#3b82f6,
				#a855f7,
				#f59e0b,
				#ef4444,
				#0ea5e9
			);
			background-size: 200% 200%;
			border: none;
			animation: card-rainbow-shift 12s ease infinite;
		}
		@keyframes card-rainbow-shift {
			0% {
				background-position: 0% 0%;
			}
			50% {
				background-position: 100% 100%;
			}
			100% {
				background-position: 0% 0%;
			}
		}
		.card[data-padding='sm'] {
			padding: var(--spacing-sm);
		}
		.card[data-padding='md'] {
			padding: var(--spacing-md);
		}
		.card[data-padding='lg'] {
			padding: var(--spacing-lg);
		}
		.card[data-gap] {
			display: flex;
			flex-direction: column;
		}
		.card[data-clip] {
			overflow: hidden;
			min-height: 0;
		}
		.card[data-gap='none'] {
			gap: 0;
		}
		.card[data-gap='xs'] {
			gap: var(--spacing-xs);
		}
		.card[data-gap='sm'] {
			gap: var(--spacing-sm);
		}
		.card[data-gap='md'] {
			gap: var(--spacing-md);
		}
		.card[data-gap='lg'] {
			gap: var(--spacing-lg);
		}
		/* Ring = the border painted as a conic gradient; glow = three circling box-shadows. */
		.card {
			--card-surface: var(--bg);
			transition:
				--card-ring-a 0.7s ease,
				--card-glow-a 1s ease;
		}
		.card[data-loading] {
			--card-ring-a: 1;
			--card-glow-a: 1;
			transition-duration: 0.5s;
		}
		.card[data-active]:not([data-bg='rainbow']) {
			border-color: transparent;
			background-image:
				linear-gradient(var(--card-surface), var(--card-surface)),
				conic-gradient(
					from var(--card-loading-angle),
					transparent 0 35%,
					rgb(99 102 241 / var(--card-ring-a)),
					rgb(139 92 246 / var(--card-ring-a)),
					rgb(236 72 153 / var(--card-ring-a)),
					rgb(245 158 11 / var(--card-ring-a)),
					transparent
				),
				linear-gradient(var(--bd), var(--bd));
			background-origin: border-box;
			background-clip: padding-box, border-box, border-box;
			box-shadow:
				calc(sin(var(--card-loading-angle)) * 6px) calc(cos(var(--card-loading-angle)) * -6px)
					16px -4px rgb(99 102 241 / calc(var(--card-glow-a) * 0.6)),
				calc(sin(var(--card-loading-angle) + 120deg) * 6px)
					calc(cos(var(--card-loading-angle) + 120deg) * -6px) 16px -4px
					rgb(236 72 153 / calc(var(--card-glow-a) * 0.5)),
				calc(sin(var(--card-loading-angle) + 240deg) * 6px)
					calc(cos(var(--card-loading-angle) + 240deg) * -6px) 16px -4px
					rgb(245 158 11 / calc(var(--card-glow-a) * 0.5));
			animation: card-loading-spin 1.3s linear infinite;
		}
		@keyframes card-loading-spin {
			to {
				--card-loading-angle: 360deg;
			}
		}
		@media (prefers-reduced-motion: reduce) {
			.card[data-active]:not([data-bg='rainbow']) {
				animation: none;
				box-shadow: none;
			}
		}
		.hoverable {
			transition:
				border-color 0.2s ease,
				--card-ring-a 0.7s ease,
				--card-glow-a 1s ease;
		}
		.hoverable:hover {
			border-color: var(--tx);
		}
	}
</style>
