# Buddy Builder — Design Specification

## Design Philosophy

Buddy Builder is a **creator-first** tool. Every pixel serves the producer's workflow: upload fast, monetize clear, earn visible. Inspired by Gumroad's simplicity and Bandcamp's community. Dark theme (consistent with STARLIGHTMIX Studio).

---

## Visual System

### Color Palette

| Role | Color | Usage |
|------|-------|-------|
| Primary | `#00D8FF` (cyan) | CTAs, highlights, active states |
| Secondary | `#A100F2` (purple) | Accents, secondary actions |
| Background | `#0F0F0F` (near-black) | Page background |
| Surface | `#1A1A1A` | Cards, panels, inputs |
| Text | `#E8E8E8` | Body text, primary |
| Text muted | `#8A8A8A` | Secondary text, labels |
| Success | `#00D962` | Payouts, confirmations |
| Warning | `#FFB800` | Rate limits, disputes |
| Error | `#FF4A4A` | Failures, blocks |

### Typography

| Level | Font | Size | Weight | Usage |
|-------|------|------|--------|-------|
| Display | Space Mono | 48px | Bold | Hero headlines |
| Heading 1 | Space Mono | 32px | Bold | Page titles |
| Heading 2 | Space Mono | 24px | Bold | Section headers |
| Heading 3 | Space Mono | 18px | Semi-bold | Card titles |
| Body | Inter | 16px | Regular | Paragraph text |
| Body small | Inter | 14px | Regular | Helper text, labels |
| Mono | Fira Code | 14px | Regular | Code, API responses |

### Spacing System

```
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
2xl: 48px
3xl: 64px
```

### Component Tokens

**Buttons**
- Primary CTA: `bg-cyan-500 hover:bg-cyan-600 rounded-lg px-6 py-3 font-medium`
- Secondary: `border border-slate-600 hover:border-slate-500 rounded-lg px-6 py-3`
- Danger: `bg-red-600 hover:bg-red-700`
- Disabled: `opacity-50 cursor-not-allowed`

**Inputs**
- Border: `border-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20`
- Placeholder: `text-slate-500`
- Background: `bg-slate-900 text-white`

**Cards**
- Background: `bg-slate-800 border border-slate-700 rounded-lg p-6`
- Hover: `hover:border-slate-600 hover:shadow-lg shadow-black/40`
- Elevation: `shadow-lg shadow-black/60`

---

## Pages & Flows

### 1. Creator Onboarding Flow

**URL:** `/creator/onboarding`

**Sections:**
1. Welcome (hero + CTA)
2. Sign up (email + password OR social auth)
3. Profile (display name, bio, avatar)
4. Stripe Connect (OAuth popup)
5. Confirmation

**Design notes:**
- Multi-step form (5 pages)
- Progress indicator at top (Step 1 of 5)
- Back/Next buttons
- Auto-save on each step
- 2-column layout on desktop (form left, info right)
- Mobile: full-width single-column

**Components:**
- Text input (name, bio)
- File upload (avatar, max 2 MB)
- Social auth buttons (Apple, Google, GitHub)
- Spinner during Stripe Connect auth

---

### 2. Track Upload & Management

**URL:** `/studio/tracks`

**Sections:**
1. Upload area (drag-drop or file picker)
2. Metadata form (title, artist, genre, mood)
3. Analysis results (BPM, key, loudness)
4. Playback preview (waveform + timeline)
5. Track list (published + drafts)

**Design notes:**
- Hero upload area: large drop zone, 500 MB limit indicator
- After upload: 2-column layout (metadata left, preview right)
- Analysis card shows: BPM ± accuracy, key, loudness, duration
- Track list: grid (mobile) or table (desktop), sort by date/name
- Action buttons per track: edit, delete, preview, use in template

**Components:**
- Drag-drop input with file preview
- Progress bar during upload
- Form fields: text (title, artist), select (genre, mood)
- Waveform viewer (wavesurfer.js)
- Play/pause button with time display
- Skeleton loaders during analysis

---

### 3. Template Editor & Builder

**URL:** `/studio/templates/:id/edit`

**Layout:** 3-panel (left sidebar + center canvas + right inspector)

**Left panel (Layers):**
- Scene list (v1.0, v1.1, etc.)
- Add layer button (+ Text, + Shape, + Image, + Animation)
- Layer stack with drag-to-reorder

**Center (Canvas):**
- 16:9 (1920×1080) default, tabs for other ratios
- Real-time preview (no rendering)
- Click layer to select
- Timeline at bottom with scrubber

**Right panel (Inspector):**
- Selected layer properties
- Text: font, size, color, alignment
- Shapes: fill, stroke, opacity
- Image: scale, position, rotation
- Animation: duration, easing, delay

**Design notes:**
- Inspired by Figma's 3-panel layout
- Keyboard shortcuts: Delete, Ctrl+Z (undo), Ctrl+D (duplicate)
- Auto-save every 30s with visual indicator (dot turns green)
- Preview in new tab: renders HyperFrames HTML

**Components:**
- Layer list (drag-reorderable)
- Property inputs (text, number, color picker)
- Canvas (SVG or HTML5 Canvas)
- Timeline scrubber
- Save/preview/publish buttons at top

