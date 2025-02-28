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
  type ReactionsJson,
} from "liveblocks.config";
import { SmilePlus } from "lucide-react";
import {
  AnimatePresence,
  type HTMLMotionProps,
  LayoutGroup,
  type Variants,
  motion,
} from "motion/react";
import { memo, useCallback, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { buttonVariants } from "./ui/button";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "./ui/drawer";
import { EmojiPicker } from "./ui/emoji-picker";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const ZWJ = "\u200D";
const SKIN_TONE_MODIFIERS =
  /\u{1F3FB}|\u{1F3FC}|\u{1F3FD}|\u{1F3FE}|\u{1F3FF}/gu;

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

const variants: Variants = {
  hidden: {
    opacity: 0,
    transition: {
      duration: 0.1,
      ease: "easeOut",
    },
  },
  visible: {
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 800,
      damping: 80,
      mass: 1,
    },
  },
};

function getBaseEmoji(emoji: string) {
  return emoji
    .split(ZWJ)
    .map((segment) => segment.replace(SKIN_TONE_MODIFIERS, ""))
    .join(ZWJ);
}

const ReactionButton = memo(
  ({
    emoji,
    isActive,
    count,
    className,
    style,
    ...props
  }: ReactionButtonProps) => {
    return (
      <motion.button
        animate="visible"
        className={cn(
          buttonVariants({ variant: "secondary" }),
          "gap-1 rounded-full px-2.5 py-1 text-sm tabular-nums will-change-transform",
          isActive
            ? "border-accent bg-accent/10 font-medium text-accent hover:border-accent hover:bg-accent/15 focus-visible:border-accent focus-visible:ring-accent/20 dark:bg-accent/20 dark:focus-visible:bg-accent/20 dark:hover:bg-accent/25"
            : "text-secondary-foreground",
          className,
        )}
        exit="hidden"
        initial="hidden"
        layout
        style={{
          ...style,

          // Prevent distortion during layout animations
          borderRadius: 9999,
        }}
        variants={variants}
        whileTap={{ scale: 0.96 }}
        {...props}
      >
        {emoji} <NumberFlow value={count} />
      </motion.button>
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
    );

    const renderEmojiPicker = () => (
      <EmojiPicker
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

      const reaction = storage.get("reactions")?.get(emoji);

      if (!reaction) {
        // If the reaction doesn't exist, initialize it with self
        storage.get("reactions")?.set(
          emoji,
          new LiveMap([
            [CREATED_AT_KEY, Date.now()],
            [id, 1],
          ]),
        );
      } else if (reaction.has(id)) {
        // If the reaction exists and is active, remove self
        reaction.delete(id);
      } else {
        // If the reaction exists and isn't active, add self
        if (reaction.size === DEFAULT_KEYS_COUNT) {
          reaction.set(CREATED_AT_KEY, Date.now());
        }

        reaction.set(id, 1);
      }
    },
    [id],
  );

  return (
    <>
      <AddReactionButton disabled={!id} onEmojiSelect={toggleReaction} />
      <AnimatePresence initial={false}>
        {Array.from(reactions)
          .sort(([, dataA], [, dataB]) => {
            return (
              (dataB.get(CREATED_AT_KEY) ?? 0) -
              (dataA.get(CREATED_AT_KEY) ?? 0)
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
      </AnimatePresence>
    </>
  );
}

function ServerReactions({ reactions }: { reactions: ReactionsJson }) {
  return (
    <>
      <AddReactionButton disabled />
      <AnimatePresence initial={false}>
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
              <ReactionButton
                count={count}
                disabled
                emoji={emoji}
                key={emoji}
              />
            );
          })}
      </AnimatePresence>
    </>
  );
}

function LocalReactions({
  initialReactions,
}: { initialReactions: ReactionsJson }) {
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
      <AnimatePresence initial={false}>
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
      </AnimatePresence>
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
        <LayoutGroup>
          <ClientSideSuspense
            fallback={<ServerReactions reactions={serverReactions} />}
          >
            <ErrorBoundary
              fallback={<LocalReactions initialReactions={serverReactions} />}
            >
              <LiveblocksReactions />
            </ErrorBoundary>
          </ClientSideSuspense>
        </LayoutGroup>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
