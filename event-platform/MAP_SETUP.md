# Maps Integration Guide

Events are now displayed on an interactive map. Users can see all events with location data plotted on OpenStreetMap.

## What's New

### Features
- **Interactive Map** — Pan, zoom, click events to see details
- **Geolocation** — Users can click 📍 to auto-detect their location
- **Coordinates** — Latitude/longitude stored in Supabase
- **Real-time** — New events appear on map instantly across devices

### Components
- `EventMap.tsx` — Main map wrapper component
- `MapContent.tsx` — Leaflet map rendering (client-side only)
- Geolocation button in `EventForm.tsx`

## Setup

### 1. Install Dependencies

Maps use Leaflet (open-source, free):

```bash
npm install leaflet react-leaflet
```

Already added to `package.json`, just run:

```bash
npm install
```

### 2. Update Supabase Schema

Add location columns to events table:

```bash
# In Supabase SQL Editor, run:
ALTER TABLE events ADD COLUMN IF NOT EXISTS latitude FLOAT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS longitude FLOAT;

# Add index for location queries
CREATE INDEX IF NOT EXISTS events_location_idx ON events(latitude, longitude);
```

Or use the updated schema in `supabase/schema.sql`.

### 3. Browser Permissions

Maps require geolocation permission. Users will see a permission prompt when clicking the 📍 button.

## Usage

### Creating Events with Locations

1. Enter event title
2. Click 📍 button next to location field
3. Browser asks for permission
4. Coordinates auto-fill (e.g., "51.5074, -0.1278")
5. Optionally edit location name
6. Submit event

### Viewing Map

The map appears above the event list showing all events with coordinates.

- **Click marker** → see event details in popup
- **Zoom/pan** → explore the area
- **Responsive** — map adjusts size based on screen

## API & TypeScript

### Event Type

```typescript
interface Event {
  id: string;
  title: string;
  location: string;
  date: string;
  latitude?: number;      // New
  longitude?: number;     // New
  description?: string;
}
```

### Using EventMap Component

```tsx
import { EventMap } from '@/components/EventMap';

export function MyPage({ events }) {
  return (
    <div>
      <EventMap events={events} height="500px" />
    </div>
  );
}
```

## Map Behavior

### Zoom Level
- Automatically adjusts based on event spread
- 1 event → zoom 15 (close-up)
- 10+ events → zoom 10 (wider view)

### Center
- Map center = average of all event coordinates
- Keeps all events visible by default

### Markers
- Standard red pin icons
- Click to see event title, location, date
- Auto-sized for viewport

## Mobile/iOS

Geolocation works on iOS via Capacitor:

1. Build app: `npm run build && npm run cap:sync`
2. Open Xcode: `npm run cap:open:ios`
3. Build & run on device
4. App requests location permission (iOS system dialog)
5. Permission granted → geolocation works

## Styling

Maps inherit theme colors but use OpenStreetMap's default style. To customize:

### Dark Mode Support

Maps automatically use light/dark tiles based on system preference (customizable in `MapContent.tsx`).

### Custom Styling

Edit `MapContent.tsx` to change:
- Tile provider (currently OpenStreetMap)
- Marker colors/icons
- Popup styling

## Performance

- **Leaflet** — lightweight (~40KB gzipped)
- **OpenStreetMap tiles** — cached by browser
- **No backend API needed** — pure client-side
- **Real-time updates** — via Supabase subscriptions

## Troubleshooting

### "Map not showing"
- Ensure events have `latitude` and `longitude` values
- Check browser console for errors
- Verify Leaflet CSS loaded (`leaflet/dist/leaflet.css`)

### "Geolocation not working"
- Check browser permissions (Settings → Privacy)
- Must be served over HTTPS in production (localhost works)
- User must grant permission when prompted

### "Markers not visible"
- Map might be zoomed too far out
- Check that events have valid coordinate ranges (-180 to 180 for longitude, -90 to 90 for latitude)

### "Tile layer not loading"
- OpenStreetMap might be temporarily unavailable
- Map still works, just shows blank tiles
- Try refreshing page

## Advanced: Geofencing & Location Search

Future features (not yet implemented):

```typescript
// Future: Find events within radius
const nearbyEvents = events.filter(e => {
  const distance = calculateDistance(userLat, userLng, e.latitude, e.longitude);
  return distance < 5; // 5km radius
});
```

## Resources

- **Leaflet docs** — https://leafletjs.com/
- **React-Leaflet docs** — https://react-leaflet.js.org/
- **OpenStreetMap** — https://www.openstreetmap.org/
- **Geolocation API** — https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API

---

Maps are fully integrated. Test on http://localhost:3000 and on iOS with Xcode build.
