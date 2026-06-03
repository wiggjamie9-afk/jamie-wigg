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
 *
 * Coverage:
 * - Provider: v8 (already a devDependency via @vitest/coverage-v8).
 * - Tracked files: lib/** and workers/**/src/** — the pure-TS logic layers.
 *   React components and Next.js pages are excluded until a rendering
 *   framework (Testing Library) is added.
 * - Thresholds: 80% lines, 75% branches. Branch threshold is intentionally
 *   looser because several browser-guard branches (SSR `typeof window`
 *   checks) are structurally unreachable in jsdom and would require a
 *   separate Node environment to exercise.
 * - Run with: pnpm test:coverage
 */
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    include: ["**/*.test.ts"],
    exclude: ["**/node_modules/**", "**/.next/**", "**/out/**"],
    coverage: {
      provider: "v8",
      include: ["lib/**", "workers/**/src/**"],
      exclude: ["**/*.test.ts"],
      thresholds: {
        lines: 80,
        branches: 75,
      },
    },
  },
});
