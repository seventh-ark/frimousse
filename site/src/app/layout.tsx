import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import localFont from "next/font/local";
import type { PropsWithChildren } from "react";
import "./styles.css";
import { AnimatedFavicon } from "@/components/animated-favicon";

const inter = localFont({
  src: "./InterVariable.woff2",
  variable: "--font-inter",
});

const config = {
  name: "Frimousse —  An emoji picker component for React",
  url: "https://frimousse.liveblocks.io",
  description:
    "A fast, lightweight, and fully customizable React emoji picker with zero dependencies. Always up-to-date, accessible, and optimized for performance—perfect for modern web apps.",
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
  keywords: ["React", "Emoji picker", "Liveblocks"],
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
      <head>
        <AnimatedFavicon />
      </head>
      <body className={inter.variable}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          <div
            className={cn(
              "container relative min-h-dvh",
              "md:before:-inset-x-2 before:pointer-events-none before:absolute before:inset-x-4 before:h-full before:border-border before:border-x before:border-dotted",
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
