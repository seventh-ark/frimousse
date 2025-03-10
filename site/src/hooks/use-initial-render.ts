import { useEffect, useState } from "react";

export function useIsInitialRender() {
  const [isInitialRender, setIsInitialRender] = useState(true);

  useEffect(() => {
    setIsInitialRender(false);
  }, []);

  return isInitialRender;
}
