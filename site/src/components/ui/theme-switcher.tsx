"use client";

import { cn } from "@/lib/utils";
import { Monitor, Moon, Sun } from "lucide-react";
import * as motion from "motion/react-client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const THEMES = [
  {
    key: "system",
    icon: Monitor,
    label: "system theme",
  },
  {
    key: "light",
    icon: Sun,
    label: "light theme",
  },
  {
    key: "dark",
    icon: Moon,
    label: "dark theme",
  },
];

export const ThemeSwitcher = ({
  className,
}: {
  value?: "light" | "dark" | "system";
  onChange?: (theme: "light" | "dark" | "system") => void;
  defaultValue?: "light" | "dark" | "system";
  className?: string;
}) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div
      className={cn(
        "relative inline-flex h-8 items-center rounded-full border border-dotted px-1",
        className,
      )}
    >
      {THEMES.map(({ key, icon: Icon, label }) => {
        const isActive = theme === key;

        return (
          <button
            aria-label={`Switch to ${label}`}
            className="relative size-6 rounded-full"
            key={key}
            onClick={() => setTheme(key as "light" | "dark" | "system")}
            title={`Switch to ${label}`}
            type="button"
          >
            {isActive && (
              <motion.div
                className="absolute inset-0 rounded-full bg-muted"
                layoutId="activeTheme"
                transition={{ type: "spring", duration: 0.6 }}
              />
            )}
            <Icon
              className={cn(
                "relative m-auto size-3.5",
                "transition duration-200 ease-out",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-secondary-foreground focus-visible:text-secondary-foreground",
              )}
            />
          </button>
        );
      })}
    </div>
  );
};
