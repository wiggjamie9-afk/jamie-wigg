# Postfox Automation Integration for Buddy System

**Social Media Strategist + Content Scheduler in your Buddy System**

Postfox Buddy (#51) brings social media automation directly into the Buddy System ecosystem. Schedule posts, optimize captions, batch content across platforms, and A/B test variations—all while maintaining your brand voice.

## What It Does

- **Schedule Posts** across LinkedIn, Twitter, Instagram, TikTok, and other platforms
- **Optimize Captions** with platform-specific length and formatting
- **Batch Processing** — turn a single piece of content into multi-platform posts
- **A/B Testing** — test caption variations and track performance
- **Hashtag Suggestions** — tailored to platform and audience
- **Scheduling Intelligence** — time posts for optimal engagement
- **Track Schedule** — view all upcoming posts, cancel or edit as needed

## Setup

### 1. Get Postfox API Credentials

1. Go to [Postfox Settings](https://www.postfox.io/settings/api)
2. Generate a new API key
3. Copy your API key

### 2. Configure Your Environment

```bash
# Copy the example config
cp .env.postfox.example .env.postfox

# Add your Postfox API key
nano .env.postfox
# or edit in your editor of choice
```

### 3. Initialize in Browser Console

```javascript
// Load the helper
const helper = new PostfoxAutomationHelper();

// Set your API key
helper.setApiKey("your_api_key_here");

// Validate connection
await helper.validateConnection();
// Output: { success: true, message: "Connected to Postfox API" }
```

## Usage

### Schedule a Single Post

```javascript
const result = helper.schedulePost({
  content:
    "Just shipped a new feature in Claude Code. Game-changer for long-term projects. 🚀",
  platforms: ["twitter", "linkedin"],
  scheduledTime: new Date("2025-01-15T09:00:00Z"),
  hashtags: ["claudecode", "ai", "productivity"],
});

console.log(result);
// { success: true, postId: "post_1234567890", message: "..." }
```

### Optimize Caption for Platform

```javascript
const tweetVersion = helper.optimizeCaption(
  "This is a long caption that might be too long for Twitter. Here's some extra text.",
  "twitter"
);

console.log(tweetVersion);
// { caption: "...", platform: "twitter", characterCount: 95, limit: 280, warning: null }
```

### Suggest Hashtags

```javascript
const hashtags = helper.suggestHashtags(
  "New feature announcement: Claude Code now supports long-term project workflows",
  "linkedin",
  5
);

console.log(hashtags);
// { platform: "linkedin", hashtags: ["#feature", "#code", "#workflow", ...], suggestion: "#feature #code ..." }
```

### Create A/B Test

```javascript
const test = helper.createABTest({
  contentA: "Exciting announcement! 🎉",
  contentB: "You won't believe what we just released",
  platform: "twitter",
  scheduledTime: new Date("2025-01-15T09:00:00Z"),
  splitPercentage: 50,
});

console.log(test);
// { success: true, testId: "test_1234567890", message: "..." }
```

### View All Scheduled Posts

```javascript
const scheduled = helper.getScheduledPosts();
console.log(scheduled.posts);
// [{ id, content, platforms, scheduledTime, status, ... }]
```

### Cancel a Post

```javascript
helper.cancelPost("post_1234567890");
// { success: true, message: "Post post_1234567890 cancelled" }
```

### Export Schedule

```javascript
// Export as JSON
const json = helper.exportSchedule("json");

// Export as CSV
const csv = helper.exportSchedule("csv");
```

## Postfox Buddy in Action

Once Postfox Buddy #51 is integrated into your Buddy System:

### Starting a Session

```
You: "Hey, I want to schedule a launch announcement for RHYTHMIX across all platforms"

Postfox Buddy: "Perfect! Let's think about your audience and goals. Are you going for energy and urgency (good for Twitter/TikTok) or professionalism and credibility (better for LinkedIn)? What time works for your audience?"

You: "Mostly tech/music people, probably 9am UTC is best"

Postfox Buddy: "Got it. Here's what I'd suggest: [suggests optimized captions for each platform, hashtag strategy, timing]. Want me to schedule these, or should we tweak the copy first?"
```

### During the Session

The buddy helps with:
- **Caption optimization** — "This is 35 chars over Twitter limit. Should we cut the emoji or rephrase?"
- **Platform strategy** — "LinkedIn will perform better if you lead with the business impact, then the tech"
- **A/B testing** — "Let's test two versions: one with a question, one with a statement"
- **Scheduling** — "You've got 12 posts scheduled. Want to see them all, or just this week's?"

### After Posting

- Track engagement and impressions (when Postfox API fully integrates)
- Analyze what resonated
- Plan next content based on performance

## Integration with Your Buddy System

### Add Postfox Buddy to Your Buddies List

Edit `apps/buddies.html` and add:

```html
<div class="buddy-card" data-buddy-id="51">
  <img src="postfox-buddy-icon.svg" alt="Postfox Strategist" />
  <h3>Postfox Strategist</h3>
  <p>Schedule, optimize, and strategize your social media presence.</p>
  <button class="select-buddy" data-buddy-id="51">Start Chatting</button>
</div>
```

### Add to Buddy Personalities

Edit `apps/buddy-personalities.js` and add Postfox Buddy #51 to the `BUDDY_PERSONALITIES` object:

```javascript
51: {
  name: "Postfox Strategist",
  systemPrompt: "...", // From postfox-buddy-integration.js
  voiceStyle: "confident, strategic, encouraging",
  suggestedElevenLabsVoice: "Josh",
  affirmations: [...],
  greetingExamples: [...],
  crisisGuidance: "...",
}
```

Or use the pre-made integration file:

```html
<script src="postfox-buddy-integration.js"></script>
<script>
  // Merge Postfox Buddy into BUDDY_PERSONALITIES
  BUDDY_PERSONALITIES[51] = window.POSTFOX_BUDDY;
</script>
```

## API Reference

### PostfoxAutomationHelper Class

#### Constructor

```javascript
new PostfoxAutomationHelper(apiKey = null)
```

#### Methods

| Method                     | Returns                          | Description                            |
| -------------------------- | -------------------------------- | -------------------------------------- |
| `setApiKey(key)`           | `{ success, message }`           | Set/update API credentials             |
| `validateConnection()`     | Promise\<`{ success, error }`\>  | Test Postfox API connection            |
| `schedulePost(options)`    | `{ success, postId }`            | Schedule a new post                    |
| `getScheduledPosts(status)` | `{ success, posts, count }`      | Retrieve all scheduled posts           |
| `cancelPost(postId)`       | `{ success, message }`           | Cancel a scheduled post                |
| `optimizeCaption(text, platform)` | `{ caption, limit, warning }` | Optimize for platform constraints |
| `suggestHashtags(content, platform, count)` | `{ hashtags, suggestion }` | Generate platform-specific hashtags |
| `createABTest(options)`    | `{ success, testId, message }`   | Create A/B test variations             |
| `getAnalytics(postId)`     | `{ success, analytics }`         | Get post performance data              |
| `exportSchedule(format)`   | String (JSON or CSV)             | Export schedule for backup             |

## Limitations & Roadmap

### Current (Local Storage Only)

- ✅ Schedule posts locally
- ✅ Optimize captions and hashtags
- ✅ A/B test variations
- ✅ Export schedule

### Coming (Requires Postfox API)

- 🔄 Send posts to Postfox for distribution
- 🔄 Real-time engagement analytics
- 🔄 Platform-native performance metrics
- 🔄 Webhook integrations for Slack/email notifications

## Troubleshooting

### "No API key configured"

1. Check that your API key is set: `helper.setApiKey("...")`
2. Verify the key format starts with your Postfox account prefix
3. Get a fresh key from [Postfox Settings](https://www.postfox.io/settings/api)

### "API error: 401 Unauthorized"

- Your API key may be expired or revoked
- Check Postfox account permissions
- Generate a new key

### Posts not appearing in schedule

- Check browser console for errors: `console.error()`
- Verify localStorage is enabled: `typeof localStorage !== 'undefined'`
- Try exporting and re-importing schedule

## Support

- **Questions?** Ask Postfox Buddy #51 in the Buddy System
- **Bugs?** Report to the Buddy System repo
- **Postfox API issues?** See [Postfox Docs](https://www.postfox.io/docs)

---

**Built for the Buddy System | Social Media, Simplified | One Less Thing to Stress About**
