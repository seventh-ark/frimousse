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
import type { EmojiPickerRootProps } from "frimousse";
import type { ReactionsJson } from "liveblocks.config";
import {
  type ComponentProps,
  type MouseEvent,
  memo,
  useCallback,
  useState,
} from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Button } from "./ui/button";
import { EmojiPicker } from "./ui/emoji-picker";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface ReactionButtonProps
  extends Omit<ComponentProps<"button">, "children"> {
  emoji: string;
  count: number;
  isActive?: boolean;
}

interface AddReactionButtonProps
  extends Omit<ComponentProps<"button">, "children"> {
  onEmojiSelect?: EmojiPickerRootProps["onEmojiSelect"];
}

interface ReactionsProps {
  roomId: string;
  serverReactions: ReactionsJson;
}

const ReactionButton = memo(
  ({ emoji, isActive, count, className, ...props }: ReactionButtonProps) => {
    return (
      <button
        className={cn(
          className,
          "rounded-full border border-transparent px-2 py-1 text-sm",
          "transition duration-150 ease-out",
          isActive
            ? "border-accent bg-accent/10 font-medium text-accent"
            : "bg-muted hover:border-border hover:bg-background",
        )}
        type="button"
        {...props}
      >
        {emoji} {count}
      </button>
    );
  },
);

const AddReactionButton = memo(
  ({ onEmojiSelect, ...props }: AddReactionButtonProps) => {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="secondary" {...props}>
            Add reaction
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <EmojiPicker onEmojiSelect={onEmojiSelect} />
        </PopoverContent>
      </Popover>
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
    <ReactionButton
      count={count}
      emoji={emoji}
      isActive={isActive}
      onClick={handleClick}
    />
  );
});

function LiveblocksReactions() {
  const { id } = useSelf();
  const reactions = useStorage((storage) => storage.reactions.keys());

  const handleAddReactionClick = useMutation(
    ({ storage }, emoji: string) => {
      if (!id) {
        return;
      }

      storage.get("reactions")?.set(emoji, new LiveMap([[id, true]]));
    },
    [id],
  );

  return (
    <>
      {Array.from(reactions).map((emoji) => (
        <LiveblocksReaction emoji={emoji} key={emoji} />
      ))}
      <AddReactionButton
        disabled={!id}
        onEmojiSelect={handleAddReactionClick}
      />
    </>
  );
}

function ServerReactions({ reactions }: { reactions: ReactionsJson }) {
  return (
    <>
      {Object.entries(reactions).map(([emoji, users]) => (
        <ReactionButton
          count={Object.keys(users).length}
          disabled
          emoji={emoji}
          key={emoji}
        />
      ))}
      <AddReactionButton disabled />
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

  const handleAddReactionClick = useCallback((emoji: string) => {
    setReactions((previousReactions) => {
      return {
        ...previousReactions,
        [emoji]: [...(previousReactions[emoji] ?? []), id],
      };
    });
  }, []);

  return (
    <>
      {Object.entries(reactions).map(([emoji, users]) => (
        <ReactionButton
          count={users.length}
          emoji={emoji}
          isActive={users.includes(id)}
          key={emoji}
          onClick={() => {
            handleReactionClick(emoji);
          }}
        />
      ))}
      <AddReactionButton onEmojiSelect={handleAddReactionClick} />
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
