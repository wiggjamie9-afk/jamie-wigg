# Claude Nexus Integration Guide

Enhanced Claude API integration for all 50 Buddy apps with personality-driven responses and ecosystem-aware support.

## Quick Start

### 1. Include the Integration Module

In your buddy app HTML file, add before the closing `</body>` tag:

```html
<script src="./claude-nexus-integration.js"></script>
```

### 2. Initialize Buddy with Claude

```javascript
// Define your buddy profile
const buddyProfile = {
    id: 1,
    name: "Anxiety Relief",
    role: "Calming Guide",
    emoji: "🧘",
    tags: ["wellness", "mindfulness"],
    personality: "compassionate, grounding",
    purpose: "Help users find calm through guided breathing and mindfulness"
};

// Initialize Claude integration
const claudeKey = localStorage.getItem('claudeApiKey'); // User's API key
const buddy = new BuddyClaudeIntegration(claudeKey, buddyProfile);
```

### 3. Generate Responses

```javascript
async function chat(userMessage) {
    const response = await buddy.generateResponse(userMessage);
    
    if (response.isCrisis) {
        // Show crisis resources prominently
        displayCrisisAlert(response.content);
    } else {
        // Display normal response
        addMessageToChat(response.content);
    }

    // Update health metrics based on sentiment
    updateHealthScore(response.sentiment);
}
```

## Features

### Personality-Aware Prompting

Each buddy generates responses consistent with their specialization and personality. The system prompt includes:

- **Role & Personality**: Ensures consistent character
- **Specialization**: Guides domain-specific advice
- **Interaction Guidelines**: Maintains appropriate boundaries
- **Nexus Awareness**: Knows about other buddies in the ecosystem

### Crisis Detection & Response

Automatically detects crisis keywords and provides immediate resources:

- National Suicide Prevention Lifeline: 988
- Crisis Text Line: Text HOME to 741741
- International resources: findahelpline.com

**Never minimizes concerns. Always encourages professional help.**

### Conversation History Management

- Maintains context with configurable memory window (default: 10 messages)
- Automatic truncation to prevent token bloat
- Full offline localStorage persistence

### Sentiment Analysis

Analyzes responses to detect:

- **Positive**: happiness, progress, confidence
- **Negative**: distress, struggle, overwhelm
- **Neutral**: informational, reflective

Updates user's health metrics accordingly.

### Multi-Buddy Ecosystem Support

```javascript
// Create ecosystem manager
const ecosystem = new NexusEcosystemManager();

// Register all 50 buddies
BUDDIES.forEach(profile => {
    ecosystem.registerBuddy(profile, claudeKey);
});

// Suggest another buddy based on need
const suggested = buddy.suggestBuddy("I'm feeling anxious about my career");
// Returns: "Career Coach"

// Record cross-buddy recommendation
ecosystem.recordBuddySuggestion(1, 2, "User mentioned career anxiety");
```

## API Methods

### BuddyClaudeIntegration

#### `generateResponse(userMessage)`
Main method to get buddy response. Returns:
```javascript
{
    content: string,          // The buddy's response
    isCrisis: boolean,        // Crisis detected?
    sentiment: string,        // 'positive' | 'negative' | 'neutral'
    usage: {                  // Token usage (if available)
        inputTokens: number,
        outputTokens: number
    },
    error?: string           // Error message if failed
}
```

#### `detectCrisis(message)`
Check if message contains crisis signals.

#### `addToHistory(role, content)`
Manually add message to conversation history.

#### `resetHistory()`
Clear conversation for fresh session.

#### `saveConversation(conversationId)`
Persist conversation to localStorage.

#### `loadConversation(conversationId)`
Restore previous conversation.

#### `analyzeSentiment(message)`
Get sentiment of any text message.

#### `suggestBuddy(userNeed)`
Get buddy recommendation based on user's stated need.

### NexusEcosystemManager

#### `registerBuddy(buddyProfile, claudeKey)`
Register a buddy in the ecosystem.

#### `getBuddy(identifier)`
Retrieve buddy by ID or name.

#### `recordBuddySuggestion(fromId, toId, reason)`
Log cross-buddy recommendations.

#### `getEcosystemContext()`
Get context about previous interactions.

#### `saveState(userId)` / `restoreState(userId)`
Persist entire ecosystem state.

## Example: Complete Chat Implementation

