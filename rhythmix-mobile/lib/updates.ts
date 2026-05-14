import * as Updates from 'expo-updates';

/**
 * Check for an OTA update on launch; if one is available, fetch and apply it.
 * Silent on dev / when no update is published.
 */
export async function checkForUpdates() {
  if (__DEV__) return;

  try {
    const result = await Updates.checkForUpdateAsync();
    if (!result.isAvailable) return;

    await Updates.fetchUpdateAsync();
    // Reload to apply. For a less abrupt UX, surface a "restart to update" toast instead.
    await Updates.reloadAsync();
  } catch (e) {
    // Network failure / not configured — keep app running on its bundled JS.
    console.log('[updates] check failed:', e instanceof Error ? e.message : e);
  }
}
