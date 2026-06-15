/**
 * src/index.ts
 *
 * Capacitor entry point. Initializes the app shell for iOS.
 * The web assets (Buddy Apps) are served from the www/ folder.
 */

import { App } from '@capacitor/app';

export function initCapacitor() {
  // Initialize Capacitor app
  console.log('Initializing Capacitor...');

  // Handle app state changes
  App.addListener('appStateChange', (state) => {
    if (state.isActive) {
      console.log('App is now active');
    } else {
      console.log('App is now inactive');
    }
  });

  // Handle app URLs / deep links (optional)
  App.addListener('appUrlOpen', (event) => {
    console.log('App URL opened:', event.url);
    // You can navigate to specific buddy apps based on the URL
  });

  // Handle app background tasks (optional)
  App.addListener('pause', () => {
    console.log('App paused');
  });

  App.addListener('resume', () => {
    console.log('App resumed');
  });

  console.log('Capacitor initialized successfully');
}

// Auto-initialize when the module loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCapacitor);
} else {
  initCapacitor();
}
