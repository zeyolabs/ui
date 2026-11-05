// Checked only at compile time — a value cast past the type system (`as CssVariable`) is not validated
// at runtime.
export type CssVariable = `var(--${string})`;

type Bounded<Brand extends string> = number & { readonly __brand: Brand };

// 0-100, clamped at construction — a raw number isn't assignable without going through toPercentage.
export type Percentage = Bounded<'Percentage'>;
export const toPercentage = (value: number): Percentage =>
	Math.min(100, Math.max(0, value)) as Percentage;

// 0-1, clamped at construction — a raw number isn't assignable without going through toOpacity.
export type Opacity = Bounded<'Opacity'>;
export const toOpacity = (value: number): Opacity => Math.min(1, Math.max(0, value)) as Opacity;

// A closed set of severity states, not a color value — a consumer maps each to its own color/class.
export type StatusColor = 'error' | 'ok' | 'warning';

// A background-color Tailwind class referencing a design token, e.g. bg-[var(--ok)].
export type BackgroundColorClass = `bg-[${CssVariable}]`;
