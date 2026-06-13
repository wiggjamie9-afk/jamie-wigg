'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icons (required for Next.js)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface Event {
  id: string;
  title: string;
  location: string;
  date: string;
  latitude: number;
  longitude: number;
}

interface MapContentProps {
  events: Event[];
}

export default function MapContent({ events }: MapContentProps) {
  // Calculate map center (average of all event locations)
  const center: [number, number] = events.length > 0
    ? [
        events.reduce((sum, e) => sum + e.latitude, 0) / events.length,
        events.reduce((sum, e) => sum + e.longitude, 0) / events.length,
      ]
    : [51.505, -0.09];

  // Calculate zoom level based on spread
  const getZoom = () => {
    if (events.length === 0) return 13;
    if (events.length === 1) return 15;

    const lats = events.map(e => e.latitude);
    const lngs = events.map(e => e.longitude);
    const latRange = Math.max(...lats) - Math.min(...lats);
    const lngRange = Math.max(...lngs) - Math.min(...lngs);
    const maxRange = Math.max(latRange, lngRange);

    if (maxRange < 0.01) return 16;
    if (maxRange < 0.1) return 14;
    if (maxRange < 1) return 12;
    return 10;
  };

  return (
    <MapContainer
      center={center}
      zoom={getZoom()}
      style={{ width: '100%', height: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {events.map((event) => (
        <Marker
          key={event.id}
          position={[event.latitude, event.longitude]}
        >
          <Popup>
            <div className="space-y-1">
              <p className="font-semibold text-sm">{event.title}</p>
              <p className="text-xs text-gray-600">{event.location}</p>
              <p className="text-xs text-gray-500">{event.date}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
