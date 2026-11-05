<!--
  Standalone copy of web-svelte's FileField (same global classes → same CSS). Two modes:
  standalone (`onSelect`), where the file is read or PUT directly rather than submitted; and
  form-bound (`form` + `name`, the same pair every other field here takes), where the real input
  carries the remote field's attributes and submits natively with the enclosing form.
-->
<script generics="Input extends RemoteFormInput = RemoteFormInput" lang="ts">
	import type { RemoteForm, RemoteFormInput } from '$app/server';
	import type { Snippet } from 'svelte';

	import Upload from '@lucide/svelte/icons/upload';

	import { createFormView } from '../field-view.svelte.js';

	type BaseProps = {
		accept?: string;
		children?: Snippet;
		disabled?: boolean;
		multiple?: boolean;
		/** Fired with the current selection. The only way to read files in standalone mode. */
		onSelect?: (files: File[]) => void;
		variant?: 'button' | 'dropzone';
	};

	/** `form` and `name` come as a pair or not at all — one without the other would silently fall
	 *  back to standalone, leaving the enclosing form with no file field and nothing to say so. */
	type Props = BaseProps &
		(
			| {
					form: Omit<RemoteForm<Input, unknown>, 'for'> | RemoteForm<Input, unknown>;
					name: keyof Input & string;
			  }
			| { form?: never; name?: never }
		);

	let {
		accept,
		children,
		disabled = false,
		form,
		multiple = false,
		name,
		onSelect,
		variant = 'button',
	}: Props = $props();

	// Fixed for a field instance, so reading them once is intended.
	// svelte-ignore state_referenced_locally
	const view =
		form && name ? createFormView(form, name, multiple ? 'file multiple' : 'file') : undefined;

	let input = $state<HTMLInputElement>();
	let files = $state<File[]>([]);
	let dragging = $state(false);

	const label = $derived(
		files.length === 0
			? 'No file chosen'
			: files.length === 1
				? files[0].name
				: `${files.length} files selected`
	);

	function sync() {
		files = input?.files ? Array.from(input.files) : [];
		onSelect?.(files);
	}

	function open() {
		if (!disabled) input?.click();
	}

	function onKey(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			open();
		}
	}

	function onDragOver(e: DragEvent) {
		e.preventDefault();
		if (!disabled) dragging = true;
	}

	function onDrop(e: DragEvent) {
		e.preventDefault();
		dragging = false;
		if (disabled || !input || !e.dataTransfer) return;
		input.files = e.dataTransfer.files;
		sync();
	}
</script>

<div class="form-field">
	{#if children}
		<span class="form-label">{@render children()}</span>
	{/if}

	<!-- Spread onto the real submitted input, so the multipart entry is what a bare input gave. -->
	<input
		bind:this={input}
		class="form-file-input"
		{accept}
		{disabled}
		{multiple}
		{...view?.attrs ?? {}}
		onchange={sync}
		type="file"
	/>

	{#if variant === 'dropzone'}
		<div
			class={[
				'form-file-dropzone',
				dragging && 'form-file-dropzone--over',
				disabled && 'form-file-dropzone--disabled',
			]
				.filter(Boolean)
				.join(' ')}
			onclick={open}
			ondragleave={() => (dragging = false)}
			ondragover={onDragOver}
			ondrop={onDrop}
			onkeydown={onKey}
			role="button"
			tabindex={disabled ? -1 : 0}
		>
			<Upload class="form-file-dropzone-icon" />
			<span class="form-file-dropzone-text">Drag &amp; drop or click to upload</span>
			<span class="form-file-name">{label}</span>
		</div>
	{:else}
		<div class="form-file-button-row">
			<button class="btn ghost" {disabled} onclick={open} type="button">
				<Upload class="form-file-button-icon" />
				Choose file{multiple ? 's' : ''}
			</button>
			<span class="form-file-name">{label}</span>
		</div>
	{/if}

	{#each view?.issues() ?? [] as issue, i (i)}
		<p class="form-error">{issue.message}</p>
	{/each}
</div>
