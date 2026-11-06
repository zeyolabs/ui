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
	import { theme } from '@zeyolabs/ui/theme/theme.svelte';
	import { Toaster } from 'svelte-sonner';

	import NavLink from '#lib/showcase/NavLink.svelte';

	import '../app.css';

	let { children }: { children: Snippet } = $props();
</script>

<div class="h-dvh [&>*]:h-full">
	<SplitShell sidebarWidth={232}>
		{#snippet sidebar()}
			<nav class="sidebar" aria-label="Main">
				<a class="brand" href={resolve('/')}>
					<span class="mark" aria-hidden="true">z</span>
					<span>Zeyo UI</span>
				</a>

				<div class="tree">
					<section>
						<span class="group-label">Foundations</span>
						<ul>
							<NavLink href={resolve('/foundations/colors')} icon={Palette} label="Colors" />
							<NavLink href={resolve('/foundations/typography')} icon={Type} label="Typography" />
							<NavLink href={resolve('/foundations/layout')} icon={Grid2x2} label="Layout" />
						</ul>
					</section>

					<section>
						<span class="group-label">Components</span>
						<ul>
							<NavLink href={resolve('/components')} icon={LayoutGrid} label="Overview" />
							<NavLink
								href={resolve('/components/buttons')}
								icon={MousePointerClick}
								label="Buttons"
							/>
							<NavLink
								href={resolve('/components/badges-status')}
								icon={Tag}
								label="Badges & status"
							/>
							<NavLink
								href={resolve('/components/cards-stats')}
								icon={Gauge}
								label="Cards & data"
							/>
							<NavLink href={resolve('/components/tables')} icon={Table} label="Tables" />
							<NavLink
								href={resolve('/components/overlays')}
								icon={PanelsTopLeft}
								label="Overlays & tabs"
							/>
							<NavLink
								href={resolve('/components/feedback')}
								icon={MessageSquare}
								label="Feedback"
							/>
							<NavLink href={resolve('/components/forms')} icon={TextCursorInput} label="Forms" />
							<NavLink href={resolve('/components/combobox')} icon={Combine} label="Combobox" />
							<NavLink href={resolve('/components/emails')} icon={Mail} label="Emails" />
						</ul>
					</section>

					<section>
						<span class="group-label">More</span>
						<ul>
							<NavLink href={resolve('/reference')} icon={BookOpen} label="Full reference" />
						</ul>
					</section>
				</div>

				<div class="foot">
					<span class="tagline"><Layers size={13} /> Components &amp; tokens</span>
					<button
						class="icon-btn"
						aria-label="Toggle theme"
						onclick={() => theme.toggle()}
						type="button"
					>
						{#if theme.dark}<Sun size={14} />{:else}<Moon size={14} />{/if}
					</button>
				</div>
			</nav>
		{/snippet}
		{#snippet content()}
			<main>{@render children()}</main>
		{/snippet}
	</SplitShell>
</div>

<Toaster position="bottom-right" theme={theme.dark ? 'dark' : 'light'} />

<style>
	.sidebar {
		display: flex;
		flex-direction: column;
		gap: 10px;
		height: 100%;
		padding: 10px 8px;
		background: var(--sf);
	}
	.brand {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 2px 6px;
		font-weight: 700;
		font-size: 15px;
		color: var(--tx);
		text-decoration: none;
	}
	.mark {
		display: grid;
		place-items: center;
		width: 22px;
		height: 22px;
		border-radius: var(--radius-sm);
		background: var(--primary-strong);
		color: var(--primary-soft);
		font-size: 13px;
	}
	ul {
		display: flex;
		flex-direction: column;
		gap: 1px;
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.tree {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding-top: 6px;
		border-top: 1px solid var(--bds);
	}
	.group-label {
		display: block;
		padding: 2px 8px;
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--txt);
	}
	.foot {
		display: flex;
		align-items: center;
		gap: 4px;
		padding-top: 8px;
		border-top: 1px solid var(--bds);
	}
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
	.icon-btn {
		display: grid;
		place-items: center;
		width: 26px;
		height: 26px;
		border-radius: var(--radius-sm);
		border: none;
		background: none;
		color: var(--txs);
		cursor: pointer;
	}
	.icon-btn:hover {
		background: var(--sfh);
		color: var(--tx);
	}

	main {
		padding: 40px 28px 80px;
		max-width: 1040px;
	}
</style>
