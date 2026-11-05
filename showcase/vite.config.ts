import adapter from '@sveltejs/adapter-cloudflare';
import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			adapter: adapter(),
			compilerOptions: { experimental: { async: true } },
			// A showcase with a demo remote form that saves nothing. Product photos come from the image bucket.
			csp: {
				directives: {
					'base-uri': ['self'],
					'connect-src': ['self'],
					'default-src': ['self'],
					'font-src': ['https://fonts.gstatic.com'],
					'form-action': ['self'],
					'frame-ancestors': ['none'],
					'frame-src': ['about:'],
					'img-src': ['self', 'data:'],
					'object-src': ['none'],
					'script-src': ['self'],
					'style-src': ['self', 'unsafe-inline', 'https://fonts.googleapis.com'],
				},
				mode: 'auto',
			},
			experimental: { remoteFunctions: true },
			preprocess: vitePreprocess(),
			version: { pollInterval: 300_000 },
		}),
	],
	resolve: {
		// @sveltejs/kit dual-instance fix
		dedupe: ['@sveltejs/kit'],
	},
	server: { port: 5178, strictPort: true },
});
