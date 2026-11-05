<script lang="ts">
	import { Button } from '@zeyolabs/ui/form';
	import Cluster from '@zeyolabs/ui/layout/Cluster.svelte';
	import Grid from '@zeyolabs/ui/layout/Grid.svelte';
	import PageHero from '@zeyolabs/ui/page-hero/PageHero.svelte';
	import Skeleton from '@zeyolabs/ui/skeleton/Skeleton.svelte';
	import SkeletonButton from '@zeyolabs/ui/skeleton/SkeletonButton.svelte';
	import SkeletonCard from '@zeyolabs/ui/skeleton/SkeletonCard.svelte';
	import SkeletonCircle from '@zeyolabs/ui/skeleton/SkeletonCircle.svelte';
	import SkeletonRow from '@zeyolabs/ui/skeleton/SkeletonRow.svelte';
	import SkeletonText from '@zeyolabs/ui/skeleton/SkeletonText.svelte';
	import { toast } from 'svelte-sonner';

	import ShowcaseSection from '#lib/showcase/ShowcaseSection.svelte';
</script>

<svelte:head>
	<title>Feedback — Pure Leaves UI</title>
</svelte:head>

<PageHero
	eyebrow="Components"
	sub="Loading placeholders and toast notifications — the two ways this design system tells you something is happening."
	title="Feedback"
/>

<ShowcaseSection
	code={`<Skeleton w="100%" h="1rem" />
<SkeletonCircle size="md" />
<SkeletonButton />
<SkeletonText lines={3} lastLineWidth="70%" />`}
	description="The base primitive plus three shape presets — every skeleton is built from these, radius and variant (pulse/shimmer) included."
	title="Primitives"
>
	<div style="width: 100%;">
		<Grid gap="md" minColumnWidth="140px">
			<div class="prim-cell">
				<Skeleton h="1rem" w="100%" />
				<span>Skeleton</span>
			</div>
			<div class="prim-cell">
				<SkeletonCircle size="md" />
				<span>SkeletonCircle</span>
			</div>
			<div class="prim-cell">
				<SkeletonButton />
				<span>SkeletonButton</span>
			</div>
			<div class="prim-cell prim-cell-wide">
				<SkeletonText lastLineWidth="70%" lines={3} />
				<span>SkeletonText</span>
			</div>
		</Grid>
	</div>
</ShowcaseSection>

<ShowcaseSection
	code={`<SkeletonCard avatar lines={2} />
<SkeletonRow avatar cols={3} />`}
	description="Composites for the two most common loading shapes — a card header and a table/list row."
	title="Composites"
>
	<div style="width: 100%;">
		<Cluster gap="md">
			<div class="composite-cell">
				<SkeletonCard avatar lines={2} />
			</div>
			<div class="composite-cell composite-cell-wide">
				<SkeletonRow avatar cols={3} />
				<SkeletonRow avatar cols={3} />
				<SkeletonRow avatar cols={3} />
			</div>
		</Cluster>
	</div>
</ShowcaseSection>

<ShowcaseSection
	code={`import { toast } from 'svelte-sonner';

toast.success('Campaign sent.');
toast.error('Could not save changes.');
toast.warning('This will affect 4 lists.');
toast('Just an update.');`}
	description="svelte-sonner, styled to match the design tokens (see the .toast* rules in @zeyolabs/ui/template.css). <Toaster> is mounted once in the root layout."
	title="Toast"
>
	<Button onclick={() => toast.success('Campaign sent.')} variant="secondary">Success</Button>
	<Button onclick={() => toast.error('Could not save changes.')} variant="secondary">Error</Button>
	<Button onclick={() => toast.warning('This will affect 4 lists.')} variant="secondary">
		Warning
	</Button>
	<Button onclick={() => toast('Just an update.')} variant="secondary">Info</Button>
</ShowcaseSection>

<style>
	.prim-cell {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}
	.prim-cell-wide {
		grid-column: 1 / -1;
	}
	.prim-cell span {
		font-size: 10.5px;
		color: var(--txt);
		font-family: var(--font-mono);
	}
	.composite-cell {
		flex: 1;
		min-width: 220px;
	}
	.composite-cell-wide {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
		min-width: 280px;
	}
</style>
