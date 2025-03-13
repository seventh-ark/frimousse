import { CodeBlock } from "@/components/ui/code-block";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import { ShadcnUiBasicPreview } from "./shadcnui-basic.client";

export function ShadcnUiBasic({
  className,
  ...props
}: Omit<ComponentProps<"figure">, "children">) {
  return (
    <figure className={cn("not-prose relative", className)} {...props}>
      <div className="flex items-center justify-center rounded-t-lg border border-b-0 border-dotted bg-background py-12">
        <ShadcnUiBasicPreview />
      </div>
      <div>
        <CodeBlock className="rounded-t-none" lang="tsx">{`
          "use client";

          import * as React from "react";

          import {
            EmojiPicker,
            EmojiPickerSearch,
            EmojiPickerContent,
            EmojiPickerFooter,
          } from "@/components/ui/emoji-picker";

          export function App() {
            return (
              <EmojiPicker
                className="h-[320px] rounded-lg border shadow-md"
                onEmojiSelect={(emoji) => {
                  console.log(emoji);
                }}
              >
                <EmojiPickerSearch />
                <EmojiPickerContent />
              </EmojiPicker>
            );
          }
        `}</CodeBlock>
      </div>
    </figure>
  );
}
