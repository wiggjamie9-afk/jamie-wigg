/**
 * Shared TypeScript types for Buddy Builder API
 * Used across endpoints for consistency
 */

// ============================================================================
// Creator Types
// ============================================================================

export interface Creator {
  id: string; // UUID
  user_id: string; // UUID from auth system
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  stripe_account_id: string | null;
  created_at: string; // ISO8601
  updated_at: string; // ISO8601
}

export interface CreatorStats {
  creator_id: string;
  total_revenue_cents: number;
  total_templates: number;
  total_remixes: number;
  follower_count: number;
  top_templates: TopTemplate[];
}

export interface TopTemplate {
  template_id: string;
  title: string;
  remixes: number;
  revenue_cents: number;
}

// ============================================================================
// Track Types
// ============================================================================

export type AnalysisStatus = 'pending' | 'analyzing' | 'completed' | 'failed';

export interface Track {
  id: string; // UUID
  creator_id: string; // UUID
  title: string;
  artist: string | null;
  genre: string | null;
  bpm: number | null;
  key: string | null;
  duration_seconds: number | null;
  loudness_lufs: number | null;
  audio_url: string; // S3 URL
  analysis_status: AnalysisStatus;
  published: boolean;
  created_at: string; // ISO8601
  updated_at: string; // ISO8601
}

export interface AnalysisJob {
  job_id: string;
  track_id: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  analysis_results: AnalysisResults | null;
  created_at: string; // ISO8601
}

export interface AnalysisResults {
  bpm: number;
  bpm_confidence: number; // 0-1
  key: string;
  key_confidence: number; // 0-1
  loudness_lufs: number;
  duration_seconds: number;
}

// ============================================================================
// Template Types
// ============================================================================

export type LicenseType = 'personal' | 'commercial' | 'exclusive';

export interface TemplateSchema {
  canvas_width: number;
  canvas_height: number;
  elements: TemplateElement[];
  timeline: TimelineKeyframe[];
}

export interface TemplateElement {
  type: 'text' | 'image' | 'shape' | 'video';
  x: number;
  y: number;
  w: number;
  h: number;
  text?: string;
  fill?: string;
  stroke?: string;
  rotation?: number;
  opacity?: number;
  [key: string]: unknown;
}

export interface TimelineKeyframe {
  element_id: string;
  time_ms: number;
  property: string;
  value: unknown;
  easing?: string;
}

export interface Template {
  id: string; // UUID
  creator_id: string; // UUID
  track_id: string; // UUID
  title: string;
  template_schema: TemplateSchema;
  royalty_percentage: number; // 0-100
  price_cents: number;
  license_type?: LicenseType;
  published: boolean;
  version: string; // semver, e.g., "1.0.0"
  remix_count?: number;
  created_at: string; // ISO8601
  updated_at: string; // ISO8601
  published_at?: string; // ISO8601
}

export interface TemplateVersion {
  id: string;
  template_id: string;
  version: string;
  template_schema: TemplateSchema;
  published_at: string; // ISO8601
  remix_count: number;
  downloads: number;
}

// ============================================================================
// Remix Types
// ============================================================================

export type RemixStatus = 'draft' | 'published' | 'archived';

export interface Remix {
  id: string; // UUID
  creator_id: string; // UUID
  template_id: string; // UUID
  title: string;
  settings: Record<string, unknown>;
  status: RemixStatus;
  published: boolean;
  created_at: string; // ISO8601
  updated_at: string; // ISO8601
  published_at?: string; // ISO8601
}

// ============================================================================
// Royalty Types
// ============================================================================

export type RoyaltyStatus = 'pending' | 'processed' | 'paid' | 'failed';

export interface Royalty {
  id: string; // UUID
  template_id: string; // UUID
  remix_id: string; // UUID
  amount_cents: number;
  status: RoyaltyStatus;
  created_at: string; // ISO8601
  paid_at?: string; // ISO8601
}

// ============================================================================
// Collaborator Types
// ============================================================================

export interface Collaborator {
  id: string; // UUID
  template_id: string; // UUID
  user_id: string; // UUID
  email: string;
  royalty_percentage: number; // 0-100
  role: 'co-producer' | 'contributor';
  status: 'invited' | 'accepted' | 'declined';
  invite_token?: string;
  invite_expires_at?: string; // ISO8601
  created_at: string; // ISO8601
}

// ============================================================================
// Stripe Connect Types
// ============================================================================

export interface StripeAccountStatus {
  stripe_account_id: string;
  charges_enabled: boolean;
  payouts_enabled: boolean;
  requirements: {
    currently_due: string[];
    eventually_due: string[];
    past_due: string[];
  };
  onboarding_complete: boolean;
}

export interface StripeOAuthResponse {
  authorization_url: string;
  state: string;
}

// ============================================================================
// Pagination Types
// ============================================================================

export interface PaginationParams {
  limit: number; // default 50, max 100
  offset?: number; // default 0
  cursor?: string; // for cursor-based pagination
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    limit: number;
    offset?: number;
    cursor?: string;
    total?: number;
  };
}

// ============================================================================
// API Error Types
// ============================================================================

export interface ApiError {
  error: string;
  details?: string | Record<string, unknown>;
  requestId?: string;
  timestamp?: string;
}

// ============================================================================
// Filter Types
// ============================================================================

export interface DiscoveryFilters {
  category?: string;
  bpm_min?: number;
  bpm_max?: number;
  mood?: string;
  license?: LicenseType;
  sort?: 'trending' | 'newest' | 'price';
}

export interface DiscoveryResponse extends PaginatedResponse<Template> {
  filters_applied: DiscoveryFilters;
}
