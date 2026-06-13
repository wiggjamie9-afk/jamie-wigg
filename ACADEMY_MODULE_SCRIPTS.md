# EventAI Academy — Module Recording Scripts

## Module 1: Event Platform Strategy (15 minutes)

### Script - "Setting Up Your Event Platform Business"

---

**[INTRO - 1 min]**

"Hey, I'm Jamie Wigg. In the next 12 weeks, we're building a production-grade event platform and turning it into revenue. This is Module 1.

By the end of today, you'll know:
- Who you're building for
- What problem you're solving
- How you'll charge them
- Your 90-day roadmap

Let's go."

**[WHO YOU'RE BUILDING FOR - 3 min]**

"First question: Who's your customer?

There are three main types of customers in the event space:

**Type 1: Event Organizers** — They're drowning in spreadsheets. Managing RSVPs, sending reminders, tracking who paid. They'd pay $50-500/month to automate this.

**Type 2: Venue Owners** — They host events but hate manual booking. They'd pay 5-10% commission per event.

**Type 3: Communities** — Meetup groups, alumni networks, neighborhoods. They want a free or cheap platform to organize events.

For this academy, we're building towards Type 1 first: event organizers. They're the easiest to sell to, they have clear pain, and they'll pay.

Pick one of these. If none fit, that's okay — the platform works for any use case. Just know your person."

**[THE PROBLEM YOU'RE SOLVING - 2 min]**

"What's the core problem we're solving?

Not 'event management is hard.'

The specific problem: **'Event organizers waste 10+ hours per event on manual tasks: sending emails, tracking RSVPs, updating attendees, managing payments.'**

That's our hook. That's what we're going to automate away.

Write this down: 'My customer wastes [specific number] hours on [specific task].'

Know that, and you'll know how to pitch."

**[HOW YOU'LL CHARGE - 2 min]**

"Three pricing models that work:

**1. Subscription** ($29-99/month)
- Best for: Organizers who run events regularly
- Example: 'Pay $49/month, unlimited events'

**2. Commission** (5-10% per event)
- Best for: Venue owners, platforms
- Example: 'We take 10% of ticket sales'

**3. Premium features** (free base, paid add-ons)
- Best for: Scaling
- Example: 'Basic free, Pro features for $29/month'

Pick one. We'll implement all three eventually, but start with subscription. It's the easiest."

**[YOUR 90-DAY ROADMAP - 2 min]**

"Here's the timeline:

Week 1-4: Build the platform (UI + real-time sync)
Week 5-8: Add AI (images, search, automation)
Week 9-10: Go mobile (iOS app + maps)
Week 11: Add payments (Stripe + automation)
Week 12: Launch & land first customers

By week 12, you have a deployed platform with paying customers.

By month 6, you're at $1K MRR. By year 1, $10K+ MRR is very doable."

**[OUTRO - 1 min]**

"That's module 1. Your homework:

1. Write down your customer (event organizer, venue owner, or community)
2. Write down the specific problem they have
3. Choose your pricing model (subscription, commission, or freemium)
4. Post this in the Discord — let's see what everyone's building

Next module: we're setting up your dev environment and getting the platform running locally.

See you tomorrow."

---

## Module 2: Tech Stack Overview (12 minutes)

### Script - "The Stack You're Using (And Why)"

---

**[INTRO - 1 min]**

"Module 2. We're talking about the tech stack.

By the end of this video, you'll understand:
- Frontend (React, TypeScript, Tailwind)
- Backend (Next.js, Supabase)
- Mobile (Capacitor)
- AI (image generation, search)
- Automation (n8n, Hermes, OpenHands)

And why each layer matters for your business."

**[FRONTEND: REACT + TYPESCRIPT + TAILWIND - 3 min]**

"Front end is what your users see.

We're using:
- **React 19** — The most popular JavaScript framework. Thousands of developers know it. Easy to hire for.
- **TypeScript** — Catches bugs before users see them. Takes 10% more time to code, saves you 100% in debugging.
- **Tailwind CSS** — Styling system. Instead of writing CSS, you compose utility classes. Fast, consistent, looks good.

Why this stack?

One: it's modern and fast. Users love fast apps.

Two: it's marketable. If you hire help later, every developer knows React.

Three: it's forgiving. You can build something impressive without 5 years of experience.

By the end of week 4, you'll have a fully functional event platform on this stack. Users can create events, search, and sync in real-time."

**[BACKEND: SUPABASE + POSTGRESQL - 3 min]**

"Backend is the engine.

We're using Supabase, which is PostgreSQL in the cloud with real-time built-in.

Why Supabase?

One: no DevOps. You don't have to think about servers. It scales automatically.

Two: real-time. When one user creates an event, everyone else's app updates instantly. That feels like magic.

Three: cheap. You can run a 10,000-user platform for $20/month on Supabase's free tier.

Four: secure. Supabase has row-level security built in. You can say 'User can only see their own events' and it's enforced at the database level. No bugs.

By week 6, your API is deployed and production-ready. You can handle thousands of concurrent users."

**[MOBILE: CAPACITOR - 2 min]**

"Mobile is where people expect your app to live now.

We're using Capacitor. It's a wrapper that takes your React web app and turns it into a native iOS and Android app. Zero extra code.

Why not React Native? Because Capacitor lets you reuse the exact same code for web and mobile. You build once, deploy everywhere.

By week 10, your app is on the App Store. People are using it from their phones."

**[AI: IMAGE GENERATION + SEMANTIC SEARCH - 2 min]**

"AI is what makes you money.

We're using:
- **Image generation** (Replicate) — Users describe an event, we generate a poster. Saves them design time.
- **Semantic search** — Instead of 'search for events with exact keyword match,' we understand intent. User says 'free tech stuff downtown' and we find relevant events.

By week 8, your users are creating content with AI. They love it."

**[AUTOMATION: N8N, HERMES, OPENHANDS - 2 min]**

"Automation is what scales you.

- **n8n** — Connect services visually. Email → Discord → Twitter → Stripe all wired up.
- **Hermes** — Chat-based AI that manages your inbox and community.
- **OpenHands** — Autonomous agents that batch-process tasks (generate 1000 images, email 1000 users, etc).

By week 11, you're not manually managing anything. Events auto-post to social. Confirmations auto-email. Invoices auto-generate."

**[OUTRO - 1 min]**

"That's the stack. Here's the good news: you don't need to be an expert in all of it. You'll learn by doing.

Next module: Setting up your dev environment. Get your laptop ready.

See you there."

---

## Module 3: Environment Setup (15 minutes)

### Script - "Get Your Dev Laptop Ready"

---

**[INTRO - 1 min]**

"Module 3: Environment setup.

By the end, your laptop is ready to code. You'll have:
- Node.js + npm
- Git
- Claude Code (or your editor)
- The event platform running locally

Let's go."

**[INSTALL NODE.JS - 3 min]**

[Screen recording: Visit nodejs.org, download LTS]

"First, Node.js. This is the JavaScript runtime.

Go to nodejs.org, download the LTS version. Click install. Done.

Verify it worked. Open Terminal, type: `node --version`

You should see v20.x or higher. Good."

**[INSTALL GIT - 2 min]**

[Screen recording: Install Git]

"Next, Git. This is version control.

On Mac: `brew install git`
On Windows: Download from git-scm.com

Verify: `git --version`"

**[CLONE THE REPO - 2 min]**

[Screen recording: Git clone]

"Now clone the event platform repo.

`git clone https://github.com/yourname/event-platform.git`

Wait for it to download. You now have the entire codebase."

**[INSTALL DEPENDENCIES - 2 min]**

[Screen recording: npm install]

"Navigate into the folder:
`cd event-platform`

Install dependencies:
`npm install`

This downloads everything the project needs. Will take 2-3 minutes."

**[START THE DEV SERVER - 2 min]**

[Screen recording: npm run dev]

"Now start the dev server:
`npm run dev`

Open http://localhost:3000 in your browser.

You should see the event platform running live. You can create events, search, sync in real-time.

If you break something, no problem. It's local. Just refresh."

**[OUTRO - 1 min]**

"That's it. You're set up. Laptop is ready.

Next module: We're building the first feature — the event creation form.

See you there."

---

## Notes for Recording

- **Use ScreenFlow or OBS** to record your screen
- **Talk conversationally.** This isn't a lecture. It's you explaining to a friend.
- **Show your face briefly** in the intro and outro (builds trust)
- **Pause after key points.** Let viewers catch up.
- **Record in segments.** Don't do a 15-minute take in one go. Do 3-5 minutes, pause, review, continue.
- **Zoom in on code.** Make text readable (at least 16px on screen)
- **Use mouse pointer.** Highlight what you're talking about.
- **Cut out mistakes.** If you stumble, pause and restart that sentence. Edit it out later.
- **Add captions.** Use Aider to auto-generate them from your audio.

---

## Timeline: Recording All 28 Modules

- **Modules 1-3** (scripted above): 45 minutes of content = ~2 hours recording + editing = 1 day
- **Modules 4-14** (UI + backend): ~5 hours content = ~12 hours recording = 3-4 days
- **Modules 15-21** (AI + mobile): ~4 hours content = ~10 hours recording = 3 days
- **Modules 22-28** (monetization + launch): ~3 hours content = ~8 hours recording = 2 days

**Total: 100 hours of work, 9-10 days if batched (2-3 hours per day)**

Alternatively: 2 hours per day = 50 days (easier, less fatigue)
