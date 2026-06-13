import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.eventplatform.app',
  appName: 'Event Platform',
  webDir: 'out',
  server: {
    androidScheme: 'https',
  },
  plugins: {},
};

export default config;
