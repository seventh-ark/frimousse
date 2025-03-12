import { cn } from "@/lib/utils";
import type { Emoji as EmojiObject } from "frimousse";
import type { ComponentProps } from "react";

interface ListProps extends ComponentProps<"div"> {
  rows: number;
  columns: number;
}

interface RowProps extends ComponentProps<"div"> {
  index: number;
}

interface EmojiProps extends ComponentProps<"button"> {
  emoji: EmojiObject;
  index: number;
}

function List({ rows, columns, children, ...props }: ListProps) {
  return (
    <div
      aria-colcount={columns}
      aria-rowcount={rows}
      frimousse-list=""
      role="grid"
      {...props}
    >
      {children}
    </div>
  );
}

function Row({ index, style, children, ...props }: RowProps) {
  return (
    <div
      aria-rowindex={index}
      frimousse-row=""
      role="row"
      style={{
        contain: "content",
        display: "flex",
        ...style,
      }}
      tabIndex={-1}
      {...props}
    >
      {children}
    </div>
  );
}

function Emoji({
  emoji,
  index,
  style,
  children,
  className,
  ...props
}: EmojiProps) {
  return (
    <button
      aria-colindex={index}
      aria-label={emoji.label}
      className={cn(
        "group relative size-12 rounded-[20%] text-2xl outline-none transition duration-200 ease-out",
        "hover:bg-gray-400/10 hover:duration-0 focus-visible:bg-gray-400/10 focus-visible:duration-0 dark:focus-visible:bg-gray-400/20 dark:hover:bg-gray-400/20",
        className,
      )}
      frimousse-emoji=""
      role="gridcell"
      style={{
        fontFamily:
          "'Apple Color Emoji', 'Noto Color Emoji', 'Twemoji Mozilla', 'Android Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', EmojiSymbols, sans-serif",
        ...style,
      }}
      type="button"
      {...props}
    >
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 hidden items-center justify-center overflow-hidden rounded-[inherit] opacity-0 transition-[display,opacity] transition-discrete duration-200 ease-out",
          "group-hover:flex group-hover:opacity-100 group-hover:duration-0 group-focus-visible:flex group-focus-visible:opacity-100 group-focus-visible:duration-0",
        )}
      >
        <span className="text-9xl opacity-20 blur-lg saturate-150">
          {emoji.emoji}
        </span>
      </span>
      <span className="relative">{emoji.emoji}</span>
    </button>
  );
}

export function ColorfulBackgroundsBlur({
  className,
  ...props
}: Omit<ComponentProps<"figure">, "children">) {
  return (
    <figure
      className={cn(
        "not-prose flex aspect-16/9 items-center justify-center rounded-lg border border-dotted bg-background p-4",
        className,
      )}
      {...props}
    >
      <List className="w-fit" columns={4} rows={3}>
        <Row index={0}>
          <Emoji
            emoji={{ emoji: "😊", label: "Smiling face with smiling eyes" }}
            index={0}
          />
          <Emoji emoji={{ emoji: "🎀", label: "Ribbon" }} index={1} />
          <Emoji emoji={{ emoji: "🥑", label: "Avocado" }} index={2} />
          <Emoji emoji={{ emoji: "🌈", label: "Rainbow" }} index={3} />
        </Row>
        <Row index={1}>
          <Emoji emoji={{ emoji: "🖤", label: "Black heart" }} index={0} />
          <Emoji emoji={{ emoji: "❤️", label: "Red heart" }} index={1} />
          <Emoji emoji={{ emoji: "🧡", label: "Orange heart" }} index={2} />
          <Emoji emoji={{ emoji: "💛", label: "Yellow heart" }} index={3} />
        </Row>
        <Row index={2}>
          <Emoji emoji={{ emoji: "💚", label: "Green heart" }} index={0} />
          <Emoji emoji={{ emoji: "💙", label: "Blue heart" }} index={1} />
          <Emoji emoji={{ emoji: "💜", label: "Purple heart" }} index={2} />
          <Emoji emoji={{ emoji: "🩷", label: "Pink heart" }} index={3} />
        </Row>
      </List>
    </figure>
  );
}
