<script lang="ts">
	import Card from '@zeyolabs/ui/card/Card.svelte';
	import Stack from '@zeyolabs/ui/layout/Stack.svelte';
	import PageHero from '@zeyolabs/ui/page-hero/PageHero.svelte';
	import Span from '@zeyolabs/ui/text/Span.svelte';
	import Text from '@zeyolabs/ui/text/Text.svelte';
	import Title from '@zeyolabs/ui/text/Title.svelte';

	import ShowcaseSection from '#lib/showcase/ShowcaseSection.svelte';

	type Level = 1 | 2 | 3 | 4 | 5 | 6;

	const headings: { level: Level; size: string }[] = [
		{ level: 1, size: '50px / 400 / -2px' },
		{ level: 2, size: '48px / 400 / -2px' },
		{ level: 3, size: '32px / 400 / -1px' },
		{ level: 4, size: '22px / 600' },
		{ level: 5, size: '18px / 600' },
		{ level: 6, size: '16px / 600' },
	];
</script>

<svelte:head>
	<title>Typography — Zeyo UI</title>
</svelte:head>

<PageHero
	eyebrow="Foundations"
	sub="The h1-h6 scale and body-text variants come from @zeyolabs/ui/typography.css — one @theme block, imported by every app. A component's own scoped style block still wins for a bespoke size; this is only the default."
	title="Typography"
/>

<ShowcaseSection
	code={headings.map((h) => `<Title level={${h.level}}>The quick brown fox</Title>`).join('\n')}
	description="Font family: --font-heading. Size / weight / letter-spacing noted per level. level picks the size (and the tag, unless you pass tag) — there's no separate size prop, so a custom font-size can never drift from its matching letter-spacing/line-height."
	title="Heading scale"
