/**
 * Recovery iOS — Zod validation schemas
 * All API request/response payloads validated here
 */

import { z } from 'zod';

// ============================================================================
// AUTH SCHEMAS
// ============================================================================

export const RegisterRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  sport: z.string().min(1, 'Sport is required'),
  team_id: z.string().optional(),
});
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;

export const SignInRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});
export type SignInRequest = z.infer<typeof SignInRequestSchema>;

export const AuthResponseSchema = z.object({
  user_id: z.string().uuid(),
  email: z.string().email(),
  token: z.string(),
  expires_at: z.string().datetime(),
});
export type AuthResponse = z.infer<typeof AuthResponseSchema>;

// ============================================================================
// ATHLETE SCHEMAS
// ============================================================================

export const AthleteProfileSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  team_id: z.string().uuid().optional(),
  display_name: z.string().min(1, 'Name is required'),
  date_of_birth: z.string().date(),
  sport: z.string().min(1, 'Sport is required'),
  position: z.string().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type AthleteProfile = z.infer<typeof AthleteProfileSchema>;

export const CreateAthleteRequestSchema = z.object({
  display_name: z.string().min(1, 'Name is required').max(100),
  date_of_birth: z.string().date(),
  sport: z.string().min(1, 'Sport is required').max(50),
  position: z.string().optional().max(50),
});
export type CreateAthleteRequest = z.infer<typeof CreateAthleteRequestSchema>;

export const UpdateAthleteRequestSchema = z.object({
  display_name: z.string().min(1).max(100).optional(),
  date_of_birth: z.string().date().optional(),
  sport: z.string().min(1).max(50).optional(),
  position: z.string().max(50).optional(),
});
export type UpdateAthleteRequest = z.infer<typeof UpdateAthleteRequestSchema>;

// ============================================================================
// INJURY SCHEMAS
// ============================================================================

export const InjurySchema = z.object({
  id: z.string().uuid(),
  athlete_id: z.string().uuid(),
  icd10_code: z.string().regex(/^[A-Z]\d{2}(\.\d{1,2})?$/, 'Invalid ICD-10 code'),
  diagnosis: z.string().min(1),
  onset_date: z.string().date(),
  severity: z.number().int().min(1).max(5),
  location: z.string().min(1),
  baseline_pain: z.number().int().min(0).max(10),
  baseline_rom: z.number().int().min(0).max(100),
  closed_date: z.string().date().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type Injury = z.infer<typeof InjurySchema>;

export const CreateInjuryRequestSchema = z.object({
  athlete_id: z.string().uuid('Invalid athlete ID'),
  icd10_code: z.string().regex(/^[A-Z]\d{2}(\.\d{1,2})?$/, 'Invalid ICD-10 code format'),
  diagnosis: z.string().min(1, 'Diagnosis is required').max(500),
  onset_date: z.string().date(),
  severity: z.number().int().min(1).max(5, 'Severity must be 1-5'),
  location: z.string().min(1, 'Location is required').max(100),
  baseline_pain: z.number().int().min(0).max(10).default(0),
  baseline_rom: z.number().int().min(0).max(100).default(100),
});
export type CreateInjuryRequest = z.infer<typeof CreateInjuryRequestSchema>;

export const UpdateInjuryRequestSchema = z.object({
  severity: z.number().int().min(1).max(5).optional(),
  location: z.string().max(100).optional(),
  closed_date: z.string().date().optional(),
});
export type UpdateInjuryRequest = z.infer<typeof UpdateInjuryRequestSchema>;

// ============================================================================
// PROTOCOL & EXERCISE SCHEMAS
// ============================================================================

export const ExerciseSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Exercise name is required'),
  sets: z.number().int().min(1),
  reps: z.number().int().min(1),
  demo_url: z.string().url().optional(),
  notes: z.string().optional(),
});
export type Exercise = z.infer<typeof ExerciseSchema>;

