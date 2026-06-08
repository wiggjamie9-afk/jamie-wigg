import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.rhythmixapp.herdcheck',
  appName: 'HerdCheck',
  webDir: '../livestock',

  ios: {
    contentInset: 'always',
    backgroundColor: '#1a3a2a',
    scheme: 'herdcheck',
  },

  android: {
    buildOptions: {
      keystorePath: process.env.ANDROID_KEYSTORE_PATH,
      keystorePassword: process.env.ANDROID_KEYSTORE_PASSWORD,
      keystoreAlias: process.env.ANDROID_KEYSTORE_ALIAS,
      keystoreAliasPassword: process.env.ANDROID_KEY_PASSWORD,
      signingMethod: 'jarsigner',
      releaseType: 'APK',
    },
  },

  server: {
    iosScheme: 'herdcheck',
    androidScheme: 'herdcheck',
  },

  plugins: {
    Camera: {},
    Geolocation: {},
  },
};

export default config;
