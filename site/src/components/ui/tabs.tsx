import * as TabsPrimitive from "@radix-ui/react-tabs";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Tab {
  name: string;
  label?: ReactNode;
  children: ReactNode;
}

interface TabsProps
  extends Omit<ComponentProps<typeof TabsPrimitive.Root>, "children"> {
  tabs: Tab[];
}

export function Tabs({ tabs, className, ...props }: TabsProps) {
  return (
    <TabsPrimitive.Root
      className={cn("flex flex-col bg-background", className)}
      data-slot="tabs"
      {...props}
    >
      <TabsPrimitive.List
        className="flex flex-none gap-1.5 bg-background p-1.5"
        data-slot="tabs-list"
      >
        {tabs.map((tab) => (
          <TabsPrimitive.Trigger
            className="rounded-sm px-2 py-1 font-medium text-secondary-foreground/80 text-sm outline-muted-foreground/40 transition duration-200 ease-out hover:bg-muted hover:text-secondary-foreground focus-visible:bg-muted focus-visible:text-secondary-foreground data-[state=active]:bg-muted data-[state=active]:text-secondary-foreground"
            data-slot="tabs-trigger"
            key={tab.name}
            value={tab.name}
          >
            {tab.label ?? tab.name}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
      {tabs.map((tab) => (
        <TabsPrimitive.Content
          className="relative min-h-0 flex-1 outline-none"
          data-slot="tabs-content"
          key={tab.name}
          value={tab.name}
        >
          {tab.children}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  );
}
