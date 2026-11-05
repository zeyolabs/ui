<script lang="ts">
	import type { Snippet } from 'svelte';

	import { setContext } from 'svelte';

	import { SELECT_FIELD_CONTEXT, type SelectFieldContext } from './select-field-context.js';

	let { children, context }: { children: Snippet; context: SelectFieldContext } = $props();

	// svelte-ignore state_referenced_locally
	setContext(SELECT_FIELD_CONTEXT, { ...context, registerOnly: true });
</script>

<!-- Anything besides <Option>s in the children (empty/loading rows) must not show here. -->
<div hidden>{@render children()}</div>
