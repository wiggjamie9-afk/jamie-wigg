import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'au.rhythmix.buddyapps',
  appName: '50 Buddy Apps',
  webDir: 'www',
  plugins: {
    Camera: {
      permissions: ['camera', 'photos'],
    },
    Microphone: {
      permissions: ['microphone'],
    },
  },
  ios: {
    minVersion: '14.0',
    scheme: '50BuddyApps',
  },
  server: {
    androidScheme: 'https',
    // Leave blank for production (serves from www/)
    // For development: url: 'http://localhost:8000'
  },
};

export default config;