---

### 4. Marketplace & Discovery

**URL:** `/discover`

**Sections:**
1. Hero banner ("Find templates from top creators")
2. Search bar with filter pills (genre, BPM, mood, license)
3. Sort dropdown (trending, newest, price)
4. Grid of template cards (3 columns on desktop, 1 on mobile)

**Template card:**
- Thumbnail (preview image)
- Title, creator name
- Track name (if available)
- Price (free or $X.XX)
- ★ Rating (0-5, if available)
- "Use now" or "Preview" button

**Design notes:**
- Infinite scroll (lazy-load on scroll)
- Filter sidebar (collapsible on mobile)
- Search returns results <200ms with loading skeleton
- Empty state: "No templates found. Try broader filters."

**Components:**
- Search input with autocomplete
- Filter pill buttons (toggleable)
- Dropdown (sort)
- Template card component (reusable)
- Grid layout (CSS Grid)
- Infinite scroll intersection observer

---

### 5. Creator Profile

**URL:** `/creators/:username`

**Sections:**
1. Header (avatar, display name, bio, follow/edit button)
2. Stats row (followers, templates, revenue, joined date)
3. Template gallery (4 columns, filterable)
4. About section (website link, social links, verified badge if applicable)

**Design notes:**
- If viewing own profile: "Edit profile" button
- If viewing other creator: "Follow" or "Collaborate" button
- Templates sorted by popularity (most remixed)
- Stats update in real-time if viewing own profile

---

### 6. Earnings Dashboard

**URL:** `/dashboard/earnings`

**Sections:**
1. Total balance (large, cyan-highlighted)
2. Quick stats (Today, This month, All-time)
3. Revenue chart (line graph, daily/weekly/monthly toggle)
4. Top templates (bar chart by revenue)
5. Payout history (table with status badges)
6. Withdraw button (manual request)

**Design notes:**
- Chart updates every 60s (WebSocket or polling)
- Status badges: "Pending" (yellow), "Processed" (blue), "Paid" (green)
- Minimum $10 shown in withdraw button
- Export CSV button next to header

**Components:**
- Large balance display with currency
- Stats cards (KPI style)
- Line chart (Chart.js or Recharts)
- Bar chart (top earners)
- Table with pagination
- Withdraw button (opens modal)

---

### 7. Settings & Account

**URL:** `/settings`

**Sections:**
1. Profile (name, bio, avatar, website)
2. Stripe (connected account, payout method, bank account)
3. Privacy (profile visibility, allow collaborations)
4. Notifications (email frequency, in-app alerts)
5. Danger zone (delete account)

**Design notes:**
- Stripe section: shows account status and connected bank
- Privacy toggles
- Email digest options (daily, weekly, monthly, off)
- Delete account: confirmation modal

---

## Responsive Design

### Breakpoints

- Mobile: 0-640px (single column, stacked)
- Tablet: 641-1024px (2 columns)
- Desktop: 1025px+ (3+ columns)

### Mobile-specific adjustments

- Template cards: 1 per row (full width with margin)
- Left sidebar in editor: collapse to bottom panel (swipe-up)
- Charts: vertical orientation
- Buttons: minimum 48px height (touch target)

---

## Animations & Interactions

### Micro-interactions

**Buttons**
- Hover: scale 1.02, shadow increase
- Active: scale 0.98, color shift
- Disabled: opacity 50%

**Cards**
- Hover: border-color change, shadow increase
- Transition: all 200ms cubic-bezier(0.2, 0, 0.38, 0.9)

**Modals**
- Entrance: fade-in (opacity 0 → 1, 200ms)
- Backdrop: overlay with click-to-close

**Loading states**
- Skeleton loaders (pulse animation)
- Spinners (rotating icon, cyan)

### Page transitions

- Fade-in on route change (200ms)
- Stagger child animations (100ms delay per item)

---

## Accessibility

### WCAG 2.1 AA Compliance

- Color contrast: 4.5:1 minimum for text
- Focus indicators: cyan ring on all interactive elements
- Alt text on all images and icons
- Aria labels on form inputs
- Keyboard navigation: Tab through all controls

### Screen reader

- Semantic HTML (`<button>`, `<label>`, etc.)
- ARIA roles and live regions for updates
- Form labels associated with inputs

---

## Dark Mode (default)

All colors specified above are for dark mode. Light mode is **not planned** for Wave 2 (defer to Phase 2j).

---

## Component Library (Reusable)

- Button (primary, secondary, danger, disabled states)
- Input (text, email, number, select)
- Card (container with optional header/footer)
- Modal (centered, with backdrop)
- Tabs (switchable sections)
- Dropdown (select with options)
- Spinner (loading indicator)
- Toast (notifications: success, error, warning)
- Badge (status labels)
- Avatar (circular image or initial)
- Breadcrumb (navigation path)

All components built with Tailwind v4 + Radix UI (for complex ones).

---

## Success Criteria

- [ ] All interactive elements have visible focus states
- [ ] Lighthouse accessibility score ≥ 95
- [ ] WCAG 2.1 AA audit passes
- [ ] Mobile viewport: all text readable (no horizontal scroll)
- [ ] Animations perform at 60 FPS
