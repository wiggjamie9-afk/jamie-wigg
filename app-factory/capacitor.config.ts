import type { CapacitorConfig } from '@capacitor/cli';

/**
 * App Factory — native shell config.
 * appId/appName are read from batch.json by the build script and mirrored here;
 * if you switch batches, update these two lines to match batch.json.
 */
const config: CapacitorConfig = {
  appId: 'au.rhythmix.appfactory.batch1',
  appName: 'App Factory · Batch 1',
  webDir: 'www',
  plugins: {
    Camera: { permissions: ['camera', 'photos'] },
    Microphone: { permissions: ['microphone'] },
  },
  ios: {
    minVersion: '14.0',
    scheme: 'AppFactory',
    contentInset: 'always',
  },
  android: {
    allowMixedContent: false,
  },
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
    // production serves bundled www/. For live reload during dev:
    // url: 'http://localhost:8000', cleartext: true
  },
};

export default config;
