export type Color =
	| 'accent'
	| 'error'
	| 'info'
	| 'secondary'
	| 'success'
	| 'tertiary'
	| 'warning'
	| 'white'
	| 'whiteSecondary';

export const COLOR_CLASS: Record<Color, string> = {
	accent: 'text-(--acc)',
	error: 'text-(--err)',
	info: 'text-(--inf)',
	secondary: 'text-(--txs)',
	success: 'text-(--ok)',
	tertiary: 'text-(--txt)',
	warning: 'text-(--w)',
	// Fixed white, not theme-aware var(--tx)/etc — for text sitting on a dark/gradient
	// surface (e.g. the rainbow panel bg), which stays the same regardless of site theme.
	white: 'text-white',
	whiteSecondary: 'text-white/70',
};

/** A tinted "chip" background behind the text (see `.chip-*` in `typography.css` for the shared
 *  padding/margin/radius + each color's `color-mix`) — e.g. flagging one invalid table cell or
 *  CSV sample without tinting the whole row. Same `Color` set as `COLOR_CLASS`; unlike text color
 *  this is a real global class (not a Tailwind arbitrary-value utility) because Tailwind has no
 *  utility for mixing a token toward transparent. */
export const BG_CLASS: Record<Color, string> = {
	accent: 'chip-accent',
	error: 'chip-error',
	info: 'chip-info',
	secondary: 'chip-secondary',
	success: 'chip-success',
	tertiary: 'chip-tertiary',
	warning: 'chip-warning',
	white: 'chip-white',
	whiteSecondary: 'chip-whiteSecondary',
};
