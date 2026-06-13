# Event Platform

A community-first event discovery and creation platform with cross-device sync (iPhone ↔ MacBook).

## Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS 4
- **Styling:** Two-color theming (base + accent) via CSS vars, dark mode support
- **Mobile:** Capacitor 8 (iOS wrapper)
- **Backend:** Supabase (real-time sync, auth, database)
- **PWA:** Service worker, manifest.json, offline-capable

## Features

✅ Browse and discover events  
✅ Create and manage events  
✅ Cross-device sync (iPhone ↔ MacBook via Supabase)  
✅ Two-color theming (5 preset themes)  
✅ Light/dark mode  
✅ Responsive design (mobile-first)  
✅ Offline-first capability  

## Getting Started

### Web Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### iOS Native App (iPhone/iPad)

```bash
# Initialize Capacitor (one-time)
npm run cap:init

# Add iOS platform
npm run cap:add:ios

# Sync web build → native project
npm run build
npm run cap:sync

# Open Xcode to build/run on device
npm run cap:open:ios
```

## Project Structure

```
event-platform/
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Home page (events list + create)
│   │   └── globals.css     # Two-color theming + styling
│   ├── components/
│   │   ├── EventList.tsx
│   │   ├── EventCard.tsx
│   │   ├── EventForm.tsx
│   │   ├── Navigation.tsx
│   │   └── ThemeToggle.tsx  # Theme preset + dark mode toggle
│   └── lib/
│       └── (Supabase client, types, etc.)
├── public/
│   └── manifest.json       # PWA metadata
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── capacitor.config.json   # Capacitor settings (generated)
```

## Theming

The platform uses **CSS custom properties** for theming. Customize via `ThemeToggle` component or directly:

```css
:root {
  --color-base: #e8f4f8;      /* Background */
  --color-accent: #0891b2;    /* Interactive elements */
}
```

5 preset themes available:
- Mist Cyan (default)
- Lavender
- Rose
- Amber
- Slate

## Supabase Setup

TODO: Wire up Supabase real-time subscriptions for iPhone ↔ MacBook sync.

```bash
npm install @supabase/supabase-js
```

## Deployment

### Web
```bash
npm run build
# Deploy `out/` to GitHub Pages, Vercel, Cloudflare Pages, etc.
```

### iOS App
Deploy via Xcode → App Store or TestFlight.

## Contributing

See `/CLAUDE.md` for project guidelines.

---

**Branch:** `claude/event-platform-design-f3b0df`
