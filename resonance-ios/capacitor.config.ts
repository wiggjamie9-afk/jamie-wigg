import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'au.com.rhythmixapp.resonance',
  appName: 'Resonance',
  webDir: 'www',
  ios: {
    contentInset: 'always',
    backgroundColor: '#06081a',
  },
  server: {
    iosScheme: 'resonance',
  },
};

export default config;
