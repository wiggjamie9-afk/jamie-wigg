/**
 * Postfox Automation Helper
 * ------------------------------------------------------------------
 * Handles scheduling, batching, and API integration for Postfox
 * within the Buddy System ecosystem.
 *
 * Features:
 * - Schedule posts across platforms
 * - Batch-process content
 * - Optimize captions/hashtags
 * - Track posting schedules
 * - A/B test variations
 *
 * API Documentation: https://www.postfox.io/docs (when available)
 */

class PostfoxAutomationHelper {
  constructor(apiKey = null) {
    this.apiKey = apiKey;
    this.baseUrl = "https://api.postfox.io/v1";
    this.schedule = [];
    this.storage = this._initStorage();
  }

  /**
   * Initialize local storage for scheduling and cache
   */
  _initStorage() {
    if (typeof window !== "undefined" && window.localStorage) {
      return {
        getSchedule: () => {
          const data = localStorage.getItem("postfox_schedule");
          return data ? JSON.parse(data) : [];
        },
        saveSchedule: (schedule) => {
          localStorage.setItem("postfox_schedule", JSON.stringify(schedule));
        },
        getSettings: () => {
          const data = localStorage.getItem("postfox_settings");
          return data ? JSON.parse(data) : {};
        },
        saveSettings: (settings) => {
          localStorage.setItem("postfox_settings", JSON.stringify(settings));
        },
      };
    }
    // Fallback for non-browser environments
    return {
      getSchedule: () => this.schedule,
      saveSchedule: (schedule) => {
        this.schedule = schedule;
      },
      getSettings: () => ({}),
      saveSettings: () => {},
    };
  }

  /**
   * Set API credentials for Postfox
   */
  setApiKey(apiKey) {
    this.apiKey = apiKey;
    const settings = this.storage.getSettings();
    settings.apiKey = apiKey;
    this.storage.saveSettings(settings);
    return { success: true, message: "API key set" };
  }

