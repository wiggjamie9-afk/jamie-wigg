# Sunny's Cozy Quokka Bedtime Tales - Web App

A beautiful, mobile-first web application for browsing, reading, and purchasing Sunny's Cozy Quokka Bedtime Tales.

## Features

✨ **Story Discovery**
- Browse all 149+ episodes in a beautiful grid
- Responsive design works on mobile, tablet, and desktop
- Fast-loading thumbnails and covers

📖 **Story Reader**
- Full story text and narration
- Scene gallery with descriptions
- Product purchase links

🛍️ **Shopping Integration**
- Direct links to Gumroad and Etsy
- Product showcase for ebooks, coloring books, phonics books
- Pricing and call-to-actions

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (or npm)

### Installation

```bash
cd sunny-app
pnpm install
```

### Development

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
pnpm build
pnpm start
```

## Project Structure

```
sunny-app/
├── app/
│   ├── api/
│   │   └── episodes/         # API routes for episodes
│   ├── episodes/
│   │   └── [id]/
│   │       └── page.tsx      # Individual episode page
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── lib/
│   └── episodes.ts           # Episode data utilities
├── components/               # Reusable React components
└── public/                   # Static assets
```

## Data Source

The app automatically reads episodes from `../kids-channel/episodes/` directory. Each episode should contain:
- `script.json` - Episode metadata (title, description, narration, scenes)
- `thumbnail.jpg` - Cover thumbnail
- `cover.jpg` - Full cover image

## Styling

Uses Tailwind CSS with custom Sunny-themed colors:
- `sunny-brown` (#654321) - Primary text color
- `sunny-gold` (#D4A574) - Accent color
- Warm, cozy gradient backgrounds

## Deployment

### GitHub Pages
```bash
pnpm build
# Output is in out/ directory
git add out/
git commit -m "Build: Sunny app"
git push
```

### Vercel
Connect your repository to Vercel for automatic deployments on git push.

## Features to Add

- [ ] Audio narration playback
- [ ] Audiobook integration
- [ ] Email signup form (ConvertKit integration)
- [ ] Purchase complete bundles
- [ ] Print-friendly coloring books
- [ ] Interactive phonics lessons
- [ ] Dark mode
- [ ] Multi-language support
- [ ] Offline reading (PWA)
- [ ] Parent dashboard with reading stats

## License

© 2024 Jamie Wigg. All rights reserved.
