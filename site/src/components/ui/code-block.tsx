"use cache";

import { cn } from "@/lib/utils";
import type { BundledLanguage } from "shiki";
import { codeToHtml } from "shiki";
import { CopyButton } from "../copy-button";

export async function CodeBlock(props: {
  children: string;
  lang: BundledLanguage;
}) {
  const out = await codeToHtml(props.children, {
    lang: props.lang,
    theme: "none",
  });

  return (
    <div className="group relative min-h-10 overflow-hidden rounded-md bg-muted">
      <span
        aria-hidden="true"
        className="absolute inset-y-0 right-0 w-3 bg-gradient-to-l from-muted"
      />
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-muted"
      />
      <CopyButton
        className={cn(
          "absolute top-1.5 right-1.5 bg-muted/20 ring-1 ring-muted backdrop-blur-md",
          "lg:scale-95 lg:opacity-0 lg:group-hover:scale-100 lg:group-hover:opacity-100",
        )}
        text={props.children}
      />
      <div
        className="flex overflow-x-auto p-3 font-mono text-secondary-foreground text-sm"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: "How Shiki works"
        dangerouslySetInnerHTML={{ __html: out }}
      />
    </div>
  );
}
