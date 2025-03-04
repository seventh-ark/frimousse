import { cn } from "@/lib/utils";
import { Liveblocks as LiveblocksClient } from "@liveblocks/node";
import {
  DEFAULT_REACTIONS,
  MAX_ROWS,
  ROOM_ID,
  type ReactionsJson,
} from "liveblocks.config";
import { unstable_cacheLife as cachelife } from "next/cache";
import { type CSSProperties, type ComponentProps, Suspense } from "react";
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
    reactions = (await liveblocks.getStorageDocument(ROOM_ID, "json"))
      .reactions;
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
        "[--button-height:calc(var(--spacing)*8)] [--gap:calc(var(--spacing)*1.5)]",
        "flex h-[calc(var(--button-height)_*_var(--rows)_+_var(--gap)_*_(var(--rows)_-_1))] flex-wrap gap-(--gap) [clip-path:inset(-3px)]",
        className,
      )}
      style={
        {
          "--rows": MAX_ROWS,
        } as CSSProperties
      }
      {...props}
    >
      <Suspense fallback={<FallbackReactions />}>
        <ServerReactions {...props} />
      </Suspense>
    </div>
  );
}
