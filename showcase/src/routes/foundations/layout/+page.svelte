<script lang="ts">
	import Card from '@zeyolabs/ui/card/Card.svelte';
	import Cluster from '@zeyolabs/ui/layout/Cluster.svelte';
	import Grid from '@zeyolabs/ui/layout/Grid.svelte';
	import Section from '@zeyolabs/ui/layout/Section.svelte';
	import Shell from '@zeyolabs/ui/layout/Shell.svelte';
	import SplitShell from '@zeyolabs/ui/layout/SplitShell.svelte';
	import Stack from '@zeyolabs/ui/layout/Stack.svelte';
	import PageHero from '@zeyolabs/ui/page-hero/PageHero.svelte';
	import Span from '@zeyolabs/ui/text/Span.svelte';
	import Text from '@zeyolabs/ui/text/Text.svelte';
	import Title from '@zeyolabs/ui/text/Title.svelte';

	import ShowcaseSection from '#lib/showcase/ShowcaseSection.svelte';

	const spacingSteps: { name: string; px: string }[] = [
		{ name: 'xs', px: '8px' },
		{ name: 'sm', px: '12px' },
		{ name: 'md', px: '20px' },
		{ name: 'lg', px: '32px' },
		{ name: 'xl', px: '48px' },
		{ name: '2xl', px: '64px' },
		{ name: '3xl', px: '96px' },
		{ name: '4xl', px: '128px' },
	];

	const bgTokens: { name: string; sample: 'bg' | 'rainbow' | 'sf' | 'sfh' | 'tertiary' }[] = [
		{ name: 'sf', sample: 'sf' },
		{ name: 'sfh', sample: 'sfh' },
		{ name: 'tertiary', sample: 'tertiary' },
		{ name: 'rainbow', sample: 'rainbow' },
	];

	let activeRow = $state(0);
	const classDemoRows = ['Row one', 'Row two', 'Row three'];

	let refSection: HTMLElement | null = $state(null);
	let refFlash = $state(false);
	function flashRefSection() {
		refFlash = true;
		refSection?.scrollIntoView({ behavior: 'smooth', block: 'center' });
		setTimeout(() => (refFlash = false), 900);
	}

	const statCards = ['Total sent', 'Reply rate', 'Bounced', 'Opted out'];
</script>

<svelte:head>
	<title>Layout — Zeyo UI</title>
</svelte:head>

<PageHero
	eyebrow="Foundations"
	sub="The spacing scale and layout primitives every page should build from — instead of a new one-off flex flex-col gap-3.5 px-4.5 every time. @zeyolabs/ui/layout/*, plus a padding prop on Card."
	title="Layout"
/>

<div class="note">
	Every page currently reimplements the same handful of shapes slightly differently — a page
	max-width wrapper, a filter/toolbar row, a stat-card grid, a sidebar+content split — each with its
	own hand-picked gap and its own breakpoint. These primitives are that shared vocabulary.
</div>

<ShowcaseSection
	code={`--spacing-xs: calc(var(--spacing) * 2);   /* 8px */
--spacing-sm: calc(var(--spacing) * 3);   /* 12px */
--spacing-md: calc(var(--spacing) * 5);   /* 20px */
--spacing-lg: calc(var(--spacing) * 8);   /* 32px */
--spacing-xl: calc(var(--spacing) * 12);  /* 48px */
--spacing-2xl: calc(var(--spacing) * 16); /* 64px */
--spacing-3xl: calc(var(--spacing) * 24); /* 96px */
--spacing-4xl: calc(var(--spacing) * 32); /* 128px */`}
	description="@zeyolabs/ui/spacing.css — plain CSS custom properties (deliberately not a Tailwind @theme key — see the file's own comment for why). xs-xl cover component-internal gaps/padding; 2xl-4xl are the section-band tier, for a full-bleed page section's own vertical padding (Section's `padding` prop below), a range component gaps never need to reach. Reach for these before a new arbitrary value; layout-only Tailwind spacing is still fine where none of these fit."
	title="Spacing scale"
