"use client";

import { toast } from "@/lib/toast";
import { ExamplePreview } from "../example-preview";
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerSearch,
} from "./ui/emoji-picker";

export function ShadcnUiPreview() {
  return (
    <ExamplePreview className="not-base shadcnui h-[460px]">
      <EmojiPicker
        className="h-[312px] rounded-lg border shadow-md"
        onEmojiSelect={(emoji) => {
          toast(emoji);
        }}
      >
        <EmojiPickerSearch />
        <EmojiPickerContent />
      </EmojiPicker>
    </ExamplePreview>
  );
}
