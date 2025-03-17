import { CodeBlock } from "@/components/ui/code-block";
import { Tabs } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import { ColorfulButtonsBlurPreview } from "./colorful-buttons-blur.client";

export function ColorfulButtonsBlur({
  className,
  ...props
}: Omit<ComponentProps<"figure">, "children">) {
  return (
    <figure
      className={cn("not-prose relative overflow-hidden", className)}
      {...props}
    >
      <div className="rounded-t-lg border border-b-0 border-dotted bg-background">
        <ColorfulButtonsBlurPreview />
      </div>
      <Tabs
        className="h-[348px] overflow-hidden rounded-b-lg **:data-[slot=tabs-list]:border-x **:data-[slot=tabs-list]:border-t **:data-[slot=tabs-list]:border-dotted"
        defaultValue="tailwind"
        tabs={[
          {
            name: "tailwind",
            label: "Tailwind CSS",
            children: (
              <CodeBlock className="absolute inset-0 rounded-none" lang="tsx">{`
                <EmojiPickerPrimitive.List
                  components={{
                    Emoji: ({ emoji, isActive, ...props }) => {
                      return (
                        <button
                          aria-label={emoji.label}
                          data-active={isActive ? "" : undefined}
                          className="relative flex aspect-square size-8 items-center justify-center overflow-hidden rounded-md text-lg data-[active]:bg-neutral-100/80 dark:data-[active]:bg-neutral-800/80 before:absolute before:inset-0 before:-z-1 before:hidden before:items-center before:justify-center before:text-[2.5em] before:blur-lg before:saturate-200 before:content-(--emoji) data-[active]:before:flex"
                          style={
                            {
                              "--emoji": \`"\${emoji.emoji}"\`,
                            } as CSSProperties
                          }
                          {...props}
                        >
                          {emoji.emoji}
                        </button>
                      );
                    },
                  }}
                />
              `}</CodeBlock>
            ),
          },
          {
            name: "css",
            label: "CSS",
            children: (
              <CodeBlock className="absolute inset-0 rounded-none" lang="css">{`
                [frimousse-emoji] {
                  position: relative;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  width: 32px;
                  height: 32px;
                  border-radius: 6px;
                  background: transparent;
                  font-size: 18px;
                  overflow: hidden;

                  &::before {
                    content: var(--emoji);
                    position: absolute;
                    inset: 0;
                    z-index: -1;
                    display: none;
                    align-items: center;
                    justify-content: center;
                    font-size: 2.5em;
                    filter: blur(16px) saturate(200%);
                  }

                  &[data-active] {
                    background: light-dark(rgb(245 245 245 / 80%), rgb(38 38 38 / 80%));

                    &::before {
                      display: flex;
                    }
                  }
                }
              `}</CodeBlock>
            ),
          },
        ]}
      />
    </figure>
  );
}
