<script lang="ts">
	type Radius = 'full' | 'lg' | 'md' | 'sm' | 'xl' | 'xs';
	type Variant = 'pulse' | 'shimmer';

	let {
		class: klass = '',
		h = '1rem',
		radius = 'xs',
		style = '',
		variant = 'pulse',
		w = '100%',
	}: {
		class?: string;
		h?: string;
		/** A step on the radius scale (see @zeyolabs/ui/base.css); defaults to 'xs'. */
		radius?: Radius;
		style?: string;
		variant?: Variant;
		w?: string;
	} = $props();

	const resolvedRadius = $derived(`var(--radius-${radius})`);
</script>

<span
	style="width: {w}; height: {h}; border-radius: {resolvedRadius}; {style}"
	class="sk {variant === 'shimmer' ? 'sk-shimmer' : 'sk-pulse'} {klass}"
	aria-hidden="true"
></span>

<style>
	.sk {
		display: block;
		flex-shrink: 0;
		background-color: var(--bd, #e5e3e0);
	}

	.sk-pulse {
		animation: sk-pulse 1.5s ease-in-out infinite;
	}

	.sk-shimmer {
		position: relative;
		overflow: hidden;
	}
	.sk-shimmer::after {
		content: '';
		position: absolute;
		inset: 0;
		transform: translateX(-100%);
		background: linear-gradient(
			90deg,
			transparent,
			var(--sfh, rgba(255, 255, 255, 0.55)),
			transparent
		);
		animation: sk-shimmer 1.6s ease-in-out infinite;
	}

	@keyframes sk-pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.45;
		}
	}

	@keyframes sk-shimmer {
		100% {
			transform: translateX(100%);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.sk-pulse {
			animation: none;
			opacity: 0.7;
		}
		.sk-shimmer::after {
			animation: none;
			display: none;
		}
	}
</style>
