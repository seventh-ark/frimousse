"use client";

import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerSearch,
} from "./ui/emoji-picker";

export function ShadcnUiBasic({
  className,
  ...props
}: Omit<ComponentProps<"figure">, "children">) {
  return (
    <figure
      className={cn(
        "not-prose relative flex items-center justify-center rounded-lg border border-dotted bg-background py-12",
        className,
      )}
      {...props}
    >
      <div className="not-base shadcnui flex size-full items-center justify-center">
        <EmojiPicker
          className="h-[320px] rounded-lg border shadow-md"
          onEmojiSelect={(emoji, label) => {
            toast(emoji, label);
          }}
        >
          <EmojiPickerSearch />
          <EmojiPickerContent />
        </EmojiPicker>
      </div>
    </figure>
  );
}
