// Settings and configuration
class SettingsManager {
  constructor() {
    this.settings = this.loadSettings();
  }

  loadSettings() {
    const saved = localStorage.getItem('post-op-settings');
    if (saved) {
      return JSON.parse(saved);
    }
    return this.getDefaultSettings();
  }

  getDefaultSettings() {
    return {
      theme: 'light',
      notifications: true,
      dailyReminders: true,
      reminderTime: '09:00',
      units: 'imperial', // lbs, fahrenheit
      language: 'en',
      apiKeys: {
        claude: null,
        googleFit: null,
        fitbit: null,
      },
      wearableAuth: {
        apple: null,
        google: null,
        fitbit: null,
        garmin: null,
      },
      premium: false,
      privacyConsent: false,
    };
  }

  saveSettings() {
    localStorage.setItem('post-op-settings', JSON.stringify(this.settings));
  }

  setApiKey(provider, key) {
    this.settings.apiKeys[provider] = key;
    this.saveSettings();
  }

  getApiKey(provider) {
    return this.settings.apiKeys[provider];
  }

  enableNotifications() {
    if ('Notification' in window && Notification.permission === 'granted') {
      return true;
    }
    return false;
  }

  requestNotificationPermission() {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          this.sendNotification('Post-Op Companion', {
            body: 'Notifications enabled!',
            icon: '❤️',
          });
        }
      });
    }
  }

  sendNotification(title, options) {
    if ('Notification' in window && Notification.permission === 'granted') {
      return new Notification(title, {
        badge: '❤️',
        tag: 'post-op-companion',
        ...options,
      });
    }
  }

  scheduleDailyReminder(time) {
    // Schedule a reminder for daily vitals logging
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const scheduledTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);

    if (scheduledTime < now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeUntilReminder = scheduledTime - now;
    setTimeout(() => {
      this.sendNotification('Daily Reminder', {
        body: 'Have you logged your vitals today?',
        actions: [
          { action: 'log', title: 'Log Now' },
          { action: 'dismiss', title: 'Later' },
        ],
      });
      // Reschedule for next day
      this.scheduleDailyReminder(time);
    }, timeUntilReminder);
  }

  exportSettings() {
    const settingsStr = JSON.stringify(this.settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(settingsStr);
    const link = document.createElement('a');
    link.href = dataUri;
    link.download = `post-op-settings-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  importSettings(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        this.settings = { ...this.settings, ...imported };
        this.saveSettings();
        alert('✓ Settings imported successfully!');
      } catch (err) {
        alert('Error importing settings: ' + err.message);
      }
    };
    reader.readAsText(file);
  }

  getFreemiumFeatures() {
    return {
      tier: this.settings.premium ? 'Premium' : 'Free',
      features: this.settings.premium
        ? [
            '✓ Basic meal planning',
            '✓ Manual vitals tracking',
            '✓ Wearable integration',
            '✓ Claude AI meal generation',
            '✓ Advanced analytics',
            '✓ Monthly re-assessment',
            '✓ Priority support',
          ]
        : [
            '✓ Basic meal planning',
            '✓ Manual vitals tracking',
            '✗ Wearable integration',
            '✗ Claude AI meal generation',
            '✗ Advanced analytics',
            '✗ Monthly re-assessment',
            '✗ Priority support',
          ],
      price: this.settings.premium ? '$9.99/month' : 'Free',
    };
  }

  setPremium(isPremium) {
    this.settings.premium = isPremium;
    this.saveSettings();
  }
}

const settingsManager = new SettingsManager();

// Update UI with settings
document.addEventListener('DOMContentLoaded', () => {
  const claudeKeyInput = document.getElementById('claude-api-key');
  if (claudeKeyInput) {
    const savedKey = localStorage.getItem('claude-api-key');
    if (savedKey) {
      claudeKeyInput.value = '••••••••••••' + savedKey.slice(-4);
    }
  }

  // --- Voice settings wiring ---
  const voiceKeyInput = document.getElementById('elevenlabs-api-key');
  const voiceSelect = document.getElementById('elevenlabs-voice-select');
  const voiceToggle = document.getElementById('voice-enabled-toggle');
  const saveVoiceKeyBtn = document.getElementById('save-voice-key-btn');
  const testVoiceBtn = document.getElementById('test-voice-btn');
  const voiceStatusHint = document.getElementById('voice-status-hint');

  function refreshVoiceHint() {
    if (!voiceStatusHint || !window.voice) return;
    voiceStatusHint.textContent = window.voice.hasNaturalVoice()
      ? '✓ Natural human voice active (ElevenLabs).'
      : "No key set — uses your device's built-in voice. Add an ElevenLabs key for a lifelike human voice.";
  }

  if (voiceKeyInput) {
    const savedVoiceKey = localStorage.getItem('elevenlabs-api-key');
    if (savedVoiceKey) {
      voiceKeyInput.value = '••••••••••••' + savedVoiceKey.slice(-4);
    }
  }

  if (voiceSelect && window.voice) {
    voiceSelect.value = window.voice.voiceId;
    voiceSelect.addEventListener('change', () => {
      window.voice.setVoiceId(voiceSelect.value);
    });
  }

  if (voiceToggle && window.voice) {
    voiceToggle.checked = window.voice.enabled;
    voiceToggle.addEventListener('change', () => {
      window.voice.setEnabled(voiceToggle.checked);
    });
  }

  if (saveVoiceKeyBtn && voiceKeyInput && window.voice) {
    saveVoiceKeyBtn.addEventListener('click', () => {
      const val = voiceKeyInput.value.trim();
      if (val && !val.startsWith('••••')) {
        window.voice.setApiKey(val);
        voiceKeyInput.value = '••••••••••••' + val.slice(-4);
        refreshVoiceHint();
        alert('✓ Natural voice enabled');
      }
    });
  }

  if (testVoiceBtn && window.voice) {
    testVoiceBtn.addEventListener('click', () => {
      window.voice.speak("Hi, I'm your recovery coach. You're doing really well — let's take this one day at a time.");
    });
  }

  refreshVoiceHint();
});
