// User types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  subscription: 'free' | 'pro' | 'studio';
}

// Content types
export type ContentType = 'video' | 'music' | 'image';
export type AspectRatio = '16:9' | '9:16' | '1:1';
export type VideoDuration = '15s' | '30s' | '60s';

export interface GeneratedContent {
  id: string;
  userId: string;
  type: ContentType;
  title: string;
  description: string;
  prompt: string;
  url: string;
  thumbnail?: string;
  duration?: number;
  size: number;
  createdAt: Date;
  updatedAt: Date;
}

// Scheduling types
export type Platform = 'twitter' | 'instagram' | 'tiktok' | 'youtube' | 'linkedin' | 'facebook';

export interface ScheduledPost {
  id: string;
  userId: string;
  contentId?: string;
  title: string;
  description: string;
  caption: string;
  platforms: Platform[];
  scheduleTime: Date;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  mediaUrls?: string[];
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

// Analytics types
export interface PostAnalytics {
  id: string;
  postId: string;
  platform: Platform;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  clicks: number;
  impressions: number;
  engagement_rate: number;
  timestamp: Date;
}

export interface CreatorAnalytics {
  userId: string;
  totalViews: number;
  totalEngagements: number;
  totalFollowers: number;
  avgEngagementRate: number;
  topPost: ScheduledPost;
  period: 'day' | 'week' | 'month';
}

// Subscription types
export type SubscriptionTier = 'free' | 'pro' | 'studio';

export interface SubscriptionPlan {
  tier: SubscriptionTier;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  generationLimits: {
    video: number;
    music: number;
    image: number;
  };
  schedulingPlatforms: number;
  analyticsRetention: number; // days
}

// Monetization types
export type MonetizationMethod = 'membership' | 'sponsorship' | 'tips' | 'affiliate';

export interface MonetizationEarning {
  id: string;
  userId: string;
  method: MonetizationMethod;
  amount: number;
  currency: string;
  description: string;
  createdAt: Date;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
