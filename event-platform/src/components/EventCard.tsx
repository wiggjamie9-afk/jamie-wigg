'use client';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
}

export default function EventCard({ event }: { event: Event }) {
  const eventDate = new Date(`${event.date}T${event.time}`);
  const formatted = eventDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="event-card">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-xl font-serif font-bold mb-2">{event.title}</h3>
          <p className="text-sm opacity-75 mb-3">{event.description}</p>
          <div className="space-y-1 text-sm">
            <p>
              <span className="font-semibold">When:</span> {formatted} at {event.time}
            </p>
            <p>
              <span className="font-semibold">Where:</span> {event.location}
            </p>
          </div>
        </div>
        <button className="btn-secondary whitespace-nowrap">Attend</button>
      </div>
    </div>
  );
}
