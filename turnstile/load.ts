/** The part of Cloudflare's `window.turnstile` that `Turnstile.svelte` uses. */
export type TurnstileApi = {
	remove(widgetId: string): void;
	render(
		container: HTMLElement,
		options: {
			callback: (token: string) => void;
			'expired-callback': () => void;
			'response-field': boolean;
			sitekey: string;
			theme: 'auto' | 'dark' | 'light';
			'timeout-callback': () => void;
		}
	): string | undefined;
	reset(widgetId: string): void;
};

const SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

let loading: Promise<null | TurnstileApi> | undefined;

function api(): null | TurnstileApi {
	return (window as { turnstile?: TurnstileApi }).turnstile ?? null;
}

/**
 * Cloudflare's Turnstile API, loading its script once per page. Null when the script fails to
 * load or loads without defining `window.turnstile` (blocked, rewritten by an extension or a bot).
 */
export function loadTurnstile(): Promise<null | TurnstileApi> {
	if (api()) return Promise.resolve(api());
	loading ??= new Promise((resolve) => {
		const script = document.createElement('script');
		script.src = SCRIPT_URL;
		script.async = true;
		script.addEventListener('load', () => resolve(api()), { once: true });
		script.addEventListener(
			'error',
			() => {
				loading = undefined;
				script.remove();
				resolve(null);
			},
			{ once: true }
		);
		document.head.append(script);
	});
	return loading;
}
