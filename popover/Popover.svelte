<script lang="ts">
	import type { Snippet } from 'svelte';

	import { fade } from 'svelte/transition';

	// Floating popover anchored to its own parent element. Rendered with
	// position: fixed (viewport coords computed on open) so it escapes any
	// `overflow: auto` clip from ancestors — e.g. a table's horizontal scroll
	// wrapper. Place <Popover> as a direct child of the element you want to
	// anchor under (the trigger cell/wrapper); it reads that parent's rect.
	let {
		/** Anchor edge the panel lines up with: 'right' = right-aligned (default). */
		align = 'right',
		ariaLabel = 'Popover',
		children,
		/** Panel max-height in px (content scrolls inside). */
		maxHeight = 360,
		/** Fired after the popover closes via outside click / Esc. */
		onClose,
		open = $bindable(false),
		/** Where the panel opens: under the anchor (default) or beside it (`align` is ignored). */
		side = 'bottom',
		/** Panel width in px. Also used to keep the panel inside the viewport. */
		width = 260,
	}: {
		align?: 'left' | 'right';
		ariaLabel?: string;
		children: Snippet;
		maxHeight?: number;
		onClose?: () => void;
		open?: boolean;
		side?: 'bottom' | 'right';
		width?: number;
	} = $props();

	let panelEl: HTMLDivElement | undefined = $state();
	let pos = $state({ left: 0, top: 0 });

	function close() {
		open = false;
		onClose?.();
	}

	// Outside-click / Escape detection via document-level listeners instead of a
	// full-viewport backdrop element. A backdrop is a real hit target covering the
	// whole page, so it swallows any click made while the popover is open — e.g.
	// rapid-clicking a second row's trigger closed the first popover but the click
	// never reached the second trigger, and nothing opened. Listeners observe
	// without being a target, so the same click closes this popover AND still
	// reaches whatever it landed on.
	$effect(() => {
		if (!open) return;

		const onPointerDown = (e: PointerEvent) => {
			const target = e.target as Node;
			// The anchor (panel's parent) holds the trigger, and every consumer's
			// trigger toggles `open` — closing here too would make that click
			// reopen the popover it just closed. Excluding the anchor also means
			// the click that opened the popover can never immediately close it.
			if (panelEl?.contains(target) || panelEl?.parentElement?.contains(target)) return;
			close();
		};
		const onKeydown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') close();
		};
		// capture: true so a stopPropagation() anywhere in the page's bubble phase
		// (including this panel's own onclick/onkeydown) can't suppress the checks.
		document.addEventListener('pointerdown', onPointerDown, { capture: true });
		document.addEventListener('keydown', onKeydown, { capture: true });
		return () => {
			document.removeEventListener('pointerdown', onPointerDown, { capture: true });
			document.removeEventListener('keydown', onKeydown, { capture: true });
		};
	});

	$effect(() => {
		if (!open || !panelEl) return;
		const anchor = panelEl.parentElement;
		if (!anchor) return;

		const reposition = () => {
			const r = anchor.getBoundingClientRect();
			const panelHeight = panelEl?.offsetHeight ?? 0;
			if (side === 'right') {
				const rightLeft = r.right + 4;
				const left = Math.max(
					8,
					rightLeft + width > window.innerWidth - 8 ? r.left - width - 4 : rightLeft
				);
				const maxTop = window.innerHeight - panelHeight - 8;
				pos = { left, top: Math.max(8, Math.min(maxTop, r.top)) };
				return;
			}
			const spaceBelow = window.innerHeight - r.bottom;
			const spaceAbove = r.top;
			const top =
				spaceBelow < panelHeight + 4 && spaceAbove > spaceBelow
					? Math.max(8, r.top - panelHeight - 4)
					: r.bottom + 4;
			// Align to the chosen edge, but never let the panel run off-screen.
			const desiredLeft = align === 'right' ? r.right - width : r.left;
			const left = Math.max(8, Math.min(window.innerWidth - width - 8, desiredLeft));
			pos = { left, top };
		};

		reposition();
		// Keep the panel glued to the anchor as the page scrolls or resizes.
		// capture: true catches scroll on any ancestor (e.g. a table's own
		// overflow-x: auto wrapper), not just window. passive: true because we
		// never preventDefault. Listeners are removed in the effect cleanup.
		window.addEventListener('scroll', reposition, { capture: true, passive: true });
		window.addEventListener('resize', reposition, { passive: true });
		return () => {
			window.removeEventListener('scroll', reposition, { capture: true });
			window.removeEventListener('resize', reposition);
		};
	});
</script>

{#if open}
	<div
		bind:this={panelEl}
		style:top="{pos.top}px"
		style:left="{pos.left}px"
		style:width="{width}px"
		style:max-height="{maxHeight}px"
		class="popover"
		aria-label={ariaLabel}
		onclick={(e) => e.stopPropagation()}
		onkeydown={(e) => e.stopPropagation()}
		role="dialog"
		tabindex="-1"
		transition:fade={{
			duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 120,
		}}
	>
		{@render children()}
	</div>
{/if}

<style>
	.popover {
		/* position: fixed (with computed top/left in JS) escapes any ancestor's
		   overflow clip — see the $effect block in <script>. */
		position: fixed;
		z-index: 9100;
		background: var(--bg);
		border: 1px solid var(--bd);
		border-radius: var(--radius);
		box-shadow: 0 8px 24px rgba(20, 18, 24, 0.12);
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 6px;
		overflow-y: auto;
	}
</style>
