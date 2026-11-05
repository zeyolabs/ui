# CLAUDE.md

`@zeyolabs/ui`: shared, project-agnostic Svelte 5 components for SvelteKit 3 apps.
`showcase/` is the live component reference.

- Nothing project-specific goes here: no brand colours (apps map their brand onto the tokens),
  no site names, no app code. The showcase stays brand-neutral.
- Shipped as source: `exports`/`files` must cover every public file; components import their
  `.svelte`/`.ts` siblings and `@zeyolabs/kit`, never an app.
- Svelte 5 runes only. Remote forms (Kit 3): every control renders from
  `form.fields.<name>.as(...)`, including hidden inputs and submit buttons; a hand-written `name`
  is rejected (`form_field_unbound`).
- Async Svelte: components may `await` in markup; `svelte.config.js` at the root exists only so
  svelte-check and editors compile them with `experimental.async`.
- Dependency versions are exact; `svelte`, `@sveltejs/kit` and `@zeyolabs/kit` are peers.
- Releases are date versions via `pnpm release` (see README). Run `pnpm check` and
  `pnpm showcase:build` before releasing.
