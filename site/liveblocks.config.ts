import type { LiveMap } from "@liveblocks/client";

export type Reactions = LiveMap<string, LiveMap<string, number>>;

export type ReactionsJson = Record<string, Record<string, number>>;

export type ReactionsJsonEntries = [string, Record<string, number>][];

declare global {
  interface Liveblocks {
    Storage: {
      reactions: Reactions;
    };
    StorageJson: {
      reactions: ReactionsJson;
    };
  }
}

export const ROOM_ID = "frimousse";

export const CREATED_AT_KEY = "@createdAt";
export const UPDATED_AT_KEY = "@updatedAt";
export const DEFAULT_KEYS = [CREATED_AT_KEY, UPDATED_AT_KEY];
export const DEFAULT_KEYS_COUNT = DEFAULT_KEYS.length;

// Roughly 3 rows of reactions on largest breakpoint
export const MAX_REACTIONS = 28;

export function sortReactions(
  [, dataA]: [string, LiveMap<string, number> | ReadonlyMap<string, number>],
  [, dataB]: [string, LiveMap<string, number> | ReadonlyMap<string, number>],
) {
  return (dataB.get(CREATED_AT_KEY) ?? 0) - (dataA.get(CREATED_AT_KEY) ?? 0);
}

export function sortReactionsEntries(
  [, dataA]: ReactionsJsonEntries[number],
  [, dataB]: ReactionsJsonEntries[number],
) {
  return (dataB[CREATED_AT_KEY] ?? 0) - (dataA[CREATED_AT_KEY] ?? 0);
}

function createDefaultReactions(emojis: string[]) {
  const reactions: ReactionsJson = {};

  for (const [index, emoji] of Object.entries(
    emojis.slice(0, MAX_REACTIONS).reverse(),
  )) {
    if (Number(index) > MAX_REACTIONS) {
      break;
    }

    reactions[emoji] = {
      [CREATED_AT_KEY]: Number(index),
      [UPDATED_AT_KEY]: Number(index),
    };

    // Initialize reactions pseudo-randomly between 1 and 15
    const seed = (Number(index) * 9301 + 49297) % 233280;
    const count = (seed % 15) + 1;

    for (let i = 0; i < count; i++) {
      reactions[emoji][`#${i}`] = 1;
    }
  }

  return reactions;
}

export const DEFAULT_REACTIONS = createDefaultReactions([
  "😊",
  "👋",
  "🎨",
  "💬",
  "🌱",
  "🫶",
  "🌈",
  "🔥",
  "🫰",
  "🌚",
  "👋",
  "🏳️‍🌈",
  "✨",
  "📚",
  "🎵",
  "👸",
  "🤓",
  "🔮",
  "🗿",
  "🏳️‍⚧️",
  "😶",
  "🥖",
  "🦋",
  "🌸",
  "🎹",
  "🎉",
  "🤔",
  "🧩",
  "🐈‍⬛",
  "🧶",
  "🪀",
  "🥸",
  "🪁",
  "🤌",
  "🪐",
  "🌹",
  "🎼",
  "🤹",
  "👀",
  "🍂",
  "🍬",
  "🍭",
  "🎀",
  "🎈",
  "🤩",
  "👒",
  "🏝️",
  "🌊",
  "😵‍💫",
  "🥁",
  "🎶",
]);
