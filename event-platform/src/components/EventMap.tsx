'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

interface Event {
  id: string;
  title: string;
  location: string;
  date: string;
  latitude?: number;
  longitude?: number;
}

interface EventMapProps {
  events: Event[];
  height?: string;
}

// Dynamically import Leaflet (required for SSR)
const DynamicMap = dynamic(
  () => import('./MapContent'),
  {
    loading: () => <div className="w-full bg-gray-200 rounded-lg flex items-center justify-center" style={{ height: '500px' }}>Loading map...</div>,
    ssr: false,
  }
);

export function EventMap({ events, height = '500px' }: EventMapProps) {
  const validEvents = useMemo(() => {
    return events.filter(e => e.latitude && e.longitude);
  }, [events]);

  if (validEvents.length === 0) {
    return (
      <div className="w-full rounded-lg bg-gray-100 dark:bg-gray-800 p-6 text-center" style={{ height }}>
        <p className="text-gray-600 dark:text-gray-400">
          No events with location data yet
        </p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600" style={{ height }}>
      <DynamicMap events={validEvents} />
    </div>
  );
}
