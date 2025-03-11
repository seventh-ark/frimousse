import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

interface PropertiesTableRowProps
  extends Omit<ComponentProps<"li">, "name" | "type"> {
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
}

export function PropertiesTable({
  children,
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "not-prose properties-table rounded-lg border border-border border-dotted",
        "**:[li:not(:last-child)]:border-border **:[li:not(:last-child)]:border-b **:[li:not(:last-child)]:border-dotted **:[li]:px-4 **:[li]:py-3",
        className,
      )}
      {...props}
    >
      <ul>{children}</ul>
    </div>
  );
}

export function PropertiesTableBasicRow({
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

export function PropertiesTableRow({
  name,
  type,
  required,
  defaultValue,
  children,
  className,
  ...props
}: PropertiesTableRowProps) {
  return (
    <li className={cn("flex flex-col gap-1", className)} {...props}>
      <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
        <code className="flex-none font-medium font-mono text-[0.875em]">
          {name}
        </code>
        {type && (
          <code className="flex-none font-medium font-mono text-[0.875em] text-secondary-foreground">
            {type}
          </code>
        )}
        {required && (
          <span className="truncate text-accent text-product-brand text-xs">
            Required
          </span>
        )}
        {defaultValue && (
          <span className="truncate text-product-brand text-secondary-foreground/80 text-xs">
            Default is {defaultValue}
          </span>
        )}
      </div>
      <div className="prose prose-sm">{children}</div>
    </li>
  );
}
