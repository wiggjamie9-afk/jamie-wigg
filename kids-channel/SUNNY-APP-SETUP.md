# Sunny's Cozy Quokka App - Setup & Deployment

A beautiful, modern web app for showcasing and selling all 149+ Sunny bedtime stories.

---

## 📱 What is the Sunny App?

The Sunny App is a Next.js web application that:

✨ **Displays all 149+ episodes** in a beautiful, responsive grid interface
- Mobile-first design optimized for phones, tablets, and desktop
- Fast page loads with optimized image thumbnails
- Professional, cozy aesthetic matching the brand

📖 **Lets users explore stories**
- Browse story collections with covers and descriptions
- Read full story text for each episode
- View scene descriptions and artwork prompts
- See tags and search keywords

🛍️ **Drives sales**
- Direct links to Gumroad, Etsy, Amazon KDP
- Product showcase: ebooks, coloring books, phonics books, audiobooks
- Pricing displayed clearly ($3.99-$4.99 per product)
- Bundles and special offers

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd sunny-app
npm install
# or
pnpm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production

```bash
npm run build
npm start
```

---

## 🏗️ Architecture

```
sunny-app/
├── app/                          # Next.js 13+ App Router
│   ├── api/
│   │   └── episodes/             # API endpoints for fetching episodes
│   │       ├── route.ts          # GET /api/episodes - all episodes
│   │       └── [id]/route.ts     # GET /api/episodes/[id] - single episode
│   ├── episodes/
│   │   └── [id]/
│   │       └── page.tsx          # Individual episode reader page
│   ├── globals.css               # Global Tailwind styles
│   ├── layout.tsx                # Root HTML layout
│   └── page.tsx                  # Home page with grid of episodes
├── lib/
│   └── episodes.ts               # Utility functions for loading episode data
├── components/                   # Reusable React components (future)
├── public/                       # Static assets
├── next.config.js                # Next.js config (static export)
├── tailwind.config.js            # Tailwind CSS config
├── tsconfig.json                 # TypeScript config
└── package.json                  # Dependencies

Data Source:
../kids-channel/episodes/         # 149 episode folders
  ├── ep01-sunny-watches-the-stars/
  │   ├── script.json             # Title, description, narration, scenes
  │   ├── thumbnail.jpg           # Episode cover (used in grid)
  │   ├── cover.jpg               # Full cover (used on episode page)
  │   ├── scene_01.jpg through scene_06.jpg
  │   └── final.mp4               # (Optional) video file
  ├── sunny-and-the-autumn-leaves/
  └── ... (149 total)
```

---

## 🎨 Design System

