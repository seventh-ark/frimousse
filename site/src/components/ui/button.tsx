import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps
  extends ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const buttonVariants = cva(
  "transition duration-200 ease-out inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-sm font-medium disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:flex-none",
  {
    variants: {
      variant: {
        none: "",
        default:
          "bg-primary text-primary-foreground hover:bg-primary/80 focus-visible:bg-primary/80 data-[state=open]:bg-primary/80 selection:bg-primary-foreground/20",
        secondary:
          "bg-muted text-secondary-foreground hover:bg-secondary/60 focus-visible:bg-secondary/60 data-[state=open]:bg-secondary/60 outline-secondary",
        ghost:
          "hover:bg-muted focus-visible:bg-muted data-[state=open]:bg-muted text-muted-foreground hover:text-secondary-foreground focus-visible:text-secondary-foreground data-[state=open]:text-secondary-foreground",
        outline:
          "border border-dotted hover:bg-muted focus-visible:bg-muted data-[state=open]:bg-muted text-secondary-foreground hover:text-foreground focus-visible:text-foreground data-[state=open]:text-foreground",
      },
      size: {
        default:
          "h-8 px-4 py-2 has-[>svg]:px-3 [&_svg:not([class*='size-'])]:size-4 text-sm",
        sm: "h-6 px-1.5 py-0.5 has-[>svg]:px-2 [&_svg:not([class*='size-'])]:size-3.5 text-xs",
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
