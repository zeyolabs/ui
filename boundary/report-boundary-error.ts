import * as Sentry from '@sentry/sveltekit';
import { getHttpStatus } from '@zeyolabs/kit/utils/errors';

/**
 * `onerror` handler for a `<svelte:boundary>` wrapping an awaited remote query. A `failed` snippet
 * alone silently swallows everything it catches, including client-only bugs, so this reports the
 * unexpected ones to Sentry. 401, 404 and 429 are expected outcomes and not worth the noise.
 */
export function reportBoundaryError(error: unknown): void {
	const status = getHttpStatus(error);
	if (status === 401 || status === 404 || status === 429) return;
	Sentry.captureException(error);
}
