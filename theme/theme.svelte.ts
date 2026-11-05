const isBrowser = typeof window !== 'undefined';
const stored = isBrowser ? localStorage.getItem('zeyo-theme') : null;
const media = isBrowser ? window.matchMedia('(prefers-color-scheme: dark)') : null;
let hasExplicitChoice = stored !== null;

const initial = stored ? stored === 'dark' : (media?.matches ?? false);
let dark = $state(initial);

if (isBrowser) {
	document.documentElement.classList.toggle('dark', initial);

	// Follow live OS changes only until the user makes an explicit choice — an explicit
	// toggle must never be overridden by a later system theme change in the same session.
	media?.addEventListener('change', (e) => {
		if (hasExplicitChoice) return;
		dark = e.matches;
		document.documentElement.classList.toggle('dark', dark);
	});
}

export const theme = {
	get dark() {
		return dark;
	},
	toggle() {
		dark = !dark;
		hasExplicitChoice = true;
		if (isBrowser) {
			localStorage.setItem('zeyo-theme', dark ? 'dark' : 'light');
			document.documentElement.classList.toggle('dark', dark);
		}
	},
};
