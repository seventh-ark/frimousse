import { cn } from "@/lib/utils";
import { Liveblocks as LiveblocksClient } from "@liveblocks/node";
import {
  DEFAULT_REACTIONS,
  MAX_ROWS,
  ROOM_ID,
  type ReactionsJson,
} from "liveblocks.config";
import { unstable_cacheLife as cachelife } from "next/cache";
import { type ComponentProps, Suspense } from "react";
import {
  Reactions as ClientReactions,
  FallbackReactions,
} from "./reactions.client";

const liveblocks = new LiveblocksClient({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

async function ServerReactions() {
  "use cache";

  cachelife("seconds");

  let reactions: ReactionsJson;

  try {
    const storage = (await liveblocks.getStorageDocument(
      ROOM_ID,
      "json",
    )) as unknown as Liveblocks["StorageJson"];

    reactions = storage.reactions;
  } catch (error) {
    reactions = DEFAULT_REACTIONS;
  }

  return <ClientReactions roomId={ROOM_ID} serverReactions={reactions} />;
}

export function Reactions({
  className,
  ...props
}: Omit<ComponentProps<"div">, "children">) {
  return (
    <div
      className={cn(
        "flex flex-wrap gap-(--gap)",
        "[--gap:var(--spacing)] lg:[--gap:calc(var(--spacing)_*_1.5)]",
        className,
      )}
      style={{
        height: `calc(var(--spacing) * 8 * ${MAX_ROWS} + var(--gap) * ${MAX_ROWS - 1})`,
        clipPath: "inset(-3px -3px -3px -3px)",
      }}
      {...props}
    >
      <Suspense fallback={<FallbackReactions />}>
        <ServerReactions {...props} />
      </Suspense>
    </div>
  );
}
