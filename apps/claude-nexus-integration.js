/**
 * Claude Nexus Integration
 *
 * Enhanced Claude API wrapper for personality-driven buddy responses
 * Integrates Nexus ecosystem prompt framework for coherent multi-buddy interactions
 * Provides context management, crisis detection, and health monitoring prompts
 */

class BuddyClaudeIntegration {
    constructor(claudeApiKey, buddyProfile) {
        this.apiKey = claudeApiKey;
        this.buddy = buddyProfile;
        this.conversationHistory = [];
        this.maxContextMessages = 10;
        this.modelId = 'claude-3-5-sonnet-20241022';
        this.crisisKeywords = [
            'suicide', 'self-harm', 'kill myself', 'hurt myself', 'no point',
            'overdose', 'cutting', 'die', 'dead', '988', 'crisis'
        ];
    }

    /**
     * Build system prompt with Nexus framework
     */
    buildSystemPrompt() {
        return `You are ${this.buddy.name}, a ${this.buddy.role} in the Buddy Nexus ecosystem.

Personality Profile:
- Nature: ${this.buddy.personality}
- Specialization: ${this.buddy.tags.join(', ')}
- Core Purpose: ${this.buddy.purpose || 'Provide compassionate support'}

Interaction Guidelines:
1. Stay deeply in character as ${this.buddy.name}
2. Use warm, approachable language matching your personality
3. Ask clarifying questions when needed
4. Provide practical, actionable advice when appropriate
5. Validate emotions before offering solutions
6. Keep responses concise (1-3 sentences usually)
7. Reference previous conversation when relevant
8. Never pretend to have capabilities you lack

Nexus Ecosystem Context:
- You are part of a 50-buddy system where users can switch between specialists
- Acknowledge limitations and suggest connecting with another buddy if needed
- Be aware that users may consult multiple buddies for holistic support
- Maintain consistency in referring to the buddy ecosystem

Crisis Protocol:
- If user mentions self-harm, suicide, or crisis: PAUSE conversation
- Respond with empathy and immediate crisis resources
- Provide: National Suicide Prevention Lifeline: 988, Crisis Text Line: Text HOME to 741741
- Encourage immediate professional help
- Never minimize their concerns

Health Integration:
- Track emotional sentiment in conversation
- Suggest appropriate self-care or professional resources
- Remember previous health check-ins
- Encourage sustainable wellness practices`;
    }

    /**
     * Detect crisis signals in user message
     */
    detectCrisis(message) {
        const lowerMsg = message.toLowerCase();
        return this.crisisKeywords.some(keyword => lowerMsg.includes(keyword));
    }

    /**
     * Generate crisis response
     */
    generateCrisisResponse() {
        return `I hear you, and I'm genuinely concerned. What you're feeling matters, and help is available right now:

🆘 National Suicide Prevention Lifeline: 988 (call or text)
💬 Crisis Text Line: Text HOME to 741741
🌍 International: findahelpline.com

You deserve support from professionals trained in crisis care. I'm here to listen, but please reach out to these services. Would you be willing to contact one of them right now?`;
    }

    /**
     * Add message to conversation history with memory management
     */
    addToHistory(role, content) {
        this.conversationHistory.push({ role, content });
        if (this.conversationHistory.length > this.maxContextMessages * 2) {
            this.conversationHistory = this.conversationHistory.slice(-this.maxContextMessages * 2);
        }
    }

    /**
     * Format conversation history for Claude API
     */
    formatHistory() {
        return this.conversationHistory.map(msg => ({
            role: msg.role,
            content: msg.content
        }));
    }

    /**
     * Main method: Generate buddy response
     */
    async generateResponse(userMessage) {
        // Check for crisis signals
        if (this.detectCrisis(userMessage)) {
            return {
                content: this.generateCrisisResponse(),
                isCrisis: true,
                sentiment: 'critical'
            };
        }

        // Add user message to history
        this.addToHistory('user', userMessage);

        try {
            // Call Claude API
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.apiKey,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: this.modelId,
                    max_tokens: 1000,
                    system: this.buildSystemPrompt(),
                    messages: this.formatHistory()
                })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            const assistantMessage = data.content?.[0]?.text || "I'm here to listen...";

            // Add assistant response to history
            this.addToHistory('assistant', assistantMessage);

            // Detect sentiment for health monitoring
            const sentiment = this.analyzeSentiment(assistantMessage);

