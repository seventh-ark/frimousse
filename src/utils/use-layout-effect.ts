import { useEffect, useLayoutEffect as useOriginalLayoutEffect } from "react";

// On React 18.2.0 and earlier, useLayoutEffect triggers a warning when executed on the server
export const useLayoutEffect =
  /* v8 ignore next */
  typeof window !== "undefined" ? useOriginalLayoutEffect : useEffect;
