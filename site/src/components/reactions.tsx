import { cn } from "@/lib/utils";
import { Liveblocks as LiveblocksClient } from "@liveblocks/node";
import {
  DEFAULT_REACTIONS,
  ROOM_ID,
  type ReactionsJson,
} from "liveblocks.config";
import { unstable_cache as cache } from "next/cache";
import { connection } from "next/server";
import type { ComponentProps } from "react";
import { Reactions as ClientReactions } from "./reactions.client";

const MAX_ROWS = 3;

const liveblocks = new LiveblocksClient({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

const getServerReactions = cache(
  async () => {
    const storage = (await liveblocks.getStorageDocument(
      ROOM_ID,
      "json",
    )) as unknown as Liveblocks["StorageJson"];

    return storage.reactions;
  },
  ["reactions"],
  { revalidate: 5 },
);

export async function Reactions({
  className,
  ...props
}: Omit<ComponentProps<"div">, "children">) {
  // Prevent prerendering the server reactions
  await connection();

  let reactions: ReactionsJson;

  try {
    reactions = await getServerReactions();
  } catch (error) {
    reactions = DEFAULT_REACTIONS;
  }

  return (
    <div
      className={cn("flex flex-wrap gap-1.5 overflow-hidden", className)}
      style={{
        maxHeight: `calc(var(--spacing) * 9 * ${MAX_ROWS} + var(--spacing) * 1.5 *${MAX_ROWS - 1})`,
      }}
      {...props}
    >
      <ClientReactions roomId={ROOM_ID} serverReactions={reactions} />
    </div>
  );
}
