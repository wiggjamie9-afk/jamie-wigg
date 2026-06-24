import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Course Platform",
  description: "Learn from AI course creators",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
