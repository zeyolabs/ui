<script generics="Input extends RemoteFormInput" lang="ts">
	import type { RemoteForm, RemoteFormInput } from '$app/server';
	import type Quill from 'quill';
	import type { Snippet } from 'svelte';
	import type { ZodType } from 'zod';

	import 'quill/dist/quill.snow.css';
	import { onDestroy, onMount } from 'svelte';

	import { createFormView, createLocalTextView, type FieldView } from '../field-view.svelte.js';
	import FieldLabel from '../FieldLabel.svelte';

	const DEFAULT_TOOLBAR = [
		['bold', 'italic', 'underline'],
		['link'],
		[{ list: 'ordered' }, { list: 'bullet' }],
	];

	interface Props {
		children?: Snippet;
		class?: string;
		form?: Omit<RemoteForm<Input, unknown>, 'for'> | RemoteForm<Input, unknown>;
		invalid?: boolean;
		/** Editor content area height in px — additive with the toolbar row and Quill's own ~24px
		 *  vertical editor padding, not the field's total visible height. */
		minHeight?: number;
		name: keyof Input & string;
		onChange?: (value: string) => void;
		onInput?: (value: string) => void;
		/** Fired once Quill's toolbar DOM exists — mount an extra control group into it (e.g. a
		 *  variable-insert menu). The caller owns that mount's lifecycle. `api.insertText` inserts
		 *  at the current cursor (falling back to end-of-document), for a menu action to call. */
		onToolbarReady?: (toolbarEl: HTMLElement, api: { insertText: (text: string) => void }) => void;
		optional?: boolean;
		placeholder?: string;
		schema?: ZodType;
		toolbar?: unknown[];
		value?: string;
	}

	let {
		children,
		class: className,
		form,
		invalid = false,
		minHeight = 280,
		name,
		onChange,
		onInput,
		onToolbarReady,
		optional,
		placeholder = 'Start writing…',
		schema,
		toolbar = DEFAULT_TOOLBAR,
		value = $bindable(''),
	}: Props = $props();

	// `as('text')` is reached only via the `form` branch; standalone uses local state. Quill's
	// contenteditable div isn't a native form control, so unlike TextField/MessageField this view
	// is never spread onto anything — only `.name`/`.value`/`.issues()` are read, and `.set()` is
	// called manually from Quill's own `text-change` event (same pattern SwitchField/SliderField
	// use for their non-native bits-ui controls).
	// svelte-ignore state_referenced_locally
	const view: FieldView = form
		? createFormView(form, name, 'text')
		: createLocalTextView<string>({
				get: () => value,
				name,
				onChange,
				onInput,
				schema,
				write: (v) => (value = v),
			});

	const required = $derived(!optional);
	const showInvalid = $derived(invalid || view.issues().length > 0);

	let editorEl: HTMLDivElement | undefined = $state();
	let quill: Quill | undefined;
	let destroyed = false;
	let formEl: HTMLFormElement | null = null;

	// Quill's contenteditable div isn't a native form control, so the enclosing <Form>'s
	// post-submit `element.reset()` — which clears every real input fine — never reaches it. Listen
	// for the native `reset` event ourselves (it bubbles from the <form>) and clear Quill directly.
	function handleReset() {
		if (!quill) return;
		quill.setText('');
		view.set('');
	}

	onMount(() => {
		// Capture synchronously, same as MessageField: `editorEl` is reactive `$state`, and
		// re-reading it after the `await` below (once this component may already have been torn
		// down by a parent `{#key}`) could hand Quill a stale/undefined value, which throws
		// "Invalid Quill container".
		const target = editorEl;
		if (!target) return;
		const initialValue = view.attrs.value as string | undefined;
		if (form) {
			formEl = target.closest('form');
			formEl?.addEventListener('reset', handleReset);
		}
		void (async () => {
			// Dynamic import — Quill touches `document` at module scope, which would throw during
			// SvelteKit's SSR pass with a static top-level import.
			const { default: QuillCtor } = await import('quill');
			if (destroyed) return;
			quill = new QuillCtor(target, {
				modules: { toolbar },
				placeholder,
				theme: 'snow',
			});
			if (initialValue) quill.clipboard.dangerouslyPasteHTML(initialValue);
			quill.on('text-change', (_delta, _old, source) => {
				if (!quill || source !== 'user') return;
				view.set(quill.root.innerHTML);
			});
			const toolbarEl = (quill.getModule('toolbar') as { container: HTMLElement }).container;
			onToolbarReady?.(toolbarEl, {
				insertText: (text) => {
					if (!quill) return;
					quill.focus();
					const range = quill.getSelection(true);
					const index = range ? range.index : quill.getLength();
					quill.insertText(index, text, 'user');
					quill.setSelection(index + text.length, 0, 'user');
				},
			});
		})();
	});

	onDestroy(() => {
		destroyed = true;
		formEl?.removeEventListener('reset', handleReset);
	});