**Colors:**
- `sunny-brown` (#654321) - Primary text, headings
- `sunny-gold` (#D4A574) - Accents, hover states
- `sunny-sky` (#1a3a52) - Deep backgrounds (future)

**Typography:**
- Headings: Bold system fonts
- Body: Regular system fonts
- Clean, readable hierarchy

**Layout:**
- Mobile-first responsive design
- 4-column grid on desktop, 2 on tablet, 1 on mobile
- Generous padding and spacing for readability

---

## 🔄 How It Works

### 1. **Home Page** (`app/page.tsx`)
```
- Hero section with app branding
- Hero call-to-action buttons (Gumroad, Etsy)
- Grid of all 149 episodes with:
  - Thumbnail image
  - Title
  - Short description
  - Click to read
- Product showcase (3 columns):
  - Colored Ebook ($3.99)
  - Coloring Book ($2.99)
  - Phonics Book ($3.99)
```

### 2. **Episode Page** (`app/episodes/[id]/page.tsx`)
```
- Cover image (left)
- Title, description, tags (right)
- Buy buttons (Gumroad, Etsy)
- Tabs:
  - Story: Full narration text
  - Scenes: 6 scene cards with descriptions
- All 6 products with pricing
```

### 3. **API Routes**
- `GET /api/episodes` → Returns array of all episodes with metadata
- `GET /api/episodes/[id]` → Returns single episode with full script

---

## 📊 Data Flow

```
kids-channel/episodes/
  └─ script.json (title, description, narration, scenes)
        ↓
    API route loads JSON
        ↓
    React component renders episode
        ↓
    User sees story with purchase links
        ↓
    Click "Buy on Gumroad" → gumroad.com
```

---

## 🚀 Deployment

### Option 1: Vercel (Recommended)
```bash
npm i -g vercel
vercel
```
- Auto-deploys on git push
- Custom domain: `sunny.app` or `stories.sunnyquokka.com`
- Free tier includes 100 deployments/month

### Option 2: GitHub Pages
```bash
# Build static export
npm run build

# Output in ./out/ directory
# Configure for GitHub Pages
```

### Option 3: Netlify
```bash
npm i -g netlify-cli
netlify deploy --prod
```

---

## 🔧 Configuration

### next.config.js
```javascript
output: 'export'  // Static HTML export (no server needed)
images: {
  unoptimized: true  // No image optimization (works with static export)
}
```

### API Integration
The app automatically reads from `../kids-channel/episodes/`. To change:

**lib/episodes.ts:**
```typescript
const EPISODES_DIR = path.join(process.cwd(), '..', 'kids-channel', 'episodes')
```

---

## 📈 Conversion Paths

### Home Page → Story Page
```
User browsing grid
    ↓
Click episode cover
    ↓
Episode page loads with full story
    ↓
See "Buy" buttons for ebook, coloring book, audiobook, phonics
    ↓
Click Gumroad/Etsy link
    ↓
Purchase on external platform
```

### Email Signup Path (Future)
```
User on home page
    ↓
"Get free Episode #1" popup
    ↓
Enter email → ConvertKit
    ↓
Receive Episode #1 PDF bundle
    ↓
Receive weekly emails with new episodes
    ↓
Click buy links in emails
    ↓
Purchase on Gumroad/Etsy
```

---

## 🎯 Key Metrics to Track

**Traffic:**
- Total sessions
- Unique visitors
- Device breakdown (mobile vs desktop)
- Traffic source (organic, direct, ads)

**Engagement:**
- Avg. time on home page
- Avg. time on episode page
- Most viewed episodes
- Click-through rate to purchase sites

**Conversions:**
- Episodes clicked
- Purchase links clicked
- Purchase completion rate (on Gumroad/Etsy side)
- Email signups (when integrated)

---

## 🚀 Future Enhancements

### Phase 1 (MVP - Current)
- ✅ Episode grid with covers
- ✅ Individual episode pages
- ✅ Links to Gumroad/Etsy
- ✅ Product showcase

### Phase 2 (Email + Community)
- 🔲 ConvertKit email signup popup
- 🔲 Episode #1 free download
- 🔲 Email nurture sequences
- 🔲 Subscriber-only content

### Phase 3 (Engagement)
- 🔲 Audio narration playback
- 🔲 Interactive reading progress
- 🔲 Coloring book preview (in-browser)
- 🔲 Phonics lesson interactive mode
- 🔲 Favorites / reading list

### Phase 4 (Monetization)
- 🔲 In-app purchases (Stripe)
- 🔲 Subscription for unlimited access
- 🔲 Audiobook streaming
- 🔲 Ad-supported free tier

### Phase 5 (Platform)
- 🔲 PWA (offline reading)
- 🔲 iOS/Android app (React Native or Expo)
- 🔲 Parental controls / age settings
- 🔲 Reading stats dashboard
- 🔲 Social sharing / referral program

---

## 🎁 Products & Pricing

| Product | Price | File | Platform |
|---------|-------|------|----------|
| Colored Ebook | $3.99 | `*.pdf` | Gumroad, Etsy, KDP, Draft2Digital |
| Coloring Book | $2.99 | `*_coloring.pdf` | Gumroad, Etsy, KDP, Draft2Digital |
| Phonics Book | $3.99 | `phonics_*.pdf` | TpT, Gumroad, Etsy, KDP |
| Audiobook | $4.99 | `*.mp3` | Audible/ACX, Apple Books, Google Play |
| Bundle (Ebook + Coloring) | $5.99 | Combined PDF | Gumroad, Etsy |
| Complete Phonics Set (26) | $49.99 | All phonics books | All platforms |

---

## 🔐 Security & Privacy

- No user data stored (static export)
- No cookies or tracking (by default)
- External links to Gumroad/Etsy (verified)
- GDPR compliant (no data collection)
- Optional: Google Analytics for traffic (users consent to cookies)

---

## 📝 Testing Checklist

- [ ] Home page loads and displays episodes
- [ ] Episode grid responsive on mobile/tablet/desktop
- [ ] Each episode has cover image showing
- [ ] Click episode → episode page loads
- [ ] Episode page shows title, description, story text
- [ ] Buy buttons link to correct platforms
- [ ] Product section shows all 3-4 products
- [ ] "Back" button returns to home
- [ ] No console errors or warnings
- [ ] Page load time < 2 seconds

---

## 🐛 Troubleshooting

### Episodes not loading
```bash
# Check if kids-channel/episodes/ directory exists
ls ../kids-channel/episodes/

# Check if script.json files exist
find ../kids-channel/episodes -name "script.json" | head -5
```

### Images not showing
```bash
# Check if thumbnails exist
find ../kids-channel/episodes -name "thumbnail.jpg" | head -5

# In next.config.js: images.unoptimized should be true
```

### Build errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install

# Try build again
npm run build
```

---

## 📚 Development Resources

- **Next.js Docs:** https://nextjs.org/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **React Docs:** https://react.dev
- **Vercel Deployment:** https://vercel.com/docs

---

## 📞 Support

For questions or issues:
1. Check the troubleshooting section above
2. Review the Next.js documentation
3. Check GitHub Issues for similar problems
4. Create a new issue with error logs and steps to reproduce

---

**Bottom Line:** The Sunny App is a beautiful, responsive web experience that showcases all 149+ stories and drives sales to Gumroad, Etsy, and other platforms. It's designed to be fast, mobile-friendly, and easy to maintain. 🦘✨
