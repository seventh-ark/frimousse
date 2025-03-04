"use client";

import { cn } from "@/lib/utils";
import {
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type HTMLAttributes,
  forwardRef,
} from "react";
import { Drawer as DrawerPrimitive } from "vaul";

const Drawer = ({
  shouldScaleBackground = true,
  ...props
}: ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root
    shouldScaleBackground={shouldScaleBackground}
    {...props}
  />
);

const DrawerTrigger = DrawerPrimitive.Trigger;

const DrawerPortal = DrawerPrimitive.Portal;

const DrawerClose = DrawerPrimitive.Close;

const DrawerOverlay = forwardRef<
  ComponentRef<typeof DrawerPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    className={cn("fixed inset-0 z-50 bg-overlay", className)}
    ref={ref}
    {...props}
  />
));

const DrawerContent = forwardRef<
  ComponentRef<typeof DrawerPrimitive.Content>,
  ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      className={cn(
        "fixed inset-x-4 bottom-0 z-50 mt-24 after:hidden",
        className,
      )}
      ref={ref}
      {...props}
    >
      <div className="relative mb-4 flex h-auto w-full flex-col rounded-2xl border bg-background shadow-popover">
        <div aria-hidden className="flex flex-col items-center py-3">
          <span className="h-1.5 w-20 rounded-full bg-secondary" />
        </div>
        {children}
      </div>
    </DrawerPrimitive.Content>
  </DrawerPortal>
));

const DrawerHeader = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)}
    {...props}
  />
);

const DrawerFooter = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("mt-auto flex flex-col gap-2 p-4", className)}
    {...props}
  />
);

const DrawerTitle = forwardRef<
  ComponentRef<typeof DrawerPrimitive.Title>,
  ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title className={cn("", className)} ref={ref} {...props} />
));

const DrawerDescription = forwardRef<
  ComponentRef<typeof DrawerPrimitive.Description>,
  ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    className={cn("text-muted-foreground text-sm", className)}
    ref={ref}
    {...props}
  />
));

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
