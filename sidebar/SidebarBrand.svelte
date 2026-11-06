<script lang="ts">
	/** Sidebar header: a small filled mark (one letter) beside the product name. */
	let { href, label, mark }: { href: string; label: string; mark?: string } = $props();
</script>

<a class="sidebar-brand" {href}>
	<span class="sidebar-mark" aria-hidden="true">{mark ?? label.charAt(0).toLowerCase()}</span>
	<span>{label}</span>
</a>

<style>
	.sidebar-brand {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 2px 6px;
		font-weight: 700;
		font-size: 15px;
		color: var(--tx);
		text-decoration: none;
	}
	.sidebar-mark {
		display: grid;
		place-items: center;
		width: 22px;
		height: 22px;
		border-radius: var(--radius-sm);
		background: var(--primary-strong);
		color: var(--primary-soft);
		font-size: 13px;
	}
</style>
