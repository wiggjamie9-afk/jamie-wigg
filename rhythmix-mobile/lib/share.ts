import { Share, Platform } from 'react-native';
import * as Linking from 'expo-linking';

import type { Track } from './audio-store';

const WEB_HOST = 'https://rhythmix.app';

/**
 * Build a universal link that resolves to /(app)/player when the app is installed,
 * and to the web preview page when it isn't. The `applinks:rhythmix.app` entry in
 * app.json + the Android intent filter handle the deep-link side.
 */
export function trackUrl(track: Track) {
  return `${WEB_HOST}/track/${track.id}`;
}

export function trackDeepLink(track: Track) {
  return Linking.createURL(`/track/${track.id}`);
}

export async function shareTrack(track: Track) {
  const url = trackUrl(track);
  const message = `Listen to "${track.title}" on RHYTHMIX — ${url}`;

  await Share.share(
    Platform.OS === 'ios' ? { url, message: `Listen to "${track.title}" on RHYTHMIX` } : { message },
    { dialogTitle: track.title },
  );
}
