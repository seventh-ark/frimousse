import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

interface PropertiesListRowProps
  extends Omit<ComponentProps<"li">, "name" | "type"> {
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
}

export function PropertiesList({
  children,
  className,
  ...props
}: ComponentProps<"ul">) {
  return (
    <ul
      className={cn(
        "not-prose properties-list overflow-hidden rounded-lg border border-border border-dotted",
        "**:[li:not(:last-child)]:border-border **:[li:not(:last-child)]:border-b **:[li:not(:last-child)]:border-dotted **:[li]:px-4 **:[li]:py-3",
        className,
      )}
      {...props}
    >
      {children}
    </ul>
  );
}

export function PropertiesListBasicRow({
  children,
  className,
  ...props
}: ComponentProps<"li">) {
  return (
    <li className={cn("prose prose-sm", className)} {...props}>
      {children}
    </li>
  );
}

export function PropertiesListRow({
  name,
  type,
  required,
  defaultValue,
  children,
  className,
  ...props
}: PropertiesListRowProps) {
  return (
    <li className={cn("flex flex-col gap-1", className)} {...props}>
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <code className="flex-none font-medium font-mono text-[0.875em]">
          {name}
        </code>
        {type && (
          <code className="flex-none font-medium font-mono text-[0.875em] text-secondary-foreground">
            {type}
          </code>
        )}
        {required && (
          <span className="text-accent text-product-brand text-xs">
            Required
          </span>
        )}
        {defaultValue && (
          <span className="text-product-brand text-secondary-foreground/80 text-xs leading-[1.65]">
            Default is {defaultValue}
          </span>
        )}
      </div>
      <div className="prose prose-sm">{children}</div>
    </li>
  );
}
