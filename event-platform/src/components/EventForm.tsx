'use client';

import { useState } from 'react';
import { AssetGenerator } from './AssetGenerator';

interface FormData {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image?: string;
  latitude?: number;
  longitude?: number;
}

export default function EventForm({
  onSubmit,
}: {
  onSubmit: (data: FormData) => void;
}) {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    image: undefined,
  });

  const [showAssetGenerator, setShowAssetGenerator] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);

  const handleGetLocation = async () => {
    setGeoLoading(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;
      setFormData((prev) => ({
        ...prev,
        latitude,
        longitude,
      }));
    } catch (error) {
      console.error('Geolocation error:', error);
      alert('Unable to get location. Please enable location permissions.');
    } finally {
      setGeoLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formData.title &&
      formData.date &&
      formData.time &&
      formData.location
    ) {
      onSubmit(formData);
      setFormData({
        title: '',
        date: '',
        time: '',
        location: '',
        description: '',
        image: undefined,
        latitude: undefined,
        longitude: undefined,
      });
      setShowAssetGenerator(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold mb-1">Event Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Community Meetup"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-accent"
          required
        />
      </div>

      {formData.title && (
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setShowAssetGenerator(!showAssetGenerator)}
            className="text-sm text-var(--color-accent) hover:underline font-medium"
          >
            {showAssetGenerator ? '✓ Hide' : '+ Generate Event Image & Description'}
          </button>

          {showAssetGenerator && (
            <AssetGenerator
              eventName={formData.title}
              eventDescription={formData.description}
              onImageGenerated={(imageUrl) =>
                setFormData((prev) => ({ ...prev, image: imageUrl }))
              }
              onScriptGenerated={(script) =>
                setFormData((prev) => ({ ...prev, description: script }))
              }
            />
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Time</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Location</label>
        <div className="flex gap-2">
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Downtown Park"
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />
          <button
            type="button"
            onClick={handleGetLocation}
            disabled={geoLoading}
            className="px-3 py-2 bg-var(--color-accent) text-white rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-50"
            title="Use your current location"
          >
            {geoLoading ? '📍' : '📍'}
          </button>
        </div>
        {formData.latitude && formData.longitude && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            📍 {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Tell us about your event..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
        />
      </div>

      <button type="submit" className="btn-primary w-full">
        Create Event
      </button>
    </form>
  );
}
