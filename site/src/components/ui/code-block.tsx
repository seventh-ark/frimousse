"use cache";

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
    <div className="group relative min-h-10 overflow-hidden rounded-md bg-muted p-3">
      <CopyButton
        className="absolute top-1.5 right-1.5 scale-95 bg-muted opacity-0 transition duration-300 ease-out group-hover:scale-100 group-hover:opacity-100"
        text={props.children}
      />
      <div
        className="font-mono text-secondary-foreground text-sm"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: "How Shiki works"
        dangerouslySetInnerHTML={{ __html: out }}
      />
    </div>
  );
}
