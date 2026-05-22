import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'au.com.rhythmixapp.reset',
  appName: 'Reset',
  webDir: 'www',
  ios: {
    contentInset: 'always',
    backgroundColor: '#000000',
  },
  server: {
    iosScheme: 'reset',
  },
};

export default config;
