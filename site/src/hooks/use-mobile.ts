import { useEffect, useState } from "react";

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 40rem)");
    setIsMobile(!mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobile(!event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return Boolean(isMobile);
}
