export const BADGE_COLORS = [
	'error',
	'info',
	'neutral',
	'purple',
	'secondary',
	'success',
	'warning',
] as const;
export type BadgeColor = (typeof BADGE_COLORS)[number];
