<script lang="ts">
	import { Search } from '@lucide/svelte';
	import { onDestroy } from 'svelte';

	import Input from './Input.svelte';

	interface Props {
		class?: string;
		/** Wait this many ms after the last keystroke before calling `onChange` — for a search
		 * that hits the server. Omit to fire on every keystroke. */
		debounce?: number;
		defaultValue?: string;
		onChange: (value: string) => void;
		placeholder?: string;
	}
	let { class: className, debounce, defaultValue, onChange, placeholder }: Props = $props();

	let timer: ReturnType<typeof setTimeout> | undefined;
	function emit(value: string) {
		clearTimeout(timer);
		if (!debounce) return onChange(value);
		timer = setTimeout(() => onChange(value), debounce);
	}
	onDestroy(() => clearTimeout(timer));
</script>

<!-- `class` sizes this wrapper: Input puts its own `class` on the inner <input>, inside a
     width: 100% icon wrapper, so a width passed there never narrowed the search bar. -->
<div class={className ?? 'w-full'}>
	<Input
		icon={Search}
		oninput={(e: Event & { currentTarget: HTMLInputElement }) => emit(e.currentTarget.value)}
		{placeholder}
		type="search"
		value={defaultValue}
	/>
</div>
