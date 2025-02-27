import { cn } from "@/lib/utils";
import { Liveblocks as LiveblocksClient } from "@liveblocks/node";
import type { ComponentProps } from "react";
import { Reactions as ClientReactions } from "./reactions.client";

const ROOM_ID = "frimousse";

const liveblocks = new LiveblocksClient({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function Reactions({
  className,
  ...props
}: Omit<ComponentProps<"div">, "children">) {
  let storage: Liveblocks["StorageJson"];

  try {
    storage = (await liveblocks.getStorageDocument(
      ROOM_ID,
      "json",
    )) as unknown as Liveblocks["StorageJson"];
  } catch (error) {
    storage = { reactions: {} };
  }

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)} {...props}>
      <ClientReactions roomId={ROOM_ID} serverReactions={storage.reactions} />
    </div>
  );
}
