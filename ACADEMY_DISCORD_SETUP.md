# EventAI Academy — Discord Community Setup

## Channel Structure

Create the following channels in your Discord server:

### 🎯 Announcements & Info
- **#announcements** — Weekly module releases, important updates
- **#faq** — Pinned answers to common questions
- **#resources** — Links to templates, guides, code repos
- **#wins** — Celebrate student launches and achievements

### 💬 Learning & Support
- **#module-1-to-5** — Discussion for weeks 1-2 modules
- **#module-6-to-10** — Discussion for weeks 3-4 modules
- **#module-11-to-15** — Discussion for weeks 5-6 modules
- **#module-16-to-20** — Discussion for weeks 7-8 modules
- **#module-21-to-28** — Discussion for weeks 9-12 modules
- **#general** — Off-topic, random stuff, memes

### 🤝 Community
- **#introductions** — New students introduce themselves
- **#show-and-tell** — Students share their projects
- **#job-opportunities** — Job postings (for graduates)
- **#accountability-partners** — Find weekly accountability buddies

### 🏢 Admin Only
- **#admin** — Internal notes, student issues, marketing ideas

---

## Discord Bot Setup

### Create a Discord Bot

1. Go to Discord Developer Portal (discord.com/developers)
2. Create New Application → Name: "EventAI Academy Bot"
3. Go to Bot tab → Add Bot
4. Copy the token (you'll need this)
5. Under "INTENT", enable:
   - Message Content Intent
   - Server Members Intent
6. Under "Oauth2" → URL Generator:
   - Scopes: bot
   - Permissions: send messages, manage roles, add reactions
7. Copy the generated URL, open it, invite the bot to your server

### Bot Functions

The bot handles:

**1. Welcome Messages**
```
@bot welcome [name]
→ Posts welcome message in #introductions
→ Assigns "Student" role
```

**2. Module Reminders**
```
@bot module [week]
→ Posts reminder in #announcements
→ Pins video link and code repo
→ Notifies @students
```

**3. Checkpoint Tracking**
```
@bot checkpoint [week] [link]
→ Records submission
→ Notifies mentors
→ Updates student progress
```

**4. Achievement Reactions**
```
When someone says "shipped" or "deployed":
→ Bot reacts with 🚀
→ Posts celebration message
```

---

## Discord Bot Code (for n8n or server)

If using n8n, add a webhook node that listens for Discord messages:

```javascript
// Discord webhook handler
const discord = require('discord.js');
const client = new discord.Client({ intents: ['GUILD_MESSAGES', 'DIRECT_MESSAGES'] });

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  // Welcome command
  if (message.content === '!welcome') {
    message.reply('Welcome to EventAI Academy! 🎉');
  }

  // Module announcement
  if (message.content.startsWith('!module')) {
    const week = message.content.split(' ')[1];
    const announcement = `
📚 **Module ${week} is live!**
Watch here: https://academy.eventai.com/modules/${week}
Code: https://github.com/eventai-academy/module-${week}
    `;
    message.channel.send(announcement);
  }

  // Celebrate launches
  if (message.content.includes('shipped') || message.content.includes('deployed')) {
    message.react('🚀');
    message.reply('🎉 Congratulations on shipping! Post in #wins so we can celebrate!');
  }
});

client.login(process.env.DISCORD_TOKEN);
```

---

## Member Roles

Create these roles:

| Role | Permissions | Who Gets It |
|------|-----------|-----------|
| **Student** | Can post in #general, see all module channels | Everyone on enrollment |
| **Pro Student** | + Can request 1-on-1 feedback, early access | Pro tier students |
| **Premium Student** | + Can create custom channels, priority support | Premium tier students |
| **Mentor** | Can moderate, create channels, manage roles | You + guest mentors |
| **Alumni** | Access to #alumni channel for life | Graduates |

---

## Onboarding Flow

### Week 1: Welcome Email
```
Subject: Welcome to EventAI Academy! 🚀

Hi [name],

Congrats on enrolling in EventAI Academy!

Here's what happens next:

1. Join Discord: [invite link]
2. Introduce yourself in #introductions
3. Watch Module 1 (15 min): [link]
4. Post in #module-1-to-5 with one question you have

That's it for day 1. See you in Discord!

— Jamie
```

### Week 1: First Discord Message
After they join, bot sends:

```
@[name] Welcome to EventAI Academy! 👋

Here's how to get the most from Discord:

📌 **Pinned:** All modules, templates, guides
💬 **Questions:** Post in #module-X channels
🎉 **Wins:** Share in #wins when you ship
🤝 **Partners:** Find accountability buddy in #accountability-partners

You're in Week 1. This week's modules: [links]

Let's build! 🚀
```

---

## Discord Moderation Rules

Post in #announcements on day 1:

```
📋 **Community Guidelines**

We're all here to learn and build together. Please:

✅ Be respectful and kind
✅ Search for answers before asking
✅ Share your wins in #wins
✅ Help others when you can
✅ Keep #general on-topic (semi-related to tech/business)

❌ No self-promotion (outside of #wins)
❌ No spam or unrelated content
❌ No gatekeeping or discouragement

Questions? DM me directly.

Let's build something amazing together! 🚀
```

---

## Engagement Tactics

### Weekly Standup
Every Monday in #announcements:
```
🌟 **This Week's Focus**

Module: [X]
Topics: [list]
Checkpoint due: Friday

What are you building? React with your tier! 🚀
```

### Showcase Fridays
Every Friday in #show-and-tell:
```
What did you build this week? Screenshot, link, or description.

Even if it's broken — post it! We learn together. 💪
```

### Monthly Q&A
Last Friday of month, live in Discord:
```
🎤 **Live Q&A with Jamie**

Topic: [This month's topic]
Time: Friday 5 PM ET
Where: #voice-channel

Ask anything! Questions about modules, code, your platform, business models, pricing, etc.

See you there!
```

---

## Automation: Auto-Moderation

If using Discord.js + n8n:

**Spam Detection**
- Delete messages with excessive links (more than 3)
- Alert if same message posted 3+ times

**Keyword Alerts**
- If "stuck" or "error": auto-reply with #faq and support links
- If "shipped" or "deployed": celebrate with reactions

**Member Timeout**
- If member hasn't posted in 21 days: send DM check-in
- If member has been inactive 60+ days: suggest they revisit course

---

## Growing the Community

**Inside Discord:**
- Celebrate every launch publicly
- Share student wins on Twitter (with permission)
- Give away monthly prizes to most helpful members
- Feature "Student Spotlight" weekly

**Outside Discord:**
- Quote positive testimonials in marketing
- Ask graduates to refer friends (affiliate reward: 10% of their tuition)
- Highlight best projects in social media

---

## Example Welcome Post (Send on Launch Day)

```
🎉 **Welcome to EventAI Academy!**

You did it — you enrolled. Now let's build something amazing.

**What you're getting:**
✓ 28 video modules (4 hours total)
✓ Ready-to-use code templates
✓ Live community of 50+ builders
✓ Direct access to me (Jamie)

**How Discord works:**
1. Read #resources (guides and templates)
2. Ask questions in your module channel
3. Share wins in #wins
4. Find accountability partner in #accountability-partners
5. Join live sessions (Tuesdays + Fridays)

**This week:**
- Module 1 (15 min) + Module 2 (12 min)
- Introduce yourself in #introductions
- Post one question in #module-1-to-5

You're not alone in this. Hundreds of people have built platforms in this exact way. You can too.

Let's go build! 🚀

— Jamie
```

---

## Discord Resources

- **Discord.js Docs:** https://discord.js.org
- **Discord Developer Portal:** https://discord.com/developers
- **n8n Discord Integration:** https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.discord/
- **Discord Moderation Bots:** UnbelievaBoat, Arcane, Dyno

---

## Summary

Your Discord is your **primary community hub**. It's where:
- Students find support 24/7
- You announce updates
- People celebrate wins
- New students onboard
- Alumni stay connected

Make it feel alive, helpful, and celebratory. That's how people stay engaged and finish the program.
