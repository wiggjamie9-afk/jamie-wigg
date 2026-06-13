'use client';

import EventCard from './EventCard';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
}

export default function EventList({ events }: { events: Event[] }) {
  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg opacity-60">No events yet. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