>
	<div class="text-reset">
		<Stack gap="md">
			{#each headings as h (h.level)}
				<div class="heading-row">
					<Title level={h.level}>The quick brown fox</Title>
					<span class="heading-meta">h{h.level} · {h.size}</span>
				</div>
			{/each}
		</Stack>
	</div>
</ShowcaseSection>

<ShowcaseSection
	code={`<Title level={5} tag="h1">Real h1, level-5 size</Title>
<Title level={5}>Default h5, level-5 size</Title>`}
	description="tag sets the element without changing the size — keep one real h1 per page for SEO and screen readers while styling it at any level. The two lines below look identical."
	title="Tag vs level"
>
	<div class="text-reset">
		<Stack gap="md">
			<Title level={5} tag="h1">Real h1, level-5 size</Title>
			<Title level={5}>Default h5, level-5 size</Title>
		</Stack>
	</div>
</ShowcaseSection>

<ShowcaseSection
	code={`<Text>Default body copy — 13px, 400 weight.</Text>
<Text size="sm">Small — 11px, for captions and helper text.</Text>
<Text size="lg">Large — 15px, for intros and lead text.</Text>
<Text bold>Bold — inherits size, 600 weight.</Text>
<Text color="secondary">Secondary color — var(--txs).</Text>
<Text color="tertiary">Tertiary color — var(--txt).</Text>
<Span>Inline span instead of a block p.</Span>`}
	description="@zeyolabs/ui/text/Text.svelte — the typed front door to typography.css's body-text utilities (.small/.large/.bold), plus a color prop so nothing reaches for a hardcoded hex."
	title="Text"
>
	<div class="text-reset">
		<Stack gap="md">
			<Text>Default body copy — 13px, 400 weight.</Text>
			<Text size="sm">Small — 11px, for captions and helper text.</Text>
			<Text size="lg">Large — 15px, for intros and lead text.</Text>
			<Text bold>Bold — inherits size, 600 weight.</Text>
			<Text color="secondary">Secondary color — var(--txs).</Text>
			<Text color="tertiary">Tertiary color — var(--txt).</Text>
			<Span>Inline span instead of a block p.</Span>
		</Stack>
	</div>
</ShowcaseSection>

<ShowcaseSection
	code={`<Title level={4} color="success">Success</Title>
<Title level={4} color="warning">Warning</Title>
<Title level={4} color="error">Error</Title>
<Title level={4} color="info">Info</Title>
<Title level={4} color="accent">Accent</Title>`}
	description="Both Text and Title share the same color enum — secondary/tertiary for neutral text, plus the five semantic tokens. Omit color for primary (var(--tx)), the inherited default."
	title="Color tokens"
>
	<div class="text-reset">
		<Stack gap="md">
			<Title color="success" level={4}>Success</Title>
			<Title color="warning" level={4}>Warning</Title>
			<Title color="error" level={4}>Error</Title>
			<Title color="info" level={4}>Info</Title>
			<Title color="accent" level={4}>Accent</Title>
		</Stack>
	</div>
</ShowcaseSection>

<ShowcaseSection
	code={`<Text bg="error">Google — doesn't look like an email</Text>
<Text bg="warning">Needs review</Text>
<Text bg="success">Verified</Text>
<Span bg="info">beta</Span>`}
	description="bg tints a small chip background behind the text — same Color enum as color, its own .bg-* classes in typography.css (a real color-mix toward transparent; Tailwind has no utility for mixing a token toward transparent). For flagging one value — a mismatched CSV sample, an invalid table cell — without tinting the whole row the way TableRow's warning prop does."
	title="bg — tinted background chip"
>
	<div class="text-reset">
		<Stack gap="md">
			<Text bg="error">Google — doesn't look like an email</Text>
			<Text bg="warning">Needs review</Text>
			<Text bg="success">Verified</Text>
			<Span bg="info">beta</Span>
		</Stack>
	</div>
</ShowcaseSection>

<ShowcaseSection
	code={`<Card bg="rainbow" padding="md">
  <Text bold color="white">white — solid, full opacity</Text>
  <Text color="whiteSecondary">whiteSecondary — 70% opacity</Text>
</Card>`}
	description="var(--tx)/var(--txs)/etc are theme-aware — fine on the page's own background, but wrong on a fixed dark surface (a gradient panel, an image overlay) that doesn't flip with light/dark mode. white/whiteSecondary are hardcoded, not theme-aware, specifically for that case — reach for the regular tokens everywhere else."
	title="white / whiteSecondary — for dark/gradient surfaces"
>
	<Card bg="rainbow" padding="md">
		<Stack gap="xs">
			<Text bold color="white">white — solid, full opacity</Text>
			<Text color="whiteSecondary">whiteSecondary — 70% opacity</Text>
		</Stack>
	</Card>
</ShowcaseSection>

<ShowcaseSection
	code={`<Title level={3} maxWidth="360px" centerBelow>Capped, left-aligned next to a panel</Title>
<Text maxWidth="340px" centerBelow color="secondary">
  Becomes a centered block once the layout stacks below 960px.
</Text>`}
	description="maxWidth caps a heading/paragraph's own width (a real px value, so a style: directive, not a fixed token) — for the common case of a heading sitting beside a side panel, capped short of the panel instead of running the full row width. centerBelow adds text-align: center + margin-inline: auto below 960px, so once that side-by-side layout stacks (shrink the browser to see it), the now-full-width text becomes a centered block instead of staying pinned left. Only meaningful for block usage — a heading, or Text with span omitted."
	title="maxWidth + centerBelow — capped text that centers on stack"
>
	<div class="maxwidth-demo">
		<div class="maxwidth-demo-text">
			<Title centerBelow level={3} maxWidth="360px">Capped, left-aligned next to a panel</Title>
			<Text centerBelow color="secondary" maxWidth="340px">
				Becomes a centered block once the layout stacks below 960px — shrink the browser to see it.
			</Text>
		</div>
		<div class="maxwidth-demo-panel">side panel</div>
	</div>
</ShowcaseSection>

<ShowcaseSection
	code={`<Text clamp={2} maxWidth="320px">
  A long preview — an email snippet, a comment body, anything that
  might run several lines — hard-cut after 2 lines, no ellipsis.
</Text>`}
	description="clamp caps Text/Span/Title to N lines, then hard-cuts past it — no ellipsis, unlike truncate's single-line + ellipsis. Needs a bounded width from context, same as truncate/maxWidth."
	title="clamp — multi-line cutoff"
>
	<div style="max-width: 320px;" class="maxwidth-demo-text">
		<Text clamp={2} color="secondary">
			A long preview — an email snippet, a comment body, anything that might run several lines —
			hard-cut after 2 lines, no ellipsis.
		</Text>
	</div>
</ShowcaseSection>

<ShowcaseSection
	code={`font-family: var(--font-sans);   /* body */
font-family: var(--font-heading); /* h1-h6 */
font-family: var(--font-mono);    /* code, tabular data */`}
	description="Three font-family tokens, set once in typography.css: body, headings, and code."
	title="Font families"
>
	<Stack gap="sm">
		<Text class="font-sample font-sample--sans">Sans — var(--font-sans)</Text>
		<Text class="font-sample font-sample--heading">Heading — var(--font-heading)</Text>
		<Text class="font-sample font-sample--mono">Mono — var(--font-mono)</Text>
	</Stack>
</ShowcaseSection>

<style>
	.text-reset {
		width: 100%;
	}
	.text-reset :global(h1),
	.text-reset :global(h2),
	.text-reset :global(h3),
	.text-reset :global(h4),
	.text-reset :global(h5),
	.text-reset :global(h6),
	.text-reset :global(p) {
		margin: 0;
	}
	.heading-row {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--spacing-md);
	}
	.heading-meta {
		flex-shrink: 0;
		font-family: var(--font-mono);
		font-size: 10.5px;
		color: var(--txt);
	}
	:global(.font-sample) {
		margin: 0;
		font-size: 16px;
	}
	:global(.font-sample--sans) {
		font-family: var(--font-sans);
	}
	:global(.font-sample--heading) {
		font-family: var(--font-heading);
	}
	:global(.font-sample--mono) {
		font-family: var(--font-mono);
		font-size: 14px;
	}

	.maxwidth-demo {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		gap: var(--spacing-lg);
		width: 100%;
	}
	.maxwidth-demo-text {
		flex: 1;
		min-width: 0;
	}
	.maxwidth-demo-panel {
		display: flex;
		flex-shrink: 0;
		align-items: center;
		justify-content: center;
		width: 160px;
		height: 80px;
		font-size: 12px;
		color: var(--txt);
		background: var(--sf);
		border: 1px solid var(--bd);
		border-radius: var(--radius-sm);
	}
</style>
