"use client";

import { type ComponentProps, useMemo } from "react";
import slugify from "slugify";
import { getTextContent } from "@/lib/get-text-content";
import { cn } from "@/lib/utils";

type Heading = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

interface PermalinkHeadingProps extends ComponentProps<Heading> {
  as?: Heading;
  slug?: string;
  slugPrefix?: string;
}

export function PermalinkHeading({
  as = "h1",
  slug: customSlug,
  slugPrefix,
  className,
  children,
  ...props
}: PermalinkHeadingProps) {
  const Heading = as;
  const slug = useMemo(() => {
    return slugify(
      (slugPrefix ? `${slugPrefix} ` : "") +
        (customSlug ?? getTextContent(children)),
      { lower: true },
    );
  }, [customSlug, slugPrefix, children]);

  return (
    <Heading
      className={cn("link scroll-mt-18 md:scroll-mt-24", className)}
      {...props}
      id={slug}
    >
      <a href={`#${slug}`}>{children}</a>
    </Heading>
  );
}
