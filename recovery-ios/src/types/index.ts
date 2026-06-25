/**
 * Recovery iOS — Type definitions
 * Shared types for API client and UI components
 */

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface AthleteProfile {
  id: string;
  user_id: string;
  team_id?: string;
  display_name: string;
  date_of_birth: string;
  sport: string;
  position?: string;
  created_at: string;
  updated_at: string;
}

export interface Injury {
  id: string;
  athlete_id: string;
  icd10_code: string;
  diagnosis: string;
  onset_date: string;
  severity: number; // 1-5
  location: string;
  baseline_pain: number;
  baseline_rom: number;
  closed_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  demo_url?: string;
  notes?: string;
}

export interface RehabProtocol {
  id: string;
  injury_id: string;
  provider_id: string;
  name: string;
  estimated_duration_days: number;
  exercises: Exercise[];
  start_date: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface DailyCheckIn {
  id: string;
  injury_id: string;
  date: string;
  pain_scale: number; // 0-10
  rom_percentage: number; // 0-100
  exercises_completed: number;
  exercises_total: number;
  notes?: string;
  photo_url?: string;
  synced: boolean;
  created_at: string;
  updated_at: string;
}

export type AlertType = 'pain_spike' | 'rom_regression' | 'missed_checkin' | 'low_adherence';
export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface Alert {
  id: string;
  injury_id: string;
  alert_type: AlertType;
  severity: AlertSeverity;
  message: string;
  metadata: Record<string, any>;
  coach_notified: boolean;
  coach_response?: string;
  acknowledged_at?: string;
  created_at: string;
}

export interface PushSubscription {
  id: string;
  user_id: string;
  fcm_token: string;
  device_info: {
    os: string;
    os_version: string;
    device_model: string;
  };
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface NotificationPreferences {
  user_id: string;
  reminder_time: string; // HH:MM
  quiet_hours_start?: string;
  quiet_hours_end?: string;
  alert_frequency: 'immediate' | 'daily_digest' | 'none';
  created_at: string;
  updated_at: string;
}

/**
 * API Response wrapper for consistency
 */
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

/**
 * Offline sync queue item
 */
export interface SyncQueueItem {
  id: string;
  endpoint: string;
  method: 'POST' | 'PATCH' | 'DELETE';
  payload: any;
  timestamp: number;
  retries: number;
  max_retries: number;
  last_error?: string;
}
