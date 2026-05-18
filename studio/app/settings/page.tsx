/**
 * `/settings` route (T6) — public per R10 (no gate). Composes the four panels
 * stacked vertically. Each panel is its own `"use client"` component so the
 * page itself stays a thin server wrapper compatible with `force-static`
 * export.
 */

import { ClearAllPanel } from "../../components/settings/clear-all-panel";
import { LicensePanel } from "../../components/settings/license-panel";
import { ReplicateTokenPanel } from "../../components/settings/replicate-token-panel";
import { SupportBundlePanel } from "../../components/settings/support-bundle-panel";

export const dynamic = "force-static";

export const metadata = {
  title: "Settings · STARLIGHTMIX Studio",
};

export default function SettingsPage() {
  return (
    <main className="min-h-screen w-full px-4 py-8 sm:px-6 sm:py-12 bg-starlightmix-bg">
      <div className="mx-auto w-full max-w-2xl">
        <header className="mb-8">
          <h1 className="font-starlightmix-display text-3xl font-black tracking-tight text-starlightmix-text sm:text-4xl">
            Settings
          </h1>
          <p className="mt-2 text-sm text-starlightmix-text-soft">
            Your Replicate token and license stay on this device. Nothing here
            is sent to our servers.
          </p>
        </header>

        <div className="space-y-5 sm:space-y-6">
          <ReplicateTokenPanel />
          <LicensePanel />
          <SupportBundlePanel />
          <ClearAllPanel />
        </div>
      </div>
    </main>
  );
}
