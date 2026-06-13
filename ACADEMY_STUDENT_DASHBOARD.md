# EventAI Academy — Student Dashboard Setup

## Dashboard Components (Next.js)

The student dashboard is at `/app/academy/dashboard/page.tsx`. Here's the structure:

### 1. Progress Tracker
```
Module 1: Event Platform Strategy ✓ (Completed)
Module 2: Tech Stack Overview ✓ (Completed)
Module 3: Environment Setup ⏳ (In Progress - 60%)
Module 4: Event Creation Form ⭕ (Not Started)
Module 5: Real-time Sync ⭕ (Not Started)
...
Module 28: Launch & Scale ⭕ (Not Started)

Progress: 3/28 modules (10%)
```

### 2. My Platform Section
```
Platform Name: [Student's custom name]
Status: 🟢 Live
Domain: https://[student-name].buildtheeventai.com
GitHub: https://github.com/[student]/event-platform
Deployed: Week 4 ✓
```

### 3. Cohort Leaderboard
```
🥇 Sarah - "Event Scheduling" - Week 11 (Launch week)
🥈 Alex - "Wedding Planning" - Week 9 (Mobile)
🥉 Jordan - "Community Events" - Week 8 (AI)
    You - "Tech Conference" - Week 3 (Frontend)
    Ben - "Sports Events" - Week 2 (Setup)
```

### 4. Personal Achievements
```
✓ Deployed to Cloudflare
✓ Real-time sync working
✓ Generated first AI image
  Next milestone: Deploy iOS app (5 days away)
```

### 5. Resources Quick Access
```
- Modules (28 video links)
- Code templates (GitHub repos)
- Setup guides (documentation)
- API docs (Supabase reference)
- Discord community (link)
- Office hours (Zoom link + schedule)
```

### 6. Feedback & Support
```
📝 Submit checkpoint for review
💬 Ask question in Discord
🎥 Schedule 1-on-1 mentor call (Pro/Premium only)
📧 Email support
```

## Database Schema

```sql
-- Students table
CREATE TABLE academy_students (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  tier VARCHAR(50), -- 'starter', 'pro', 'premium'
  enrolled_at TIMESTAMP,
  cohort VARCHAR(50), -- e.g., 'cohort-jan-2026'
  platform_name VARCHAR(255),
  platform_domain VARCHAR(255),
  github_repo VARCHAR(255)
);

-- Progress tracking
CREATE TABLE academy_progress (
  id UUID PRIMARY KEY,
  student_id UUID REFERENCES academy_students(id),
  module_id INT,
  module_title VARCHAR(255),
  status VARCHAR(50), -- 'not_started', 'in_progress', 'completed'
  progress_percent INT,
  completed_at TIMESTAMP
);

-- Checkpoints (assignments)
CREATE TABLE academy_checkpoints (
  id UUID PRIMARY KEY,
  student_id UUID REFERENCES academy_students(id),
  week INT,
  title VARCHAR(255),
  description TEXT,
  submission_url VARCHAR(500),
  mentor_feedback TEXT,
  submitted_at TIMESTAMP,
  feedback_at TIMESTAMP
);

-- Achievements
CREATE TABLE academy_achievements (
  id UUID PRIMARY KEY,
  student_id UUID REFERENCES academy_students(id),
  achievement_key VARCHAR(100),
  achievement_title VARCHAR(255),
  unlocked_at TIMESTAMP
);
```

## Automations (n8n Workflows)

### 1. Welcome Sequence (On Enrollment)
```
Trigger: New student enrolls
  → Send welcome email
  → Send Discord invite link
  → Create Supabase user
  → Add to cohort channel
  → Send first module link
```

### 2. Weekly Digest
```
Trigger: Every Monday at 9 AM
  → Fetch student progress
  → Calculate what's due this week
  → Send "This week's modules" email
  → Post cohort wins to Discord
```

### 3. Checkpoint Reminder
```
Trigger: Week 4, Week 6, Week 8, etc.
  → Check if student submitted checkpoint
  → If not: send reminder ("Checkpoint due in 2 days")
  → If submitted: notify mentor
```

### 4. Achievement Unlock
```
Trigger: Student completes module
  → Check if they unlocked achievement
  → Send celebration email
  → Post to Discord
  → Update leaderboard
```

### 5. At-Risk Intervention
```
Trigger: Daily at 6 PM
  → Check if student is falling behind
  → If no progress in 7 days: send check-in email
  → If no response in 14 days: Hermes agent sends personalized message
```

## Implementation

File: `event-platform/src/app/academy/dashboard/page.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Student {
  id: string;
  name: string;
  email: string;
  tier: 'starter' | 'pro' | 'premium';
  platform_name: string;
  platform_domain: string;
}

interface Progress {
  module_id: number;
  module_title: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress_percent: number;
}

export default function AcademyDashboard() {
  const [student, setStudent] = useState<Student | null>(null);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [achievements, setAchievements] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    // TODO: Fetch student data from Supabase
    // TODO: Fetch progress data
    // TODO: Fetch achievements
  }, []);

  if (!student) return <div>Loading...</div>;

  return (
    <main className="min-h-screen bg-base">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 py-6">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-serif font-bold mb-2">
            Welcome back, {student.name}
          </h1>
          <p className="opacity-75">
            {student.tier.toUpperCase()} tier • Cohort 2026
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Progress Overview */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Your Progress</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
              <p className="text-sm opacity-60 mb-2">Modules Completed</p>
              <p className="text-3xl font-bold">{progress.filter(p => p.status === 'completed').length}/28</p>
            </div>
            <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
              <p className="text-sm opacity-60 mb-2">Current Week</p>
              <p className="text-3xl font-bold">Week 3</p>
            </div>
            <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
              <p className="text-sm opacity-60 mb-2">Next Checkpoint</p>
              <p className="text-3xl font-bold">Week 4</p>
            </div>
            <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
              <p className="text-sm opacity-60 mb-2">Achievements</p>
              <p className="text-3xl font-bold">{achievements.length}</p>
            </div>
          </div>
        </section>

        {/* My Platform */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">My Platform</h2>
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm opacity-60 mb-2">Platform Name</p>
                <p className="font-bold text-lg">{student.platform_name}</p>
              </div>
              <div>
                <p className="text-sm opacity-60 mb-2">Live at</p>
                <a
                  href={`https://${student.platform_domain}`}
                  className="font-bold text-var(--color-accent) hover:underline"
                >
                  {student.platform_domain}
                </a>
              </div>
              <div>
                <p className="text-sm opacity-60 mb-2">Code</p>
                <a
                  href={`https://github.com${student.github_repo}`}
                  className="font-bold text-var(--color-accent) hover:underline"
                >
                  GitHub →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Module Progress */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Modules</h2>
          <div className="space-y-3">
            {progress.map((p) => (
              <div
                key={p.module_id}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-sm opacity-60">Module {p.module_id}</span>
                    <p className="font-bold">{p.module_title}</p>
                  </div>
                  <span className={`text-sm font-bold ${
                    p.status === 'completed' ? 'text-green-600' :
                    p.status === 'in_progress' ? 'text-blue-600' :
                    'text-gray-400'
                  }`}>
                    {p.status === 'completed' ? '✓ Done' :
                     p.status === 'in_progress' ? '⏳ In Progress' :
                     '⭕ Not Started'}
                  </span>
                </div>
                {p.status === 'in_progress' && (
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-var(--color-accent) h-2 rounded-full"
                      style={{ width: `${p.progress_percent}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
```

This dashboard lives at: `http://localhost:3000/academy/dashboard`

For deployment, it will be: `https://buildtheeventai.com/dashboard`
