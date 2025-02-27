import Link from "next/link";
import type { JSX } from "react";
import { Heart } from "./logo";

const Footer = (): JSX.Element => {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <div className="flex flex-col gap-0.5 text-secondary-foreground text-xs">
        <span>
          © <time dateTime={currentYear.toString()}>{currentYear}</time>{" "}
          <Link className="link" href="/">
            MIT License
          </Link>
        </span>
        <span>
          Made with <Heart className="mr-0.5 inline size-4" /> by{" "}
          <Link className="link" href="https://liveblocks.io" target="_blank">
            Liveblocks
          </Link>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
