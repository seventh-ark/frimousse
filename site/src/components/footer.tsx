import Link from "next/link";
import type { JSX } from "react";
import { Heart } from "./logo";
import { ThemeSwitcher } from "./ui/theme-switcher";

const Footer = (): JSX.Element => {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <div className="flex justify-between gap-10 text-secondary-foreground text-xs">
        <div className="flex flex-col gap-0.5">
          <span>
            © <time dateTime={currentYear.toString()}>{currentYear}</time>{" "}
            <Link className="link" href="/">
              MIT License
            </Link>
          </span>
          <span>
            Made with{" "}
            <Heart className="pointer-events-none mr-0.5 inline size-4" /> by{" "}
            <Link className="link" href="https://liveblocks.io" target="_blank">
              Liveblocks
            </Link>
          </span>
        </div>
        <ThemeSwitcher />
      </div>
    </footer>
  );
};

export default Footer;
