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
import NumberFlow from "@number-flow/react";
import type { EmojiPickerRootProps } from "frimousse";
import type { ReactionsJson } from "liveblocks.config";
import { SmilePlus } from "lucide-react";
import { type HTMLMotionProps, LayoutGroup, motion } from "motion/react";
import { type MouseEvent, memo, useCallback, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { buttonVariants } from "./ui/button";
import { EmojiPicker } from "./ui/emoji-picker";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface ReactionButtonProps
  extends Omit<HTMLMotionProps<"button">, "children"> {
  emoji: string;
  count: number;
  isActive?: boolean;
}

interface AddReactionButtonProps
  extends Omit<HTMLMotionProps<"button">, "children"> {
  onEmojiSelect?: EmojiPickerRootProps["onEmojiSelect"];
}

interface ReactionsProps {
  roomId: string;
  serverReactions: ReactionsJson;
}

const ReactionButton = memo(
  ({ emoji, isActive, count, className, ...props }: ReactionButtonProps) => {
    return (
      <motion.button
        className={cn(
          buttonVariants({ variant: "secondary" }),
          "rounded-full px-2.5 py-1 text-sm",
          isActive
            ? "border-accent bg-accent/10 font-medium text-accent hover:border-accent hover:bg-accent/15 focus-visible:border-accent focus-visible:bg-accent/10 focus-visible:ring-accent/20"
            : "text-secondary-foreground",
          className,
        )}
        layout
        {...props}
      >
        {emoji} <NumberFlow value={count} />
      </motion.button>
    );
  },
);

const AddReactionButton = memo(
  ({ onEmojiSelect, ...props }: AddReactionButtonProps) => {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <motion.button
            aria-label="Add reaction"
            className={cn(
              buttonVariants({ variant: "secondary", size: "icon" }),
              "rounded-full text-secondary-foreground",
            )}
            layout
            title="Add reaction"
            {...props}
          >
            <SmilePlus />
          </motion.button>
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

  if (count === 0) {
    return null;
  }

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
    <LayoutGroup>
      {Array.from(reactions).map((emoji) => (
        <LiveblocksReaction emoji={emoji} key={emoji} />
      ))}
      <AddReactionButton
        disabled={!id}
        onEmojiSelect={handleAddReactionClick}
      />
    </LayoutGroup>
  );
}

function ServerReactions({ reactions }: { reactions: ReactionsJson }) {
  return (
    <>
      {Object.entries(reactions).map(([emoji, users]) => {
        const count = Object.keys(users).length;

        if (count === 0) {
          return null;
        }

        return (
          <ReactionButton count={count} disabled emoji={emoji} key={emoji} />
        );
      })}
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
      {Object.entries(reactions).map(([emoji, users]) => {
        const count = users.length;

        if (count === 0) {
          return null;
        }

        return (
          <ReactionButton
            count={count}
            emoji={emoji}
            isActive={users.includes(id)}
            key={emoji}
            onClick={() => {
              handleReactionClick(emoji);
            }}
          />
        );
      })}
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
