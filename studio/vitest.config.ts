/**
 * Vitest config for studio/.
 *
 * - `jsdom` environment so window/localStorage/etc. are present by default.
 * - `globals: true` so tests can use `describe/it/expect/vi` without
 *   importing them — both styles work; existing files under
 *   components/fallback-screens/__tests__/ import them explicitly.
 * - `include` picks up any `*.test.ts` anywhere in the project so the
 *   existing T15 tests under components/fallback-screens/__tests__/ stay
 *   green alongside the new ones under lib/.
 *
 * Polyfills (WebCrypto, in particular) are inlined at the top of each
 * test file that needs them rather than in a setupFiles entry. Reasoning:
 * T14's writable-file glob restricts new files to `**\/*.test.ts`, so a
 * hand-written setup.ts is out. Co-locating the polyfill with the file
 * that needs it (secrets.test.ts) keeps the dependency obvious; tests
 * that don't need it (capability-detect, tab-coordinator) stay free of
 * runtime side effects.
 */
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    include: ["**/*.test.ts"],
    exclude: ["**/node_modules/**", "**/.next/**", "**/out/**"],
  },
});
