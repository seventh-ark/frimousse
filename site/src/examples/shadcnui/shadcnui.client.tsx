"use client";

import { toast } from "@/lib/toast";
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerSearch,
} from "./ui/emoji-picker";

export function ShadcnUiPreview() {
  return (
    <div className="not-base shadcnui flex size-full items-center justify-center">
      <EmojiPicker
        className="h-[312px] rounded-lg border shadow-md"
        onEmojiSelect={(emoji) => {
          toast(emoji);
        }}
      >
        <EmojiPickerSearch />
        <EmojiPickerContent />
      </EmojiPicker>
    </div>
  );
}
