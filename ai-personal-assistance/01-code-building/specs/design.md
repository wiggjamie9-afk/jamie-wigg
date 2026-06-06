# Code & Building — Design Specification

UI/UX design for Sandbox Code Runner web app.

---

## Design System

### Color Palette
- **Primary:** `#2563EB` (Indigo) — actions, highlights
- **Success:** `#10B981` (Emerald) — code execution success
- **Warning:** `#F59E0B` (Amber) — limits approaching
- **Error:** `#EF4444` (Red) — errors, failures
- **Background:** `#0F172A` (Dark slate) — code editor background
- **Surface:** `#1E293B` (Slate) — cards, panels
- **Text:** `#F1F5F9` (Light slate) — primary text
- **Muted:** `#94A3B8` (Slate-400) — secondary text

### Typography
- **Headings:** Inter, sans-serif (bold 600/700)
- **Body:** Inter, sans-serif (regular 400)
- **Code:** Fira Code, monospace (regular 400)
- **Base size:** 16px (1rem)

### Spacing
- `4px` (0.25rem) — micro
- `8px` (0.5rem) — xs
- `16px` (1rem) — sm
- `24px` (1.5rem) — md
- `32px` (2rem) — lg
- `48px` (3rem) — xl

---

## Core Screens

### Screen 1: Landing Page

**Purpose:** Convince visitor to sign up  
**Path:** `/`

**Layout:**
```
[Header: Logo + CTA "Try Free"]

[Hero Section]
├── Headline: "Run Code Safely in Seconds"
├── Subheading: "Isolated sandboxes. No setup. AI feedback."
├── CTA: Large "Get Started" button
├── Code example animation (Python printing result)

[Feature Section]
├── Grid of 4:
│   ├── "Run Any Code" + icon (Python, Node, Ruby...)
│   ├── "Get AI Feedback" + icon (Claude review)
│   ├── "Read/Write Files" + icon (folder)
│   └── "No Setup Required" + icon (zap)

[Pricing Section]
├── Free / Pro / Business tabs
├── Feature comparison table
├── CTA: "Start Free"

[Footer]
├── Links: Docs, GitHub, Twitter, Privacy
```

**Key interactions:**
- Hover on features → highlight
- Click "Get Started" → signup modal
- Click "Start Free" → signup modal

---

### Screen 2: Signup / Login

**Purpose:** Create account or login  
**Path:** `/auth`

**Layout (modal or full page):**
```
[Left side: Brand + tagline (desktop only)]

[Right side: Form]
├── Heading: "Create your account"
├── Email input
├── Password input
├── Checkbox: "I agree to terms"
├── Button: "Sign Up" (blue)
├── Divider: "or"
├── Button: "Sign in with GitHub" (dark)
├── Link: "Already have an account? Log in"
```

**Key states:**
- Typing email → validate email format
- Password <8 chars → show error
- Submit → loading spinner
- Success → redirect to onboarding
- Error → red text "Account already exists"

---

### Screen 3: Onboarding (First Run)

**Purpose:** Guide new user through core flow  
**Path:** `/onboarding`

**Layout:**
```
[Card 1: Welcome]
├── Heading: "Welcome to Sandbox Runner"
├── Explanation: "Run code safely in isolated environments"
├── Button: "Next"

[Card 2: Create Sandbox]
├── Heading: "Create your first sandbox"
├── Dropdown: Pick Docker image (Python 3.12 selected)
├── Button: "Create Sandbox"
└── Loading spinner → redirect to editor

[Card 3: Run Code]
├── Heading: "Run your first command"
├── Pre-filled code: `print("Hello from Sandbox")`
├── Button: "Run Code"
├── Show result below

[Card 4: Success]
├── Checkmark animation
├── "You're all set! Start coding →"
├── Button: "Go to Dashboard"
```

---

### Screen 4: Editor (Main App)

**Purpose:** Where users write and run code  
**Path:** `/editor` or `/sandbox/:id`

**Layout (3-column):**

```
┌─────────────────────────────────────────────────────┐
│ [Header]                                            │
│ Logo | Sandbox name | Language | [Kill] [Settings] │
└─────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────┐
│                                                      │
│  [Left Sidebar]    [Code Editor]      [Right Panel] │
│  ─────────────────────────────────────────────────  │
│  Sandboxes        import sys             ↓ Results  │
│  ├─ Python 3.12   print("hello")        ↓          │
│  ├─ Node 20       x = 5                 ↓          │
│  ├─ Ruby 3.2      y = 10                hello      │
│                   print(x + y)          15         │
│  Files            z = x * y                        │
│  ├─ input.json    print(z)                         │
│  ├─ script.py                                      │
│                                                    │
│  [Run] [Review]                                    │
│                                                    │
└─────────────────────────────────────────────────────┘
```

**Left Sidebar:**
- **Sandboxes**
  - List of active sandboxes
  - Click to switch
  - Delete sandbox (X icon)
  - "+ New Sandbox" button
  
- **Files**
  - List files in current sandbox
  - Double-click to open
  - Right-click menu: Delete, Download
  - Drag-drop to upload

