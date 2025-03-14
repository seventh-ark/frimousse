import { CodeBlock } from "@/components/ui/code-block";
import { Tabs } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import { UsagePreview } from "./usage.client";

export function Usage({
  className,
  ...props
}: Omit<ComponentProps<"figure">, "children">) {
  return (
    <figure
      className={cn("not-prose relative overflow-hidden", className)}
      {...props}
    >
      <div className="flex items-center justify-center rounded-t-lg border border-b-0 border-dotted bg-background py-12">
        <UsagePreview />
      </div>
      <Tabs
        className="h-[348px] overflow-hidden rounded-b-lg border-x border-t border-dotted"
        defaultValue="tailwind"
        tabs={[
          {
            name: "tailwind",
            label: "Tailwind CSS",
            children: (
              <CodeBlock className="absolute inset-0 rounded-none" lang="tsx">{`
                  "use client";
        
                  import { EmojiPicker, EmojiPickerRootProps } from "frimousse";

                  export function MyEmojiPicker(props: EmojiPickerRootProps) {
                    return (
                      <EmojiPickerPrimitive.Root
                        className="isolate flex h-[352px] w-fit flex-col bg-white dark:bg-neutral-900"
                        {...props}
                      >
                        <EmojiPickerPrimitive.Search className="z-10 mx-2 mt-2 appearance-none rounded-md bg-neutral-100 px-2.5 py-2 text-sm dark:bg-neutral-800" />
                        <EmojiPickerPrimitive.Viewport className="relative flex-1 outline-hidden">
                          <EmojiPickerPrimitive.Loading className="absolute inset-0 flex items-center justify-center text-neutral-400 text-sm dark:text-neutral-500">
                            Loading…
                          </EmojiPickerPrimitive.Loading>
                          <EmojiPickerPrimitive.Empty className="absolute inset-0 flex items-center justify-center text-neutral-400 text-sm dark:text-neutral-500">
                            No emoji found.
                          </EmojiPickerPrimitive.Empty>
                          <EmojiPickerPrimitive.List
                            className="select-none pb-1.5"
                            components={{
                              CategoryHeader: ({ category, ...props }) => (
                                <div
                                  className="bg-white px-3 pt-3 pb-1.5 font-medium text-neutral-600 text-xs dark:bg-neutral-900 dark:text-neutral-400"
                                  {...props}
                                >
                                  {category.label}
                                </div>
                              ),
                              Row: ({ children, ...props }) => (
                                <div className="scroll-my-1.5 px-1.5" {...props}>
                                  {children}
                                </div>
                              ),
                              Emoji: ({ emoji, isActive: _, ...props }) => (
                                <button
                                  aria-label={emoji.label}
                                  className="flex size-8 items-center justify-center whitespace-nowrap rounded-md text-lg data-[active]:bg-neutral-100 dark:data-[active]:bg-neutral-800"
                                  {...props}
                                >
                                  {emoji.emoji}
                                </button>
                              ),
                            }}
                          />
                        </EmojiPickerPrimitive.Viewport>
                      </EmojiPickerPrimitive.Root>
                    );
                  }
                `}</CodeBlock>
            ),
          },
          {
            name: "css",
            label: "CSS",
            children: (
              <CodeBlock className="absolute inset-0 rounded-none" lang="css">{`
                  [frimousse-root] {
                    display: flex;
                    flex-direction: column;
                    width: fit-content;
                    height: 352px;
                    background: light-dark(#fff, #171717);
                    isolation: isolate;
                  }

                  [frimousse-search] {
                    position: relative;
                    z-index: 10;
                    appearance: none;
                    margin-block-start: 8px;
                    margin-inline: 8px;
                    padding: 8px 10px;
                    background: light-dark(#f5f5f5, #262626);
                    border-radius: 6px;
                    font-size: 14px;
                  }

                  [frimousse-viewport] {
                    position: relative;
                    flex: 1;
                    outline: none;
                  }

                  [frimousse-loading] {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: light-dark(#a1a1a1, #737373);
                    font-size: 14px;
                  }

                  [frimousse-list] {
                    padding-block-end: 12px;
                    user-select: none;
                  }

                  [frimousse-category-header] {
                    padding: 12px 12px 6px;
                    background: light-dark(#fff, #171717);
                    color: light-dark(#525252, #a1a1a1);
                    font-size: 12px;
                    font-weight: 500;
                  }

                  [frimousse-row] {
                    padding-inline: 12px;
                    scroll-margin-block: 12px;
                  }

                  [frimousse-emoji] {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 32px;
                    height: 32px;
                    border-radius: 6px;
                    background: transparent;
                    font-size: 18px;
                    white-space: nowrap;

                    &[data-active] {
                      background: light-dark(#f5f5f5, #262626);
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
