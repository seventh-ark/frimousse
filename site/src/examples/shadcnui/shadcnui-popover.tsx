"use client";

import { cn } from "@/lib/utils";
import { type ComponentProps, useState } from "react";
import { Button } from "./ui/button";
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerFooter,
  EmojiPickerSearch,
} from "./ui/emoji-picker";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export function ShadcnUiPopover({
  className,
  ...props
}: Omit<ComponentProps<"figure">, "children">) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <figure
      className={cn(
        "not-prose relative flex h-[320px] items-center justify-center rounded-lg border border-dotted bg-background",
        className,
      )}
      {...props}
    >
      <div className="not-base shadcnui flex size-full items-center justify-center">
        <Popover onOpenChange={setIsOpen} open={isOpen}>
          <PopoverTrigger asChild>
            <Button>Open emoji picker</Button>
          </PopoverTrigger>
          <PopoverContent className="w-fit p-0" side="bottom">
            <EmojiPicker
              className="h-[320px]"
              onEmojiSelect={(emoji) => {
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
      </div>
    </figure>
  );
}
