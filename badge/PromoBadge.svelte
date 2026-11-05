<script lang="ts">
	import type { Snippet } from 'svelte';

	import { onMount } from 'svelte';

	type UnicornScene = {
		destroy?: () => void;
		paused?: boolean;
		resize?: () => void;
	};

	type UnicornStudioApi = {
		addScene: (options: {
			altText?: string;
			ariaLabel?: string;
			dpi?: number;
			elementId: string;
			filePath: string;
			fps?: number;
			interactivity?: {
				mouse?: {
					disabled?: boolean;
					disableMobile?: boolean;
				};
			};
			lazyLoad?: boolean;
			production?: boolean;
			scale?: number;
		}) => Promise<UnicornScene>;
		destroy: () => void;
	};

	type UnicornWindow = Window & {
		__zeyoUnicornLoader__?: Promise<UnicornStudioApi>;
		UnicornStudio?: UnicornStudioApi;
	};

	let {
		children,
		href = '#',
		label,
		labelColor = 'gradient',
		variant = 'light',
	}: {
		children: Snippet;
		href?: string;
		label: string;
		labelColor?: 'black' | 'gradient';
		variant?: 'dark' | 'light';
	} = $props();

	const BADGE_SCENE_PATH = '/unicorn/badge-rainbow.json';
	const SDK_SRC =
		'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.4/dist/unicornStudio.umd.js';

	let sceneElement: HTMLDivElement | undefined = $state();
	let labelElement: HTMLSpanElement | undefined = $state();

	const variants = {
		dark: {
			container: 'bg-white/5 rounded-none border border-white/10',
			link: 'text-gray-300 hover:text-white',
		},
		light: {
			container: 'bg-white rounded-none shadow-sm border border-gray-200',
			link: 'text-gray-700 hover:text-gray-900',
		},
	};

	const labelColors = {
		black: 'bg-black text-white',
		gradient: 'pbadge-grad-fallback text-white',
	};

	const styles = $derived(variants[variant]);
	const labelStyle = $derived(labelColors[labelColor]);

	function isWebGLAvailable(): boolean {
		try {
			const canvas = document.createElement('canvas');
			return !!(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
		} catch {
			return false;
		}
	}

	async function loadSdk(): Promise<UnicornStudioApi> {
		const unicornWindow = window as UnicornWindow;

		if (unicornWindow.UnicornStudio) {
			return unicornWindow.UnicornStudio;
		}

		if (!unicornWindow.__zeyoUnicornLoader__) {
			unicornWindow.__zeyoUnicornLoader__ = new Promise((resolve, reject) => {
				const existingScript = document.querySelector<HTMLScriptElement>(
					`script[src="${SDK_SRC}"]`
				);

				if (existingScript) {
					existingScript.addEventListener('load', () => {
						if (unicornWindow.UnicornStudio) {
							resolve(unicornWindow.UnicornStudio);
							return;
						}

						reject(new Error('Unicorn Studio SDK loaded without exposing the runtime.'));
					});
					existingScript.addEventListener('error', () => {
						reject(new Error('Failed to load the Unicorn Studio SDK.'));
					});
					return;
				}

				const script = document.createElement('script');
				script.src = SDK_SRC;
				script.async = true;
				script.onload = () => {
					if (unicornWindow.UnicornStudio) {
						resolve(unicornWindow.UnicornStudio);
						return;
					}

					reject(new Error('Unicorn Studio SDK loaded without exposing the runtime.'));
				};
				script.onerror = () => {
					reject(new Error('Failed to load the Unicorn Studio SDK.'));
				};
				document.head.appendChild(script);
			});
		}

		return unicornWindow.__zeyoUnicornLoader__;
	}

	async function hasRealSceneJson(path: string): Promise<boolean> {
		try {
			const response = await fetch(path, { cache: 'no-store' });
			if (!response.ok) {
				return false;
			}

			const payload = (await response.json()) as { __placeholder?: boolean };
			return payload?.__placeholder !== true;
		} catch {
			return false;
		}
	}

	onMount(() => {
		if (labelColor !== 'gradient' || !sceneElement || !labelElement || window.innerWidth < 500) {
			return;
		}

		let isDisposed = false;
		let currentScene: undefined | UnicornScene;
		let resizeObserver: ResizeObserver | undefined;
		const currentLabelElement = labelElement;

		const mountScene = async () => {
			if (!isWebGLAvailable()) return;
			const sceneExists = await hasRealSceneJson(BADGE_SCENE_PATH);
			if (!sceneExists || isDisposed || !sceneElement) {
				return;
			}

			if (!sceneElement.id) {
				sceneElement.id = `zeyo-unicorn-badge-${crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)}`;
			}

			const unicornStudio = await loadSdk();
			if (isDisposed) {
				return;
			}

			currentScene = await unicornStudio.addScene({
				altText: `${label} badge animation`,
				ariaLabel: `${label} badge animation`,
				dpi: 1,
				elementId: sceneElement.id,
				filePath: BADGE_SCENE_PATH,
				fps: 24,
				interactivity: {
					mouse: {
						disabled: true,
						disableMobile: true,
					},
				},
				lazyLoad: true,
				production: true,
				scale: 1,
			});

			resizeObserver = new ResizeObserver(() => {
				currentScene?.resize?.();
			});
			resizeObserver.observe(currentLabelElement);
		};

		void mountScene().catch((error: unknown) => {
			console.error('Failed to initialize PromoBadge scene.', error);
		});

		return () => {
			isDisposed = true;
			resizeObserver?.disconnect();
			currentScene?.destroy?.();
		};
	});
</script>

<div class="pbadge inline-flex items-center p-[4px] {styles.container}">
	<span
		bind:this={labelElement}
		class="{labelStyle}  px-2.5 py-1 rounded-none sm relative overflow-hidden"
	>
		{#if labelColor === 'gradient'}
			<div
				bind:this={sceneElement}
				class="pbadge-rainbow-scene absolute inset-0 w-full h-full"
			></div>
		{/if}
		<span class="relative z-10">{label}</span>
	</span>
	{#if href && href !== '#'}
		<a
			class="{styles.link}  px-3 py-1 sm inline-flex items-center gap-1.5 transition-colors"
			{href}
		>
			<span>{@render children()}</span>
			<svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
			</svg>
		</a>
	{:else}
		<span
			class="{styles.link}  px-3 py-1 sm inline-flex items-center gap-1.5 transition-colors cursor-pointer"
		>
			<span>{@render children()}</span>
			<svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
			</svg>
		</span>
	{/if}
</div>

<style>
	.pbadge {
		margin-bottom: 16px;
	}
	.pbadge + :global(h1),
	.pbadge + :global(h2) {
		margin-top: 0;
	}
	.pbadge-grad-fallback {
		background: linear-gradient(
			135deg,
			#7c3aed 0%,
			#4f46e5 14%,
			#0ea5e9 28%,
			#06b6d4 40%,
			#8b5cf6 54%,
			#ec4899 68%,
			#f59e0b 80%,
			#7c3aed 100%
		);
		background-size: 300% 300%;
		background-position: 0% 50%;
		animation: pbadgeShine 4s ease infinite;
	}
	@keyframes pbadgeShine {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}
	.pbadge-rainbow-scene {
		overflow: hidden;
		border-radius: inherit;
	}
	.pbadge-rainbow-scene :global(canvas) {
		width: 100% !important;
		height: 100% !important;
		max-width: 100% !important;
		max-height: 100% !important;
		animation: pbadgeCanvasFadeIn 0.6s ease both;
	}
	@keyframes pbadgeCanvasFadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	@media (max-width: 499px) {
		.pbadge-rainbow-scene {
			display: none !important;
		}
		.pbadge {
			transform: scale(0.88);
			transform-origin: center;
		}
		.pbadge > :global(a) {
			min-width: 0;
			overflow: hidden;
		}
		.pbadge > :global(a) > :global(span) {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
</style>
