<script lang="ts">
	import { resolve } from '$app/paths';
	import Badge from '@zeyolabs/ui/badge/Badge.svelte';
	import { BADGE_COLORS } from '@zeyolabs/ui/badge/color';
	import PromoBadge from '@zeyolabs/ui/badge/PromoBadge.svelte';
	import Eyebrow from '@zeyolabs/ui/eyebrow/Eyebrow.svelte';
	import Cluster from '@zeyolabs/ui/layout/Cluster.svelte';
	import Stack from '@zeyolabs/ui/layout/Stack.svelte';
	import PageHero from '@zeyolabs/ui/page-hero/PageHero.svelte';
	import StatusRow from '@zeyolabs/ui/status-row/StatusRow.svelte';
	import Title from '@zeyolabs/ui/text/Title.svelte';

	import ShowcaseSection from '#lib/showcase/ShowcaseSection.svelte';

	// The shop's order statuses: the app owns the status -> colour/label mapping, the badge doesn't.
	const ORDER_STATUS_VIEW = ['pending', 'paid', 'shipped', 'cancelled', 'refunded'] as const;
	const ORDER_STATUS_COLOR: Record<
		(typeof ORDER_STATUS_VIEW)[number],
		(typeof BADGE_COLORS)[number]
	> = {
		cancelled: 'neutral',
		paid: 'success',
		pending: 'warning',
		refunded: 'info',
		shipped: 'secondary',
	};
	const ORDER_STATUS_LABEL: Record<(typeof ORDER_STATUS_VIEW)[number], string> = {
		cancelled: 'Cancelled',
		paid: 'Paid',
		pending: 'Awaiting payment',
		refunded: 'Refunded',
		shipped: 'Shipped',
	};

	const colorNames: Record<(typeof BADGE_COLORS)[number], string> = {
		error: 'Error',
		info: 'Info',
		neutral: 'Neutral',
		purple: 'Purple',
		secondary: 'Secondary',
		success: 'Success',
		warning: 'Warning',
	};

	// Deterministic demo data (no Date.now()/Math.random() — must render identically on
	// server and client). Keys are hour-of-day (0-23), not epoch — slotInterval just needs
	// to be an arithmetic sequence, it isn't required to be real time.
	const colors: ('error' | 'ok' | 'warning')[] = [
		'ok',
		'ok',
		'ok',
		'ok',
		'ok',
		'warning',
		'ok',
		'ok',
		'ok',
		'error',
		'ok',
		'ok',
		'ok',
		'ok',
		'warning',
		'ok',
		'ok',
		'ok',
		'error',
		'ok',
		'ok',
		'ok',
		'ok',
		'ok',
	];
	const statusRowSlots = new Map(
		colors.map((color, key) => [key, { color, label: `${key}:00 — ${color}` }])
	);
</script>

<svelte:head>
	<title>Badges &amp; status — Pure Leaves UI</title>
</svelte:head>

<PageHero
	eyebrow="Components"
	sub="Status communication: the generic Badge pill (color in, label as children — each domain owns its own status mapping), a time-series StatusRow, the Eyebrow kicker label, and the marketing PromoBadge pill."
	title="Badges & status"
/>

<ShowcaseSection
	code={`<Badge color="success">Active</Badge>
<Badge color="warning">Paused</Badge>
<Badge color="error">Failed</Badge>
<Badge color="info">Queued</Badge>
<Badge color="purple">Meeting</Badge>
<Badge color="secondary">Draft</Badge>
<Badge color="info" dot={false}>No dot</Badge>
<Badge color="success" plain>Dot and label, no pill</Badge>`}
	description="@zeyolabs/ui/badge — a colored pill with a small dot before the label (dot={false} for no dot; plain for just the dot and label, no pill or outline), color + label text as children. It has no built-in status vocabulary; each domain owns its own status → color/label mapping and passes both in. See the order status mapping below for the pattern."
	title="Badge"
