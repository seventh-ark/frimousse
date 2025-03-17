import { CodeBlock } from "@/components/ui/code-block";
import { Tabs } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import { ColorfulButtonsAlternatePreview } from "./colorful-buttons-alternate.client";

export function ColorfulButtonsAlternate({
  className,
  ...props
}: Omit<ComponentProps<"figure">, "children">) {
  return (
    <figure
      className={cn("not-prose relative overflow-hidden", className)}
      {...props}
    >
      <div className="rounded-t-lg border border-b-0 border-dotted bg-background">
        <ColorfulButtonsAlternatePreview />
      </div>
      <Tabs
        className="h-[348px] overflow-hidden rounded-b-lg **:data-[slot=tabs-list]:border-x **:data-[slot=tabs-list]:border-t **:data-[slot=tabs-list]:border-dotted"
        defaultValue="tailwind"
        tabs={[
          {
            name: "tailwind",
            label: "Tailwind CSS",
            children: (
              <CodeBlock className="absolute inset-0 rounded-none" lang="tsx">{`
                <EmojiPickerPrimitive.List
                  components={{
                    Row: ({ children, ...props }) => (
                      <div className="group" {...props}>
                        {children}
                      </div>
                    ),
                    Emoji: ({ emoji, ...props }) => {
                      return (
                        <button
                          className="relative flex aspect-square size-8 items-center justify-center overflow-hidden rounded-md text-lg data-[active]:group-even:nth-[3n+1]:bg-blue-100 data-[active]:group-even:nth-[3n+2]:bg-red-100 data-[active]:group-even:nth-[3n+3]:bg-green-100 data-[active]:group-odd:nth-[3n+1]:bg-red-100 data-[active]:group-odd:nth-[3n+2]:bg-green-100 data-[active]:group-odd:nth-[3n+3]:bg-blue-100 dark:data-[active]:group-even:nth-[3n+1]:bg-blue-900 dark:data-[active]:group-even:nth-[3n+2]:bg-red-900 dark:data-[active]:group-even:nth-[3n+3]:bg-green-900 dark:data-[active]:group-odd:nth-[3n+1]:bg-red-900 dark:data-[active]:group-odd:nth-[3n+2]:bg-green-900 dark:data-[active]:group-odd:nth-[3n+3]:bg-blue-900"
                          {...props}
                        >
                          {emoji.emoji}
                        </button>
                      );
                    },
                  }}
                />
              `}</CodeBlock>
            ),
          },
          {
            name: "css",
            label: "CSS",
            children: (
              <CodeBlock className="absolute inset-0 rounded-none" lang="css">{`
                [frimousse-emoji] {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  width: 32px;
                  height: 32px;
                  border-radius: 6px;
                  background: transparent;
                  font-size: 18px;

                  &[data-active] {
                    [frimousse-row]:nth-child(odd) &:nth-child(3n+1),
                    [frimousse-row]:nth-child(even) &:nth-child(3n+2) {
                      background: light-dark(#ffe2e2, #82181a);
                    }

                    [frimousse-row]:nth-child(odd) &:nth-child(3n+2),
                    [frimousse-row]:nth-child(even) &:nth-child(3n+3) {
                      background: light-dark(#dcfce7, #0d542b);
                    }

                    [frimousse-row]:nth-child(odd) &:nth-child(3n+3),
                    [frimousse-row]:nth-child(even) &:nth-child(3n+1) {
                      background: light-dark(#dbeafe, #1c398e);
                    }
                  }
                }
              `}</CodeBlock>
            ),
          },
        ]}
      />
    </figure>
  );
}
