"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
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
import {
  CREATED_AT_KEY,
  DEFAULT_KEYS,
  DEFAULT_KEYS_COUNT,
  DEFAULT_REACTIONS,
  MAX_REACTIONS,
  type ReactionsJson,
} from "liveblocks.config";
import { SmilePlus } from "lucide-react";
import {
  type ComponentProps,
  memo,
  useCallback,
  useEffect,
  useState,
} from "react";
import { ErrorBoundary } from "react-error-boundary";
import { buttonVariants } from "./ui/button";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "./ui/drawer";
import { EmojiPicker } from "./ui/emoji-picker";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const ZWJ = "\u200D";
const SKIN_TONE_MODIFIERS =
  /\u{1F3FB}|\u{1F3FC}|\u{1F3FD}|\u{1F3FE}|\u{1F3FF}/gu;

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

function getBaseEmoji(emoji: string) {
  return emoji
    .split(ZWJ)
    .map((segment) => segment.replace(SKIN_TONE_MODIFIERS, ""))
    .join(ZWJ);
}

const ReactionButton = memo(
  ({ emoji, isActive, count, className, ...props }: ReactionButtonProps) => {
    return (
      <button
        className={cn(
          buttonVariants({ variant: "secondary" }),
          "rounded-full px-2.5 py-1 text-sm tabular-nums will-change-transform",
          isActive
            ? "border-accent bg-accent/10 font-medium text-accent hover:border-accent hover:bg-accent/15 focus-visible:border-accent focus-visible:ring-accent/20 dark:bg-accent/20 dark:focus-visible:bg-accent/20 dark:hover:bg-accent/25"
            : "text-secondary-foreground",
          className,
        )}
        {...props}
      >
        {emoji} <NumberFlow value={count} />
      </button>
    );
  },
);

const AddReactionButton = memo(
  ({ onEmojiSelect, ...props }: AddReactionButtonProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const { isMobile } = useMediaQuery();

    useEffect(() => {
      setIsMounted(true);
    }, []);

    const handleEmojiSelect = useCallback(
      (emoji: string) => {
        onEmojiSelect?.(getBaseEmoji(emoji));
      },
      [onEmojiSelect],
    );

    const renderTrigger = () => (
      <button
        aria-label="Add reaction"
        className={cn(buttonVariants({ variant: "default" }), "rounded-full")}
        title="Add reaction"
        {...props}
      >
        <SmilePlus className="-ml-1" /> Try it
      </button>
    );

    const renderEmojiPicker = () => (
      <EmojiPicker
        autoFocus
        onEmojiSelect={(emoji) => {
          handleEmojiSelect?.(emoji);
          setIsOpen(false);
        }}
      />
    );

    if (!isMounted) {
      return renderTrigger();
    }

    return isMobile ? (
      <Drawer onOpenChange={setIsOpen} open={isOpen}>
        <DrawerTrigger asChild>{renderTrigger()}</DrawerTrigger>
        <DrawerContent>
          <DrawerTitle className="sr-only">Pick a reaction</DrawerTitle>
          {renderEmojiPicker()}
        </DrawerContent>
      </Drawer>
    ) : (
      <Popover onOpenChange={setIsOpen} open={isOpen}>
        <PopoverTrigger asChild>{renderTrigger()}</PopoverTrigger>
        <PopoverContent sideOffset={6}>{renderEmojiPicker()}</PopoverContent>
      </Popover>
    );
  },
);

