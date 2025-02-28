import type { LiveMap } from "@liveblocks/client";

export type Reactions = LiveMap<string, LiveMap<string, number>>;

export type ReactionsJson = Record<string, Record<string, number>>;

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

export const ROOM_ID = "frimousse6";

export const CREATED_AT_KEY = "@createdAt";
export const DEFAULT_KEYS = [CREATED_AT_KEY];
export const DEFAULT_KEYS_COUNT = DEFAULT_KEYS.length;

export const MAX_ROWS = 3;
export const MAX_REACTIONS = MAX_ROWS * 15;

function createDefaultReactions(emojis: string[]) {
  const reactions: ReactionsJson = {};

  for (const [index, emoji] of Object.entries([...emojis].reverse())) {
    if (Number(index) > MAX_REACTIONS) {
      break;
    }

    reactions[emoji] = {
      [CREATED_AT_KEY]: Number(index),
    };

    // Initialize reactions pseudo-randomly between 1 and 10
    const seed = (Number(index) * 9301 + 49297) % 233280;
    const count = (seed % 10) + 1;

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
