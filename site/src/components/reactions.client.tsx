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
import type { ReactionsJson } from "liveblocks.config";
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
          onEmojiSelect?.(emoji);
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

  const handleReactionClick = useMutation(
    ({ storage }, emoji: string) => {
      const reaction = storage.get("reactions")?.get(emoji);

      if (!id || !reaction) {
        return;
      }

      if (reaction.has(id)) {
        reaction.delete(id);
      } else {
        reaction.set(id, true);
      }
    },
    [id],
  );

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
      <AddReactionButton
        disabled={!id}
        onEmojiSelect={handleAddReactionClick}
      />
      <AnimatePresence initial={false}>
        {Array.from(reactions).map(([emoji, users]) => {
          const count = users.size;

          if (count === 0) {
            return null;
          }

          return (
            <ReactionButton
              count={count}
              emoji={emoji}
              isActive={id ? users.has(id) : false}
              key={emoji}
              onClick={() => {
                handleReactionClick(emoji);
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
        {Object.entries(reactions).map(([emoji, users]) => {
          const count = Object.keys(users).length;

          if (count === 0) {
            return null;
          }

          return (
            <ReactionButton count={count} disabled emoji={emoji} key={emoji} />
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
      <AddReactionButton onEmojiSelect={handleAddReactionClick} />
      <AnimatePresence initial={false}>
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
      </AnimatePresence>
    </>
  );
}

const initialStorage: Liveblocks["Storage"] = {
  reactions: new LiveMap([
    [
      "😊",
      new LiveMap([
        ["####0", true],
        ["####1", true],
        ["####2", true],
      ]),
    ],
    ["👋", new LiveMap([["####0", true]])],
    [
      "🎨",
      new LiveMap([
        ["####0", true],
        ["####1", true],
      ]),
    ],
  ]),
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
