import { base, config, noHandWrittenSvg, svelteRules } from '@zeyolabs/kit/eslint-config';

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
		// ui builds Title/Text/Span and Stack/Cluster/Grid out of the raw elements and CSS the
		// apps are told to avoid, so the text and layout rules stay off here (hand-drawn svg stays banned).
		'no-restricted-syntax': 'off',
		'svelte/no-navigation-without-resolve': 'warn',
		'svelte/no-restricted-html-elements': ['error', noHandWrittenSvg],
		'svelte/no-unused-svelte-ignore': 'warn',
		'svelte/prefer-svelte-reactivity': 'warn',
		'zeyolabs/layout-css': 'off',
	},
});