>
	<div style="width: 100%;">
		<Stack gap="xs">
			<span class="sm font-semibold tracking-wide text-(--txt) uppercase"> Every color </span>
			<Cluster gap="xs">
				{#each BADGE_COLORS as color (color)}
					<Badge {color}>{colorNames[color]}</Badge>
				{/each}
			</Cluster>
		</Stack>
	</div>
	<div style="width: 100%;">
		<Stack gap="xs">
			<span class="sm font-semibold tracking-wide text-(--txt) uppercase">
				No dot — dot=&#123;false&#125;
			</span>
			<Cluster gap="xs">
				{#each BADGE_COLORS as color (color)}
					<Badge {color} dot={false}>{colorNames[color]}</Badge>
				{/each}
			</Cluster>
		</Stack>
	</div>
	<div style="width: 100%;">
		<Stack gap="xs">
			<span class="sm font-semibold tracking-wide text-(--txt) uppercase">
				Dot and label, no pill — plain
			</span>
			<Cluster gap="sm">
				{#each BADGE_COLORS as color (color)}
					<Badge {color} plain>{colorNames[color]}</Badge>
				{/each}
			</Cluster>
		</Stack>
	</div>
	<div style="width: 100%;">
		<Stack gap="xs">
			<span class="sm font-semibold tracking-wide text-(--txt) uppercase">
				A real domain mapping — order status
			</span>
			<Cluster gap="xs">
				{#each ORDER_STATUS_VIEW as status (status)}
					<Badge color={ORDER_STATUS_COLOR[status]}>
						{ORDER_STATUS_LABEL[status]}
					</Badge>
				{/each}
			</Cluster>
		</Stack>
	</div>
</ShowcaseSection>

<ShowcaseSection
	code={`<Eyebrow>Support ticket</Eyebrow>
<Title level={4}>Refund request #4821</Title>`}
	description="A small uppercase kicker label that sits above a heading."
	title="Eyebrow"
>
	<div>
		<Eyebrow>Support ticket</Eyebrow>
		<Title class="m-0" level={4}>Refund request #4821</Title>
	</div>
</ShowcaseSection>

<ShowcaseSection
	code={`<PromoBadge label="New" variant="light">Find leads in minutes with AI</PromoBadge>
<PromoBadge href={resolve('pricing')} label="Pricing" labelColor="black" variant="light"
  >Pay only for what you use</PromoBadge
>`}
	description="apps/marketing's hero/section kicker pill — a gradient- or black-labeled chip plus a linked (or plain) caption. variant controls the light/dark container; labelColor picks the chip style, where gradient renders an animated Unicorn Studio scene on desktop (falling back to a static gradient on mobile or without WebGL). Not a status indicator — see Badge above for that. href takes a plain string (packages/ui has no $app/paths) — callers pass resolve(...) themselves."
	title="PromoBadge"
>
	<Stack gap="sm">
		<PromoBadge label="New" variant="light">Find leads in minutes with AI</PromoBadge>
		<PromoBadge
			href={resolve('components/buttons')}
			label="Pricing"
			labelColor="black"
			variant="light"
		>
			Pay only for what you use
		</PromoBadge>
	</Stack>
</ShowcaseSection>

<ShowcaseSection
	code={`<StatusRow
  slots={hourlyStatusMap}
  slotInterval={1}
  maxSlots={24}
  height={30}
  formatTick={(key) => \`\${key}:00\`}
/>`}
	description="A fixed-width row of status-colored segments with an optional tick axis — e.g. hourly send-health. Segments are clickable when onSelect is passed."
	title="StatusRow"
>
	<div class="status-row-demo">
		<StatusRow
			formatTick={(key) => `${key}:00`}
			maxSlots={24}
			slotInterval={1}
			slots={statusRowSlots}
		/>
	</div>
</ShowcaseSection>

<style>
	.status-row-demo {
		width: 100%;
	}
</style>
