"use client";
import { toast } from "@/lib/toast";
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerSearch,
} from "./ui/emoji-picker";

export function ShadcnUiBasicPreview() {
  return (
    <div className="not-base shadcnui flex size-full items-center justify-center">
      <EmojiPicker
        className="h-[320px] rounded-lg border shadow-md"
        onEmojiSelect={(emoji, label) => {
          toast(emoji, label);
        }}
      >
        <EmojiPickerSearch />
        <EmojiPickerContent />
      </EmojiPicker>
    </div>
  );
}
