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

Date versions: `YYYY.MMDD.N`: the release day in London as month × 100 + day (semver forbids
leading zeros, so 6 November is `1106` and 5 January `105`), then that day's release count from 0:
`2026.1106.0`, `2026.1106.1`, `2026.1107.0`. Earlier releases used `YYYY.M.D` (`2026.11.6`). Publishing uses npm trusted publishing (no stored token).

```
pnpm release                          # sets the version, commits, tags vYYYY.MMDD.N
git push origin HEAD vYYYY.MMDD.N      # the tag publishes to npm (publish.yaml)
```

## Checks

`pnpm check`: prettier, eslint, and svelte-check through the showcase.
