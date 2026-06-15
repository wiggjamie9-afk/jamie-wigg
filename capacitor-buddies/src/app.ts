/**
 * src/app.ts
 *
 * App shell setup. Sets up logging, error handling, and Buddy Apps integration.
 */

import { Camera } from '@capacitor/camera';
import { Microphone } from '@capacitor/microphone';

export class BuddyAppsShell {
  constructor() {
    this.setupLogging();
    this.setupErrorHandling();
    this.setupCapabilities();
  }

  private setupLogging() {
    // Enhance console logging for debugging in Xcode
    const originalLog = console.log;
    const originalError = console.error;

    console.log = (...args) => {
      originalLog('[BuddyApps]', ...args);
    };

    console.error = (...args) => {
      originalError('[BuddyApps ERROR]', ...args);
    };
  }

  private setupErrorHandling() {
    // Global error handler
    window.addEventListener('error', (event) => {
      console.error('Unhandled error:', event.error);
    });

    // Unhandled promise rejection
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
    });
  }

  private setupCapabilities() {
    // Check and log available capabilities
    this.checkCameraPermission();
    this.checkMicrophonePermission();
  }

  private async checkCameraPermission() {
    try {
      const permission = await Camera.checkPermissions();
      console.log('Camera permission status:', permission.camera);
    } catch (error) {
      console.log('Camera capability check failed (may not be available):', error);
    }
  }

  private async checkMicrophonePermission() {
    try {
      const permission = await Microphone.checkPermissions();
      console.log('Microphone permission status:', permission.microphone);
    } catch (error) {
      console.log('Microphone capability check failed (may not be available):', error);
    }
  }

  // Public method to request camera access (called by Buddy Apps)
  async requestCameraAccess() {
    try {
      const result = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: 'base64',
      });
      return result;
    } catch (error) {
      console.error('Camera access failed:', error);
      throw error;
    }
  }

  // Public method to request microphone access (called by Buddy Apps)
  async requestMicrophoneAccess() {
    try {
      // Note: Microphone plugin usage depends on Capacitor plugins available
      // This is a placeholder for future microphone integration
      console.log('Microphone access requested');
      return { success: true };
    } catch (error) {
      console.error('Microphone access failed:', error);
      throw error;
    }
  }
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const shell = new BuddyAppsShell();
    // Expose globally for Buddy Apps to use
    (window as any).buddyAppsShell = shell;
  });
} else {
  const shell = new BuddyAppsShell();
  (window as any).buddyAppsShell = shell;
}
