# The Legend of the Build Engineer

## The Story

A senior build engineer left a company, leaving behind a collection of automation scripts that automated literally everything:

### Scripts Left Behind

1. **smack-my-bitch-up.sh**
   - Sends "running late" text to wife
   - Triggers if SSH sessions exist after 9pm
   - Randomly picks excuse from array
   - Cron: 9:20 PM weekdays

2. **kumar-asshole.sh**
   - Monitors inbox for emails from "Kumar" (DBA at client)
   - Detects keywords: "help", "trouble", "sorry"
   - Auto-SSHes into client server
   - Rolls back staging DB to latest backup
   - Replies: "no worries mate, be careful next time"
   - Cron: Every 10 minutes

3. **hangover.sh**
   - Sends "not feeling well / working from home" emails
   - Triggers if no interactive sessions at 8:45am
   - Randomizes excuses
   - Cron: 8:45 AM weekdays

4. **fucking-coffee.sh** ⭐ (The Masterpiece)
   - Waits 17 seconds (time to walk to coffee machine)
   - Telnets to coffee machine (yes, it's networked + Linux)
   - Sends: `sys brew` (brews mid-sized half-caf latte)
   - Waits 24 seconds for pour
   - Perfect timing = hot coffee at desk
   - Cron: Hourly 9am-6pm weekdays

---

## The Philosophy

**"If it takes more than 90 seconds, script it."**

This engineer embodied the extreme end of automation culture:
- Identified every repetitive task
- Eliminated manual work entirely
- Made the system self-healing
- Left behind a living codebase of personal workflow

---

## Lessons for AI Agent Builders

### What Works

1. **Domain knowledge embedded in scripts** — Only someone deep in the ops knew these pain points
2. **Automation as leverage** — One engineer scaled to multiple people's work
3. **Task identification** — Knowing what's worth automating is 80% of the value
4. **Cron-driven autonomy** — System runs unattended, survives his departure

### What's Risky

1. **Fragility** — Scripts break if assumptions change (Kumar changes email tone, coffee machine reboots)
2. **Maintainability** — Legacy code with no documentation; team struggles after engineer leaves
3. **Social chaos** — Automating "I'm late" and "I'm sick" creates trust issues
4. **Opacity** — Team didn't know coffee machine was networked until discovering the script

### Application to Nucleus

**Mary Agent should learn:**
- ✅ Aggressively automate repetitive campaign tasks
- ✅ Build procedural memory ("what worked last time?")
- ⚠️ Document the automation logic (Mary's system prompts, learned patterns)
- ⚠️ Make the system inspectable (audit trail of automated decisions)
- ⚠️ Support override mechanisms (human can interrupt, redirect)

---

## Environment Variables

```bash
# Twilio (text messages)
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...

# Gmail (email monitoring)
GMAIL_USERNAME=admin@example.org
GMAIL_PASSWORD=...
```

## Implementation Notes

- Original: bash.im (Russian internet folklore)
- Languages: Shell, Ruby, Python, Perl implementations available
- License: WTFPL (Do What The Fuck You Want To Public License)
- Status: **Do not actually run in production** (for legal/ethical reasons)

---

## Related Concepts

- **Service as Software** — This engineer turned service-level work into scripts
- **Extreme Automation** — Taking it to humorous extremes
- **One-Person DevOps** — What one person can scale with scripting
- **Legacy Code** — The challenge of inheriting someone's automation culture

---

## Quotes

> "The dude was literally living inside the terminal. You know, that type of a guy who loves Vim, creates diagrams in Dot and writes wiki-posts in Markdown."

> "If something - anything - requires more than 90 seconds of his time, he writes a script to automate that."

> "fucking-coffee.sh - this one waits exactly 17 seconds (!) [...] The timing is exactly how long it takes to walk to the machine from the dudes desk."

---

**Original Source:** bash.im/quote/436725 (Russian internet folklore, via Archive.org)

**Lesson:** Automation at scale requires both technical skill and deep domain knowledge. The best automations feel invisible because they solve real friction points.
