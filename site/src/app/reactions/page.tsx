"use client";
import { cn } from "@/lib/utils";
import { LiveMap } from "@liveblocks/client";
import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
  useMutation,
  useSelf,
  useStorage,
} from "@liveblocks/react/suspense";
import { type MouseEvent, memo } from "react";

const Reaction = memo(({ emoji }: { emoji: string }) => {
  const { id } = useSelf();
  const { count, hasReacted } = useStorage((storage) => {
    const users = storage.reactions.get(emoji);

    return {
      count: users?.size ?? 0,
      hasReacted: users && id ? users.has(id) : false,
    };
  });

  const handleClick = useMutation(
    ({ storage }, _: MouseEvent) => {
      const reaction = storage.get("reactions")?.get(emoji);

      if (!id || !reaction) {
        return;
      }

      if (hasReacted) {
        reaction.delete(id);
      } else {
        reaction.set(id, true);
      }
    },
    [emoji, hasReacted],
  );

  return (
    <button
      className={cn(
        "cursor-pointer rounded-full px-2 py-1 text-sm",
        hasReacted ? "bg-blue-100" : "bg-gray-100",
      )}
      onClick={handleClick}
      type="button"
    >
      {emoji} {count}
    </button>
  );
});

function Reactions() {
  const reactions = useStorage((storage) => storage.reactions.keys());

  return (
    <ul className="flex gap-2">
      {Array.from(reactions).map((emoji) => (
        <li key={emoji}>
          <Reaction emoji={emoji} />
        </li>
      ))}
    </ul>
  );
}

const initialStorage: Liveblocks["Storage"] = {
  reactions: new LiveMap([
    ["😊", new LiveMap([["####0", true]])],
    [
      "🌚",
      new LiveMap([
        ["####0", true],
        ["####1", true],
      ]),
    ],
  ]),
};

export default function Page() {
  return (
    <div>
      <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
        <RoomProvider id="frimousse" initialStorage={initialStorage}>
          <ClientSideSuspense fallback={null}>
            <Reactions />
          </ClientSideSuspense>
        </RoomProvider>
      </LiveblocksProvider>
    </div>
  );
}
