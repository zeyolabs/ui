# Typography

All text in the apps goes through `Title`, `Text` and `Span` from `@zeyolabs/ui/text`, so size,
weight, tracking and line height stay in one scale.

```svelte
<script lang="ts">
	import Span from '@zeyolabs/ui/text/Span.svelte';
	import Text from '@zeyolabs/ui/text/Text.svelte';
	import Title from '@zeyolabs/ui/text/Title.svelte';
</script>

<Title level={1}>Page title</Title>
<Title level={2} size="md">Card heading</Title>
<Text>Body copy.</Text>
<Text color="secondary" size="sm">Caption.</Text>
<Span color="secondary" size="sm">Inline note.</Span>
```

## Rules

- **Never write `<h1>`-`<h6>`, `<p>` or `<span>` in a `.svelte` file.** ESLint
  (`svelte/no-restricted-html-elements`, an error) names the component to use. `<div>`, `<a>`,
  `<label>`, `<small>` and friends stay fine.
- **`Title`**: `level` (1-6) is the tag only, for the page outline; `size` (`xl | lg | md | sm`) is the
  look only. `size` defaults from `level` (1 `xl`, 2 `lg`, 3 `md`, 4-6 `sm`), so pass it only when the
  look and the tag differ. Every page has one `h1` (`level={1}`, the page title) and its
  sections are `level={2}`, with sub-headings `level={3}`, whatever they look like. A section title
  that should look like a card heading is `<Title level={2} size="md">`. Spec: `zeyolabs:ui/title-spec`.
- **`Text`** renders `<p>` (or `<a>` with `href`); **`Span`** renders `<span>`. Props: `size`
  (`xs | sm | default | lg | xl`), `color` (`secondary | tertiary | accent | error | success | ...`),
  `mono`, `uppercase`, `truncate`, `bold`, `centered`.
- **Don't set `font-size`, `font-weight`, `letter-spacing` or `line-height` through `class` or a
  scoped `<style>`.** Pick the `size` instead.
- **`class` is layout** (margin, flex, max-width), plus colour tokens such as `text-[var(--brand-strong)]`.
  No hex colours.
- Rendered markdown has its own scale and is the only place raw heading tags appear.

The admin is denser: page titles are `<Title level={1} size="md" color="accent">` and sections
`<Title level={2} size="sm">`. Alerts wrap `<Text color="error">` in a `<div role="alert">`, since
the text components take no ARIA attributes.
