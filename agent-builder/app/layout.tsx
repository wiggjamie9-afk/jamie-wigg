import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agent Builder",
  description: "Build and deploy AI agents in minutes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
