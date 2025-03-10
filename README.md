<h1>
  <a href="https://frimousse.liveblocks.io#gh-light-mode-only">
    <img src="https://raw.githubusercontent.com/liveblocks/frimousse/main/.github/assets/logo-light.svg" width="107" height="24" alt="Frimousse"   />
  </a>
  <a href="https://frimousse.liveblocks.io#gh-dark-mode-only">
    <img src="https://raw.githubusercontent.com/liveblocks/frimousse/main/.github/assets/logo-dark.svg" width="107" height="24" alt="Frimousse"   />
  </a>
</h1>

[![npm](https://img.shields.io/npm/v/frimousse?color=%23fc0)](https://www.npmjs.com/package/frimousse)
[![installs](https://img.shields.io/npm/dm/frimousse?color=%23fc0&label=npm)](https://www.npmjs.com/package/frimousse)
[![size](https://img.shields.io/bundlephobia/minzip/frimousse?label=size&color=%23fc0)](https://bundlephobia.com/package/frimousse)
[![tests](https://img.shields.io/github/actions/workflow/status/liveblocks/frimousse/.github/workflows/tests.yml?color=%23fc0&label=tests)](https://github.com/liveblocks/frimousse/actions/workflows/tests.yml)
[![license](https://img.shields.io/github/license/liveblocks/frimousse?color=%23fc0)](https://github.com/liveblocks/frimousse/blob/main/LICENSE)

A lightweight, unstyled, and composable emoji picker for React.

- ⚡️ **Lightweight and fast**: Dependency-free, tree-shakable, and virtualized with minimal re-renders
- 🎨 **Unstyled and composable**: Bring your own styles and compose parts as you want
- 🔄 **Always up-to-date**: Latest emoji data is fetched when needed and cached locally
- 🔣 **No � symbols**: Unsupported emojis are automatically hidden
- ♿️ **Accessible**: Keyboard navigable and screen reader-friendly

## Installation

```bash
npm i frimousse
```

## Usage

Import the `EmojiPicker` parts and create your own component by composing them.

```tsx
import { EmojiPicker } from "frimousse";

export function MyEmojiPicker() {
  return (
    <EmojiPicker.Root>
      <EmojiPicker.Search  />
      <EmojiPicker.Viewport>
        <EmojiPicker.Loading>Loading…</EmojiPicker.Loading>
        <EmojiPicker.Empty>No emoji found.</EmojiPicker.Empty>
        <EmojiPicker.List />
      </EmojiPicker.Viewport>
    </EmojiPicker.Root>
  );
}
```

## Contributing

All contributions are welcome! If you find a bug or have a feature request, feel free to create an [issue](https://github.com/liveblocks/frimousse/issues) or a [PR](https://github.com/liveblocks/frimousse/pulls).

The project is setup as a monorepo with the `frimousse` package at the root and [frimousse.liveblocks.io](https://frimousse.liveblocks.io) in the `site` directory.

### Development

Install dependencies and start development builds from the root.

```bash
npm i
npm run dev
```

The site can be used as a development playground since it’s built with the root package via [Turborepo](https://turbo.build/repo).

```bash
npm run dev:site
```

### Tests

The package has ~99% test coverage with [Vitest](https://vitest.dev/). Some tests use Vitest’s [browser mode](https://vitest.dev/guide/browser-testing) with [Playwright](https://playwright.dev/), make sure to install the required browser first.

```bash
npx playwright install chromium
```

Run the tests.

```bash
npm run test:coverage
```

### Releases

Releases are triggered from [a GitHub action](.github/workflows/release.yml) via [release-it](https://github.com/release-it/release-it), and continuous releases are automatically triggered for every commit in PRs via [pkg.pr.new](https://github.com/stackblitz-labs/pkg.pr.new).