>
	<Stack gap="sm">
		{#each spacingSteps as step (step.name)}
			<Cluster gap="sm">
				<span class="spacing-label">{step.name}</span>
				<div style:width={step.px} class="spacing-bar"></div>
				<span class="spacing-px">{step.px}</span>
			</Cluster>
		{/each}
	</Stack>
</ShowcaseSection>

<ShowcaseSection
	code={`<Shell variant="wide">   <!-- max-width: 1200px -->
  ...
</Shell>
<Shell variant="narrow"> <!-- max-width: 720px -->
  ...
</Shell>
<Shell variant="fill">   <!-- viewport height minus the TopBar -->
  ...
</Shell>`}
	description="The page max-width wrapper every top-level route renders inside — variant='full' skips the cap entirely for edge-to-edge shells, and variant='fill' is a padded column exactly the height of the viewport under the TopBar, for screens like the Unibox whose panes scroll inside themselves."
	title="Shell"
>
	<div class="viewport-demo">
		<Text class="viewport-caption" color="tertiary" size="sm">variant="wide" (1200px)</Text>
		<div class="viewport-frame">
			<Shell variant="wide">
				<div class="fill-block">Shell content sits here, centered, max-width: 1200px</div>
			</Shell>
		</div>
		<Text class="viewport-caption" color="tertiary" size="sm">variant="narrow" (720px)</Text>
		<div class="viewport-frame">
			<Shell variant="narrow">
				<div class="fill-block">max-width: 720px</div>
			</Shell>
		</div>
	</div>
</ShowcaseSection>

<ShowcaseSection
	code={`<Section spacing="sm">...</Section>
<Section spacing="md">...</Section>
<Section spacing="lg">...</Section>`}
	description="A vertical block with a semantic bottom margin — the space between one section of a page and the next."
	title="Section — spacing"
>
	<div class="section-demo">
		<Section spacing="sm">
			<div class="fill-block fill-block--sm">spacing="sm" (12px below)</div>
		</Section>
		<Section spacing="md">
			<div class="fill-block fill-block--sm">spacing="md" (20px below)</div>
		</Section>
		<Section spacing="lg">
			<div class="fill-block fill-block--sm">spacing="lg" (32px below)</div>
		</Section>
		<div class="fill-block fill-block--sm">(next block)</div>
	</div>
</ShowcaseSection>

<ShowcaseSection
	code={`<Section bg="tertiary" padding="4xl">
  <div class="page-inner">...</div>
</Section>`}
	description="padding + bg turn Section into a full-bleed page band — the colored, padded section every landing page reimplements slightly differently (background: X; padding: Npx var(--spacing-xl);) — instead of a new hand-written CSS rule per section. padding sets top/bottom via the section-band tier (2xl-4xl reach here, xs-xl don't); left/right is always var(--spacing-xl), dropping to var(--spacing-md) under 700px — that half doesn't vary section to section, only the vertical number does. Omit padding for the plain spacer-only behavior above."
	title="Section — padding + bg (page bands)"
>
	<div class="band-demo">
		<Section bg="tertiary" padding="2xl">
			<Text centered size="sm">bg="tertiary" padding="2xl"</Text>
		</Section>
	</div>
</ShowcaseSection>

<ShowcaseSection
	code={`<Section bg="sf" padding="lg" contentWidth="360px" centered>
  <Title level={5}>Capped + centered</Title>
  <Text color="secondary" size="sm">Full-bleed background, capped/centered content.</Text>
</Section>`}
	description="contentWidth caps + centers children in an inner max-width/margin:0 auto wrapper — the div every full-bleed section band needs when its content shouldn't stretch the full width. centered adds text-align: center on the section itself, cascading down. Both replace a page-local max-width/margin/text-align class on the section's own wrapper div."
	title="Section — contentWidth + centered"
>
	<div class="band-demo">
		<Section bg="sf" centered contentWidth="360px" padding="lg">
			<Stack gap="xs">
				<Title level={5}>Capped + centered</Title>
				<Text color="secondary" size="sm">Full-bleed background, capped/centered content.</Text>
			</Stack>
		</Section>
	</div>
</ShowcaseSection>

<ShowcaseSection
	code={`let section: HTMLElement | null = $state(null);
</script>

<Section bind:ref={section} bg="tertiary" padding="lg">...</Section>
<button onclick={() => section?.scrollIntoView({ behavior: 'smooth' })}>Scroll to it</button>`}
	description="ref is a bindable DOM ref — bind:ref gets the real section element, same as bind:this on a plain element. This is what unblocks a Section that also needs an IntersectionObserver/scroll target, without falling back to a hand-written section."
	title="Section — ref (DOM binding)"
>
	<Stack gap="sm">
		<button class="class-demo-btn" onclick={flashRefSection} type="button">
			Scroll to + flash the section below
		</button>
		<div class="band-demo">
			<Section
				class={refFlash ? 'ref-demo-flash' : ''}
				bg="tertiary"
				padding="lg"
				bind:ref={refSection}
			>
				<Text centered size="sm">bind:ref={'{section}'} points at this element</Text>
			</Section>
		</div>
	</Stack>
</ShowcaseSection>

<ShowcaseSection
	code={`<Stack gap="sm">
  <div>Row one</div>
  <div>Row two</div>
  <div>Row three</div>
</Stack>

<!-- gap="none" — flush rows, separated only by their own border -->
<Stack gap="none">
  <div class="list-row">Row one</div>
  <div class="list-row">Row two</div>
</Stack>`}
	description="Vertical flex list with a scale-backed gap — for any stacked column of rows/cards. gap='none' is for a dense list whose rows are meant to sit flush, relying on each row's own border-bottom for separation instead of a visible gap between them."
	title="Stack"
>
	<div class="stack-demo">
		<Stack gap="sm">
			<div class="fill-block fill-block--sm">Row one</div>
			<div class="fill-block fill-block--sm">Row two</div>
			<div class="fill-block fill-block--sm">Row three</div>
		</Stack>
	</div>
</ShowcaseSection>

<ShowcaseSection
	code={`<Cluster gap="sm">
  <Badge color="info">Active</Badge>
  <Badge color="warning">Paused</Badge>
  <Badge color="success">Completed</Badge>
</Cluster>
<Cluster gap="xs" nowrap><!-- one line: a truncating item + badges --></Cluster>`}
	description="Horizontal, wrapping flex row with a scale-backed gap — the filter/toolbar row above a table (resize the window to see it wrap). nowrap keeps the items on one line instead, for a row that truncates one of them, such as a list row's header."
	title="Cluster"
>
	<Cluster gap="sm">
		{#each Array.from({ length: 8 }) as _, i (i)}
			<div class="pill-block">Filter {i + 1}</div>
		{/each}
	</Cluster>
</ShowcaseSection>

<ShowcaseSection
	code={`<Grid columns={4} gap="md">
  <Stat>...</Stat>
  <Stat>...</Stat>
  <Stat>...</Stat>
  <Stat>...</Stat>
</Grid>

<Grid columns="2fr 1fr" gap="md"><!-- two-column split --></Grid>

<Grid minColumnWidth="140px" gap="sm"><!-- responsive, no breakpoint to pick --></Grid>

<Grid columns="1fr 300px" gap="md" stack><!-- collapses to 1 column below 960px --></Grid>
<Grid columns="1fr 2fr" fill><!-- fills a flex column; cards inside scroll, not stretch --></Grid>`}
	description="One component for fixed-column stat grids AND two-column splits. minColumnWidth uses auto-fit/minmax so the column count adapts continuously to the available width — no breakpoint to hand-pick. stack collapses a fixed columns split to 1fr below 960px — Grid sets its columns via a style: directive (an inline style), which no external stylesheet can override without !important, so that override lives inside Grid itself instead of every caller hand-rolling a page-local :global(.grid-layout) media query with !important. fill is for a grid inside a flex column (like a Shell variant='fill'): it takes the space left and lets the rows shrink to it, so cards that hold their own scrolling list scroll inside the grid instead of stretching it."
	title="Grid"
>
	<Stack gap="md">
		<div>
			<Text class="grid-demo-caption" color="tertiary" size="sm">columns={'{4}'}</Text>
			<Grid columns={4} gap="md">
				{#each statCards as label (label)}
					<div class="fill-block fill-block--sm">{label}</div>
				{/each}
			</Grid>
		</div>
		<div>
			<Text class="grid-demo-caption" color="tertiary" size="sm">columns="2fr 1fr"</Text>
			<Grid columns="2fr 1fr" gap="md">
				<div class="fill-block fill-block--sm">2fr</div>
				<div class="fill-block fill-block--sm">1fr</div>
			</Grid>
		</div>
		<div>
			<Text class="grid-demo-caption" color="tertiary" size="sm"
				>minColumnWidth="120px" — resize the window</Text
			>
			<Grid gap="sm" minColumnWidth="120px">
				{#each Array.from({ length: 6 }) as _, i (i)}
					<div class="fill-block fill-block--sm">Card {i + 1}</div>
				{/each}
			</Grid>
		</div>
		<div>
			<Text class="grid-demo-caption" color="tertiary" size="sm"
				>columns="1fr 300px" stack — shrink the browser below 960px</Text
			>
			<Grid columns="1fr 300px" gap="md" stack>
				<div class="fill-block fill-block--sm">1fr</div>
				<div class="fill-block fill-block--sm">300px, collapses below 960px</div>
			</Grid>
		</div>
	</Stack>
</ShowcaseSection>

<ShowcaseSection
	code={`<SplitShell sidebarWidth={200}>
  {#snippet sidebar()}...{/snippet}
  {#snippet content()}...{/snippet}
</SplitShell>`}
	description="Sidebar+content app shell — one shared collapse point (1024px) instead of every page picking its own breakpoint. Shrink the window below that to see it stack."
	title="SplitShell"
>
	<div class="split-demo">
		<SplitShell sidebarWidth={180}>
			{#snippet sidebar()}
				<div class="split-demo-sidebar">
					<div class="split-demo-item split-demo-item--active">Overview</div>
					<div class="split-demo-item">Activity</div>
					<div class="split-demo-item">Settings</div>
				</div>
			{/snippet}
			{#snippet content()}
				<div class="split-demo-content">Content panel</div>
			{/snippet}
		</SplitShell>
	</div>
</ShowcaseSection>

<ShowcaseSection
	code={`<Card padding="sm">...</Card>
<Card padding="md">...</Card>
<Card padding="lg">...</Card>`}
	description="Card's own padding prop — reach for this before a hand-picked p-5 or an arbitrary py-[22px] px-6."
	title="Card padding"
>
	<Card padding="sm">padding="sm"</Card>
	<Card padding="md">padding="md"</Card>
	<Card padding="lg">padding="lg"</Card>
</ShowcaseSection>

<ShowcaseSection
	code={`<Card bg="tertiary" padding="md">...</Card>
<Stack bg="sf" gap="sm">...</Stack>
<Cluster bg="sfh" gap="sm">...</Cluster>
<Grid bg="tertiary" columns={2} gap="sm">...</Grid>
<Section bg="rainbow" padding="lg">...</Section>`}
	description="Every layout primitive (Card, Stack, Cluster, Grid, Section) takes the same bg prop — a surface token (bg/sf/sfh/tertiary, mapped to the matching CSS var) or 'rainbow', the animated gradient panel used for feature/product-UI showcase blocks (previously hand-copied across 9+ marketing files). Omit for transparent, the historical default for every one of these."
	title="bg — shared across every layout primitive"
>
	<Grid gap="sm" minColumnWidth="140px">
		{#each bgTokens as token (token.name)}
			<Card bg={token.sample} padding="md">
				<Span bold centered>{token.name}</Span>
			</Card>
		{/each}
	</Grid>
</ShowcaseSection>

<ShowcaseSection
	code={`<Cluster class={active === i ? 'row-active' : ''} gap="sm">
  Row {i}
</Cluster>`}
	description="class is layout-only, same rule as Button/Text — margin, or (as here) a conditional class computed by the caller for state the primitive itself has no prop for. Cluster/Stack/Grid/Section always render their own base class too (cluster/stack/grid-layout/nothing) — yours is appended, not a replacement. This is the escape hatch for a highlighted/active row in a list, without going back to a hand-written flex div."
	title="class — conditional/dynamic classes"
>
	<Stack gap="xs">
		{#each classDemoRows as row, i (row)}
			<Cluster
				class="class-demo-row {activeRow === i ? 'class-demo-row--active' : ''}"
				gap="sm"
				justify="between"
			>
				<Span>{row}</Span>
				<button class="class-demo-btn" onclick={() => (activeRow = i)} type="button">
					{activeRow === i ? 'Active' : 'Select'}
				</button>
			</Cluster>
		{/each}
	</Stack>
</ShowcaseSection>

<style>
	.note {
		max-width: 720px;
		margin-bottom: var(--spacing-xl);
		padding: var(--spacing-sm) var(--spacing-md);
		font-size: 12px;
		line-height: 1.6;
		color: var(--txs);
		background: var(--sf);
		border: 1px solid var(--bd);
		border-radius: var(--radius-sm);
	}

	.spacing-label {
		width: 24px;
		flex-shrink: 0;
		font-family: var(--font-mono);
		font-size: 11px;
		color: var(--txs);
	}
	.spacing-bar {
		height: 14px;
		background: var(--acc);
		border-radius: var(--radius-xs);
	}
	.spacing-px {
		font-family: var(--font-mono);
		font-size: 11px;
		color: var(--txt);
	}

	.viewport-demo {
		width: 100%;
	}
	:global(.viewport-caption) {
		font-family: var(--font-mono);
		margin: 0 0 var(--spacing-xs);
	}
	.viewport-frame {
		overflow-x: auto;
		border: 1px dashed var(--bd);
		border-radius: var(--radius-sm);
		margin-bottom: var(--spacing-md);
	}
	.viewport-frame:last-child {
		margin-bottom: 0;
	}

	.band-demo,
	.section-demo,
	.stack-demo {
		width: 100%;
	}
	.band-demo {
		overflow: hidden;
		border-radius: var(--radius-sm);
	}
	:global(.ref-demo-flash) {
		outline: 2px solid var(--acc);
		outline-offset: -2px;
		transition: outline-color 0.2s ease;
	}

	:global(.class-demo-row) {
		width: 100%;
		padding: var(--spacing-sm) var(--spacing-md);
		background: var(--sf);
		border-radius: var(--radius-sm);
	}
	:global(.class-demo-row--active) {
		background: var(--acc);
	}
	:global(.class-demo-row--active p) {
		color: var(--bg);
	}
	.class-demo-btn {
		flex-shrink: 0;
		padding: var(--spacing-xs) var(--spacing-sm);
		font-family: var(--font-sans);
		font-size: 11px;
		color: var(--txs);
		background: var(--bg);
		border: 1px solid var(--bd);
		border-radius: var(--radius-xs);
		cursor: pointer;
	}

	:global(.grid-demo-caption) {
		font-family: var(--font-mono);
		margin: 0 0 var(--spacing-xs);
	}

	.split-demo {
		width: 100%;
		height: 220px;
		border: 1px solid var(--bd);
		border-radius: var(--radius-sm);
		overflow: hidden;
	}
	.split-demo-sidebar {
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: var(--spacing-sm);
		height: 100%;
		background: var(--sf);
	}
	.split-demo-item {
		padding: var(--spacing-xs) var(--spacing-sm);
		font-size: 12px;
		border-radius: var(--radius-xs);
		color: var(--txs);
	}
	.split-demo-item--active {
		background: var(--bg);
		color: var(--tx);
		font-weight: 600;
	}
	.split-demo-content {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		color: var(--txt);
		font-size: 12px;
	}

	.fill-block {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--spacing-md);
		background: var(--sf);
		border: 1px solid var(--bd);
		border-radius: var(--radius-xs);
		font-size: 12px;
		color: var(--txs);
		text-align: center;
	}
	.fill-block--sm {
		padding: var(--spacing-sm);
	}

	.pill-block {
		padding: var(--spacing-xs) var(--spacing-sm);
		background: var(--sf);
		border: 1px solid var(--bd);
		border-radius: var(--radius-full);
		font-size: 11.5px;
		color: var(--txs);
		white-space: nowrap;
	}
</style>