            return {
                content: assistantMessage,
                isCrisis: false,
                sentiment: sentiment,
                usage: {
                    inputTokens: data.usage?.input_tokens,
                    outputTokens: data.usage?.output_tokens
                }
            };
        } catch (error) {
            console.error('Claude API error:', error);
            return {
                content: "I'm having trouble connecting right now. Try again in a moment?",
                isCrisis: false,
                sentiment: 'neutral',
                error: error.message
            };
        }
    }

    /**
     * Analyze emotional sentiment of message
     */
    analyzeSentiment(message) {
        const positive = ['happy', 'great', 'wonderful', 'excited', 'grateful', 'better', 'improving', 'strong'];
        const negative = ['sad', 'angry', 'anxious', 'worried', 'overwhelmed', 'tired', 'stuck', 'lost'];

        const lower = message.toLowerCase();
        const posCount = positive.filter(w => lower.includes(w)).length;
        const negCount = negative.filter(w => lower.includes(w)).length;

        if (posCount > negCount) return 'positive';
        if (negCount > posCount) return 'negative';
        return 'neutral';
    }

    /**
     * Generate health check-in prompt
     */
    getHealthCheckPrompt() {
        return `As ${this.buddy.name}, ask ${this.buddy.name === 'Grief Buddy' ? 'how are they feeling today' : 'a gentle check-in question about their wellbeing'} based on your specialty. Keep it natural and conversational.`;
    }

    /**
     * Get suggested buddy based on need
     */
    suggestBuddy(userNeed) {
        const suggestions = {
            'anxiety': 'Anxiety Relief',
            'career': 'Career Coach',
            'grief': 'Grief Buddy',
            'motivation': 'Motivation Expert',
            'sleep': 'Sleep Consultant',
            'relationships': 'Dating Advisor',
            'fitness': 'Fitness Motivator',
            'study': 'Study Buddy',
            'creativity': 'Creative Muse',
            'confidence': 'Confidence Builder'
        };

        for (const [key, buddy] of Object.entries(suggestions)) {
            if (userNeed.toLowerCase().includes(key)) {
                return buddy;
            }
        }
        return null;
    }

    /**
     * Clear conversation history (new session)
     */
    resetHistory() {
        this.conversationHistory = [];
    }

    /**
     * Save conversation to localStorage
     */
    saveConversation(conversationId) {
        const data = {
            buddy: this.buddy.name,
            timestamp: new Date().toISOString(),
            messages: this.conversationHistory
        };
        localStorage.setItem(`conv-${conversationId}`, JSON.stringify(data));
    }

    /**
     * Load conversation from localStorage
     */
    loadConversation(conversationId) {
        const data = localStorage.getItem(`conv-${conversationId}`);
        if (data) {
            const parsed = JSON.parse(data);
            this.conversationHistory = parsed.messages;
        }
    }
}

/**
 * Nexus Ecosystem Manager
 * Coordinates multi-buddy interactions and context sharing
 */
class NexusEcosystemManager {
    constructor() {
        this.buddies = new Map();
        this.userContext = {};
        this.previousInteractions = [];
    }

    /**
     * Register a buddy in the ecosystem
     */
    registerBuddy(buddyProfile, claudeApiKey) {
        const buddy = new BuddyClaudeIntegration(claudeApiKey, buddyProfile);
        this.buddies.set(buddyProfile.id, buddy);
        return buddy;
    }

    /**
     * Get buddy by name or ID
     */
    getBuddy(identifer) {
        if (typeof identifer === 'number') {
            return this.buddies.get(identifer);
        }
        for (const buddy of this.buddies.values()) {
            if (buddy.buddy.name === identifer) return buddy;
        }
        return null;
    }

    /**
     * Record cross-buddy recommendation
     */
    recordBuddySuggestion(fromBuddyId, toBuddyId, reason) {
        this.previousInteractions.push({
            from: fromBuddyId,
            to: toBuddyId,
            reason,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Generate ecosystem context for new buddy
     */
    getEcosystemContext() {
        return {
            previousBuddies: [...new Set(this.previousInteractions.map(i => i.from))],
            recentInteractions: this.previousInteractions.slice(-5),
            userPreferences: this.userContext
        };
    }

    /**
     * Save entire ecosystem state
     */
    saveState(userId) {
        const state = {
            buddies: Array.from(this.buddies.entries()).map(([id, buddy]) => ({
                id,
                history: buddy.conversationHistory
            })),
            userContext: this.userContext,
            interactions: this.previousInteractions
        };
        localStorage.setItem(`nexus-${userId}`, JSON.stringify(state));
    }

    /**
     * Restore entire ecosystem state
     */
    restoreState(userId) {
        const state = localStorage.getItem(`nexus-${userId}`);
        if (state) {
            const parsed = JSON.parse(state);
            this.userContext = parsed.userContext;
            this.previousInteractions = parsed.interactions;
            parsed.buddies.forEach(buddyState => {
                const buddy = this.buddies.get(buddyState.id);
                if (buddy) {
                    buddy.conversationHistory = buddyState.history;
                }
            });
        }
    }
}

// Export for use in buddy apps
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BuddyClaudeIntegration, NexusEcosystemManager };
}
