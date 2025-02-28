import { unstable_cacheLife as cacheLife } from "next/cache";
import Link from "next/link";
import { type ComponentProps, Suspense } from "react";
import { Heart } from "../logo";
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
    <footer className="mt-auto flex justify-between gap-10 pt-20 pb-8 text-secondary-foreground text-xs md:pt-40">
      <div className="flex flex-col gap-1">
        <span>
          ©{" "}
          <Suspense>
            <Year />
          </Suspense>{" "}
          <Link className="link" href="/">
            MIT License
          </Link>
        </span>
        <span>
          Made with{" "}
          <Heart
            aria-label="love"
            className="pointer-events-none mr-0.5 inline size-4"
          />{" "}
          by{" "}
          <Link className="link" href="https://liveblocks.io" target="_blank">
            Liveblocks
          </Link>
        </span>
      </div>
      <ThemeSwitcher />
    </footer>
  );
}
