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
  title: "Frimousse",
  description: "An emoji picker component for React.",
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
