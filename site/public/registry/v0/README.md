These registry items aren’t meant to be installed via the shadcn CLI, they’re specifically built to be opened as examples in [v0](https://v0.dev/).

### Tailwind CSS v4

These examples are built for Tailwind CSS v3 as v0 doesn’t support Tailwind CSS v4 yet:
  - `outline-hidden` → `outline-none`
  - `rounded-sm` → `rounded-md`
  - `max-w-(--frimousse-viewport-width)` → `max-w-[--frimousse-viewport-width]`

When Tailwind CSS v4 is supported, the `components/ui/emoji-picker.tsx` entries (duplicated from `/public/registry/emoji-picker.json`) should be removed and replaced by `"registryDependencies": ["https://frimousse.liveblocks.io/r/emoji-picker"]`.