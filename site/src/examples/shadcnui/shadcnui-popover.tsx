import { buttonVariants } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import { ShadcnUiPopoverPreview } from "./shadcnui-popover.client";

export function ShadcnUiPopover({
  className,
  ...props
}: Omit<ComponentProps<"figure">, "children">) {
  return (
    <figure
      className={cn("not-prose relative overflow-hidden", className)}
      {...props}
    >
      <div className="relative isolate flex items-center justify-center rounded-t-lg border border-b-0 border-dotted bg-background">
        <a
          className={cn(
            buttonVariants({ size: "sm", variant: "ghost" }),
            "absolute top-1.5 right-1.5 z-10",
          )}
          href="https://v0.dev/chat/api/open?url=https://frimousse.liveblocks.io/r/blocks/emoji-picker-popover"
          rel="noreferrer"
          target="_blank"
        >
          <span className="mx-px inline-flex items-center gap-1">
            Edit in{" "}
            <svg
              className="size-4.5 leading-none"
              fill="currentColor"
              fillRule="evenodd"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>v0</title>
              <path
                clipRule="evenodd"
                d="M14.252 8.25h5.624c.088 0 .176.006.26.018l-5.87 5.87a1.889 1.889 0 01-.019-.265V8.25h-2.25v5.623a4.124 4.124 0 004.125 4.125h5.624v-2.25h-5.624c-.09 0-.179-.006-.265-.018l5.874-5.875a1.9 1.9 0 01.02.27v5.623H24v-5.624A4.124 4.124 0 0019.876 6h-5.624v2.25zM0 7.5v.006l7.686 9.788c.924 1.176 2.813.523 2.813-.973V7.5H8.25v6.87L2.856 7.5H0z"
              />
            </svg>
          </span>
        </a>
        <ShadcnUiPopoverPreview />
      </div>
      <CodeBlock className="max-h-[304px] rounded-t-none" lang="tsx">{`
          "use client";

          import * as React from "react";

          import { Button } from "@/components/ui/button";
          import {
            EmojiPicker,
            EmojiPickerSearch,
            EmojiPickerContent,
            EmojiPickerFooter,
          } from "@/components/ui/emoji-picker";
          import {
            Popover,
            PopoverContent,
            PopoverTrigger,
          } from "@/components/ui/popover";

          export default function Page() {
            const [isOpen, setIsOpen] = React.useState(false);

            return (
              <main className="flex h-full min-h-screen w-full items-center justify-center p-4">
                <Popover onOpenChange={setIsOpen} open={isOpen}>
                  <PopoverTrigger asChild>
                    <Button>Open emoji picker</Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-fit p-0">
                    <EmojiPicker
                      className="h-[312px]"
                      onEmojiSelect={({ emoji }) => {
                        setIsOpen(false);
                        console.log(emoji);
                      }}
                    >
                      <EmojiPickerSearch />
                      <EmojiPickerContent />
                      <EmojiPickerFooter />
                    </EmojiPicker>
                  </PopoverContent>
                </Popover>
              </main>
            );
          }
        `}</CodeBlock>
    </figure>
  );
}
