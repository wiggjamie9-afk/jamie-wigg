#!/usr/bin/env python3
"""Build apps.html — the RHYTHMIX App Hub.

Scans apps/*.html, categorises every app, derives a clean display name,
monogram and blurb, then injects the catalogue into
scripts/apps-hub.template.html and writes apps.html at the repo root.

Re-run any time the apps/ folder changes:  python3 scripts/build-apps-hub.py
"""
import os, re, json, glob, html

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APPS_DIR = os.path.join(ROOT, "apps")
TEMPLATE = os.path.join(ROOT, "scripts", "apps-hub.template.html")
OUT = os.path.join(ROOT, "apps.html")

# ---- categories (order = display order; brand palette) ----
CATEGORIES = [
    {"id": "all",      "name": "All",            "accent": "#ffffff"},
    {"id": "featured", "name": "Featured",       "accent": "#f5c000"},
    {"id": "mind",     "name": "Mind & Mood",    "accent": "#ff6fc8"},
    {"id": "health",   "name": "Health & Body",  "accent": "#00e887"},
    {"id": "money",    "name": "Money & Work",   "accent": "#f5c000"},
    {"id": "learn",    "name": "Learn & Grow",   "accent": "#00d8ff"},
    {"id": "focus",    "name": "Focus & Plan",   "accent": "#7c3aed"},
    {"id": "food",     "name": "Food & Fitness", "accent": "#ff1f5a"},
    {"id": "sound",    "name": "RHYTHMIX Sound",  "accent": "#00d8ff"},
    {"id": "buddy",    "name": "AI Buddies",     "accent": "#ff1f5a"},
    {"id": "build",    "name": "Build & System", "accent": "#a0a0b0"},
]

