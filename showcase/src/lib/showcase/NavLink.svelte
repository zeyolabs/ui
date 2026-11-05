<script lang="ts">
	import { page } from '$app/state';

	let { href, label }: { href: string; label: string } = $props();

	const active = $derived(page.url.pathname === href);
</script>

<a class="nav-link" class:active {href}>
	{label}
</a>

<style>
	.nav-link {
		display: block;
		padding: var(--spacing-xs) var(--spacing-sm);
		font-size: 12.5px;
		font-weight: 500;
		color: var(--txs);
		text-decoration: none;
		border-radius: var(--radius-xs);
		transition:
			background 0.12s ease,
			color 0.12s ease;
	}
	.nav-link:hover {
		color: var(--tx);
		background: var(--sf);
	}
	.nav-link.active {
		color: var(--tx);
		background: var(--sf);
		font-weight: 600;
	}
</style>
