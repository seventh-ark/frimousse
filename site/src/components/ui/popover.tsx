"use client";

import { cn } from "@/lib/utils";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import type { ComponentProps } from "react";

function Popover(props: ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

function PopoverTrigger(
  props: ComponentProps<typeof PopoverPrimitive.Trigger>,
) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  children,
  ...props
}: ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        align={align}
        className={cn(
          "elevation relative isolate z-50 origin-(--radix-popover-content-transform-origin) overflow-hidden rounded-xl bg-background shadow-elevation outline-none",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-[0.96] data-[state=open]:zoom-in-[0.96] data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 after:pointer-events-none after:absolute after:inset-0 after:z-10 after:rounded-[inherit] data-[state=closed]:animate-out data-[state=open]:animate-in dark:after:shadow-[inset_0_0_0_1px_var(--color-neutral-800)]",
          className,
        )}
        collisionPadding={8}
        data-slot="popover-content"
        sideOffset={sideOffset}
        {...props}
      >
        {children}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
}

function PopoverAnchor(props: ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />;
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
