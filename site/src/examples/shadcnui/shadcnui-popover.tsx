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
      <div className="flex items-center justify-center rounded-t-lg border border-b-0 border-dotted bg-background">
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

          export function App() {
            const [isOpen, setIsOpen] = React.useState(false);

            return (
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
            );
          }
        `}</CodeBlock>
    </figure>
  );
}
