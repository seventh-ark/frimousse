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
import type { ReactionsJson } from "liveblocks.config";
import {
  type ComponentProps,
  type MouseEvent,
  memo,
  useCallback,
  useState,
} from "react";
import { ErrorBoundary } from "react-error-boundary";

interface ReactionProps extends Omit<ComponentProps<"button">, "children"> {
  emoji: string;
  count: number;
  isActive?: boolean;
}

interface ReactionsProps {
  roomId: string;
  serverReactions: ReactionsJson;
}

const Reaction = memo(
  ({ emoji, isActive, count, className, ...props }: ReactionProps) => {
    return (
      <button
        className={cn(
          className,
          "cursor-pointer rounded-full px-2 py-1 text-sm",
          isActive ? "bg-blue-100" : "bg-gray-100",
        )}
        type="button"
        {...props}
      >
        {emoji} {count}
      </button>
    );
  },
);

const LiveblocksReaction = memo(({ emoji }: { emoji: string }) => {
  const { id } = useSelf();
  const { count, isActive } = useStorage((storage) => {
    const users = storage.reactions.get(emoji);

    return {
      count: users?.size ?? 0,
      isActive: users && id ? users.has(id) : false,
    };
  });

  const handleClick = useMutation(
    ({ storage }, _: MouseEvent) => {
      const reaction = storage.get("reactions")?.get(emoji);

      if (!id || !reaction) {
        return;
      }

      if (isActive) {
        reaction.delete(id);
      } else {
        reaction.set(id, true);
      }
    },
    [emoji, isActive],
  );

  return (
    <Reaction
      count={count}
      emoji={emoji}
      isActive={isActive}
      onClick={handleClick}
    />
  );
});

function LiveblocksReactions() {
  const reactions = useStorage((storage) => storage.reactions.keys());

  return (
    <>
      {Array.from(reactions).map((emoji) => (
        <LiveblocksReaction emoji={emoji} key={emoji} />
      ))}
    </>
  );
}

function ServerReactions({ reactions }: { reactions: ReactionsJson }) {
  return (
    <>
      {Object.entries(reactions).map(([emoji, users]) => (
        <Reaction
          count={Object.keys(users).length}
          disabled
          emoji={emoji}
          key={emoji}
        />
      ))}
    </>
  );
}

function LocalReactions({
  initialReactions,
}: { initialReactions: ReactionsJson }) {
  const id = "#####";
  const [reactions, setReactions] = useState<Record<string, string[]>>(() =>
    Object.fromEntries(
      Object.entries(initialReactions).map(([emoji, users]) => [
        emoji,
        Object.keys(users),
      ]),
    ),
  );

  const handleReactionClick = useCallback((emoji: string) => {
    setReactions((previousReactions) => {
      const users = previousReactions[emoji] ?? [];
      const hasReacted = users.includes(id);

      return {
        ...previousReactions,
        [emoji]: hasReacted
          ? users.filter((userId) => userId !== id)
          : [...users, id],
      };
    });
  }, []);

  return (
    <>
      {Object.entries(reactions).map(([emoji, users]) => (
        <Reaction
          count={users.length}
          emoji={emoji}
          isActive={users.includes(id)}
          key={emoji}
          onClick={() => {
            handleReactionClick(emoji);
          }}
        />
      ))}
    </>
  );
}

const initialStorage: Liveblocks["Storage"] = {
  reactions: new LiveMap([["😊", new LiveMap([["####0", true]])]]),
};

export function Reactions({ roomId, serverReactions }: ReactionsProps) {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider id={roomId} initialStorage={initialStorage}>
        <ClientSideSuspense
          fallback={<ServerReactions reactions={serverReactions} />}
        >
          <ErrorBoundary
            fallback={<LocalReactions initialReactions={serverReactions} />}
          >
            <LiveblocksReactions />
          </ErrorBoundary>
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
