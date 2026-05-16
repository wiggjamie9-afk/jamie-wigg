import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.rhythmix.web",
  appName: "RHYTHMIX",
  webDir: "www",
  ios: {
    contentInset: "automatic",
    backgroundColor: "#0a0a0a",
  },
  android: {
    backgroundColor: "#0a0a0a",
    allowMixedContent: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      backgroundColor: "#0a0a0a",
      showSpinner: false,
      androidScaleType: "CENTER_CROP",
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#0a0a0a",
    },
    // Ionic Appflow Live Updates. Fill in `appId` after creating the app in
    // the Appflow dashboard; pair with the matching channel name (Production,
    // Staging, etc.). Until then this plugin no-ops at runtime.
    LiveUpdates: {
      appId: "REPLACE_WITH_APPFLOW_APP_ID",
      channel: "Production",
      autoUpdateMethod: "background",
      maxVersions: 2,
    },
  },
};

export default config;