**Code Editor:**
- Syntax highlighting (Fira Code font)
- Line numbers
- Dark theme (background #0F172A)
- Fullscreen toggle (top-right)
- Undo/Redo (Ctrl+Z, Ctrl+Shift+Z)

**Right Panel (Results):**
- Tabs: Output | Errors | AI Review
- **Output tab:**
  - `stdout` in green
  - `stderr` in red
  - Execution time: "Completed in 234ms"
  - Memory used: "Peak: 42MB"
- **Errors tab:**
  - Error message + traceback (if any)
  - Red background
- **AI Review tab:**
  - Claude's feedback on code
  - Suggestions (blue callout)
  - Loading spinner while fetching

**Bottom Toolbar:**
- `[Run Code]` button (blue, large)
- `[Get AI Review]` button (secondary)
- `[Upload File]` button
- Free tier indicator: "4/5 runs used today"

---

### Screen 5: Dashboard / My Sandboxes

**Purpose:** List user's saved sandboxes  
**Path:** `/dashboard`

**Layout:**
```
[Header]
Heading: "My Sandboxes"
Button: "+ New Sandbox"

[Grid of Sandbox Cards]
Each card:
├── Sandbox name (editable)
├── Language/Image: "Python 3.12"
├── Created: "2 hours ago"
├── Last run: "5 min ago"
├── Actions: [Open] [Delete] [...]
```

---

### Screen 6: Pricing Page

**Purpose:** Convert free users to paid  
**Path:** `/pricing`

**Layout:**
```
[Heading: "Choose your plan"]

[Three-column pricing table]

Free        │ Pro              │ Business
────────────┼──────────────────┼─────────────
$0/month    │ $9.99/month      │ $29.99/month
────────────┼──────────────────┼─────────────
5 runs/day  │ Unlimited runs   │ Everything + Team
Python only │ All languages    │ 5 team members
Read-only   │ Read/write       │ Custom images
No AI       │ AI features      │ API access
────────────┼──────────────────┼─────────────
            │ [Start Free]     │ [Contact us]
            │ (or upgrade)     │
```

**Upgrade flow:**
- Click "Upgrade to Pro"
- Open Stripe payment modal
- Enter card details
- Confirm → close modal
- Redirect to editor with unlimited access

---

## Key Interactions

### Interaction 1: Run Code
```
User clicks [Run Code]
  ↓
Button shows loading spinner (1–2s)
  ↓
Code executes in sandbox
  ↓
Results appear in right panel
  ↓
Success: Output in green, execution time shown
  OR
  Error: Traceback in red, "Fix and try again" hint
```

### Interaction 2: Get AI Review
```
User clicks [Get AI Review]
  ↓
Right panel switches to "AI Review" tab
  ↓
Loading spinner + "Analyzing your code..."
  ↓
Claude API processes code (5–10s)
  ↓
Review appears: Suggestions, improvements, architecture notes
  ↓
User can click "Apply suggestion" or dismiss
```

### Interaction 3: Hit Free Tier Limit
```
User clicks [Run Code] (6th time today)
  ↓
Modal appears: "You've used 5/5 daily runs"
  ↓
Two buttons: [Upgrade to Pro] [Try Tomorrow]
  ↓
Click [Upgrade to Pro] → Stripe modal
  ↓
Payment confirmed → runs reset → code executes
```

---

## Responsive Design

### Desktop (1200px+)
- 3-column layout (sidebar | editor | results)
- Full code editor with line numbers
- Hover effects on buttons

### Tablet (768px–1199px)
- 2-column layout (sidebar + editor | results)
- Results panel slides out on demand
- Collapse sidebar on small space

### Mobile (< 768px)
- 1-column layout (stacked vertically)
- Editor takes full width
- Results panel slides up from bottom (like mobile keyboard)
- Sidebar collapses to hamburger menu
- Code editor with touch-optimized zoom

---

## Accessibility

- **Color contrast:** 4.5:1 minimum (WCAG AA)
- **Focus states:** Blue outline on all interactive elements
- **Keyboard nav:** Tab through buttons, Enter to activate
- **Screen readers:** Code editor labeled "Code input area"
- **Error messages:** In red + icon + text (not just color)

---

## Loading States

- **Page load:** Skeleton screens for editor
- **Code execution:** Spinner + "Running..."
- **AI review:** Spinner + "Analyzing with Claude..."
- **File upload:** Progress bar
- **Sandbox creation:** Modal with spinner

---

## Empty States

- **No sandboxes:** Heading "Create your first sandbox" + button
- **No files in sandbox:** "No files yet. Upload or create one."
- **No results after run:** "Run some code to see results here."
- **No AI review:** "Click 'Get AI Review' to analyze your code."

---

## Error States

- **Connection error:** "Connection lost. Retrying..." → "Failed to connect"
- **Sandbox crash:** "Sandbox encountered an error. Try again or create a new one."
- **API error:** "Something went wrong. Please try again."
- **Rate limit:** "You've hit the limit. Upgrade to Pro for unlimited access."

---

## Wireframes

(To be created in Figma or excalidraw and placed in `assets/wireframes/`)

- `/assets/wireframes/landing-page.png`
- `/assets/wireframes/editor-desktop.png`
- `/assets/wireframes/editor-mobile.png`
- `/assets/wireframes/dashboard.png`
- `/assets/wireframes/pricing.png`

---

## Animation Checklist

- [ ] Hero section: Smooth fade-in on scroll
- [ ] Buttons: 200ms scale-up on hover
- [ ] Results: Fade in when code executes
- [ ] Modals: Slide in from center (200ms)
- [ ] Loading spinners: 1s rotation
- [ ] Success checkmark: Bounce animation (300ms)

---

## Next Steps

1. Create wireframes in Figma or Excalidraw
2. Get design approval
3. Hand off to frontend (create React components)
4. Build backend API (Next.js routes + Supabase)
