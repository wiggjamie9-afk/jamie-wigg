# 🎵 Music Integration Guide for Your Apps
## Add Spotify / Music Assistant to Your Apps (Later)

---

## Which Apps Should Have Music Features?

**Primary candidates:**
1. **Hum** — Music/audio app (obvious)
2. **Live** — Live streaming app (could include music)
3. **Resonate** — Sound/frequency healing (natural fit)
4. **Meditation Guide** — Background ambient music for meditation

**Secondary candidates:**
5. **Pomodoro Timer** — Background focus music
6. **Workout Timer** — Workout music playlist

---

## Integration Options (Pick One)

### Option A: Spotify Web API (Recommended for MVP)
**Pros:** Free tier available, 350M+ songs, easy to implement  
**Cons:** Requires Spotify account; users need Premium for some features  
**Effort:** Low (2–3 hours setup)

### Option B: Music Assistant Server
**Pros:** Open-source, runs locally, connects to your own streaming services  
**Cons:** Requires always-on server (Raspberry Pi, NAS, etc.)  
**Effort:** Medium (requires DevOps)

### Option C: YouTube Music / Apple Music APIs
**Pros:** Larger catalogs, iOS native support  
**Cons:** More complex auth, stricter rate limits  
**Effort:** High (5–10 hours setup)

---

## Step-by-Step: Spotify Integration (Easiest)

### Step 1: Create Spotify App
1. Go to: https://developer.spotify.com/dashboard
2. Log in (create free account if needed)
3. Click "Create an App"
4. Name: "YourAppName Music"
5. Accept terms → Create
6. Copy: **Client ID** and **Client Secret** (keep secret!)

**Time: 5 minutes**

---

### Step 2: Set Up Authentication
Add this to your app's HTML:

```html
<!-- In your app's header -->
<script src="https://sdk.scdn.co/spotify-web-playback-sdk.js"></script>

<script>
  // Spotify auth flow
  const clientId = "YOUR_CLIENT_ID_HERE";
  const redirectUri = "https://yourapp.com/callback";
  
  // User clicks "Connect Spotify" button
  function connectSpotify() {
    const scopes = [
      "streaming",
      "user-read-private",
      "user-read-email",
      "user-library-read",
      "user-top-read"
    ];
    
    const authUrl = new URL("https://accounts.spotify.com/authorize");
    authUrl.searchParams.append("client_id", clientId);
    authUrl.searchParams.append("response_type", "token");
    authUrl.searchParams.append("redirect_uri", redirectUri);
    authUrl.searchParams.append("scope", scopes.join(" "));
    
    window.location.href = authUrl.toString();
  }
</script>

<!-- In your HTML -->
<button onclick="connectSpotify()">🎵 Connect Spotify</button>
```

**Time: 15 minutes**

---

### Step 3: Add Music Player
```html
<div id="player">
  <input type="text" id="search" placeholder="Search songs...">
  <button onclick="searchSongs()">Search</button>
  <div id="results"></div>
  <button onclick="playTrack()">▶️ Play</button>
</div>

<script>
  // Search Spotify
  async function searchSongs() {
    const query = document.getElementById("search").value;
    const token = localStorage.getItem("spotify_token"); // from auth flow
    
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${query}&type=track&limit=10`,
      {
        headers: { "Authorization": `Bearer ${token}` }
      }
    );
    
    const data = await response.json();
    displayResults(data.tracks.items);
  }
  
  function displayResults(tracks) {
    const html = tracks.map(t => `
      <div onclick="playTrack('${t.uri}')">
        <img src="${t.album.images[0].url}" style="width:50px;">
        ${t.name} - ${t.artists[0].name}
      </div>
    `).join("");
    document.getElementById("results").innerHTML = html;
  }
  
  // Play track
  function playTrack(trackUri) {
    const device_id = localStorage.getItem("device_id"); // from player init
    const token = localStorage.getItem("spotify_token");
    
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
      method: "PUT",
      headers: { "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ uris: [trackUri] })
    });
  }
</script>
```

**Time: 30 minutes**

---

### Step 4: Add to Meditation Guide (Example)
```javascript
// meditation-guide.js
class MeditationWithMusic {
  constructor() {
    this.spotifyToken = localStorage.getItem("spotify_token");
    this.meditationPlaylist = [
      // Pre-curated relaxing tracks (Spotify URIs)
      "spotify:track:4cOdkLwLK6i3ArFtw0DkIX", // Rain Sounds
      "spotify:track:3xt6VYO1fUPm9v1PqKUXn7", // Ambient Piano
      // Add more...
    ];
  }
  
  async startMeditation(duration) {
    // Play background music
    await this.playPlaylist();
    
    // Show meditation timer
    this.startTimer(duration);
    
    // Auto-pause when done
    setTimeout(() => this.pauseMusic(), duration * 60 * 1000);
  }
  
