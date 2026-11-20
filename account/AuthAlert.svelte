<script lang="ts">
	import type { Snippet } from 'svelte';

	import Text from '../text/Text.svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div class="auth-alert" role="alert"><Text color="error">{@render children()}</Text></div>

<style>
	.auth-alert {
		padding: 8px 10px;
		border: 1px solid color-mix(in srgb, var(--err) 40%, transparent);
		border-radius: var(--radius-md);
		background: color-mix(in srgb, var(--err) 8%, transparent);
	}
</style>
