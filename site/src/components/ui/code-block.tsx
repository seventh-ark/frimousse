"use cache";

import type { BundledLanguage } from "shiki";
import { codeToHtml } from "shiki";

export async function CodeBlock(props: {
  children: string;
  lang: BundledLanguage;
}) {
  const out = await codeToHtml(props.children, {
    lang: props.lang,
    theme: "none",
  });

  return (
    <div
      className="overflow-hidden rounded-md bg-muted p-3 font-mono text-secondary-foreground text-sm"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: "How Shiki works"
      dangerouslySetInnerHTML={{ __html: out }}
    />
  );
}