function LiveblocksReactions() {
  const { id } = useSelf();
  const reactions = useStorage((storage) => storage.reactions);

  const toggleReaction = useMutation(
    ({ storage }, emoji: string) => {
      if (!id) {
        return;
      }

      const reactions = storage.get("reactions");
      const reaction = reactions?.get(emoji);

      if (!reaction) {
        // If the reaction doesn't exist, initialize it with self
        reactions?.set(
          emoji,
          new LiveMap([
            [CREATED_AT_KEY, Date.now()],
            [id, 1],
          ]),
        );
      } else if (reaction.has(id)) {
        // If the reaction exists and is active, remove self
        reaction.delete(id);

        if (reaction.size === DEFAULT_KEYS_COUNT) {
          reactions?.delete(emoji);
        }
      } else {
        // If the reaction exists and isn't active, add self
        if (reaction.size === DEFAULT_KEYS_COUNT) {
          reaction.set(CREATED_AT_KEY, Date.now());
        }

        reaction.set(id, 1);
      }

      if (reactions && reactions.size > MAX_REACTIONS) {
        const [oldestReaction] = Array.from(reactions.entries()).sort(
          ([, dataA], [, dataB]) => {
            return (
              (dataA.get(CREATED_AT_KEY) ?? 0) -
              (dataB.get(CREATED_AT_KEY) ?? 0)
            );
          },
        );

        if (oldestReaction) {
          reactions.delete(oldestReaction[0]);
        }
      }
    },
    [id],
  );

  return (
    <>
      <AddReactionButton disabled={!id} onEmojiSelect={toggleReaction} />
      {Array.from(reactions)
        .sort(([, dataA], [, dataB]) => {
          return (
            (dataB.get(CREATED_AT_KEY) ?? 0) - (dataA.get(CREATED_AT_KEY) ?? 0)
          );
        })
        .map(([emoji, data]) => {
          const count = data.size - DEFAULT_KEYS_COUNT;

          if (count === 0) {
            return null;
          }

          return (
            <ReactionButton
              count={count}
              emoji={emoji}
              isActive={id ? data.has(id) : false}
              key={emoji}
              onClick={() => {
                toggleReaction(emoji);
              }}
            />
          );
        })}
    </>
  );
}

function ServerReactions({ reactions }: { reactions: ReactionsJson }) {
  return (
    <>
      <AddReactionButton disabled />
      {Object.entries(reactions)
        .sort(([, dataA], [, dataB]) => {
          return (dataB[CREATED_AT_KEY] ?? 0) - (dataA[CREATED_AT_KEY] ?? 0);
        })
        .map(([emoji, data]) => {
          const count = Object.keys(data).length - DEFAULT_KEYS_COUNT;

          if (count === 0) {
            return null;
          }

          return (
            <ReactionButton count={count} disabled emoji={emoji} key={emoji} />
          );
        })}
    </>
  );
}

function LocalReactions({
  reactions: initialReactions,
}: {
  reactions: ReactionsJson;
}) {
  const id = "#####";
  const [reactions, setReactions] = useState<Record<string, string[]>>(() =>
    Object.fromEntries(
      Object.entries(initialReactions).map(([emoji, data]) => [
        emoji,
        Object.keys(data),
      ]),
    ),
  );

  const toggleReaction = useCallback((emoji: string) => {
    setReactions((previousReactions) => {
      const reaction = previousReactions[emoji];

      if (!reaction) {
        // If the reaction doesn't exist, initialize it with self
        return {
          [emoji]: [...DEFAULT_KEYS, id],
          ...previousReactions,
        };
      }

      if (reaction.includes(id)) {
        // If the reaction exists and is active, remove self
        return {
          ...previousReactions,
          [emoji]: reaction.filter((userId) => userId !== id),
        };
      }

      // If the reaction exists and isn't active, add self
      return {
        ...previousReactions,
        [emoji]: [...reaction, id],
      };
    });
  }, []);

  return (
    <>
      <AddReactionButton onEmojiSelect={toggleReaction} />
      {Object.entries(reactions).map(([emoji, data]) => {
        const count = data.length - DEFAULT_KEYS_COUNT;

        if (count === 0) {
          return null;
        }

        return (
          <ReactionButton
            count={count}
            emoji={emoji}
            isActive={data.includes(id)}
            key={emoji}
            onClick={() => {
              toggleReaction(emoji);
            }}
          />
        );
      })}
    </>
  );
}

export function FallbackReactions() {
  return (
    <>
      <AddReactionButton disabled />
      {Object.entries(DEFAULT_REACTIONS).map(([emoji, data]) => {
        const count = Object.keys(data).length - DEFAULT_KEYS_COUNT;

        if (count === 0) {
          return null;
        }

        return (
          <ReactionButton
            className="text-transparent"
            count={count}
            disabled
            emoji={emoji}
            key={emoji}
          />
        );
      })}
    </>
  );
}

const initialStorage: Liveblocks["Storage"] = {
  reactions: new LiveMap(
    Object.entries(DEFAULT_REACTIONS).map(([emoji, data]) => [
      emoji,
      new LiveMap(Object.entries(data)),
    ]),
  ),
};

export function Reactions({ roomId, serverReactions }: ReactionsProps) {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider id={roomId} initialStorage={initialStorage}>
        <ClientSideSuspense
          fallback={<ServerReactions reactions={serverReactions} />}
        >
          <ErrorBoundary
            fallback={<LocalReactions reactions={serverReactions} />}
          >
            <LiveblocksReactions />
          </ErrorBoundary>
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
