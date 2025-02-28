import Link from "next/link";
import { Heart } from "../logo";
import { ThemeSwitcher } from "../ui/theme-switcher";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto flex justify-between gap-10 pt-20 pb-8 text-secondary-foreground text-xs md:pt-32">
      <div className="flex flex-col gap-1">
        <span>
          © <time dateTime={currentYear.toString()}>{currentYear}</time>{" "}
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
