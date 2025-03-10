import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import { PermalinkHeading } from "../permalink-heading";
import { CodeBlock } from "../ui/code-block";

export function Docs({
  className,
  ...props
}: Omit<ComponentProps<"section">, "children">) {
  return (
    <section className={cn("prose mt-10 md:mt-16", className)} {...props}>
      <PermalinkHeading as="h2">Installation</PermalinkHeading>
      <CodeBlock lang="bash">npm i frimousse</CodeBlock>
      <PermalinkHeading as="h2">Usage</PermalinkHeading>
      <p>
        Import the <code>EmojiPicker</code> parts and create your own component
        by composing them.
      </p>
      <CodeBlock lang="tsx">{`
        import { EmojiPicker } from "frimousse";
    
        export function MyEmojiPicker() {
          return (
            <EmojiPicker.Root>
              <EmojiPicker.Search />
              <EmojiPicker.Viewport>
                <EmojiPicker.Loading>Loading…</EmojiPicker.Loading>
                <EmojiPicker.Empty>No emoji found.</EmojiPicker.Empty>
                <EmojiPicker.List />
              </EmojiPicker.Viewport>
            </EmojiPicker.Root>
          );
        }
      `}</CodeBlock>
      <p>
        Apart from a few sizing and overflow defaults, the parts don’t have any
        styles out-of-the-box. Being composable, you can bring your own styles
        and apply them however you want:{" "}
        <a href="https://tailwindcss.com/" rel="noreferrer" target="_blank">
          Tailwind CSS
        </a>
        , CSS-in-JS, vanilla CSS via inline styles, custom classes, or by
        targeting the <code>[frimousse-*]</code> data attributes present on each
        part.
      </p>
      <p>
        Now that your emoji picker component is styled, you might want to use it
        in a popover rather than on its own. Frimousse only provides the emoji
        picker itself so if you don’t have a popover component in your app yet,
        there are several libraries you could use:{" "}
        <a
          href="https://www.radix-ui.com/primitives/docs/components/popover"
          rel="noreferrer"
          target="_blank"
        >
          Radix UI
        </a>
        ,{" "}
        <a
          href="https://base-ui.com/react/components/popover"
          rel="noreferrer"
          target="_blank"
        >
          Base UI
        </a>
        ,{" "}
        <a
          href="https://headlessui.com/react/popover"
          rel="noreferrer"
          target="_blank"
        >
          Headless UI
        </a>
        , and{" "}
        <a
          href="https://react-spectrum.adobe.com/react-aria/Popover.html"
          rel="noreferrer"
          target="_blank"
        >
          React Aria
        </a>
        , to name a few.
      </p>
      <PermalinkHeading as="h3">shadcn/ui</PermalinkHeading>
      <p>
        If you are using{" "}
        <a href="https://ui.shadcn.com/" rel="noreferrer" target="_blank">
          shadcn/ui
        </a>
        , you can install a pre-built component which integrates with the
        existing{" "}
        <a href="https://ui.shadcn.com/" rel="noreferrer" target="_blank">
          shadcn/ui
        </a>{" "}
        themes and components (e.g.{" "}
        <a
          href="https://ui.shadcn.com/docs/components/popover"
          rel="noreferrer"
          target="_blank"
        >
          Popover
        </a>
        ).
      </p>
      <CodeBlock lang="bash">
        npx shadcn@latest add https://frimousse.liveblocks.io/r/emoji-picker
      </CodeBlock>
    </section>
  );
}
