<script lang="ts">
	import type { PercentageRingSize } from '@zeyolabs/ui/percentage-ring/types';

	import { Mail } from '@lucide/svelte';
	import Card from '@zeyolabs/ui/card/Card.svelte';
	import CardBody from '@zeyolabs/ui/card/CardBody.svelte';
	import CardFooter from '@zeyolabs/ui/card/CardFooter.svelte';
	import CardHeader from '@zeyolabs/ui/card/CardHeader.svelte';
	import DistributionBar from '@zeyolabs/ui/distribution-bar/DistributionBar.svelte';
	import FAQList from '@zeyolabs/ui/faq/FAQList.svelte';
	import { Button } from '@zeyolabs/ui/form';
	import Grid from '@zeyolabs/ui/layout/Grid.svelte';
	import ListRow from '@zeyolabs/ui/list-row/ListRow.svelte';
	import MiniStat from '@zeyolabs/ui/mini-stat/MiniStat.svelte';
	import PageHero from '@zeyolabs/ui/page-hero/PageHero.svelte';
	import PercentageRing from '@zeyolabs/ui/percentage-ring/PercentageRing.svelte';
	import { toPercentage } from '@zeyolabs/ui/schema';
	import Stat from '@zeyolabs/ui/stat/Stat.svelte';
	import Text from '@zeyolabs/ui/text/Text.svelte';

	import ShowcaseSection from '#lib/showcase/ShowcaseSection.svelte';

	let reloading = $state(false);
	let version = $state(0);
	function reload() {
		reloading = true;
		setTimeout(() => {
			version += 1;
			reloading = false;
		}, 2500);
	}

	const rings: { pct: number; size: PercentageRingSize }[] = [
		{ pct: 40, size: 'tiny' },
		{ pct: 68, size: 'small' },
		{ pct: 72, size: 'medium' },
		{ pct: 91, size: 'large' },
	];

	// Static demo sparkline path — Stat's `chart` snippet accepts any small visual, an app
	// would compute this from real values instead.
	const sparkPath = 'M 0 18 L 10.7 14 L 21.3 8 L 32 10 L 42.7 4 L 53.3 2 L 64 0';
</script>

<svelte:head>
	<title>Cards &amp; data — Zeyo UI</title>
</svelte:head>

<PageHero
	eyebrow="Components"
	sub="Card is the base surface everything else builds on — Stat and MiniStat wrap it for numbers. Tables (Table/TableRow/TableCell/GroupedGrid) have their own dedicated page."
	title="Cards & data"
/>

<ShowcaseSection
	code={`<Card>
  <Text size="sm">Plain content, any children.</Text>
</Card>
<Card hover>
  <Text size="sm">hover adds a border transition on :hover.</Text>
</Card>`}
	description="@zeyolabs/ui/card — the base surface. hover adds a subtle border transition, used for anything clickable. padding and gap (md, sm, xs, lg, or none) lay children out as a padded column; clip rounds the corners over the children and lets the card shrink inside a flex/grid parent, for a card that holds its own scrolling list or thread. loading adds the reload ring and glow (see Card loading below)."
	title="Card"
>
	<Card class="w-60" padding="md">
		<Text size="sm">Plain content, any children.</Text>
	</Card>
	<Card class="w-60" hover padding="md">
		<Text size="sm">hover adds a border transition on :hover.</Text>
	</Card>
</ShowcaseSection>

<ShowcaseSection
	code={`<Card clip gap="none">
  <CardHeader>Header</CardHeader>
  <CardBody padding="sm" busy={loading}>…scrolls…</CardBody>
  <CardFooter>Footer</CardFooter>
</Card>`}
	description="@zeyolabs/ui/card — the parts of a card that holds its own scrolling region (use clip and gap='none' on the Card). CardHeader and CardFooter are pinned strips with a divider; CardBody takes the space left and scrolls, and busy frosts it (blur + dim, via the .frosted class) while it reloads. padding takes the same scale as Card (xs, sm, md, lg); CardHeader and CardFooter default to sm, CardBody to none."
	title="Card parts"
