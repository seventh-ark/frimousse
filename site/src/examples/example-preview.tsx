import { cn } from "@/lib/utils";
import { LoaderCircleIcon } from "lucide-react";
import { useInView } from "motion/react";
import { type ComponentProps, useRef } from "react";

export function ExamplePreview({
  children,
  className,
  ...props
}: ComponentProps<"div">) {
  const ref = useRef<HTMLDivElement>(null!);
  const isInView = useInView(ref);

  return (
    <div
      {...props}
      className={cn(
        "relative flex w-full items-center justify-center",
        className,
      )}
      ref={ref}
    >
      {isInView ? (
        children
      ) : (
        <LoaderCircleIcon className="size-5 animate-spin text-muted-foreground" />
      )}
    </div>
  );
}
