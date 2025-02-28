import { CodeBlock } from "@/components/ui/code-block";

const USAGE_CODE = `"use client";
 
import { EmojiPicker } from "frimousse";
 
export function CustomEmojiPicker() {
  return (
    <EmojiPicker.Root>
      <EmojiPicker.Search  />
      <EmojiPicker.Viewport>
        <EmojiPicker.Loading>Loading…</EmojiPicker.Loading>
        <EmojiPicker.Empty>No emoji found.</EmojiPicker.Empty>
        <EmojiPicker.List />
      </EmojiPicker.Viewport>
    </EmojiPicker.Root>
  );
}`;

export const Usage = () => {
  return (
    <div>
      <h2>Usage</h2>
      <p>Create your own emoji picker component.</p>
      <CodeBlock lang="tsx">{USAGE_CODE}</CodeBlock>
    </div>
  );
};
