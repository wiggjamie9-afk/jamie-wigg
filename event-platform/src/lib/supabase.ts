import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Database = {
  public: {
    Tables: {
      events: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          title: string;
          description: string;
          date: string;
          time: string;
          location: string;
          latitude: number | null;
          longitude: number | null;
          organizer_id: string;
          attendees_count: number;
        };
        Insert: {
          title: string;
          description?: string;
          date: string;
          time: string;
          location: string;
          latitude?: number;
          longitude?: number;
          organizer_id?: string;
        };
        Update: {
          title?: string;
          description?: string;
          date?: string;
          time?: string;
          location?: string;
          latitude?: number;
          longitude?: number;
        };
      };
      attendees: {
        Row: {
          id: string;
          event_id: string;
          user_id: string;
          created_at: string;
          status: 'attending' | 'interested' | 'cancelled';
        };
        Insert: {
          event_id: string;
          user_id: string;
          status?: 'attending' | 'interested' | 'cancelled';
        };
        Update: {
          status?: 'attending' | 'interested' | 'cancelled';
        };
      };
    };
  };
};
