import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'au.rhythmix.buddyapps',
  appName: '50 Buddy Apps',
  webDir: 'www',
  server: {
    androidScheme: 'https',
    iosScheme: 'buddyapps'
  },
  ios: {
    scheme: 'buddyapps',
    paddingBottom: 50,
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: 0,
    limitsNavigationsToAppBoundDomains: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#060912',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#060912',
      overlaysWebView: true
    }
  }
};

export default config;
