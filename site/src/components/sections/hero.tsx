import { Logo } from "../logo";
import { Reactions } from "../reactions";

export function Hero() {
  return (
    <div className="flex flex-col pt-20 md:pt-40">
      <h1 className="inline-flex items-center gap-2 font-medium">
        <Logo />
        Frimousse
      </h1>
      <p className="mt-[1em] max-w-(--container-lg) text-secondary-foreground">
        A <strong>fast</strong>, <strong>lightweight</strong>, and{" "}
        <strong>fully customizable</strong> React emoji picker with zero
        dependencies. Always up-to-date via CDN, it filters out unsupported
        emojis and supports 25+ locales. Fully accessible, unstyled, and
        optimized for performance.
      </p>
      <Reactions className="mt-[1em]" />
    </div>
  );
}
