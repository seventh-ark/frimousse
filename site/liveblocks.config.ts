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

export const ROOM_ID = "frimousse2.5";

export const CREATED_AT_KEY = "@createdAt";
export const DEFAULT_KEYS = [CREATED_AT_KEY];
export const DEFAULT_KEYS_COUNT = DEFAULT_KEYS.length;

export const DEFAULT_REACTIONS: ReactionsJson = {
  "😊": {
    [CREATED_AT_KEY]: 0,
    "####0": 1,
    "####1": 1,
    "####2": 1,
  },
  "👋": {
    [CREATED_AT_KEY]: 1,
    "####0": 1,
  },
  "🎨": {
    [CREATED_AT_KEY]: 2,
    "####0": 1,
    "####1": 1,
  },
};
