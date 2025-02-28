"use client";

import { Check, Copy } from "lucide-react";
import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-client";
import { useCallback, useRef, useState } from "react";
import { Button } from "./ui/button";

const COPY_ANIMATION_DURATION = 2000;
const CLIPBOARD_RESET_DELAY = 3000;

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

export function CopyButton({
  text,
  className,
  label = "Copy code",
}: {
  text: string;
  className?: string;
  label?: string;
}) {
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

  const handleCopy = useCallback(() => {
    copyToClipboard(text);
    setIsAnimating(true);

    setTimeout(() => {
      setIsAnimating(false);
    }, COPY_ANIMATION_DURATION);
  }, [copyToClipboard, text]);

  return (
    <Button
      aria-label={label}
      className={className}
      onClick={handleCopy}
      size="icon"
      title={label}
      variant="ghost"
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
    </Button>
  );
}
