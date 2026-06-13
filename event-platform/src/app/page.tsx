'use client';

import { useState } from 'react';
import EventList from '@/components/EventList';
import EventForm from '@/components/EventForm';
import Navigation from '@/components/Navigation';
import ThemeToggle from '@/components/ThemeToggle';
import { EventMap } from '@/components/EventMap';

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [events, setEvents] = useState<any[]>([
    {
      id: '1',
      title: 'Community Meetup',
      date: '2026-06-20',
      time: '18:00',
      location: 'Downtown Park',
      latitude: 51.5074,
      longitude: -0.1278,
      description: 'Join us for an evening of community connections.',
    },
    {
      id: '2',
      title: 'Tech Talk: AI & Design',
      date: '2026-06-25',
      time: '19:00',
      location: 'Creative Hub',
      latitude: 51.5148,
      longitude: -0.1247,
      description: 'Exploring the intersection of AI and creative design.',
    },
  ]);

  const handleCreateEvent = (newEvent: any) => {
    setEvents([...events, { ...newEvent, id: Date.now().toString() }]);
    setShowForm(false);
  };

  return (
    <main className="min-h-screen bg-base transition-colors duration-200">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold mb-2">Events</h1>
            <p className="text-lg opacity-75">Discover and create events in your community</p>
          </div>
          <div className="flex gap-4">
            <ThemeToggle />
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn-primary"
            >
              {showForm ? 'Cancel' : '+ Create Event'}
            </button>
          </div>
        </div>

        {showForm && (
          <div className="mb-12 p-6 rounded-lg bg-white dark:bg-slate-800 shadow-lg">
            <h2 className="text-2xl font-serif mb-4">New Event</h2>
            <EventForm onSubmit={handleCreateEvent} />
          </div>
        )}

        {events.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-serif mb-4">Events Near You</h2>
            <EventMap events={events} height="500px" />
          </div>
        )}

        <EventList events={events} />
      </div>
    </main>
  );
}
