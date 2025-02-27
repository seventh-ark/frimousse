import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import "./styles.css";
import localFont from "next/font/local";

const inter = localFont({
  src: "./InterVariable.woff2",
  variable: "--font-inter",
});

const openRunde = localFont({
  src: [
    {
      path: "./OpenRunde-Medium.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-open-runde",
});

export const metadata: Metadata = {
  title: "Frimousse —  An emoji picker component for React",
  description:
    "A fast, lightweight, and fully customizable React emoji picker with zero dependencies. Always up-to-date, accessible, and optimized for performance—perfect for modern web apps.",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html
      className={`${openRunde.variable} ${inter.variable} font-sans antialiased`}
      lang="en"
    >
      <body>{children}</body>
    </html>
  );
}