  async playPlaylist() {
    const track = this.meditationPlaylist[0]; // Start with first track
    await fetch(`https://api.spotify.com/v1/me/player/play`, {
      method: "PUT",
      headers: { "Authorization": `Bearer ${this.spotifyToken}` },
      body: JSON.stringify({ uris: [track] })
    });
  }
}
```

**Time: 20 minutes**

---

## Step-by-Step: Music Assistant Server (Advanced)

### Step 1: Deploy Music Assistant
```bash
# On always-on device (Raspberry Pi, NAS, etc.)
# Using Docker

docker run -d \
  --name music-assistant \
  -p 8060:8060 \
  -v /path/to/config:/data \
  ghcr.io/music-assistant/server:latest
```

**Time: 30 minutes (includes device setup)**

---

### Step 2: Connect Your App to Music Assistant
```javascript
// music-assistant-client.js
class MusicAssistantClient {
  constructor(serverUrl = "http://localhost:8060") {
    this.serverUrl = serverUrl;
  }
  
  async searchTracks(query) {
    const response = await fetch(
      `${this.serverUrl}/api/search?q=${query}&type=track`
    );
    return await response.json();
  }
  
  async playTrack(trackId) {
    await fetch(`${this.serverUrl}/api/players/{player_id}/play`, {
      method: "POST",
      body: JSON.stringify({ media_id: trackId })
    });
  }
  
  async getPlaylists() {
    const response = await fetch(`${this.serverUrl}/api/library/playlists`);
    return await response.json();
  }
}

// Usage in your app
const musicClient = new MusicAssistantClient();
await musicClient.playTrack("track_123");
```

**Time: 1 hour (setup + integration)**

---

## Implementation Checklist

### For Spotify (Easy Path)
- [ ] Create Spotify Developer App
- [ ] Get Client ID + Client Secret
- [ ] Add Spotify Web Playback SDK to HTML
- [ ] Implement auth flow (ConnectSpotify button)
- [ ] Add search functionality
- [ ] Add player controls (play/pause/next)
- [ ] Test on mobile (iOS + Android)
- [ ] Add to localStorage for persistence
- [ ] Deploy to App Store / Play Store with Spotify creds

### For Music Assistant (Advanced Path)
- [ ] Deploy Music Assistant Docker container
- [ ] Configure streaming service connections (Spotify, Apple Music, etc.)
- [ ] Create Music Assistant API client for your app
- [ ] Integrate search + playback into your app
- [ ] Test network connectivity (local + remote)
- [ ] Add fallback if server is offline
- [ ] Document server setup in app help

---

## Privacy & Permissions

### Spotify
- Users must authorize with Spotify account
- You get access to: library, playlists, playback history
- **Privacy policy**: Clearly state "Spotify integration" + link to Spotify's privacy policy
- **In-app disclosure**: "This app connects to your Spotify account"

### Music Assistant
- Runs on user's own device (self-hosted)
- No data leaves their network
- **Privacy policy**: "No data collected, runs on your local network"

---

## For App Store Submission

### iOS App Store
- Spotify auth is pre-approved
- Add permission: "NSLocalNetworkUsageDescription" (for Music Assistant)
- Review may ask: "Does this require Spotify subscription?"
  - Answer: "No, free accounts work but with limitations"

### Google Play
- Same Spotify setup
- Add permission: `android.permission.CHANGE_NETWORK_STATE` (if Music Assistant)
- Add privacy policy (required)

---

## Revenue Impact

### Spotify Integration
- **Free tier**: Spotify Basic users (ad-supported)
- **Premium features**: For Premium subscribers
- **Monetization**: Affiliate link to Spotify Premium ($9.99/mo)
  - Earn 15–25% referral if user upgrades

### Music Assistant Integration
- **No direct revenue** (open-source, free)
- **Upsell**: Premium version of your app (ad-free, offline music)

---

## Estimated Effort

| Feature | Time | Difficulty |
|---------|------|------------|
| Spotify search + play | 2–3 hours | Easy |
| Full Spotify integration | 8–10 hours | Medium |
| Music Assistant setup | 4–6 hours | Hard |
| Both (hybrid) | 12–16 hours | Hard |

---

## When You're Ready to Implement

1. **Pick Spotify** (easiest, recommended for MVP)
2. **Follow Step-by-Step guide above**
3. **Add to Hum, Meditation, Resonate apps first**
4. **Test on real device (iOS + Android)**
5. **Submit to App Store / Play Store**

---

## Resources

**Spotify:**
- https://developer.spotify.com/documentation/web-api/tutorials/getting-started
- https://developer.spotify.com/documentation/web-playback-sdk

**Music Assistant:**
- https://music-assistant.io/
- https://music-assistant.io/docs/developers/

---

**That's your playbook. Implement when you're ready.** 🎵

For now, focus on the core 28 apps. Music integration is Phase 2.
