import { unstable_cacheLife as cacheLife } from "next/cache";
import Link from "next/link";
import { type ComponentProps, Suspense } from "react";
import { Heart } from "../logo";
import { Button } from "../ui/button";
import { ThemeSwitcher } from "../ui/theme-switcher";

async function Year(props: ComponentProps<"time">) {
  "use cache";

  cacheLife("hours");

  const year = String(new Date().getFullYear());

  return (
    <time dateTime={year} {...props}>
      {year}
    </time>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto flex justify-between gap-6 pt-20 pb-outer-gutter text-secondary-foreground text-xs md:pt-40">
      <div className="flex flex-auto flex-col gap-1">
        <span>
          ©{" "}
          <Suspense>
            <Year />
          </Suspense>{" "}
          <Link
            className="link"
            href="https://github.com/liveblocks/frimousse/blob/main/LICENSE"
          >
            MIT License
          </Link>
        </span>
        <span>
          Made with{" "}
          <Heart
            aria-label="love"
            className="pointer-events-none inline size-4"
          />{" "}
          by{" "}
          <Link className="link" href="https://liveblocks.io" target="_blank">
            Liveblocks
          </Link>
        </span>
      </div>
      <div className="flex flex-none items-center gap-1.5">
        <Button asChild className="rounded-full" size="icon" variant="outline">
          <Link
            aria-label="Go to GitHub repository"
            href="https://github.com/liveblocks/frimousse"
            target="_blank"
          >
            <svg
              aria-hidden="true"
              fill="currentColor"
              focusable="false"
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </Link>
        </Button>
        <ThemeSwitcher />
      </div>
    </footer>
  );
}