  /**
   * Validate API connection
   */
  async validateConnection() {
    if (!this.apiKey) {
      return { success: false, error: "No API key configured" };
    }

    try {
      const response = await fetch(`${this.baseUrl}/account`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        return { success: true, message: "Connected to Postfox API" };
      } else {
        return {
          success: false,
          error: `API error: ${response.status} ${response.statusText}`,
        };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Schedule a post across platforms
   */
  schedulePost({
    content,
    platforms,
    scheduledTime,
    hashtags = [],
    mediaUrls = [],
    variations = null,
  }) {
    if (!content || !platforms || !scheduledTime) {
      return { success: false, error: "Missing required fields" };
    }

    const post = {
      id: `post_${Date.now()}`,
      content,
      platforms: Array.isArray(platforms) ? platforms : [platforms],
      scheduledTime: new Date(scheduledTime),
      hashtags,
      mediaUrls,
      variations,
      status: "scheduled",
      createdAt: new Date(),
    };

    const schedule = this.storage.getSchedule();
    schedule.push(post);
    this.storage.saveSchedule(schedule);

    return {
      success: true,
      postId: post.id,
      message: `Post scheduled for ${post.scheduledTime.toISOString()}`,
    };
  }

  /**
   * Get all scheduled posts
   */
  getScheduledPosts(filterStatus = null) {
    let schedule = this.storage.getSchedule();

    if (filterStatus) {
      schedule = schedule.filter((p) => p.status === filterStatus);
    }

    return {
      success: true,
      posts: schedule,
      count: schedule.length,
    };
  }

  /**
   * Cancel a scheduled post
   */
  cancelPost(postId) {
    const schedule = this.storage.getSchedule();
    const postIndex = schedule.findIndex((p) => p.id === postId);

    if (postIndex === -1) {
      return { success: false, error: "Post not found" };
    }

    schedule[postIndex].status = "cancelled";
    this.storage.saveSchedule(schedule);

    return { success: true, message: `Post ${postId} cancelled` };
  }

  /**
   * Optimize caption for a platform
   */
  optimizeCaption(caption, platform = "twitter") {
    const limits = {
      twitter: 280,
      linkedin: 3000,
      instagram: 2200,
      tiktok: 2200,
    };

    const limit = limits[platform] || 3000;
    const optimized = {
      caption: caption.substring(0, limit),
      platform,
      characterCount: caption.length,
      limit,
      warning: caption.length > limit ? `Over ${platform} limit by ${caption.length - limit} chars` : null,
    };

    return optimized;
  }

  /**
   * Suggest hashtags for content
   */
  suggestHashtags(content, platform = "twitter", count = 10) {
    // Simple keyword extraction (in production, use a real NLP library)
    const words = content.toLowerCase().split(/\s+/);
    const keywords = words.filter((w) => w.length > 5 && !this._isStopword(w));

    // Platform-specific hashtag strategies
    const hashtagLimits = {
      twitter: 2,
      linkedin: 5,
      instagram: 30,
      tiktok: 15,
    };

    const limit = hashtagLimits[platform] || 10;
    const hashtags = keywords.slice(0, limit).map((k) => `#${k}`);

    return {
      platform,
      hashtags,
      suggestion: hashtags.join(" "),
    };
  }

  /**
   * Helper: Check if word is a stopword
   */
  _isStopword(word) {
    const stopwords = [
      "the",
      "a",
      "an",
      "and",
      "or",
      "but",
      "is",
      "are",
      "am",
      "was",
      "were",
      "be",
      "been",
      "being",
      "have",
      "has",
      "had",
      "do",
      "does",
      "did",
      "will",
      "would",
      "could",
      "should",
      "may",
      "might",
      "can",
      "i",
      "you",
      "he",
      "she",
      "it",
      "we",
      "they",
    ];
    return stopwords.includes(word);
  }

  /**
   * A/B test caption variations
   */
  createABTest({
    contentA,
    contentB,
    platform,
    scheduledTime,
    splitPercentage = 50,
  }) {
    const testId = `test_${Date.now()}`;

    const test = {
      testId,
      variants: [
        {
          id: `${testId}_a`,
          content: contentA,
          platform,
          scheduledTime,
          variant: "A",
          impressions: 0,
          clicks: 0,
        },
        {
          id: `${testId}_b`,
          content: contentB,
          platform,
          scheduledTime,
          variant: "B",
          impressions: 0,
          clicks: 0,
        },
      ],
      splitPercentage,
      status: "created",
      createdAt: new Date(),
    };

    // Store test
    const schedule = this.storage.getSchedule();
    schedule.push(test);
    this.storage.saveSchedule(schedule);

    return {
      success: true,
      testId,
      message: `A/B test created with ${splitPercentage}% split`,
    };
  }

  /**
   * Get posting analytics (placeholder for Postfox API integration)
   */
  async getAnalytics(postId) {
    // This would integrate with Postfox API in production
    const schedule = this.storage.getSchedule();
    const post = schedule.find((p) => p.id === postId);

    if (!post) {
      return { success: false, error: "Post not found" };
    }

    return {
      success: true,
      postId,
      analytics: {
        impressions: 0,
        clicks: 0,
        shares: 0,
        comments: 0,
        platform: post.platforms[0],
        scheduledTime: post.scheduledTime,
        note: "Analytics require Postfox API integration",
      },
    };
  }

  /**
   * Export schedule for backup
   */
  exportSchedule(format = "json") {
    const schedule = this.storage.getSchedule();

    if (format === "csv") {
      const headers = ["ID", "Content", "Platforms", "Scheduled Time", "Status"];
      const rows = schedule.map((p) => [
        p.id,
        `"${p.content.replace(/"/g, '""')}"`,
        p.platforms.join(";"),
        p.scheduledTime,
        p.status,
      ]);
      const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
      return csv;
    }

    return JSON.stringify(schedule, null, 2);
  }
}

// Export
if (typeof window !== "undefined") {
  window.PostfoxAutomationHelper = PostfoxAutomationHelper;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = PostfoxAutomationHelper;
}
