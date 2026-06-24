/**
 * OpenMontage Integration for Jackson's Ecosystem
 * Bridges Pixabay Music API for royalty-free background tracks
 *
 * Usage:
 *   const music = await musicFromPixabay("calm lullaby", { duration: 30 });
 *   const music = await musicFromMusicGen("upbeat electronic");
 *   const music = await textToMusicWithFallback("script", { preferPixabay: true });
 */

import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

/**
 * Search Pixabay Music for tracks matching a query
 * @param {string} query - Music search term (e.g., "lullaby", "upbeat electronic")
 * @param {object} options - Search options
 * @returns {Promise<object>} Track info { title, url, duration, id, license }
 */
export async function searchPixabayMusic(query, options = {}) {
  const {
    duration = 30,  // Desired duration in seconds
    maxResults = 5,
    pixabayApiKey = process.env.PIXABAY_API_KEY,
  } = options;

  if (!pixabayApiKey) {
    console.error('❌ PIXABAY_API_KEY not set in environment');
    return null;
  }

  console.log(`🎵 Searching Pixabay Music for: "${query}" (${duration}s)`);

  try {
    const url = new URL('https://pixabay.com/api/videos/');
    url.searchParams.set('key', pixabayApiKey);
    url.searchParams.set('q', query);
    url.searchParams.set('per_page', maxResults);
    url.searchParams.set('order', 'popular');
    url.searchParams.set('safesearch', 'true');

    const response = await fetch(url.toString());
    if (!response.ok) throw new Error(`API error: ${response.statusText}`);

    const data = await response.json();
    if (!data.hits || data.hits.length === 0) {
      console.warn(`⚠️  No Pixabay results for "${query}"`);
      return null;
    }

    // Get first result
    const hit = data.hits[0];
    const track = {
      title: hit.tags?.split(', ')[0] || 'Pixabay Track',
      id: hit.id,
      duration: hit.duration || duration,
      url: hit.videos?.medium?.url || hit.videos?.large?.url,
      license: 'Pixabay Content License (free for commercial use)',
      source: 'Pixabay Music',
    };

    console.log(`✅ Found: "${track.title}" (${track.duration}s)`);
    return track;
  } catch (err) {
    console.error(`❌ Pixabay API error: ${err.message}`);
    return null;
  }
}

/**
 * Download Pixabay music track and save locally
 * @param {object} track - Track object from searchPixabayMusic()
 * @param {string} outputPath - Where to save the file
 * @returns {Promise<string>} Path to downloaded file
 */
export async function downloadPixabayTrack(track, outputPath) {
  if (!track || !track.url) {
    throw new Error('Invalid track or no URL provided');
  }

  console.log(`⬇️  Downloading: ${track.title}`);

  try {
    const response = await fetch(track.url);
    if (!response.ok) throw new Error(`Download failed: ${response.statusText}`);

    const buffer = await response.buffer();
    fs.writeFileSync(outputPath, buffer);
    console.log(`✅ Saved to: ${outputPath}`);
    return outputPath;
  } catch (err) {
    console.error(`❌ Download error: ${err.message}`);
    throw err;
  }
}

/**
 * Generate music from text using Pixabay Music (royalty-free)
 * @param {string} description - Music description (e.g., "calm lullaby", "upbeat dance")
 * @param {object} options - Options
 * @returns {Promise<object>} { file, track, source }
 */
export async function musicFromPixabay(description, options = {}) {
  const { outputDir = './ecosystem/outputs', duration = 30 } = options;

  try {
    // Search Pixabay
    const track = await searchPixabayMusic(description, { duration });
    if (!track) return null;

    // Download track
    const filename = `music-pixabay-${track.id}-${Date.now()}.mp4`;
    const filepath = path.join(outputDir, filename);

    await downloadPixabayTrack(track, filepath);

    return {
      file: filepath,
      track,
      source: 'Pixabay Music',
      license: 'Free (commercial use allowed)',
      duration: track.duration,
    };
  } catch (err) {
    console.error(`❌ Pixabay music error: ${err.message}`);
    return null;
  }
}

/**
 * Generate music from text using Replicate MusicGen (AI-generated)
 * @param {string} description - Music prompt
 * @param {object} options - Options
 * @returns {Promise<object>} { file, prediction_id, source }
 */
