/**
 * Type definitions for agent-builder database schema
 */

// Users & Auth
export interface User {
  id: string;
  email: string;
  name: string | null;
  tier: 'starter' | 'pro' | 'addon';
  created_at: string;
  updated_at: string;
}

// Projects
export interface Project {
  id: string;
  user_id: string;
  agent_type: string;
  config: Record<string, any>;
  tier: string;
  created_at: string;
  updated_at: string;
}

// Purchases & Licensing
export interface UserPurchase {
  id: string;
  user_id: string;
  app_id: string;
  app_name: string;
  category?: string;
  license_key: string;
  purchased_at: string;
  expires_at?: string;
  is_premium: boolean;
  is_lifetime: boolean;
  gumroad_transaction_id?: string;
  gumroad_product_id?: string;
  price_paid: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface LicenseValidation {
  id: string;
  license_key: string;
  last_validated: string;
  is_valid: boolean;
  device_fingerprint?: string;
  last_used_at?: string;
  validation_count: number;
}

export interface PremiumFeature {
  id: string;
  purchase_id: string;
  feature_name: string;
  enabled: boolean;
  activated_at: string;
}

// Subscriptions
export interface Subscription {
  id: string;
  user_id: string;
  tier: 'free' | 'pro' | 'premium';
  status: 'active' | 'paused' | 'cancelled';
  started_at: string;
  renews_at?: string;
  stripe_subscription_id?: string;
  price_monthly?: number;
  currency: string;
  cancelled_at?: string;
  created_at: string;
  updated_at: string;
}

// Analytics
export interface AppSession {
  id: string;
  purchase_id: string;
  app_id: string;
  session_start: string;
  session_end?: string;
  duration_seconds?: number;
  user_agent?: string;
  ip_address?: string;
  country?: string;
  is_premium_user: boolean;
  created_at: string;
}

export interface RevenueEvent {
  id: string;
  user_id?: string;
  event_type: 'purchase' | 'subscription' | 'refund' | 'upgrade';
  app_id?: string;
  amount: number;
  currency: string;
  source: 'gumroad' | 'stripe' | 'direct';
  gumroad_transaction_id?: string;
  stripe_transaction_id?: string;
  metadata: Record<string, any>;
  recorded_at: string;
  created_at: string;
}

// App Metadata
export interface AppMetadata {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  app_type: string;
  estimated_status: 'functional' | 'unknown';
  recommended_price: number;
  icon_emoji?: string;
  icon_url?: string;
  features: string[];
  free_features: string[];
  premium_features: string[];
}

// Dashboard Card
export interface AppCard extends UserPurchase {
  metadata?: Partial<AppMetadata>;
  sessions_count?: number;
  last_used?: string;
}