```javascript
class BuddyChatUI {
    constructor(buddyProfile) {
        this.buddy = new BuddyClaudeIntegration(
            localStorage.getItem('claudeApiKey'),
            buddyProfile
        );
        this.loadConversation(buddyProfile.id);
    }

    async sendMessage(userText) {
        // Add user message to UI
        this.displayMessage(userText, 'user');

        // Generate response
        const response = await this.buddy.generateResponse(userText);

        // Handle crisis
        if (response.isCrisis) {
            this.displayCrisis(response.content);
            return;
        }

        // Display buddy response
        this.displayMessage(response.content, 'buddy');

        // Update health based on sentiment
        this.updateHealthMetric('mood', {
            positive: '😊 Happy',
            negative: '😔 Struggling',
            neutral: '😐 Thoughtful'
        }[response.sentiment]);

        // Save conversation
        this.buddy.saveConversation(this.buddy.buddy.id);
    }

    displayMessage(text, role) {
        const el = document.createElement('div');
        el.className = `message ${role}`;
        el.textContent = text;
        document.getElementById('chatMessages').appendChild(el);
    }

    displayCrisis(text) {
        const el = document.createElement('div');
        el.className = 'message crisis-alert';
        el.innerHTML = `<strong>🚨 Crisis Support Available</strong><br/>${text}`;
        document.getElementById('chatMessages').appendChild(el);
    }

    loadConversation(buddyId) {
        const saved = localStorage.getItem(`conv-${buddyId}`);
        if (saved) {
            const data = JSON.parse(saved);
            this.buddy.conversationHistory = data.messages;
        }
    }
}

// Usage
const chat = new BuddyChatUI(buddyProfile);
```

## Configuration

### Model

Default: `claude-3-5-sonnet-20241022` (most cost-effective for real-time chat)

To use a different model:

```javascript
buddy.modelId = 'claude-opus-4-1'; // Higher capability, higher cost
```

### Context Window

Default: 10 messages each direction (20 total before truncation)

```javascript
buddy.maxContextMessages = 20; // Increase for longer context
```

### Crisis Keywords

Custom crisis detection:

```javascript
buddy.crisisKeywords = [...buddy.crisisKeywords, 'custom-keyword'];
```

## Error Handling

All methods handle API errors gracefully:

```javascript
const response = await buddy.generateResponse(userMessage);

if (response.error) {
    console.error('Claude API error:', response.error);
    // Show user-friendly fallback message
    displayMessage("I'm having connection issues. Try again?", 'buddy');
}
```

## Privacy & Security

- ✅ Claude API key stored in localStorage (user's local device)
- ✅ No conversation data sent to third-party servers
- ✅ No analytics or tracking
- ✅ Offline-first: works without internet after initial load
- ✅ User maintains full data ownership

## Token Usage & Costs

Typical costs per conversation:

- **Short Q&A** (1-3 messages): ~500-1000 tokens = ~$0.005
- **Medium chat** (5-10 messages): ~2000-4000 tokens = ~$0.02
- **Long session** (20+ messages): ~5000-10000 tokens = ~$0.05

Users provide their own Claude API key → users control costs.

## Troubleshooting

### "Invalid API Key" Error

- Verify key in Settings
- Ensure key starts with `sk-` or `sk-ant-`
- Check key has not been revoked at console.anthropic.com

### Crisis Detected But User Says They're Fine

This is intentional—better to over-detect and provide resources than under-detect.

### Responses Seem Off-Character

Increase `maxContextMessages` to maintain more context for personality consistency.

### Token Limit Errors

Reduce `maxContextMessages` or use shorter input messages.

## Extending the System

### Add Custom Crisis Keywords

```javascript
buddy.crisisKeywords.push('new-keyword');
```

### Add Health Metrics

```javascript
class HealthAwareBuddy extends BuddyClaudeIntegration {
    analyzeSentiment(message) {
        const base = super.analyzeSentiment(message);
        // Add custom health tracking
        return base;
    }
}
```

### Multi-Language Support

Claude supports 100+ languages natively:

```javascript
const buddyProfile = {
    // ... existing fields ...
    language: 'es' // Spanish
};
// System prompt automatically uses user's language
```

## Next Steps

1. **Add to buddy-1.html through buddy-50.html**: Replace fetch-based chat with `BuddyClaudeIntegration`
2. **Add to buddy-system.html**: Use `NexusEcosystemManager` for hub-level coordination
3. **Test crisis detection**: Verify crisis flows work properly
4. **Monitor sentiment tracking**: Check if health metrics update correctly
5. **Deploy**: Push updated apps to production

## Support

For issues:
1. Check console for JavaScript errors
2. Verify Claude API key in localStorage: `console.log(localStorage.getItem('claudeApiKey'))`
3. Test API directly: `curl -X POST https://api.anthropic.com/v1/messages ...`
4. Check Anthropic status page: https://status.anthropic.com
