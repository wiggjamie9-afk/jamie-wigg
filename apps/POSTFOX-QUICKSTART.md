# Postfox Buddy — Quick Start (5 Minutes)

Get Postfox Buddy #51 up and running in your Buddy System.

## 1. Copy Configuration (30 seconds)

```bash
cp .env.postfox.example .env.postfox
# Edit .env.postfox with your Postfox API key
```

Get your API key: https://www.postfox.io/settings/api

## 2. Load the Scripts (1 minute)

Add to your Buddy System HTML (e.g., `buddy-system.html` or wherever you initialize buddies):

```html
<!-- Postfox Buddy Integration -->
<script src="postfox-buddy-integration.js"></script>
<script src="postfox-automation-helper.js"></script>

<script>
  // Initialize Postfox automation
  const postfoxHelper = new PostfoxAutomationHelper();

  // Load Postfox Buddy personality
  if (window.POSTFOX_BUDDY) {
    // Add to your buddy system
    // BUDDY_PERSONALITIES[51] = window.POSTFOX_BUDDY;
  }
</script>
```

## 3. Set Your API Key (1 minute)

In browser console or your initialization code:

```javascript
postfoxHelper.setApiKey("your_api_key_from_postfox");

// Verify connection
await postfoxHelper.validateConnection();
// Should output: { success: true, message: "Connected to Postfox API" }
```

## 4. Try It Out (2 minutes)

### Schedule Your First Post

```javascript
const result = postfoxHelper.schedulePost({
  content: "Testing Postfox automation in Buddy System! 🚀",
  platforms: ["twitter"],
  scheduledTime: new Date(Date.now() + 60 * 1000), // 1 minute from now
  hashtags: ["ai", "postfox", "automation"],
});

console.log(result);
// { success: true, postId: "post_1234567890", message: "..." }
```

### View Your Schedule

```javascript
const scheduled = postfoxHelper.getScheduledPosts();
console.log(scheduled.posts);
// See all your scheduled posts
```

### Optimize a Caption

```javascript
const optimized = postfoxHelper.optimizeCaption(
  "This is my long caption that might not fit on Twitter...",
  "twitter"
);

console.log(optimized.caption);
// Automatically trimmed to 280 characters
```

## 5. Chat with Postfox Buddy (Optional)

Once integrated into your Buddy System, select **Postfox Strategist** and:

- "Schedule a post about my new feature"
- "What hashtags should I use for LinkedIn?"
- "Help me optimize this caption for Twitter"
- "Show me my posting schedule"

## What's Next?

- 📚 Read [POSTFOX-INTEGRATION.md](POSTFOX-INTEGRATION.md) for full API documentation
- 🎯 Explore A/B testing with `createABTest()`
- 📊 Export your schedule with `exportSchedule()`
- 🔌 Connect Postfox API webhooks when available

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "No API key configured" | Run `postfoxHelper.setApiKey("your_key")` |
| "API error: 401" | Check your API key is valid. Get a new one from [Postfox Settings](https://www.postfox.io/settings/api) |
| Scripts not loading | Verify file paths: `postfox-buddy-integration.js` and `postfox-automation-helper.js` are in the same directory |
| Schedule not persisting | Check browser localStorage is enabled |

---

**That's it! You're ready to automate your social media from the Buddy System.**
