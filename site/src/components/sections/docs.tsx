import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import { CodeBlock } from "../ui/code-block";

export function Docs({
  className,
  ...props
}: Omit<ComponentProps<"section">, "children">) {
  return (
    <section className={cn("content mt-10 md:mt-16", className)} {...props}>
      <h2>Installation</h2>
      <CodeBlock lang="bash">npm i frimousse</CodeBlock>
      <h2>Usage</h2>
      <p>
        Import the <code>EmojiPicker</code> parts and create your own component
        by composing them.
      </p>
      <CodeBlock lang="tsx">{`
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
      `}</CodeBlock>
    </section>
  );
}
