import { loadConfig } from '@sveltejs/load-config';
import { base, config, svelteRules } from '@zeyolabs/kit/eslint-config';

const svelteConfig = (await loadConfig('./', { traverse: false }))?.config;

export default config(...base(), ...svelteRules(svelteConfig), {
	languageOptions: {
		parserOptions: {
			tsconfigRootDir: import.meta.dirname,
		},
	},
	// These three are warnings in the showcase pages; the apps proper keep the stricter defaults.
	rules: {
		'svelte/no-navigation-without-resolve': 'warn',
		'svelte/no-unused-svelte-ignore': 'warn',
		'svelte/prefer-svelte-reactivity': 'warn',
	},
});