export const ProtocolSchema = z.object({
  id: z.string().uuid(),
  injury_id: z.string().uuid(),
  provider_id: z.string().uuid(),
  name: z.string().min(1),
  estimated_duration_days: z.number().int().min(1),
  exercises: z.array(ExerciseSchema),
  start_date: z.string().date(),
  end_date: z.string().date().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type Protocol = z.infer<typeof ProtocolSchema>;

export const CreateProtocolRequestSchema = z.object({
  injury_id: z.string().uuid('Invalid injury ID'),
  name: z.string().min(1, 'Protocol name is required').max(200),
  estimated_duration_days: z.number().int().min(1, 'Duration must be at least 1 day'),
  exercises: z.array(ExerciseSchema).min(1, 'At least one exercise is required'),
  start_date: z.string().date(),
  end_date: z.string().date().optional(),
});
export type CreateProtocolRequest = z.infer<typeof CreateProtocolRequestSchema>;

// ============================================================================
// CHECK-IN SCHEMAS
// ============================================================================

export const CheckInSchema = z.object({
  id: z.string().uuid(),
  injury_id: z.string().uuid(),
  date: z.string().date(),
  pain_scale: z.number().int().min(0).max(10),
  rom_percentage: z.number().int().min(0).max(100),
  exercises_completed: z.number().int().min(0),
  exercises_total: z.number().int().min(0),
  notes: z.string().optional(),
  photo_url: z.string().url().optional(),
  synced: z.boolean().default(true),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type CheckIn = z.infer<typeof CheckInSchema>;

export const CreateCheckInRequestSchema = z.object({
  injury_id: z.string().uuid('Invalid injury ID'),
  date: z.string().date(),
  pain_scale: z.number().int().min(0).max(10, 'Pain scale must be 0-10'),
  rom_percentage: z.number().int().min(0).max(100, 'ROM must be 0-100%'),
  exercises_completed: z.number().int().min(0),
  exercises_total: z.number().int().min(0),
  notes: z.string().max(1000).optional(),
  photo_url: z.string().url().optional(),
});
export type CreateCheckInRequest = z.infer<typeof CreateCheckInRequestSchema>;

export const UpdateCheckInRequestSchema = z.object({
  pain_scale: z.number().int().min(0).max(10).optional(),
  rom_percentage: z.number().int().min(0).max(100).optional(),
  exercises_completed: z.number().int().min(0).optional(),
  exercises_total: z.number().int().min(0).optional(),
  notes: z.string().max(1000).optional(),
  photo_url: z.string().url().optional(),
});
export type UpdateCheckInRequest = z.infer<typeof UpdateCheckInRequestSchema>;

// ============================================================================
// ALERT SCHEMAS
// ============================================================================

export const AlertTypeSchema = z.enum(['pain_spike', 'rom_regression', 'missed_checkin', 'low_adherence']);
export const AlertSeveritySchema = z.enum(['info', 'warning', 'critical']);

export const AlertSchema = z.object({
  id: z.string().uuid(),
  injury_id: z.string().uuid(),
  alert_type: AlertTypeSchema,
  severity: AlertSeveritySchema,
  message: z.string().min(1),
  metadata: z.record(z.any()).default({}),
  coach_notified: z.boolean().default(false),
  coach_response: z.string().optional(),
  acknowledged_at: z.string().datetime().optional(),
  created_at: z.string().datetime(),
});
export type Alert = z.infer<typeof AlertSchema>;

// ============================================================================
// PUSH NOTIFICATION SCHEMAS
// ============================================================================

export const PushSubscribeRequestSchema = z.object({
  fcm_token: z.string().min(1, 'FCM token is required'),
  device_info: z.object({
    os: z.string().default('iOS'),
    os_version: z.string(),
    device_model: z.string(),
  }),
});
export type PushSubscribeRequest = z.infer<typeof PushSubscribeRequestSchema>;

export const NotificationPreferencesSchema = z.object({
  user_id: z.string().uuid(),
  reminder_time: z.string().regex(/^\d{2}:\d{2}$/, 'Must be HH:MM format'),
  quiet_hours_start: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  quiet_hours_end: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  alert_frequency: z.enum(['immediate', 'daily_digest', 'none']),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type NotificationPreferences = z.infer<typeof NotificationPreferencesSchema>;

export const UpdateNotificationPreferencesSchema = z.object({
  reminder_time: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  quiet_hours_start: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  quiet_hours_end: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  alert_frequency: z.enum(['immediate', 'daily_digest', 'none']).optional(),
});
export type UpdateNotificationPreferences = z.infer<typeof UpdateNotificationPreferencesSchema>;

// ============================================================================
// PAGINATION SCHEMAS
// ============================================================================

export const PaginationQuerySchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
});
export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;

export const ListResponseSchema = <T extends z.ZodType<any, any, any>>(schema: T) =>
  z.object({
    data: z.array(schema),
    page: z.number().int(),
    limit: z.number().int(),
    total: z.number().int(),
    has_more: z.boolean(),
  });
