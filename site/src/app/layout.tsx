import { Footer } from "@/components/sections/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import localFont from "next/font/local";
import type { PropsWithChildren } from "react";
import "./styles.css";
import { JetBrains_Mono } from "next/font/google";
import Script from "next/script";

const inter = localFont({
  src: "./inter-variable.woff2",
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

const config = {
  name: "Frimousse — An emoji picker component for React",
  url: "https://frimousse.liveblocks.io",
  description:
    "A modern React emoji picker: fast, lightweight, fully customizable, and always up-to-date.",
  links: {
    twitter: "https://x.com/liveblocks",
    github: "https://github.com/liveblocks/frimousse",
  },
} as const;

export const metadata: Metadata = {
  title: {
    default: config.name,
    template: `%s — ${config.name}`,
  },
  metadataBase: new URL(config.url),
  description: config.description,
  keywords: [
    "emoji",
    "emoji picker",
    "react",
    "unstyled",
    "component",
    "emojibase",
    "liveblocks",
  ],
  authors: [
    {
      name: "Liveblocks",
      url: "https://liveblocks.io",
    },
  ],
  creator: "Liveblocks",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: config.url,
    title: config.name,
    description: config.description,
    siteName: config.name,
    videos: [
      {
        url: "/opengraph-video.mp4",
        width: 1200,
        height: 630,
        type: "video/mp4",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: config.name,
    description: config.description,
    creator: "@liveblocks",
  },
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Script id="disable-zoom">{`
        (()=>  {
          if (!/iPad|iPhone/.test(navigator.userAgent)) return;
          const element = document.querySelector("meta[name=viewport]");
          if (!element) return;
          const content = element.getAttribute("content") ?? "";
          const scale = /maximum\-scale=[0-9\.]+/g;
          element.setAttribute(
            "content",
            scale.test(content)
              ? content.replace(scale, "maximum-scale=1.0")
              : content + ", maximum-scale=1.0",
          );
        })()
      `}</Script>
      <body className={cn(inter.variable, jetbrainsMono.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          <div
            className={cn(
              "container relative flex min-h-dvh flex-col",
              "before:pointer-events-none before:absolute before:inset-x-4 before:h-full before:border-border before:border-x before:border-dotted md:before:inset-x-0",
            )}
          >
            {children}
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
