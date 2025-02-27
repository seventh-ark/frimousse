import type { LiveMap } from "@liveblocks/client";

export type Reactions = LiveMap<string, LiveMap<string, boolean>>;

export type ReactionsJson = Record<string, Record<string, boolean>>;

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
