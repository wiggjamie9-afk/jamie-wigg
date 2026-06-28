import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'au.com.rhythmixapp.herdcheck',
  appName: 'HerdCheck',
  webDir: 'www',
  ios: {
    contentInset: 'always',
    backgroundColor: '#f7f4ec',
  },
  server: {
    iosScheme: 'herdcheck',
  },
};

export default config;
