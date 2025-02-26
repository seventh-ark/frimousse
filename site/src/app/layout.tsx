import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import "./styles.css";

export const metadata: Metadata = {
  title: "Frimousse",
  description: "An emoji picker component for React.",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
