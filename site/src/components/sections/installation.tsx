"use client";

import { Check, Copy } from "lucide-react";
import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-client";
import { useCallback, useRef, useState } from "react";

const COPY_ANIMATION_DURATION = 2000;
const CLIPBOARD_RESET_DELAY = 3000;
const INSTALL_COMMAND = "npm install frimousse";
const INSTALL_COMMAND_LABEL = "Copy install command";

const variants = {
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2 },
  },
  hidden: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.1 },
  },
};

export const Installation = () => {
  const timeout = useRef(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [, setHasCopied] = useState(false);

  const copyToClipboard = useCallback(async (text: string) => {
    window.clearTimeout(timeout.current);

    try {
      await navigator.clipboard.writeText(text);
      setHasCopied(true);

      timeout.current = window.setTimeout(() => {
        setHasCopied(false);
      }, CLIPBOARD_RESET_DELAY);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  }, []);

  const handleCopyCommand = useCallback(() => {
    copyToClipboard(INSTALL_COMMAND);
    setIsAnimating(true);

    setTimeout(() => {
      setIsAnimating(false);
    }, COPY_ANIMATION_DURATION);
  }, [copyToClipboard]);

  return (
    <div>
      <h2>Installation</h2>
      <code
        className="relative flex h-10 cursor-copy items-center rounded-md bg-muted px-3 font-mono text-secondary-foreground text-sm"
        onClick={handleCopyCommand}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleCopyCommand();
          }
        }}
        role="button"
        tabIndex={0}
      >
        {INSTALL_COMMAND}
        <button
          aria-label={INSTALL_COMMAND_LABEL}
          className="absolute top-1.5 right-1.5 inline-flex size-7 items-center justify-center rounded transition-colors duration-200 ease-out hover:bg-secondary focus-visible:bg-secondary"
          onClick={(e) => {
            e.stopPropagation();
            handleCopyCommand();
          }}
          title={INSTALL_COMMAND_LABEL}
          type="button"
        >
          <AnimatePresence initial={false} mode="wait">
            {isAnimating ? (
              <motion.div
                animate="visible"
                exit="hidden"
                initial="hidden"
                key="copied"
                variants={variants}
              >
                <Check className="size-3.5" />
              </motion.div>
            ) : (
              <motion.div
                animate="visible"
                exit="hidden"
                initial="hidden"
                key="copy"
                variants={variants}
              >
                <Copy className="size-3.5" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </code>
    </div>
  );
};
