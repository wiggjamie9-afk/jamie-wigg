import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/supabase';

type Event = Database['public']['Tables']['events']['Row'];

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch initial events
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (fetchError) throw fetchError;
      setEvents(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch events'));
    } finally {
      setLoading(false);
    }
  }, []);

  // Subscribe to real-time updates
  useEffect(() => {
    fetchEvents();

    // Real-time subscription: listen for INSERT, UPDATE, DELETE
    const subscription = supabase
      .from('events')
      .on('*', (payload) => {
        if (payload.eventType === 'INSERT') {
          setEvents((prev) => [...prev, payload.new as Event]);
        } else if (payload.eventType === 'UPDATE') {
          setEvents((prev) =>
            prev.map((e) => (e.id === payload.new.id ? (payload.new as Event) : e))
          );
        } else if (payload.eventType === 'DELETE') {
          setEvents((prev) => prev.filter((e) => e.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchEvents]);

  const createEvent = useCallback(
    async (event: Database['public']['Tables']['events']['Insert']) => {
      try {
        const { data, error: createError } = await supabase
          .from('events')
          .insert([event])
          .select()
          .single();

        if (createError) throw createError;
        return data;
      } catch (err) {
        throw err instanceof Error ? err : new Error('Failed to create event');
      }
    },
    []
  );

  const updateEvent = useCallback(
    async (id: string, updates: Database['public']['Tables']['events']['Update']) => {
      try {
        const { data, error: updateError } = await supabase
          .from('events')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (updateError) throw updateError;
        return data;
      } catch (err) {
        throw err instanceof Error ? err : new Error('Failed to update event');
      }
    },
    []
  );

  const deleteEvent = useCallback(async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete event');
    }
  }, []);

  return {
    events,
    loading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
  };
}
