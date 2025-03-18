These registry items aren’t meant to be installed via the shadcn CLI, they’re specifically built to be opened in [v0](https://v0.dev/).

### Differences

- Built for Tailwind CSS v3 as v0 doesn’t support Tailwind CSS v4 yet
  - `outline-hidden` → `outline-none`
  - `rounded-sm` → `rounded-md`
  - `max-w-(--frimousse-viewport-width)` → `max-w-[--frimousse-viewport-width]`