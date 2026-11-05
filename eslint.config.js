import { base, config, svelteRules } from '@zeyolabs/kit/eslint-config';

// No svelte.config.js (ui is consumed as source). svelteRules() with no arg parses the components.
export default config(...base(), ...svelteRules(), {
	languageOptions: {
		parserOptions: {
			tsconfigRootDir: import.meta.dirname,
		},
	},
	// These three are warnings here (an existing backlog in the components). Applied to this
	// package only: the apps keep the stricter defaults.
	rules: {
		'svelte/no-navigation-without-resolve': 'warn',
		'svelte/no-unused-svelte-ignore': 'warn',
		'svelte/prefer-svelte-reactivity': 'warn',
	},
});