</script>

<div class={['form-field', className]}>
	{#if children}
		<FieldLabel for={view.attrs.name as string} {required}>{@render children()}</FieldLabel>
	{/if}
	<div
		style={`--rtf-min-height: ${minHeight}px`}
		class={['rich-text-field', showInvalid && 'rich-text-field-invalid']}
	>
		<div bind:this={editorEl}></div>
	</div>
	{#if form}
		<!-- Quill's contenteditable div doesn't participate in native FormData submission the way
		     a real <textarea> does — mirror the current value into a hidden input so <Form>'s
		     native form submit actually carries it. -->
		<input
			name={view.attrs.name as string}
			type="hidden"
			value={(view.attrs.value as string) ?? ''}
		/>
	{/if}
	{#each view.issues() as issue (`${issue.path}`)}
		<p class="form-error">{issue.message}</p>
	{/each}
</div>

<style>
	/* Stacks whatever Quill puts in here (toolbar + editor container land as flush siblings
	   inside this wrapper — Quill inserts its toolbar as a PRECEDING SIBLING of the element it's
	   given, not a child, so that element must itself be nested inside this wrapper for the
	   toolbar to land inside the styled/rounded box too). Square corners on purpose. */
	.rich-text-field {
		display: flex;
		flex-direction: column;
	}
	/* Move Quill's toolbar to the bottom of the editor. Quill mounts toolbar as first sibling. */
	.rich-text-field :global(.ql-toolbar.ql-snow) {
		order: 2;
		background: var(--sf);
		border: 1px solid var(--bd);
		border-top: none;
	}
	.rich-text-field :global(.ql-container.ql-snow) {
		order: 1;
		border: 1px solid var(--bd);
		font-family: inherit;
		font-size: 13px;
	}
	.rich-text-field-invalid :global(.ql-toolbar.ql-snow),
	.rich-text-field-invalid :global(.ql-container.ql-snow) {
		border-color: var(--err);
	}
	/* Restyle Quill's link tooltip to match app design (was default snow theme). */
	.rich-text-field :global(.ql-tooltip) {
		background: var(--bg);
		border: 1px solid var(--bd);
		border-radius: var(--radius);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
		color: var(--tx);
		font-family: inherit;
		font-size: 13px;
		padding: 8px 10px;
	}
	.rich-text-field :global(.ql-tooltip input[type='text']) {
		border: 1px solid var(--bd);
		border-radius: var(--radius);
		padding: 4px 8px;
		font-family: inherit;
		font-size: 13px;
		color: var(--tx);
		background: var(--bg);
	}
	.rich-text-field :global(.ql-tooltip a) {
		color: var(--txa, var(--tx));
	}
	.rich-text-field :global(.ql-editor) {
		min-height: var(--rtf-min-height);
		color: var(--tx);
	}
	.rich-text-field :global(.ql-editor.ql-blank::before) {
		color: var(--txt);
		font-style: normal;
	}
</style>
