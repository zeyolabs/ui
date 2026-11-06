# @zeyolabs/ui

Shared Svelte 5 components, form fields (remote-form aware), skeletons, `Boundary`, design
tokens and base CSS for SvelteKit 3 apps. Depends on
`@zeyolabs/kit`.

Published as source (`.svelte` / `.ts` / `.css`, no build step): the consuming app compiles it.

## Install

```
pnpm add -E @zeyolabs/ui @zeyolabs/kit
```

In the app's CSS, import the tokens and let Tailwind scan the components:

```css
@import '@zeyolabs/ui/tokens.css';
@import '@zeyolabs/ui/base.css';
@source "../node_modules/@zeyolabs/ui";
```

The app must enable async Svelte and remote functions in its `vite.config.ts`
(`compilerOptions.experimental.async`, `experimental.remoteFunctions`).

## Showcase

`showcase/` is a SvelteKit app rendering every component live (ui.zeyo.dev).
`pnpm showcase:dev`, `pnpm showcase:build`. It deploys on push to main
(`deploy-showcase.yaml`, with `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` from the `production` environment, which only `main` can use).

## Versions

Every merge to `main` publishes a new version (`.github/workflows/publish.yaml`); there is no
release step. Versions are `YYYY.M.N` in London time: `N` counts that month's releases and resets
each month (`2026.11.7`, then `2026.12.0`). CI sets the version and pushes the `vYYYY.M.N` tag;
docs- or CI-only changes don't publish. Publishing uses npm trusted publishing (no stored token).


## Checks

`pnpm check`: prettier, eslint, and svelte-check through the showcase.
