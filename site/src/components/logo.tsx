"use client";

import { type ComponentProps, useEffect, useState } from "react";

const ICONS = [Globe, Flag, Heart, Moon];
const INTERVAL = 400;

export function Globe(props: ComponentProps<"svg">) {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Globe</title>
      <path d="m22,9v-2h-1v-2h-1v-1h-1v-1h-2v-1h-2v-1h-6v1h-2v1h-2v1h-1v1h-1v2h-1v2h-1v7h1v1h1v2h1v1h1v1h2v1h2v1h6v-1h2v-1h2v-1h1v-1h1v-2h1v-2h1v-6h-1Zm-1,1v4h-3v-4h3Zm-5-6h1v1h2v2h1v1h-3v-3h-1v-1Zm-2,14v2h-1v1h-2v-1h-1v-2h-1v-2h6v2h-1Zm2-8v4h-8v-4h8Zm-7-4h1v-2h1v-1h2v1h1v2h1v2h-6v-2Zm-5,1h1v-2h2v-1h1v1h-1v3h-3v-1Zm-1,7v-4h3v4h-3Zm2,5v-2h-1v-1h3v3h1v1h-1v-1h-2Zm14-2v2h-2v1h-1v-1h1v-3h3v1h-1Z" />
    </svg>
  );
}

export function Flag(props: ComponentProps<"svg">) {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Flag</title>
      <path d="m21,4v1h-2v1h-6v-1h-7v1h-1v-1h1v-2h-1v-1h-2v1h-1v2h1v17h2v-4h1v-1h7v1h6v-1h2v-1h1V4h-1Zm-1,11h-1v1h-6v-1h-7v1h-1v-8h1v-1h7v1h6v-1h1v8Z" />
    </svg>
  );
}

export function Heart(props: ComponentProps<"svg">) {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Heart</title>
      <path d="m22,6v-1h-1v-1h-1v-1h-6v1h-1v1h-2v-1h-1v-1h-6v1h-1v1h-1v1h-1v5h1v1h1v1h1v1h1v1h1v1h1v1h1v1h1v1h1v1h1v1h2v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-5h-1Zm-2,4v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-2v-1h-1v-1h-1v-1h-1v-1h-1v-1h-1v-1h-1v-1h-1v-1h-1v-3h1v-1h1v-1h4v1h1v1h1v1h2v-1h1v-1h1v-1h4v1h1v1h1v3h-1Z" />
    </svg>
  );
}

export function Moon(props: ComponentProps<"svg">) {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Moon</title>
      <path d="m21,17v1h-2v1h-4v-1h-2v-1h-2v-1h-1v-2h-1v-2h-1v-4h1v-2h1v-2h1v-1h2v-1h2v-1h-5v1h-2v1h-2v1h-1v1h-1v2h-1v2h-1v6h1v2h1v2h1v1h1v1h2v1h2v1h6v-1h2v-1h2v-1h1v-1h1v-2h-1Zm-13,3v-1h-2v-2h-1v-2h-1v-6h1v-2h1v-2h2v1h-1v2h-1v4h1v2h1v2h1v1h1v1h1v1h2v1h2v1h-5v-1h-2Z" />
    </svg>
  );
}

export function Logo() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (ICONS.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((previousIndex) => (previousIndex + 1) % ICONS.length);
    }, INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, []);

  if (!ICONS[currentIndex]) {
    return null;
  }

  const Icon = ICONS[currentIndex];

  return (
    <div className="relative size-6 [&>svg]:absolute [&>svg]:top-0 [&>svg]:left-0 [&>svg]:size-full">
      <Icon />
    </div>
  );
}
