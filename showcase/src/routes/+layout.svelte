<script lang="ts">
	import type { Snippet } from 'svelte';

	import { resolve } from '$app/paths';
	import {
		BookOpen,
		Combine,
		Gauge,
		Grid2x2,
		Layers,
		LayoutGrid,
		Mail,
		MessageSquare,
		Moon,
		MousePointerClick,
		Palette,
		PanelsTopLeft,
		Sun,
		Table,
		Tag,
		TextCursorInput,
		Type,
	} from '@lucide/svelte';
	import SplitShell from '@zeyolabs/ui/layout/SplitShell.svelte';
	import Sidebar from '@zeyolabs/ui/sidebar/Sidebar.svelte';
	import SidebarBrand from '@zeyolabs/ui/sidebar/SidebarBrand.svelte';
	import SidebarButton from '@zeyolabs/ui/sidebar/SidebarButton.svelte';
	import SidebarGroup from '@zeyolabs/ui/sidebar/SidebarGroup.svelte';
	import { theme } from '@zeyolabs/ui/theme/theme.svelte';
	import { Toaster } from 'svelte-sonner';

	import NavLink from '#lib/showcase/NavLink.svelte';

	import '../app.css';

	let { children }: { children: Snippet } = $props();
</script>

<div class="h-dvh [&>*]:h-full">
	<SplitShell sidebarWidth={232}>
		{#snippet sidebar()}
			<Sidebar>
				{#snippet brand()}
					<SidebarBrand href={resolve('/')} label="Zeyo UI" mark="z" />
				{/snippet}

				<SidebarGroup label="Foundations">
					<NavLink href={resolve('/foundations/colors')} icon={Palette} label="Colors" />
					<NavLink href={resolve('/foundations/typography')} icon={Type} label="Typography" />
					<NavLink href={resolve('/foundations/layout')} icon={Grid2x2} label="Layout" />
				</SidebarGroup>

				<SidebarGroup label="Components">
					<NavLink href={resolve('/components')} icon={LayoutGrid} label="Overview" />
					<NavLink href={resolve('/components/buttons')} icon={MousePointerClick} label="Buttons" />
					<NavLink href={resolve('/components/badges-status')} icon={Tag} label="Badges & status" />
					<NavLink href={resolve('/components/cards-stats')} icon={Gauge} label="Cards & data" />
					<NavLink href={resolve('/components/tables')} icon={Table} label="Tables" />
					<NavLink
						href={resolve('/components/overlays')}
						icon={PanelsTopLeft}
						label="Overlays & tabs"
					/>
					<NavLink href={resolve('/components/feedback')} icon={MessageSquare} label="Feedback" />
					<NavLink href={resolve('/components/forms')} icon={TextCursorInput} label="Forms" />
					<NavLink href={resolve('/components/combobox')} icon={Combine} label="Combobox" />
					<NavLink href={resolve('/components/emails')} icon={Mail} label="Emails" />
				</SidebarGroup>

				<SidebarGroup label="More">
					<NavLink href={resolve('/reference')} icon={BookOpen} label="Full reference" />
				</SidebarGroup>

				{#snippet foot()}
					<span class="tagline"><Layers size={13} /> Components &amp; tokens</span>
					<SidebarButton aria-label="Toggle theme" onclick={() => theme.toggle()}>
						{#if theme.dark}<Sun size={14} />{:else}<Moon size={14} />{/if}
					</SidebarButton>
				{/snippet}
			</Sidebar>
		{/snippet}
		{#snippet content()}
			<main>{@render children()}</main>
		{/snippet}
	</SplitShell>
</div>

<Toaster position="bottom-right" theme={theme.dark ? 'dark' : 'light'} />

<style>
	.tagline {
		flex: 1;
		min-width: 0;
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 0 6px;
		color: var(--txs);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	main {
		padding: 40px 28px 80px;
		max-width: 1040px;
	}
</style>
