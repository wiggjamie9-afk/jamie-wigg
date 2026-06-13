# EventAI Academy — Quick Start Guide

**Everything is built and ready to go. Pick a path:**

---

## 🟢 Path 1: Launch This Week (Fast)

### Today (1 hour)
```bash
cd event-platform
npm run build
# Deploy to Vercel/Cloudflare Pages
# Point buildtheeventai.com
```

### Tomorrow (2 hours)
- [ ] Create Discord server (ACADEMY_DISCORD_SETUP.md)
- [ ] Record Module 1 video (use template from ACADEMY_MODULE_VIDEO_TEMPLATES.md)
- [ ] Generate TTS: `npx --yes hyperframes@0.4.42 tts`
- [ ] Render: `npx --yes hyperframes@0.4.42 render`
- [ ] Upload to YouTube (unlisted)

### Day 3-4 (3 hours)
- [ ] Set up n8n account (free tier)
- [ ] Import 7 base workflows (ACADEMY_N8N_WORKFLOWS.md)
- [ ] Connect Supabase, Gmail, Discord
- [ ] Test enrollment → welcome email flow

### Day 5 (Launch Day)
- [ ] Post on ProductHunt, HN, Reddit, Twitter, LinkedIn
- [ ] Monitor enrollments
- [ ] Respond to every comment/DM
- [ ] Celebrate first signup

**Expected outcome**: 5-15 enrollments, $1.5K-$15K revenue by end of week

---

## 🟡 Path 2: Beta Test First (Safer)

### Week 1-2
- Deploy landing page
- Invite 5-10 beta students
- Run through modules 1-4
- Collect feedback
- Refine based on feedback

### Week 3-4
- Record remaining modules (5-28)
- Set up full n8n automation
- Prepare launch campaign
- Schedule content

### Week 5+
- Launch full campaign
- Run first public cohort

**Expected outcome**: Refined curriculum, confident go-to-market, higher conversion

---

## 📊 Paths Compared

| Aspect | Path 1 (Fast) | Path 2 (Safe) |
|---|---|---|
| Time to first sale | 5 days | 30 days |
| Revenue in month 1 | $5K-$20K | $500-$2K |
| Quality risk | Medium (iterate with students) | Low (refine before launch) |
| Best for | Confident with modules + sales | Perfectionist / first-time builder |

---

## 🎯 Key Files You'll Need

**Landing Page**:
- `event-platform/src/app/academy/page.tsx` ✅ Ready
- Deploy to `buildtheeventai.com`

**Dashboard** (for students):
- `event-platform/src/app/academy/dashboard/page.tsx` ✅ Ready
- Requires Supabase `.env.local`

**Video Templates**:
- `ACADEMY_MODULE_VIDEO_TEMPLATES.md` ✅ 4 templates ready
- Copy → HyperFrames → render → upload

**Automation**:
- `ACADEMY_N8N_WORKFLOWS.md` ✅ 7 base workflows ready
- `ACADEMY_N8N_WORKFLOWS_SOCIAL.md` ✅ 6 new workflows ready

**Launch Plan**:
- `ACADEMY_LAUNCH_CAMPAIGN.md` ✅ 2-week plan ready
- Follow day-by-day

---

## ⚡ Fastest Path (48 Hours)

### Friday (4 hours)
```bash
# 1. Deploy landing page
cd event-platform && npm run build
# Deploy to Vercel / set domain

# 2. Create Discord server
# Channel structure: ACADEMY_DISCORD_SETUP.md
# Copy/paste welcome message

# 3. Prepare Module 1 video
# Copy HTML from: ACADEMY_MODULE_VIDEO_TEMPLATES.md → "Module Intro"
# Save as: rhythmix-module-1-30s/index.html
# Generate audio: npx --yes hyperframes@0.4.42 tts
# Render: npx --yes hyperframes@0.4.42 render
# Upload to YouTube (unlisted)
```

