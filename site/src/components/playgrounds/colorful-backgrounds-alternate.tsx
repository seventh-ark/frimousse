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

function Row({ index, style, className, children, ...props }: RowProps) {
  return (
    <div
      aria-rowindex={index}
      className={cn("group", className)}
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
  className,
  children,
  ...props
}: EmojiProps) {
  return (
    <button
      aria-colindex={index}
      aria-label={emoji.label}
      className={cn(
        "group relative size-12 rounded-[20%] text-2xl outline-none transition duration-200 ease-out",
        "hover:bg-(--color) hover:duration-0 focus-visible:bg-(--color) focus-visible:duration-0",
        "[--color-red:var(--color-rose-100)] dark:[--color-red:var(--color-rose-950)]",
        "[--color-green:var(--color-lime-100)] dark:[--color-green:var(--color-lime-950)]",
        "[--color-blue:var(--color-sky-100)] dark:[--color-blue:var(--color-sky-950)]",
        "group-odd:nth-[3n+1]:[--color:var(--color-red)] group-even:nth-[3n+2]:[--color:var(--color-red)]",
        "group-odd:nth-[3n+2]:[--color:var(--color-green)] group-even:nth-[3n+3]:[--color:var(--color-green)]",
        "group-odd:nth-[3n+3]:[--color:var(--color-blue)] group-even:nth-[3n+1]:[--color:var(--color-blue)]",
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
      {emoji.emoji}
    </button>
  );
}

export function ColorfulBackgroundsAlternate({
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
