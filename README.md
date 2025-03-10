# Frimousse

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