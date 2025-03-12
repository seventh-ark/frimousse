"use client";

import { cn } from "@/lib/utils";
import {
  type EmojiPickerListCategoryHeaderProps,
  type EmojiPickerListEmojiProps,
  type EmojiPickerListRowProps,
  EmojiPicker as EmojiPickerPrimitive,
  type EmojiPickerRootProps,
} from "frimousse";
import { Frown, LoaderCircle, Search } from "lucide-react";
import { buttonVariants } from "./button";

interface EmojiPickerProps extends EmojiPickerRootProps {
  autoFocus?: boolean;
}

function EmojiPickerRow({ children, ...props }: EmojiPickerListRowProps) {
  return (
    <div
      {...props}
      className="scroll-my-[2vw] px-[2vw] sm:scroll-my-1.5 sm:px-1.5"
    >
      {children}
    </div>
  );
}

function EmojiPickerEmoji({
  emoji,
  isActive,
  ...props
}: EmojiPickerListEmojiProps) {
  return (
    <button
      {...props}
      aria-label={emoji.label}
      className="group relative flex aspect-square min-w-8 max-w-[calc(100%/var(--frimousse-list-columns))] flex-1 items-center justify-center whitespace-nowrap rounded-[max(2vw,var(--radius-md))] text-[max(4vw,var(--text-lg))] transition-colors duration-200 ease-out data-[active]:bg-muted/80 data-[active]:duration-0 sm:size-8 sm:flex-none sm:rounded-md sm:text-lg"
    >
      <span
        aria-hidden
        className="absolute inset-0 hidden items-center justify-center overflow-hidden rounded-[inherit] opacity-0 transition-[display,opacity] transition-discrete duration-200 ease-out group-data-[active]:flex group-data-[active]:opacity-100 group-data-[active]:duration-0"
      >
        <span className="text-[2.5em] opacity-20 blur-lg saturate-200">
          {emoji.emoji}
        </span>
      </span>
      <span className="relative">{emoji.emoji}</span>
    </button>
  );
}

function EmojiPickerCategoryHeader({
  category,
  ...props
}: EmojiPickerListCategoryHeaderProps) {
  return (
    <div
      {...props}
      className="bg-background px-4 pt-3 pb-1.5 font-medium text-secondary-foreground text-xs sm:px-3"
    >
      {category.label}
    </div>
  );
}

function EmojiPicker({
  className,
  autoFocus,
  columns,
  ...props
}: EmojiPickerProps) {
  const skinToneSelector = (
    <EmojiPickerPrimitive.SkinToneSelector
      className={cn(
        buttonVariants({ variant: "secondary", size: "icon" }),
        "rounded-md",
      )}
      title="Change skin tone"
    />
  );

  return (
    <EmojiPickerPrimitive.Root
      className={cn(
        "isolate flex h-[calc(100%_-_var(--spacing)*8)] w-full flex-col sm:h-[368px]",
        className,
      )}
      columns={columns}
      {...props}
    >
      <div className="relative z-10 flex flex-none items-center gap-2 px-4 sm:px-2 sm:pt-2">
        <div className="relative flex-1">
          <Search className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-2 size-4 text-muted-foreground" />
          <EmojiPickerPrimitive.Search
            autoFocus={autoFocus}
            className="focusable h-8 w-full appearance-none rounded-md bg-muted py-1.5 pr-2.5 pl-7.5 transition duration-200 ease-out placeholder:text-muted-foreground sm:text-sm"
          />
        </div>
        <div className="flex-none sm:hidden">{skinToneSelector}</div>
      </div>
      <EmojiPickerPrimitive.Viewport className="relative flex-1 outline-none">
        <EmojiPickerPrimitive.Loading>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
            <LoaderCircle className="size-5 animate-spin" />
          </div>
        </EmojiPickerPrimitive.Loading>
        <EmojiPickerPrimitive.Empty>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <Frown className="size-5" />
            <span className="text-sm">No emoji found.</span>
          </div>
        </EmojiPickerPrimitive.Empty>
        <EmojiPickerPrimitive.List
          className="select-none pb-[2vw] sm:pb-1.5"
          components={{
            Row: EmojiPickerRow,
            Emoji: EmojiPickerEmoji,
            CategoryHeader: EmojiPickerCategoryHeader,
          }}
        />
      </EmojiPickerPrimitive.Viewport>
      <div className="hidden w-full min-w-0 max-w-(--frimousse-viewport-width) flex-none items-center gap-1 border-border/80 border-t p-2 sm:flex dark:border-border">
        <EmojiPickerPrimitive.ActiveEmoji>
          {({ emoji }) =>
            emoji ? (
              <>
                <div className="flex size-8 flex-none items-center justify-center text-xl">
                  {emoji.emoji}
                </div>
                <span className="truncate font-medium text-secondary-foreground text-xs">
                  {emoji.label}
                </span>
              </>
            ) : (
              <span className="ml-2 truncate font-medium text-muted-foreground text-xs">
                Select an emoji…
              </span>
            )
          }
        </EmojiPickerPrimitive.ActiveEmoji>
        <div className="ml-auto flex-none">{skinToneSelector}</div>
      </div>
    </EmojiPickerPrimitive.Root>
  );
}

export { EmojiPicker };
