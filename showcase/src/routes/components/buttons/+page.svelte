<script lang="ts">
	import { resolve } from '$app/paths';
	import { Pencil, Plus, Trash2 } from '@lucide/svelte';
	import { Button } from '@zeyolabs/ui/form';
	import PageHero from '@zeyolabs/ui/page-hero/PageHero.svelte';
	import Text from '@zeyolabs/ui/text/Text.svelte';
	import Title from '@zeyolabs/ui/text/Title.svelte';

	import ShowcaseSection from '#lib/showcase/ShowcaseSection.svelte';

	let loading = $state(false);

	function simulate() {
		loading = true;
		setTimeout(() => (loading = false), 1500);
	}
</script>

<svelte:head>
	<title>Buttons — Zeyo UI</title>
</svelte:head>

<PageHero
	eyebrow="Components"
	sub="Always <Button> — there's no hand-styled-<button> escape hatch anymore. size, icon, and variant cover the dimensions and colors a button can need. Never override its visuals via class/style."
	title="Buttons"
/>

<ShowcaseSection
	code={`<Button variant="default">Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="ghost-destructive">Ghost destructive</Button>
<Button variant="link">Link</Button>`}
	description="From @zeyolabs/ui/form. Layout-only classes (mt-4, w-full) are fine — never padding/background/color/border."
	title="Variants"
>
	<Button variant="default">Default</Button>
	<Button variant="secondary">Secondary</Button>
	<Button variant="destructive">Destructive</Button>
	<Button variant="ghost">Ghost</Button>
	<Button variant="ghost-destructive">Ghost destructive</Button>
	<Button variant="link">Link</Button>
</ShowcaseSection>

<ShowcaseSection
	code="<Button variant=&quot;shiny&quot;>Get started</Button>"
	description="An animated gradient CTA for a handful of high-stakes spots (pricing, waitlist signup) — not general-purpose, but shared like every other variant. Originated as marketing's own brand fork; promoted into @zeyolabs/ui/template.css so any app can reach for it without re-forking the CSS."
	title="Decorative variant"
>
	<Button variant="shiny">Get started</Button>
</ShowcaseSection>

<ShowcaseSection
	code={`<Button>Default (35px)</Button>
<Button size="sm">Small (28px)</Button>`}
	description="Omit size for the default 35px height. size='small' is the one shorter footprint (28px) — for toolbars, inline row actions, dense panels."
	title="Sizes"
>
	<Button>Default (35px)</Button>
	<Button size="sm">Small (28px)</Button>
</ShowcaseSection>

<ShowcaseSection
	code={`<Button icon variant="ghost" aria-label="Edit"><Pencil size={14} /></Button>
<Button icon size="sm" variant="ghost" aria-label="Delete"><Trash2 size={12} /></Button>`}
	description="Square, zero-padding footprint for a single icon child. Combines with size (icon size='small' = 28×28, icon alone = 35×35). Always pair with aria-label — there's no visible text."
	title="Icon"
>
	<Button aria-label="Edit" icon variant="ghost">
		<Pencil size={14} />
	</Button>
	<Button aria-label="Delete" icon size="sm" variant="ghost">
		<Trash2 size={12} />
	</Button>
	<Button aria-label="Add" icon variant="default">
		<Plus size={16} />
	</Button>
</ShowcaseSection>

<ShowcaseSection
	code={`<Button disabled>Disabled</Button>
<Button loading>Loading</Button>
<Button loading loadingMessage="Saving…">Save</Button>`}
	description="loading (or a wired-up form prop) swaps the label for a spinner automatically — no manual isPending wiring."
	title="States"
>
	<Button disabled>Disabled</Button>
	<Button loading>Loading</Button>
	<Button loading loadingMessage="Saving…">Save</Button>
	<Button {loading} onclick={simulate}>Click to simulate</Button>
</ShowcaseSection>

<ShowcaseSection
	code={`<Button href={resolve('dashboard')}>Renders as &lt;a&gt;</Button>`}
	description="Passing href renders an <a class='btn ...'> instead of a <button> — same visual, correct semantics for navigation. Route strings always go through resolve()."
	title="As a link"
>
	<Button href={resolve('components/buttons')}>Renders as &lt;a&gt;</Button>
</ShowcaseSection>

<div class="not-a-button-note">
	<Title class="not-a-button-title" level={6}>When it's not a Button</Title>
	<Text class="not-a-button-text" color="secondary" size="sm">
		A plain <code>&lt;button&gt;</code> is only for chrome that isn't visually a button:
	</Text>
	<ul>
		<li>
			A checkbox-shaped control — use the <code>.form-checkbox</code> pattern (see
			<a href={resolve('components/forms')}>Forms</a>) instead of a bordered square that toggles
			color.
		</li>
		<li>
			A full-width dropdown/menu row or clickable list row — no color/border/padding to swap in,
			it's a different shape entirely.
		</li>
		<li>
			An OAuth brand button (Google, etc.) — bound by that provider's brand guidelines, not this
			design system's tokens.
		</li>
	</ul>
	<Text class="not-a-button-text" color="secondary" size="sm"
		>Everything with a color and a size is a <code>&lt;Button&gt;</code>.</Text
	>
</div>

<style>
	.not-a-button-note {
		max-width: 640px;
		padding: var(--spacing-md);
		background: var(--sf);
		border: 1px solid var(--bd);
		border-radius: var(--radius-sm);
	}
	:global(.not-a-button-title) {
		margin: 0 0 var(--spacing-xs);
	}
	:global(.not-a-button-text) {
		margin: 0 0 var(--spacing-xs);
	}
	.not-a-button-note ul {
		margin: 0 0 var(--spacing-xs);
		padding-left: 18px;
		font-size: 12.5px;
		color: var(--txs);
		line-height: 1.6;
	}
	.not-a-button-note li + li {
		margin-top: 4px;
	}
	.not-a-button-note code {
		font-family: var(--font-mono);
		font-size: 11.5px;
		color: var(--tx);
	}
	.not-a-button-note a {
		color: var(--tx);
	}
</style>
