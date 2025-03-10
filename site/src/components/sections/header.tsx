import { Reactions } from "../reactions";
import { StickyHeader } from "./header.client";

export function Header() {
  return (
    <>
      <StickyHeader />
      <p className="mt-4 max-w-(--container-lg) text-secondary-foreground">
        A lightweight, unstyled, and composable emoji picker for React.
      </p>
      <Reactions className="mt-4" />
    </>
  );
}
