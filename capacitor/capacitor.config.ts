import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Capacitor wrapper for the RHYTHMIX Studio static export.
 *
 * The web app is built in ../studio/ and copied into ./www by
 * `pnpm sync:web` (run by `pnpm build` here). Capacitor then bundles
 * ./www into the native iOS/Android shell.
 *
 * appId is the reverse-DNS iOS bundle identifier — must match what
 * you register in Apple Developer + App Store Connect. This is
 * separate from the Appflow `app_id` in ionic.config.json.
 */
const config: CapacitorConfig = {
  appId: "com.rhythmix.studio",
  appName: "RHYTHMIX Studio",
  webDir: "www",
  ios: {
    contentInset: "always",
    // Required for the audio drag-drop and IndexedDB Blob storage to
    // work inside WKWebView without the cap-go BackgroundMode shim.
    limitsNavigationsToAppBoundDomains: false,
    // The studio app is fully client-side; no need to allow http://
    // origins. studio.rhythmixapp.com.au + the proxy/license Workers
    // are reached via https.
    allowsLinkPreview: false,
  },
  server: {
    // For dev: point at the live Cloudflare Pages deploy instead of
    // the bundled www/ so you can iterate on the web app without
    // re-running `pnpm sync:web` + reinstalling the app every time.
    // Comment out the `url` line for production builds.
    // url: "https://studio.rhythmixapp.com.au",
    androidScheme: "https",
    iosScheme: "https",
  },
};

export default config;