# ---- explicit per-file overrides: file -> (category, name, blurb, star) ----
# Curated copy for the flagship 28-app portfolio + premium apps (from
# APPS_PORTFOLIO_SUMMARY.md) so the hero apps read as production products.
OVERRIDE = {
    # Featured / premium flagships
    "CodeMentor.html":   ("featured", "CodeMentor",   "AI code-review tutor — paste code, get line-by-line mentorship.", True),
    "NutriAI.html":      ("featured", "NutriAI",      "Smart nutrition tracker with AI meal insights and macro goals.", True),
    "StoryStudio.html":  ("featured", "StoryStudio",  "Turn an idea into a ready-to-shoot video script in seconds.", True),
    "VoiceJournal.html": ("featured", "VoiceJournal", "Speak your day — wellness journaling with voice and mood.", True),
    "bookreader-pro.html":("featured","BookReader Pro","Distraction-free reader with progress, notes and highlights.", True),
    "fitcoach-pro.html": ("featured", "FitCoach Pro", "Personalised workout coaching with adaptive session plans.", True),
    "mathtutor-pro.html":("featured", "MathTutor Pro","Step-by-step math tutoring across arithmetic to algebra.", True),
    "meetingmind.html":  ("featured", "MeetingMind",  "Capture meetings, extract action items and follow-ups.", True),
    "smartgrocery.html": ("featured", "SmartGrocery", "Smart grocery lists that organise by aisle and budget.", True),
    "languagelens.html": ("featured", "LanguageLens", "Point, translate, learn — language practice in context.", True),

    # Mind & Mood
    "heartbeat.html":       ("mind", "Heartbeat",       "Your AI friend who listens — voice-based emotional support, free forever.", True),
    "mood-journal.html":    ("mind", "Mood Journal",    "Five-emoji mood tracking with journaling and pattern insights.", False),
    "meditation-guide.html":("mind", "Meditation Guide","Eight guided meditations, breathing circles and streaks.", False),
    "voicejournal.html":    ("mind", "Voice Journal",   "Wellness journaling you speak instead of type.", False),

    # Health & Body
    "dreams.html":              ("health", "Dreams",            "Sleep tracking and rest meditation for better nights.", False),
    "medicine-companion.html":  ("health", "Medicine Companion","Dosage tracking and adherence reminders for medications.", False),
    "blood-pressure-buddy.html":("health", "Blood Pressure Buddy","Log BP, spot trends and classify your heart health.", False),
    "calorie-counter.html":     ("health", "Calorie Counter",   "Lightweight food logging with daily totals by category.", False),
    "weight-tracker.html":      ("health", "Weight Tracker",    "Weight history, trend analysis and goal tracking.", False),
    "water-tracker.html":       ("health", "Water Tracker",     "Stay hydrated with a visual daily intake tracker.", False),
    "period-tracker.html":      ("health", "Period Buddy",      "Private cycle tracking with fertility and ovulation prediction.", False),
    "lifeaudit.html":           ("health", "LifeAudit",         "One comprehensive assessment of your whole health picture.", False),

    # Money & Work
    "vendor-tracker.html":   ("money", "Vendor Tracker",   "Inventory and sales management for small businesses.", False),
    "expense-tracker.html":  ("money", "Expense Tracker",  "Daily spending logs with category breakdowns.", False),
    "savings-challenge.html":("money", "Savings Challenge","Goal-based saving with daily contribution tracking.", False),
    "loan-calculator.html":  ("money", "Loan Calculator",  "Understand any loan — EMI, interest and payoff breakdown.", False),
    "goal-tracker.html":     ("money", "Goal Tracker",     "Milestone tracking with percentage-based progress.", False),
    "budget-tracker.html":   ("money", "Budget Tracker",   "Monthly budgets by category with visual breakdowns.", False),

    # Learn & Grow
    "english-pocket.html":("learn", "English Pocket","Learn English vocabulary and phrases offline, free.", False),
    "math-helper.html":   ("learn", "Math Helper",   "Quick multi-function calculator built for students.", False),
    "study-planner.html": ("learn", "Study Planner", "Schedule subjects and topics, track time per task.", False),
    "trivia-quiz.html":   ("learn", "Trivia Quiz",   "Daily ten-question quizzes that test your knowledge.", False),
    "spellingbuddy.html": ("learn", "SpellingBuddy", "Practise spelling with adaptive word lists.", False),
    "studymate.html":     ("learn", "StudyMate",     "Your study companion for focus and revision.", False),
    "codementor.html":    ("learn", "CodeMentor Lite","Learn to code with bite-size review and hints.", False),

    # Focus & Plan
    "notes.html":         ("focus", "Simple Notes",  "Capture ideas instantly — zero-friction note taking.", False),
    "voice-notes.html":   ("focus", "Voice Notes",   "Record thoughts on the go with playback and download.", False),
    "tasklist.html":      ("focus", "TaskList",      "Organise tasks and stay productive with progress stats.", False),
    "reminders.html":     ("focus", "Reminders",     "Date-time reminders so you never forget what matters.", False),
    "daily-planner.html": ("focus", "Daily Planner", "Plan your day one hour at a time, by category.", False),
    "pomodoro-timer.html":("focus", "Focus Timer",   "Pomodoro sessions with presets and break reminders.", False),
    "habit-streak.html":  ("focus", "Habit Streak",  "Build good habits with daily check-ins and streaks.", False),

    # Food & Fitness
    "nutriai.html":      ("food", "NutriAI Lite",  "Track meals and macros with quick AI suggestions.", False),
    "quick-recipes.html":("food", "Quick Recipes", "Cook delicious meals in minutes — search by ingredient.", False),
    "workout-timer.html":("food", "Workout Timer", "Time workouts with pause, resume and history.", False),

    # Creative (mapped under Featured/learn as relevant)
    "storystudio.html":  ("featured", "StoryStudio Lite", "Fast video-script drafts for creators.", False),

    # RHYTHMIX Sound
    "live.html":    ("sound", "RHYTHMIX Live", "Drop a track, get a beat-synced AI music video.", True),
    "resonate.html":("sound", "Resonate",      "Closed-loop generative music that breathes with you.", True),
    "hum.html":     ("sound", "Hum",           "A daily humming practice — coherence breath and healing tones.", False),

    # Build & System (the engine behind the apps)
    "buddies.html":             ("build", "Buddies Gallery",      "Swipe to choose from 50 AI companion apps.", False),
    "index.html":               ("build", "Buddy Index",          "The 50 AI Buddy apps, one landing page.", False),
    "buddy-app-machine.html":   ("build", "Buddy App Machine",    "One idea, one click — generate a new buddy app.", False),
    "buddy-app-premium.html":   ("build", "Buddy Premium",        "The premium AI companion template.", False),
    "buddy-app-template.html":  ("build", "Buddy Template",       "Base template every buddy app is built from.", False),
    "buddy-builder.html":       ("build", "Buddy Builder",        "Create AI companion apps from a prompt.", False),
    "buddy-builder-v2.html":    ("build", "Buddy Builder v2",     "Create and improve AI companions, version two.", False),
    "buddy-command-center.html":("build", "Command Center",       "Control your whole app empire from one dashboard.", False),
    "buddy-marketplace.html":   ("build", "Buddy Marketplace",    "Discover and download AI companions.", False),
    "buddy-system.html":        ("build", "Buddy System",         "The AI companion ecosystem overview.", False),
    "buddy-verifier.html":      ("build", "Receipt Verifier",     "Don't trust — verify buddy purchase receipts.", False),
    "get-apps.html":            ("build", "Get Apps",             "Download bundle for deployment.", False),
    "test-suite.html":          ("build", "MVP Test Suite",       "Automated checks across every app.", False),
    "thumbnails.html":          ("build", "Thumbnail Studio",     "Generate store thumbnails for every app.", False),
    "avatar-proxy-test.html":   ("build", "Avatar Proxy Tester",  "Diagnostics for the avatar proxy.", False),
}