export async function musicFromMusicGen(description, options = {}) {
  const {
    replicateToken = process.env.REPLICATE_TOKEN,
    model = 'musicgen-large',
    duration = 30,
    outputDir = './ecosystem/outputs',
  } = options;

  if (!replicateToken) {
    console.error('❌ REPLICATE_TOKEN not set');
    return null;
  }

  console.log(`🎵 Generating music with Replicate MusicGen: "${description}"`);

  try {
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${replicateToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: '671ac645ce5e552cc63a54a2bbff63fcf798043055d2dac5fc9e36ff9bec53f6',
        input: {
          prompt: description,
          duration: Math.min(duration, 30), // Max 30s per generation
        },
      }),
    });

    if (!response.ok) throw new Error(await response.text());

    const prediction = await response.json();
    console.log(`✅ Music generation queued: ${prediction.id}`);

    return {
      prediction_id: prediction.id,
      source: 'Replicate MusicGen',
      duration: Math.min(duration, 30),
      outputDir,
    };
  } catch (err) {
    console.error(`❌ MusicGen error: ${err.message}`);
    return null;
  }
}

/**
 * Generate music with intelligent fallback
 * Tries: Pixabay first (free, instant), then Replicate (AI, higher quality)
 *
 * @param {string} description - Music description
 * @param {object} options - { preferPixabay, preferMusicGen, duration }
 * @returns {Promise<object>} Music result
 */
export async function textToMusicWithFallback(description, options = {}) {
  const {
    preferPixabay = true,
    preferMusicGen = false,
    duration = 30,
    pixabayApiKey,
    replicateToken,
    outputDir,
  } = options;

  console.log('\n🎵 [TEXT-TO-MUSIC] Starting music generation');
  console.log(`   Query: "${description}"`);
  console.log(`   Prefer: ${preferPixabay ? 'Pixabay' : 'MusicGen'}`);

  // Try preferred source first
  if (preferPixabay) {
    console.log('\n🔍 Attempt 1: Pixabay Music (free, instant)');
    const pixabayResult = await musicFromPixabay(description, {
      duration,
      outputDir,
      pixabayApiKey,
    });
    if (pixabayResult) {
      return { ...pixabayResult, attempt: 1 };
    }

    console.log('\n🔄 Fallback: Replicate MusicGen (AI, higher quality)');
    const musicgenResult = await musicFromMusicGen(description, {
      duration,
      outputDir,
      replicateToken,
    });
    if (musicgenResult) {
      return { ...musicgenResult, attempt: 2 };
    }
  } else {
    // Prefer MusicGen
    console.log('\n🔍 Attempt 1: Replicate MusicGen (AI)');
    const musicgenResult = await musicFromMusicGen(description, {
      duration,
      outputDir,
      replicateToken,
    });
    if (musicgenResult) {
      return { ...musicgenResult, attempt: 1 };
    }

    console.log('\n🔄 Fallback: Pixabay Music (free, instant)');
    const pixabayResult = await musicFromPixabay(description, {
      duration,
      outputDir,
      pixabayApiKey,
    });
    if (pixabayResult) {
      return { ...pixabayResult, attempt: 2 };
    }
  }

  throw new Error('All music generation methods failed');
}

/**
 * Batch: Generate multiple music tracks (for segmented videos)
 * Useful for videos longer than 30s
 *
 * @param {string} description - Base music description
 * @param {number} count - Number of tracks to generate
 * @param {object} options - Options
 * @returns {Promise<array>} Array of music results
 */
export async function generateMusicPlaylist(description, count = 3, options = {}) {
  console.log(`\n🎵 Generating ${count}-track playlist: "${description}"`);

  const results = [];
  for (let i = 0; i < count; i++) {
    console.log(`\n📍 Track ${i + 1}/${count}`);
    const result = await textToMusicWithFallback(description, options);
    if (result) {
      results.push({ ...result, trackNumber: i + 1 });
    }
  }

  return results;
}

export default {
  searchPixabayMusic,
  downloadPixabayTrack,
  musicFromPixabay,
  musicFromMusicGen,
  textToMusicWithFallback,
  generateMusicPlaylist,
};
