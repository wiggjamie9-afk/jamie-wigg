import type { CapacitorConfig } from '@capacitor/cli';
import { readFileSync } from 'node:fs';

/**
 * App Factory — native shell config, driven by a batch file so one wrapper can
 * build any batch or a standalone app. Select which batch with the env var:
 *   APP_FACTORY_BATCH=owed.batch.json npx cap sync
 * Defaults to batch.json. appId/appName come straight from the batch file.
 */
const batchFile = process.env.APP_FACTORY_BATCH || 'batch.json';
const batch = JSON.parse(readFileSync(new URL(`./${batchFile}`, import.meta.url), 'utf8'));

const config: CapacitorConfig = {
  appId: batch.appId || 'au.rhythmix.appfactory.batch1',
  appName: batch.appName || 'App Factory',
  webDir: 'www',
  plugins: {
    Camera: { permissions: ['camera', 'photos'] },
    Microphone: { permissions: ['microphone'] },
  },
  ios: { minVersion: '14.0', scheme: 'AppFactory', contentInset: 'always' },
  android: { allowMixedContent: false },
  server: { androidScheme: 'https', iosScheme: 'https' },
};

export default config;
