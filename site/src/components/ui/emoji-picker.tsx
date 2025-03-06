"use client";

import { cn } from "@/lib/utils";
import {
  EmojiPicker as EmojiPickerPrimitive,
  type EmojiPickerRootProps,
} from "frimousse";
import { Frown, LoaderCircle } from "lucide-react";

interface EmojiPickerProps extends EmojiPickerRootProps {
  autoFocus?: boolean;
}

function EmojiPicker({
  className,
  autoFocus,
  columns = 9,
  ...props
}: EmojiPickerProps) {
  return (
    <EmojiPickerPrimitive.Root
      className={cn("w-full", className)}
      columns={columns}
      {...props}
    >
      <div className="px-4 sm:px-2 sm:pt-2">
        <EmojiPickerPrimitive.Search
          autoFocus={autoFocus}
          className="w-full rounded bg-muted p-2 outline-none placeholder:text-muted-foreground sm:text-sm"
        />
      </div>
      <EmojiPickerPrimitive.Viewport className="h-[320px]">
        <EmojiPickerPrimitive.Loading>
          <div className="flex h-full w-full flex-col items-center justify-center gap-3">
            <LoaderCircle className="size-6 animate-spin" />
            <span>Loading…</span>
          </div>
        </EmojiPickerPrimitive.Loading>
        <EmojiPickerPrimitive.Empty>
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <Frown className="size-5" />
            <span className="text-xs">No emoji found.</span>
          </div>
        </EmojiPickerPrimitive.Empty>
        <EmojiPickerPrimitive.List
          className="select-none pb-1"
          components={{
            Row: ({ children, ...props }) => (
              <div
                {...props}
                className="scroll-mb-4 px-4 text-lg max-sm:justify-between sm:scroll-mb-1.5 sm:px-1.5"
              >
                {children}
              </div>
            ),
            Emoji: ({ emoji, isActive, ...props }) => (
              <button
                {...props}
                aria-label={emoji.label}
                className="flex aspect-square min-w-8 flex-1 items-center justify-center whitespace-nowrap rounded-[max(2vw,var(--radius-md))] text-[max(4vw,var(--text-lg))] transition duration-100 data-[active]:bg-muted data-[active]:duration-0 sm:size-8 sm:flex-none sm:rounded-md sm:text-lg"
              >
                {emoji.emoji}
              </button>
            ),
            CategoryHeader: ({ category, ...props }) => (
              <div
                {...props}
                className="bg-background px-4 pt-3 pb-1.5 font-medium text-secondary-foreground text-xs sm:px-2.5"
              >
                {category.label}
              </div>
            ),
          }}
        />
      </EmojiPickerPrimitive.Viewport>
      <div className="flex w-full min-w-0 max-w-(--frimousse-list-width) flex-1 items-center gap-1 border-t p-2">
        <EmojiPickerPrimitive.ActiveEmoji>
          {({ emoji }) =>
            emoji ? (
              <>
                <div className="flex size-8 flex-none items-center justify-center text-xl">
                  {emoji?.emoji}
                </div>
                <span className="truncate font-medium text-secondary-foreground text-xs">
                  {emoji?.label}
                </span>
              </>
            ) : (
              <span className="ml-2 truncate font-medium text-muted-foreground text-xs">
                Select an emoji…
              </span>
            )
          }
        </EmojiPickerPrimitive.ActiveEmoji>
        <EmojiPickerPrimitive.SkinToneSelector
          className="ml-auto size-8 flex-none text-xl"
          emoji="👋"
        />
      </div>
    </EmojiPickerPrimitive.Root>
  );
}

export { EmojiPicker };
