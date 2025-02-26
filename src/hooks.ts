import { useCallback, useDeferredValue, useMemo } from "react";
import { $activeEmoji, sameEmojiPickerEmoji } from "./store";

import { useEmojiPickerStore } from "./store";
import type { Emoji, SkinTone, SkinToneVariation } from "./types";
import { getSkinToneVariations } from "./utils/get-skin-tone-variations";
import { useSelector, useSelectorKey } from "./utils/store";

export function useActiveEmoji(): Emoji | undefined {
  const store = useEmojiPickerStore();
  const activeEmoji = useSelector(store, $activeEmoji, sameEmojiPickerEmoji);

  return useDeferredValue(activeEmoji);
}

export function useSkinTone(
  emoji = "✋",
): [SkinTone, (skinTone: SkinTone) => void, SkinToneVariation[]] {
  const store = useEmojiPickerStore();
  const skinTone = useSelectorKey(store, "skinTone");
  const skinTones = useMemo(() => getSkinToneVariations(emoji), [emoji]);

  const setSkinTone = useCallback((skinTone: SkinTone) => {
    store.set({ skinTone });
  }, []);

  return [skinTone, setSkinTone, skinTones] as const;
}
