"use client";

import { useLayoutEffect } from "react";

const IOS_REGEX = /iPad|iPhone/;
const SCALE_REGEX = /maximum\-scale=[0-9\.]+/g;

export function DynamicMaximumScaleMeta() {
  useLayoutEffect(() => {
    if (!IOS_REGEX.test(navigator.userAgent)) {
      return;
    }

    const meta = document.querySelector("meta[name=viewport]");

    if (!meta) {
      return;
    }

    const content = meta.getAttribute("content") ?? "";

    meta.setAttribute(
      "content",
      SCALE_REGEX.test(content)
        ? content.replace(SCALE_REGEX, "maximum-scale=1.0")
        : `${content}, maximum-scale=1.0`,
    );

    return () => {
      meta.setAttribute("content", content);
    };
  }, []);

  return null;
}
