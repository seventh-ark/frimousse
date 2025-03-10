import { type RefObject, useEffect, useState } from "react";

export function useIsSticky<T extends HTMLElement>(ref: RefObject<T>) {
  const [isSticky, setIsSticky] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: The passed ref is expected to be stable
  useEffect(() => {
    const current = ref.current;

    const observer = new IntersectionObserver(
      ([entry]) => setIsSticky((entry?.intersectionRatio ?? 1) < 1),
      {
        threshold: [1],
      },
    );

    observer.observe(current as T);

    return () => {
      observer.unobserve(current as T);
    };
  }, []);

  return isSticky;
}