STOPWORDS = {"the", "your", "a", "an", "of", "and", "for", "to"}


def read_head(path, n=9000):
    try:
        with open(path, encoding="utf-8", errors="ignore") as f:
            return f.read(n)
    except OSError:
        return ""


def extract_title(doc):
    m = re.search(r"<title[^>]*>(.*?)</title>", doc, re.I | re.S)
    return re.sub(r"\s+", " ", m.group(1)).strip() if m else ""


def extract_desc(doc):
    m = re.search(r'<meta[^>]+name=["\']description["\'][^>]+content=["\'](.*?)["\']', doc, re.I | re.S)
    return re.sub(r"\s+", " ", m.group(1)).strip() if m else ""


def split_name(title):
    """'Heartbeat – Your AI Friend' -> ('Heartbeat', 'Your AI Friend')."""
    for sep in (" — ", " – ", " - ", " · "):
        if sep in title:
            a, b = title.split(sep, 1)
            return a.strip(), b.strip()
    return title.strip(), ""


def monogram(name):
    words = [w for w in re.split(r"[\s\-]+", name) if w]
    sig = [w for w in words if w.lower() not in STOPWORDS] or words
    if len(sig) >= 2:
        return (sig[0][0] + sig[1][0]).upper()
    w = sig[0] if sig else "A"
    return (w[:2]).upper() if len(w) >= 2 else w.upper()


def categorise(fname, title):
    m = re.match(r"buddy-(\d+)\.html$", fname)
    if m:
        topic, _ = split_name(title)
        topic = topic.replace(" — Your AI Buddy", "").strip()
        return "buddy", topic, "Private, offline-first AI companion.", False
    return None


def build_app(fname):
    if fname in OVERRIDE:
        cat, name, blurb, star = OVERRIDE[fname]
        return cat, name, blurb, star

    doc = read_head(os.path.join(APPS_DIR, fname))
    title = extract_title(doc) or fname.replace(".html", "")
    desc = extract_desc(doc)

    c = categorise(fname, title)
    if c:
        cat, name, blurb, star = c
        if desc:
            blurb = desc
        return cat, name, blurb, star

    # generic fallback
    name, tagline = split_name(title)
    blurb = desc or tagline or "Offline-first web app."
    return "build", name, blurb, False


def main():
    files = sorted(os.path.basename(p) for p in glob.glob(os.path.join(APPS_DIR, "*.html")))
    accent = {c["id"]: c["accent"] for c in CATEGORIES}

    apps = []
    for fname in files:
        cat, name, blurb, star = build_app(fname)
        apps.append({
            "name": name,
            "href": "apps/" + fname,
            "cat": cat,
            "blurb": blurb,
            "mono": monogram(name),
            "kw": fname.replace(".html", "").replace("-", " "),
            "star": star,
        })

    # sort: featured first, then by category order, then name
    order = {c["id"]: i for i, c in enumerate(CATEGORIES)}
    apps.sort(key=lambda a: (order.get(a["cat"], 99), a["name"].lower()))

    catalogue = {"categories": CATEGORIES, "apps": apps}
    payload = json.dumps(catalogue, ensure_ascii=False, separators=(",", ":"))

    with open(TEMPLATE, encoding="utf-8") as f:
        tpl = f.read()
    out = tpl.replace("__CATALOG_JSON__", payload).replace("__COUNT__", str(len(apps)))

    with open(OUT, "w", encoding="utf-8") as f:
        f.write(out)

    # report
    by_cat = {}
    for a in apps:
        by_cat[a["cat"]] = by_cat.get(a["cat"], 0) + 1
    print(f"Built {OUT}")
    print(f"  {len(apps)} apps across {len([c for c in by_cat])} categories")
    for c in CATEGORIES:
        if c["id"] in by_cat:
            print(f"  {by_cat[c['id']]:>3}  {c['name']}")


if __name__ == "__main__":
    main()
