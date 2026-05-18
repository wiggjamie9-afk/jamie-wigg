import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CapabilityGate } from "@/components/fallback-screens/capability-gate";

export const metadata: Metadata = {
  title: "STARLIGHTMIX Studio",
  description:
    "Upload a track, pick a visual theme, get an AI-generated music video — all in your browser.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // `CapabilityGate` is a client component (it owns the capability-check
  // redirect and the tab-coordinator banner per R13 + R14). It still
  // composes inside this server component just fine — Next runs the gate
  // on the client only, but the surrounding `<html>` / `<body>` stays
  // server-rendered, so SSR isn't broken.
  return (
    <html lang="en">
      <body>
        <CapabilityGate>{children}</CapabilityGate>
      </body>
    </html>
  );
}
