"use client";

/**
 * `CapabilityGate` — root-layout wrapper that:
 *
 *   1. Detects browser capabilities on mount (R13). If a blocking
 *      capability is missing, redirects to `/unsupported?missing=<cap>`.
 *   2. Spins up a `TabCoordinator` so we can show a banner when the user
 *      opens Studio in a second tab (R14).
 *
 * Both responsibilities are client-only, so the whole component is
 * `"use client"` and we guard everything behind a mount-effect. The actual
 * route-level pages stay free to render in their normal SSR/SSG mode; this
 * wrapper just hangs off the layout and gets out of the way once it has
 * decided we're allowed to be here.
 *
 * Lives under `fallback-screens/` because that's the only sibling
 * directory T15 is allowed to write into.
 */

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  detectCapabilities,
  firstMissingCapability,
} from "@/lib/capability-detect";
import { TabCoordinator } from "@/lib/tab-coordinator";
import { TabBanner } from "./tab-banner";

export interface CapabilityGateProps {
  children: React.ReactNode;
}

export function CapabilityGate({ children }: CapabilityGateProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [secondTab, setSecondTab] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Capability check.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const report = detectCapabilities();
    const missing = firstMissingCapability(report);

    // If we're already on /unsupported, never bounce away — even if the
    // user lands there directly with a valid query param.
    if (missing && pathname !== "/unsupported") {
      router.replace(`/unsupported?missing=${missing}`);
    }
  }, [router, pathname]);

  // Tab coordinator. Skip on the /unsupported page — no point coordinating
  // tabs the user can't actually use anyway.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (typeof BroadcastChannel === "undefined") return;
    if (pathname === "/unsupported") return;

    const coordinator = new TabCoordinator();
    coordinator.onOtherTabDetected(() => setSecondTab(true));

    const handlePageHide = () => coordinator.close();
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      window.removeEventListener("pagehide", handlePageHide);
      coordinator.close();
    };
  }, [pathname]);

  const showBanner = secondTab && !dismissed && pathname !== "/unsupported";

  return (
    <>
      {showBanner ? (
        <TabBanner
          onUseThis={() => setDismissed(true)}
          onCloseOther={() => {
            // Browsers won't let us close a tab we didn't open from this
            // tab, so the best we can do is hide the banner and trust the
            // user to close it manually. Future: broadcast a "please
            // close" message and have the other tab close itself if it
            // was opened with `window.open`.
            setDismissed(true);
          }}
        />
      ) : null}
      {children}
    </>
  );
}

export default CapabilityGate;
