import { Reactions } from "../reactions";
import { StickyHeader } from "./header.client";

export function Header() {
  return (
    <>
      <StickyHeader />
      <p className="mt-3.5 max-w-(--container-lg) text-secondary-foreground leading-[1.65]">
        A lightweight, unstyled, and composable emoji picker for React.
      </p>
      <Reactions className="mt-4" />
    </>
  );
}
