<script lang="ts">
	import type { Snippet } from 'svelte';

	import { resolve } from '$app/paths';
	import { Moon, Sun } from '@lucide/svelte';
	import { Button } from '@zeyolabs/ui/form';
	import Span from '@zeyolabs/ui/text/Span.svelte';
	import { theme } from '@zeyolabs/ui/theme/theme.svelte';
	import { Toaster } from 'svelte-sonner';

	import NavLink from '#lib/showcase/NavLink.svelte';

	import '../app.css';

	let { children }: { children: Snippet } = $props();
</script>

<div class="shell">
	<aside class="sidebar">
		<a class="wordmark" href={resolve('/')}>
			<span class="wordmark-dot"></span>
			Zeyo UI
		</a>

		<nav>
			<Span class="nav-group-label" bold color="tertiary">Foundations</Span>
			<NavLink href={resolve('foundations/colors')} label="Colors" />
			<NavLink href={resolve('foundations/typography')} label="Typography" />
			<NavLink href={resolve('foundations/layout')} label="Layout" />

			<Span class="nav-group-label" bold color="tertiary">Components</Span>
			<NavLink href={resolve('components')} label="Overview" />
			<NavLink href={resolve('components/buttons')} label="Buttons" />
			<NavLink href={resolve('components/badges-status')} label="Badges & status" />
			<NavLink href={resolve('components/cards-stats')} label="Cards & data" />
			<NavLink href={resolve('components/tables')} label="Tables" />
			<NavLink href={resolve('components/overlays')} label="Overlays & tabs" />
			<NavLink href={resolve('components/feedback')} label="Feedback" />
			<NavLink href={resolve('components/forms')} label="Forms" />
			<NavLink href={resolve('components/combobox')} label="Combobox" />
			<NavLink href={resolve('components/emails')} label="Emails" />

			<Span class="nav-group-label" bold color="tertiary">More</Span>
			<NavLink href={resolve('reference')} label="Full reference" />
		</nav>
	</aside>

	<div class="main-col">
		<header class="topbar">
			<span class="topbar-tagline">Component &amp; design-token showcase</span>
			<Button
				aria-label="Toggle dark mode"
				icon
				onclick={() => theme.toggle()}
				size="sm"
				variant="ghost"
			>
				{#if theme.dark}
					<Sun size={14} />
				{:else}
					<Moon size={14} />
				{/if}
			</Button>
		</header>

		<main>
			{@render children()}
		</main>
	</div>
</div>

<Toaster position="bottom-right" theme={theme.dark ? 'dark' : 'light'} />

<style>
	.shell {
		display: flex;
		min-height: 100dvh;
	}

	.sidebar {
		display: flex;
		flex-direction: column;
		flex-shrink: 0;
		width: 232px;
		height: 100dvh;
		position: sticky;
		top: 0;
		padding: var(--spacing-md) var(--spacing-sm);
		border-right: 1px solid var(--bd);
		background: var(--sf);
		overflow-y: auto;
	}

	.wordmark {
		display: flex;
		align-items: center;
		gap: var(--spacing-xs);
		padding: var(--spacing-xs) var(--spacing-sm) var(--spacing-md);
		font-family: var(--font-heading);
		font-size: 15px;
		font-weight: 600;
		letter-spacing: -0.01em;
		color: var(--tx);
		text-decoration: none;
	}
	.wordmark-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--acc);
	}

	nav {
		display: flex;
		flex-direction: column;
		gap: 1px;
	}

	:global(.nav-group-label) {
		display: block;
		margin: var(--spacing-sm) var(--spacing-sm) 4px;
		font-size: 10px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
	:global(.nav-group-label:first-child) {
		margin-top: 0;
	}

	.main-col {
		display: flex;
		flex-direction: column;
		flex: 1;
		min-width: 0;
	}

	.topbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 52px;
		flex-shrink: 0;
		padding: 0 var(--spacing-lg);
		border-bottom: 1px solid var(--bd);
	}
	.topbar-tagline {
		font-size: 12px;
		color: var(--txs);
	}

	main {
		flex: 1;
		padding: 40px 28px 80px;
		max-width: 1040px;
	}
</style>