>
	<Card class="h-48 w-60" clip gap="none">
		<CardHeader>
			<Text size="sm">Header</Text>
		</CardHeader>
		<CardBody padding="sm">
			{#each Array.from({ length: 8 }) as _, i (i)}
				<Text color="secondary" size="sm">Row {i + 1}</Text>
			{/each}
		</CardBody>
		<CardFooter>
			<Text color="secondary" size="sm">Footer</Text>
		</CardFooter>
	</Card>
</ShowcaseSection>

<ShowcaseSection
	code={`const loading = pendingFlag(); // @zeyolabs/ui/boundary/pending-flag — on only after 150ms

<Card clip gap="none" loading={loading.current}>
  <CardHeader>…</CardHeader>
  <CardBody busy={loading.current} padding="sm">
    {#each rows as row, i (row.id)}
      <div class="fi d{Math.min(i, 5)}">…</div>
    {/each}
  </CardBody>
</Card>`}
	description="Loading goes on the content that is about to change, never on the controls that triggered it. Card's loading draws a spinning gradient ring on its border and a glow leaking outside it (a parent that clips needs ~12px of room around the card for the glow). CardBody's busy frosts the old rows — the .frosted class from base.css, usable on any element with aria-busy — and the new rows fade up with the .fi / .dN classes. Drive all of it from pendingFlag(), which only switches on after 150ms, so a fast reload shows nothing. Press Reload."
	title="Card loading"
>
	<Card class="h-64 w-72" clip gap="none" loading={reloading}>
		<CardHeader>
			<Text size="sm">Results</Text>
		</CardHeader>
		<CardBody busy={reloading} padding="sm">
			{#key version}
				{#each Array.from({ length: 8 }) as _, i (i)}
					<div class="fi d{Math.min(i, 5)}">
						<Text color="secondary" size="sm">Result {version * 8 + i + 1}</Text>
					</div>
				{/each}
			{/key}
		</CardBody>
		<CardFooter>
			<Button disabled={reloading} onclick={reload} size="sm" variant="secondary">Reload</Button>
		</CardFooter>
	</Card>
</ShowcaseSection>

<ShowcaseSection
	code={`<ListRow muted onclick={open} selected>
  {#snippet leading()}<Mail size={13} />{/snippet}
  <Text size="sm">Subject line</Text>
</ListRow>`}
	description="@zeyolabs/ui/list-row — a clickable row for a list inside a card. selected marks the current row with a bar on its left edge (and sets aria-current); muted tints the background so the other rows stand out, e.g. read vs unread. leading is a slot before the content, outside the click target, for an icon, a status mark or a control such as a checkbox; what goes in the row stays with the caller."
	title="List row"
>
	<Card class="w-72" clip gap="none">
		<ListRow>
			{#snippet leading()}<Mail size={13} />{/snippet}
			<Text size="sm">Interested, can we talk Tuesday?</Text>
			<Text color="secondary" size="sm">Summit Builders</Text>
		</ListRow>
		<ListRow selected>
			{#snippet leading()}<Mail size={13} />{/snippet}
			<Text size="sm">Re: quote for the new roof</Text>
			<Text color="secondary" size="sm">Acme Roofing · selected</Text>
		</ListRow>
		<ListRow muted>
			{#snippet leading()}<Mail size={13} />{/snippet}
			<Text size="sm">Not for us, thanks</Text>
			<Text color="secondary" size="sm">Lakeview Waste · muted</Text>
		</ListRow>
	</Card>
</ShowcaseSection>

<ShowcaseSection
	code={`<Stat>
  {#snippet label()}Total sent{/snippet}
  {#snippet value()}48,204{/snippet}
  {#snippet sub()}+12% this week{/snippet}
</Stat>

<!-- delta owns its own up/down/neutral color coding -->
<Stat delta={{ dir: 'up', pct: '+18%' }}>
  {#snippet label()}Credits{/snippet}
  {#snippet value()}4,820{/snippet}
</Stat>
<Stat delta={{ dir: 'down', pct: '-4%' }}>
  {#snippet label()}Bounced{/snippet}
  {#snippet value()}212{/snippet}
</Stat>
<Stat delta={{ dir: 'neutral', pct: '—' }}>
  {#snippet label()}Reply rate{/snippet}
  {#snippet value()}—{/snippet}
</Stat>

<!-- chart is any small visual, a sparkline typically -->
<Stat delta={{ dir: 'up', pct: '+6%' }}>
  {#snippet label()}Active campaigns{/snippet}
  {#snippet value()}12{/snippet}
  {#snippet chart()}
    <svg height="22" preserveAspectRatio="none" style="display:block" viewBox="0 0 64 20" width="100%">
      <path d={sparkPath} fill="none" stroke="var(--tx)" stroke-linecap="round" stroke-opacity="0.55" stroke-width="1.25" />
    </svg>
  {/snippet}
</Stat>

<!-- numerals="plain" drops the DM Sans display face for the body sans -->
<Stat numerals="plain">
  {#snippet label()}Open rate{/snippet}
  {#snippet value()}38.4%{/snippet}
  {#snippet sub()}18,504 opens{/snippet}
</Stat>`}
	description="A Card preset for a single number — label / value / optional sub, all snippets so a label can hold an icon or richer markup. delta adds an up/down/neutral change badge (owns its own color coding); chart is any small visual under the value, a sparkline typically. The plain numerals variant swaps the DM Sans display face for the body sans at a slightly smaller size, for dense metric grids."
	title="Stat"
>
	<div style="width: 100%;">
		<Grid gap="sm" minColumnWidth="160px">
			<Stat>
				{#snippet label()}Total sent{/snippet}
				{#snippet value()}48,204{/snippet}
				{#snippet sub()}+12% this week{/snippet}
			</Stat>
			<Stat delta={{ dir: 'up', pct: '+18%' }}>
				{#snippet label()}Credits{/snippet}
				{#snippet value()}4,820{/snippet}
			</Stat>
			<Stat delta={{ dir: 'down', pct: '-4%' }}>
				{#snippet label()}Bounced{/snippet}
				{#snippet value()}212{/snippet}
			</Stat>
			<Stat delta={{ dir: 'neutral', pct: '—' }}>
				{#snippet label()}Reply rate{/snippet}
				{#snippet value()}—{/snippet}
			</Stat>
			<Stat delta={{ dir: 'up', pct: '+6%' }}>
				{#snippet label()}Active campaigns{/snippet}
				{#snippet value()}12{/snippet}
				{#snippet chart()}
					<svg
						style="display:block"
						height="22"
						preserveAspectRatio="none"
						viewBox="0 0 64 20"
						width="100%"
					>
						<path
							d={sparkPath}
							fill="none"
							stroke="var(--tx)"
							stroke-linecap="round"
							stroke-opacity="0.55"
							stroke-width="1.25"
						/>
					</svg>
				{/snippet}
			</Stat>
			<Stat numerals="plain">
				{#snippet label()}Open rate{/snippet}
				{#snippet value()}38.4%{/snippet}
				{#snippet sub()}18,504 opens{/snippet}
			</Stat>
		</Grid>
	</div>
</ShowcaseSection>

<ShowcaseSection
	code={`<MiniStat dot="var(--ok)" label="delivered" value={4820} />
<MiniStat dot="var(--err)" label="bounced" value={212} />
<MiniStat label="pending" value={38} />`}
	description="A lightweight inline alternative to Stat for dense breakdowns where a full card wastes space."
	title="MiniStat"
>
	<MiniStat dot="var(--ok)" label="delivered" value={4820} />
	<MiniStat dot="var(--err)" label="bounced" value={212} />
	<MiniStat label="pending" value={38} />
</ShowcaseSection>

<ShowcaseSection
	code={`<DistributionBar
  segments={[
    { color: 'var(--ok)', label: 'valid', value: 142 },
    { color: 'var(--w)', label: 'risky', value: 38 },
    { color: 'var(--inf)', label: 'catch-all', value: 21 },
    { color: 'var(--err)', label: 'invalid', value: 14 },
  ]}
/>

<!-- every segment at 0 (or an empty array) falls back to emptyLabel -->
<DistributionBar emptyLabel="Not verified" segments={[]} />`}
	description="Pairs Bar with a MiniStat legend — one segment shape (color/label/value) drives both the proportional bar and the dot-labeled breakdown underneath. Zero-value segments are dropped automatically; if every segment is 0, emptyLabel renders instead of an empty bar."
	title="DistributionBar"
>
	<DistributionBar
		segments={[
			{ color: 'var(--ok)', label: 'valid', value: 142 },
			{ color: 'var(--w)', label: 'risky', value: 38 },
			{ color: 'var(--inf)', label: 'catch-all', value: 21 },
			{ color: 'var(--err)', label: 'invalid', value: 14 },
		]}
	/>
	<DistributionBar emptyLabel="Not verified" segments={[]} />
</ShowcaseSection>

<ShowcaseSection
	code={`<PercentageRing color="var(--acc)" percentage={toPercentage(72)} size="medium" />`}
	description="A bare ring — dimmed track plus a filled arc, formatted text centered inside. Four size presets."
	title="PercentageRing"
>
	{#each rings as ring (ring.size)}
		<div class="ring-demo">
			<PercentageRing color="var(--acc)" percentage={toPercentage(ring.pct)} size={ring.size} />
			<span>{ring.size}</span>
		</div>
	{/each}
</ShowcaseSection>

<ShowcaseSection
	code={`<FAQList
  items={[
    { question: 'Is there a free plan?', answer: 'Yes — sign up and you start with free credits.' },
    { question: 'Can two answers be open?', answer: 'No, opening one closes the other.' }
  ]}
/>`}
	description="@zeyolabs/ui/faq — an accordion list of question/answer pairs, one open at a time. Renders only the list; the page brings its own heading."
	title="FAQList"
>
	<div class="w-full max-w-160">
		<FAQList
			items={[
				{
					answer: 'Yes — sign up and you start with free credits, no card needed.',
					question: 'Is there a free plan?',
				},
				{
					answer: 'No. Opening one answer closes the one that was open.',
					question: 'Can two answers be open at once?',
				},
				{
					answer: 'Each question is a button with aria-expanded and aria-controls.',
					question: 'Is it keyboard and screen-reader friendly?',
				},
			]}
		/>
	</div>
</ShowcaseSection>

<style>
	.ring-demo {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-xs);
	}
	.ring-demo span {
		font-size: 11px;
		color: var(--txs);
	}
</style>
