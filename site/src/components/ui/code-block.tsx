"use cache";

import { cn } from "@/lib/utils";
import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import dedent from "dedent";
import type { ComponentProps } from "react";
import type { BundledLanguage } from "shiki";
import { codeToHtml, createCssVariablesTheme } from "shiki";
import { CopyButton } from "../copy-button";

const TRANSFORMERS_ANNOTATION_REGEX = /\[!code(?:\s+\w+(:\w+)?)?\]/;

interface CodeBlockProps extends Omit<ComponentProps<"div">, "children"> {
  lang: BundledLanguage;
  children: string;
}

function removeTransformersAnnotations(code: string): string {
  return code
    .split("\n")
    .filter((line) => !TRANSFORMERS_ANNOTATION_REGEX.test(line))
    .join("\n");
}

export async function CodeBlock({
  children,
  lang,
  className,
  ...props
}: CodeBlockProps) {
  const code = dedent(children);
  const html = await codeToHtml(code, {
    lang,
    theme: createCssVariablesTheme(),
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
        "code-block not-prose group relative min-h-11 overflow-hidden rounded-lg bg-muted",
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
          "absolute top-1.5 right-1.5 bg-muted/20 outline-muted-foreground/40 backdrop-blur-md",
          "lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100",
        )}
        text={removeTransformersAnnotations(code)}
      />
      <div
        className={cn(
          "flex overflow-x-auto font-mono text-secondary-foreground text-sm",
          "**:[code]:block **:[pre,code,.line]:w-full **:[pre,span]:text-(--shiki-light) dark:**:[pre,span]:text-(--shiki-dark) **:[pre]:cursor-text **:[pre]:outline-none",
          "**:[.line.highlighted]:bg-secondary/60 **:[.line:first-child]:mt-3 **:[.line:last-child]:mb-3 **:[.line:only-child]:pt-0.25 **:[.line]:inline-block **:[.line]:px-3",
        )}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: This is safe with Shiki
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
