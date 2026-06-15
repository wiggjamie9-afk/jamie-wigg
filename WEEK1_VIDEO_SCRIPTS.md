# Week 1 Video Scripts: Agent Builder SaaS Course

Complete scripts, pacing notes, and visual cues for the three launch videos. Each includes timing, talking points, code sections, and calls-to-action.

---

## Video 1: "Building a SaaS Agent Builder — Week 1 Hook" (5 min)

**Target:** Hook viewers with the vision, show live demo, establish credibility.

**Publishing:** Monday 9 AM (kick off the course)

### Script

---

**[INTRO — 0:00-0:30 | Talking head, split screen with dashboard live demo starting in background]**

"Hey, I'm building a full-stack SaaS platform called Agent Builder — a tool that lets anyone create AI agents without writing code.

[Pause 1 sec]

In the next four weeks, I'm going to show you exactly how I built it from scratch. We're talking 24 different features, 239 passing tests, and a complete production-ready platform.

[Pause 1 sec]

By the end of this course, you'll understand the stack, the architecture, and how to build SaaS apps that scale."

**[VISUAL CUE: Show website/pricing page briefly — Agent Builder landing page slides by]**

---

**[THE PROBLEM — 0:30-1:15 | Back to code editor, show blank Next.js project]**

"Most AI agent platforms are locked down. You need API keys, you're dependent on their pricing, and you can't customize the agent's behavior.

[Pause]

So I decided to build something different. A platform where you get:

[On-screen: Points appear as you speak]
✓ 6 pre-built agent types — Code Review, Document Processing, Research, Security Audit, Data Analysis, Customer Support
✓ A 5-step guided workflow — anyone can create an agent in 5 minutes
✓ Full customization — pick your agent type, write your system prompt, set up your environment
✓ Multiple pricing tiers — $500 starter, $1500 pro, $500 per add-on

[Pause 1 sec]

Everything runs on Supabase for the backend, Next.js 15 for the frontend, and deploys to production in minutes."

**[VISUAL CUE: Animate in stack diagram: Next.js 15 → React 19 → Supabase → Cloudflare]**

---

**[LIVE DEMO — 1:15-4:00 | Full-screen code + application demo]**

**SECTION A: Dashboard (30 sec)**

"Let me show you the dashboard.

[Open browser: localhost:3000/dashboard]

Here's where users land after signing up. They see all their agents — in this case, I've got three: a code-review bot, a research agent, and a customer-support AI.

[Point to each agent card]

They can click 'Create New' to start building immediately."

**[VISUAL CUE: Zoom in on "Create New" button, highlight in orange]**

---

**SECTION B: 5-Step Builder Workflow (90 sec)**

"Click 'Create New' and you enter the 5-step builder.

[Click button, show Step 1]

**Step 1: Choose Agent Type**

Six cards. Each has a description and a use case. You pick one — let's say Code Review.

