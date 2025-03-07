"use client";

import { cn } from "@/lib/utils";
import {
  EmojiPicker as EmojiPickerPrimitive,
  type EmojiPickerRootProps,
} from "frimousse";
import { Frown, LoaderCircle, Search } from "lucide-react";

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
      className={cn(
        "flex h-[82vh] max-h-[520px] w-full flex-col sm:h-[360px]",
        className,
      )}
      columns={columns}
      {...props}
    >
      <div className="flex flex-none items-center gap-2 px-4 sm:px-2 sm:pt-2">
        <div className="relative flex-1">
          <Search className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-2 size-4 text-muted-foreground" />
          <EmojiPickerPrimitive.Search
            autoFocus={autoFocus}
            className="w-full appearance-none rounded-md bg-muted py-2 pr-2.5 pl-7.5 outline-none placeholder:text-muted-foreground sm:text-sm"
          />
        </div>
        <EmojiPickerPrimitive.SkinToneSelector
          className="-mr-1 size-8 flex-none text-xl sm:hidden"
          emoji="👋"
        />
      </div>
      <EmojiPickerPrimitive.Viewport className="flex-1 outline-none">
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
          className="select-none pb-4 sm:pb-1.5"
          components={{
            Row: ({ children, ...props }) => (
              <div
                {...props}
                className="scroll-mb-4 px-[calc(var(--spacing)+2vw)] text-lg sm:scroll-mb-1.5 sm:px-1.5"
              >
                {children}
              </div>
            ),
            Emoji: ({ emoji, isActive, ...props }) => (
              <button
                {...props}
                aria-label={emoji.label}
                className="flex aspect-square min-w-8 max-w-[calc(100%/var(--frimousse-list-columns))] flex-1 items-center justify-center whitespace-nowrap rounded-[max(2vw,var(--radius-md))] text-[max(4vw,var(--text-lg))] transition duration-100 data-[active]:bg-muted data-[active]:duration-0 sm:size-8 sm:flex-none sm:rounded-md sm:text-lg"
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
      <div className="hidden w-full min-w-0 max-w-(--frimousse-list-width) flex-none items-center gap-1 border-t p-2 sm:flex">
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
