import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import type { ComponentProps } from "react";

interface ButtonProps
  extends ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const buttonVariants = cva(
  "transition-all duration-200 ease-out inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded text-sm font-medium disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-3.5 [&_svg]:shrink-0 outline-none focus-visible:ring-ring focus-visible:ring-3",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/80 focus-visible:bg-primary/80 data-[state=open]:bg-primary/80",
        secondary:
          "bg-muted hover:bg-background border border-transparent hover:border-border focus-visible:border-border focus-visible:bg-background data-[state=open]:bg-background data-[state=open]:border-border",
        ghost:
          "hover:bg-secondary focus-visible:bg-secondary data-[state=open]:bg-secondary text-secondary-foreground",
        outline:
          "border border-dotted hover:bg-muted focus-visible:bg-muted data-[state=open]:bg-muted text-secondary-foreground hover:text-foreground focus-visible:text-foreground data-[state=open]:text-foreground",
      },
      size: {
        default: "h-8 px-4 py-2 has-[>svg]:px-3",
        icon: "size-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : "button";

  return (
    <Component
      className={cn(buttonVariants({ variant, size, className }))}
      data-slot="button"
      {...props}
    />
  );
}

export { Button, buttonVariants };
