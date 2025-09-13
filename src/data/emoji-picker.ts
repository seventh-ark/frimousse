import type {
  Emoji,
  EmojiData,
  EmojiDataEmoji,
  EmojiPickerData,
  EmojiPickerDataCategory,
  EmojiPickerDataRow,
  EmojiPickerEmoji,
  SkinTone,
} from "../types";
import { chunk } from "../utils/chunk";

export function searchAndExcludeEmojis(
  emojis: EmojiDataEmoji[],
  search?: string,
  excludedEmojis?: Array<string>,
) {
  if (!search && !excludedEmojis) {
    return emojis;
  }

  const searchText = search?.toLowerCase().trim() ?? "";
  const scores = new WeakMap<Emoji, number>();

  return emojis
    .filter((emoji) => {
      if (excludedEmojis?.includes(emoji.emoji)) {
        return false;
      }

      if (searchText !== "") {
        let score = 0;

        if (emoji.label.toLowerCase().includes(searchText)) {
          score += 10;
        }

        for (const tag of emoji.tags) {
          if (tag.toLowerCase().includes(searchText)) {
            score += 1;
          }
        }

        if (score > 0) {
          scores.set(emoji, score);

          return true;
        }

        return false;
      }

      return true;
    })
    .sort((a, b) => (scores.get(b) ?? 0) - (scores.get(a) ?? 0));
}

export function getEmojiPickerData(
  data: EmojiData,
  columns: number,
  skinTone: SkinTone | undefined,
  search: string,
  excludedEmojis?: Array<string>,
): EmojiPickerData {
  const emojis = searchAndExcludeEmojis(data.emojis, search, excludedEmojis);
  const rows: EmojiPickerDataRow[] = [];
  const categories: EmojiPickerDataCategory[] = [];
  const categoriesStartRowIndices: number[] = [];
  const emojisByCategory: Record<number, EmojiPickerEmoji[]> = {};
  let categoryIndex = 0;
  let startRowIndex = 0;

  for (const emoji of emojis) {
    if (!emojisByCategory[emoji.category]) {
      emojisByCategory[emoji.category] = [];
    }

    emojisByCategory[emoji.category]!.push({
      emoji:
        skinTone && skinTone !== "none" && emoji.skins
          ? emoji.skins[skinTone]
          : emoji.emoji,
      label: emoji.label,
    });
  }

  for (const category of data.categories) {
    const categoryEmojis = emojisByCategory[category.index];

    if (!categoryEmojis || categoryEmojis.length === 0) {
      continue;
    }

    const categoryRows = chunk(Array.from(categoryEmojis), columns).map(
      (emojis) => ({
        categoryIndex,
        emojis,
      }),
    );

    rows.push(...categoryRows);
    categories.push({
      label: category.label,
      rowsCount: categoryRows.length,
      startRowIndex,
    });

    categoriesStartRowIndices.push(startRowIndex);

    categoryIndex++;
    startRowIndex += categoryRows.length;
  }

  return {
    count: emojis.length,
    categories,
    categoriesStartRowIndices,
    rows,
    skinTones: data.skinTones,
  };
}
