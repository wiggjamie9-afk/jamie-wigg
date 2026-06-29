import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Capacitor wrapper for the productionized Pro app (CodeMentor).
 *
 * webDir points at ./app — the self-contained PWA (index.html + manifest + sw +
 * icons). `npx cap add ios` / `cap add android` generate the native projects;
 * `npx cap sync` copies ./app into them. Same pattern as recovery-ios/.
 */
const config: CapacitorConfig = {
  appId: 'au.com.rhythmixapp.codementor',
  appName: 'CodeMentor',
  webDir: 'app',
  backgroundColor: '#0f172a',
  ios: { contentInset: 'always' },
};

export default config;
