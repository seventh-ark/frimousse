"use cache";

import { cn } from "@/lib/utils";
import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import type { ComponentProps } from "react";
import type { BundledLanguage } from "shiki";
import { codeToHtml } from "shiki";
import { CopyButton } from "../copy-button";

interface CodeBlockProps extends Omit<ComponentProps<"div">, "children"> {
  lang: BundledLanguage;
  children: string;
}

export async function CodeBlock({
  children: code,
  lang,
  className,
  ...props
}: CodeBlockProps) {
  const html = await codeToHtml(code, {
    lang,
    theme: "none",
    defaultColor: false,
    transformers: [
      transformerNotationDiff(),
      transformerNotationErrorLevel(),
      transformerNotationHighlight(),
      transformerNotationWordHighlight(),
    ],
  });

  return (
    <div
      className={cn(
        "group relative min-h-11 overflow-hidden rounded-lg bg-muted",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className="absolute inset-y-0 right-0 w-3 bg-gradient-to-l from-muted"
      />
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-muted"
      />
      <CopyButton
        className={cn(
          "absolute top-1.5 right-1.5 bg-muted/20 ring-1 ring-muted backdrop-blur-md",
          "lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100",
        )}
        text={code}
      />
      <div
        className="flex overflow-x-auto p-3 font-mono text-secondary-foreground text-sm **:[pre,span]:text-(--shiki-light) dark:**:[pre,span]:text-(--shiki-dark) **:[pre]:cursor-text **:[pre]:outline-none **:[pre]:has-[&_.line:only-child]:pt-0.25"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: This is safe with Shiki
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
