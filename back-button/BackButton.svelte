<script lang="ts">
	import { ArrowLeft } from '@lucide/svelte';

	let { href, label }: { href: string; label: string } = $props();
</script>

<a class="back-btn" {href}>
	<ArrowLeft size={11} />
	{label}
</a>

<style>
	.back-btn {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		margin-bottom: 12px;
		font-size: 13px;
		color: var(--txs);
		text-decoration: none;
		transition: color 0.12s ease;
	}
	.back-btn:hover {
		color: var(--tx);
	}
</style>
