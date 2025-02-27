import type { LiveMap } from "@liveblocks/client";

type Reactions = LiveMap<string, LiveMap<string, boolean>>;

declare global {
  interface Liveblocks {
    Storage: {
      reactions: Reactions;
    };
  }
}