[Click Code Review card, show it's selected]

**Step 2: Name & Description**

Give your agent a name. Mine will be 'Python Code Reviewer'. Add a brief description.

[Type name: "Python Code Reviewer"]
[Type description: "Reviews Python code for quality, security, and best practices"]

[Pause 1 sec]

**Step 3: Environment Setup**

Configure where this agent runs. You can set environment variables, API keys, rate limits.

[Show environment form: paste example API key, set rate limit to 100]

**Step 4: System Prompt**

This is the core of the agent. You write the system prompt that tells the AI how to behave.

[Show prompt: "You are a Python code reviewer..."]

[Pause to let viewers read]

Here, I've pasted a prompt that turns this into a strict code reviewer. It looks for security issues, performance problems, and style violations.

**Step 5: Fine-tune & Deploy**

Last step: preview your agent config, tweak any settings, then deploy.

[Click Deploy]

Done. Agent is now live.

[Pause 1 sec]

The entire workflow takes about 5 minutes. Compare that to building an agent from scratch — which takes weeks."

**[VISUAL CUE: Show timer: "5 min to deploy vs 4 weeks to build" overlay]**

---

**SECTION C: Agent Config & Settings (45 sec)**

"Once deployed, your agent has a settings page.

[Navigate to agent settings]

You see the config you set up, plus new options:
- Regenerate API keys
- Delete the agent
- View analytics — how many times it's been used, average latency, error rate

[Point to analytics chart]

This agent's been tested 47 times, with zero errors and a 120ms average response time.

[Pause]

And if you want to sell access to this agent, we've got built-in billing. You can set a per-use price, and we handle the payments."

---

**[CLOSE: Call-to-action — 4:00-5:00 | Back to talking head]**

"This course covers everything:

[Point to list on screen]
- How I structured the Next.js 15 app
- Authentication with Supabase Row-Level Security
- The database schema for agents, configs, and analytics
- Building the 5-step form workflow
- Styling with Tailwind v4
- Testing (239 tests, and I show you the patterns)
- Deploying to Cloudflare Pages and handling real-time updates

[Pause]

New videos drop Monday, Wednesday, and Friday. Each one goes deep into one feature.

[Pause 1 sec]

Here's what I want you to do:

1. Subscribe. Turn on the bell.
2. Comment below: What kind of agent would you build? I read every comment.
3. Follow me on GitHub and Twitter — I post snippets and updates there.

[Pause]

Next Wednesday, we're diving into authentication. We'll set up Supabase, create users, and implement Row-Level Security so every user sees only their own data.

[Pause]

See you then."

**[VISUAL CUE: Outro slide: "Agent Builder Course — Week 1" + subscribe button animation]**

---

## Video 2: "Authentication with Supabase RLS" (12 min)

**Target:** Deep dive into auth. Show Supabase setup, RLS policies, JWT verification. Appeal to intermediate developers.

**Publishing:** Wednesday 9 AM

### Script Outline (detailed beats, not full prose)

---

**INTRO (1 min)**
- Recap: Why Supabase? (Open-source, PostgreSQL, auto-generates APIs)
- This video: RLS (Row-Level Security) policies so users can only see their own data
- Practical: Build signup → login → create project → only user sees their project

**PART 1: Supabase Setup (2.5 min)**
- Show browser: Supabase dashboard
- Create new project: name "AgentBuilder", region closest to you
- Wait for initialization (show while waiting: explain database structure)
- Introduce `users` table (id, email, auth_user_id, created_at)
- Introduce `projects` table (id, user_id, name, config JSONB, tier enum, created_at)

**PART 2: SQL Migrations (2 min)**
- Open VS Code: `agent-builder/migrations/001_users.sql`
- Read aloud: CREATE TABLE users AS auth.users
- Explain: Why we link auth.users to our users table (custom fields later)
- Show `002_projects.sql`:
  - `projects` table with `user_id` foreign key
  - `tier` enum: 'starter' | 'pro' | 'addon'
  - `config` JSONB: stores agent templates
- Run migrations via Supabase dashboard SQL Editor

**PART 3: RLS Policies (3.5 min)**
- Concept: RLS = each query is filtered by who's asking
- Example: "SELECT * FROM projects WHERE user_id = auth.uid()"
- Code: `agent-builder/lib/db.ts` → show policy definitions
- Policy 1: Users can only SELECT their own projects
  ```sql
  CREATE POLICY "Users see own projects" 
    ON projects FOR SELECT 
    USING (auth.uid() = user_id);
  ```
- Policy 2: Users can INSERT projects (auto-set user_id)
  ```sql
  CREATE POLICY "Users insert own projects"
    ON projects FOR INSERT
    WITH CHECK (auth.uid() = user_id);
  ```
- Policy 3: Users can UPDATE their own projects
  ```sql
  CREATE POLICY "Users update own projects"
    ON projects FOR UPDATE
    USING (auth.uid() = user_id);
  ```
- Live test: Show two browser windows (user A logged in left, user B right), insert project in A, verify B can't see it

**PART 4: NextAuth Integration (2 min)**
- Overview: NextAuth handles OAuth + JWT
- Callback: When user logs in, create session with Supabase token
- Show code: `agent-builder/lib/auth.ts` → NextAuth config
- Explain callback: Get user from Supabase, add to JWT, return
- Show protected route: `/dashboard` redirects to login if no session

**PART 5: Client-side Usage (1 min)**
- Show React hook: `useSupabaseClient()` in component
- Simple query: `supabase.from('projects').select('*')`
- RLS does the filtering automatically (user_id check happens in DB)

**OUTRO (0.5 min)**
- Next video: Database design patterns
- Comment: What data model would you build?
- Subscribe, bell, GitHub star

---

## Video 3: "Building the 5-Step Workflow UI" (15 min)

**Target:** Advanced React developers. Show form state management, multi-step flow, real-time config preview.

**Publishing:** Friday 9 AM

### Script Outline

---

**INTRO (1 min)**
- Hook: "Most form UIs are linear. We're building something better."
- This video: Multi-step form with persistent state + live config preview
- Show final result: 5 screens, click through, config updates live on right panel

**PART 1: Component Architecture (2 min)**
- Overview: `BuilderSteps.tsx` (orchestrator) → 5 step components
- State: React Context (FormContext) stores all form data centrally
- Data shape:
  ```
  {
    agentType: 'code-review' | 'document-processing' | ... ,
    name: string,
    description: string,
    environment: Record<string, string>,
    systemPrompt: string,
    config: AgentConfig
  }
  ```
- Why Context? Easy to access from any step, survives navigation

**PART 2: Step 1 — Type Selector (2.5 min)**
- Show UI: 6 cards in grid
- Code: `components/AgentTypeSelector.tsx`
- Map over templates: `templates.map(t => <TypeCard key={t.id} ... />)`
- TypeCard component: Image, name, description, hover effect (scale 1.02)
- On click: Set context.agentType, move to Step 2
- Live demo: Click cards, watch card highlight

**PART 3: Step 2-3 — Forms (3 min)**
- Step 2: Name + description inputs
- Show form validation:
  ```tsx
  const errors = validateStep2(formData);
  if (errors.length > 0) return <ErrorList errors={errors} />;
  ```
- Step 3: Environment setup
- Dynamic input: Add/remove env vars with + / - buttons
- Code: `useReducer` to handle array mutations safely
- On change: Merge into context, trigger re-render of config preview

**PART 4: Step 4 — Prompt Editor (2 min)**
- Textarea with syntax highlighting (highlight code blocks in prompt)
- Button: "Load template" → fills in default prompt for agent type
- User can customize
- Live: Show typing, watch config preview update

**PART 5: Config Preview Panel (2 min)**
- Right sidebar: Real-time JSON preview of final agent config
- Show: Agent type, name, environment, system prompt, tier
- Before deploy: JSON formatted, one-click copy button
- "Copy config" button copies to clipboard for manual backup

**PART 6: Step 5 — Deploy (1.5 min)**
- Final review screen: Summary of all inputs
- Buttons: "Back" (Step 4), "Deploy" (save to DB + show success modal)
- Success modal: Gives agent ID, edit URL, API endpoint
- Code: POST /api/agents, returns new agent object
- Redirect to settings page on success

**OUTRO (1 min)**
- Summary: Multi-step forms with Context API
- Key patterns: Controlled inputs, validation, state lifting
- Next video: Testing these forms
- Comment: Form patterns you'd add?
- Subscribe, bell, GitHub

---

## Publishing Schedule

| Video | Day | Time | Title |
|---|---|---|---|
| V1 | Mon | 9 AM | Building a SaaS Agent Builder — Hook |
| V2 | Wed | 9 AM | Authentication with Supabase RLS |
| V3 | Fri | 9 AM | Building the 5-Step Workflow UI |

**Comment cadence:** Reply to first 5-10 comments on each video within 24 hours. Builds momentum.

**Shorts (optional):** Clip 30-60 sec from each video, post 2-3 per week as YouTube Shorts or TikTok to drive traffic back to full videos.

---

## Ad-lib Notes for Presenters

- **Speak with confidence:** You built this. Own it.
- **Reference other tools:** "Unlike [Zapier/Make], we give you full code access."
- **Analogies:** "RLS is like a filter on the database query — only you see your data."
- **Pause for impact:** After key points, let silence sit 1-2 sec.
- **Camera:** Make eye contact with camera (not monitor). Imagine viewer 3 feet away.
- **Energy:** Smile when demoing features. Enthusiasm is contagious.
- **Mistakes:** If you mess up, fix it and keep going. Authenticity > perfection.