### Saturday (3 hours)
```bash
# 1. Set up n8n
# Import: Workflow 1 (Enrollment → Welcome)
# Test: fake enrollment through landing page

# 2. Prepare launch posts
# Copy templates from: ACADEMY_LAUNCH_CAMPAIGN.md
# Schedule in: Buffer, Later, or Hootsuite

# 3. Set up email list
# ConvertKit or Mailchimp
# Create welcome sequence (3 emails)
```

### Sunday (Launch Day - 2 hours)
```bash
# 8 AM ET:
# 1. Post ProductHunt link
# 2. Post HN link
# 3. Post Twitter thread
# 4. Post Reddit (r/startups, r/webdev)
# 5. Email your list
# 6. Post in Discord communities

# 10 AM-5 PM:
# Respond to every comment, DM, question
# Monitor analytics
# Share first wins

# Expected: 5-10 signups, $1.5K-$10K revenue
```

---

## 💰 Revenue Model (Quick Math)

**If 20 students enroll in first week:**

- 10 @ $297 (Starter) = $2,970
- 7 @ $897 (Pro) = $6,279
- 3 @ $1,997 (Premium) = $5,991
- **Total**: ~$15,240

**At 30% refund rate** (first-time course):
- Refunds: ~$4,500
- Net: ~$10,740

**By week 2** (typical pattern):
- First week total: ~$10,740
- Second week new signups: 10 students (~$5,000)
- **Cumulative**: ~$15,740 (minus 30% refund buffer)

---

## ✅ Pre-Launch Checklist

### Landing Page
- [ ] Domain set to `buildtheeventai.com`
- [ ] Analytics enabled
- [ ] Email capture working (test signup)
- [ ] Pricing shows correctly
- [ ] Mobile responsive (test on phone)

### Product
- [ ] Discord server created
- [ ] Module 1 video rendered + uploaded
- [ ] Dashboard ready (`.env.local` configured)
- [ ] n8n Workflow 1 tested (enrollment → email)

### Marketing
- [ ] ProductHunt draft written
- [ ] Twitter thread drafted + queued
- [ ] Email list imported (if you have one)
- [ ] Reddit posts scheduled
- [ ] LinkedIn post written

### Mental
- [ ] You've recorded your voice/presence
- [ ] You're ready to respond to 100+ messages
- [ ] You're OK with potential refunds
- [ ] You're committed to office hours (Tue/Fri)

---

## 🚀 Go/No-Go Decision

**GO if:**
- ✅ Landing page is deployed
- ✅ Module 1 is ready
- ✅ Discord server is live
- ✅ You can commit 8-10 hours/week for 12 weeks
- ✅ You're comfortable with public speaking (office hours)

**NO-GO if:**
- ❌ Module scripts need major rewrites
- ❌ You don't have 8+ hours/week
- ❌ Landing page isn't deployed
- ❌ You're not confident in the curriculum

---

## 📞 Support

**If something breaks:**
1. Check the error message
2. Search in relevant doc:
   - Landing page issues → `event-platform/src/app/academy/page.tsx`
   - Deployment issues → check Vercel/Cloudflare logs
   - Video issues → `ACADEMY_MODULE_VIDEO_TEMPLATES.md`
   - Workflow issues → `ACADEMY_N8N_WORKFLOWS.md`

**If you need to skip something:**
- No Discord? Use Telegram or Slack instead
- No module 1? Pre-record it this weekend
- No n8n? Use Zapier or manual emails instead
- No exact domain? Use `eventai-academy.vercel.app` for now

---

## 🎯 Your Decision

You have:
- ✅ Landing page (fully designed + branded)
- ✅ Dashboard (fully designed + branded)
- ✅ Video templates (4 ready-to-use)
- ✅ Automation (13 workflows documented)
- ✅ Launch plan (detailed 2-week plan)

**You decide:**

**Option A**: Ship in 48 hours (risky but fast)  
**Option B**: Beta test for 2 weeks (safer)  
**Option C**: Wait and polish (slowest)

What matters: **You choose and commit.**

The work is done. Time to ship.

🚀

---

## One-Line Summary

You've built a complete EventAI Academy with RHYTHMIX branding. Everything is documented. Deploy the landing page, set up Discord, record module 1, launch in 48 hours. Ship it.
