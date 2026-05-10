# Cowork Content System — Setup

This folder is the home of an AI content system designed to be opened as a Cowork workspace. The structure, master instructions (`CLAUDE.md`), and next-step prompts are scaffolded for you. The pieces below need your input to finish.

## What's already done

- Folder structure created (`context/`, `transcripts/`, `drafts/{linkedin,instagram,threads,tiktok,carousel-briefs}`, `review/`, `published/`, `skills/`, `performance/`, `research/`, `assets/`).
- `CLAUDE.md` master instruction file written. Cowork reads this every session.

## What you need to do next

### Step 1 — Open this folder in Cowork

In Cowork, hit "Add Workspace" and point it at this `cowork-system/` folder.

### Step 2 — Build your context files

Open a fresh Cowork chat for each one and paste the prompt. Save outputs to `/context/`.

#### `brand-voice.md`

```
I want to write a brand voice file for my Ai content system.

Ask me 8 to 10 questions to figure out:
- How my content should feel (tone, energy)
- Words and phrases I always use
- Words and phrases I refuse to use
- How I open posts (hooks I trust, hooks I ban)
- My sentence structure preferences
- A 2-line voice test I can apply to any draft

After I answer, write the file as brand-voice.md in markdown. Save it to my /context/ folder.
```

#### `audience-profile.md`

```
I want to write an audience profile for my content system.

Ask me 8 questions to figure out:
- Who they are (job, life stage, income, mindset)
- What they're trying to achieve
- What pains them
- What they believe right now (even if wrong)
- The exact questions they ask out loud
- What earns their attention
- What loses them instantly

Save the result as audience-profile.md in my /context/ folder.
```

#### `platform-rules.md`

```
Write a platform-rules.md file for my content system.

Cover these platforms: LinkedIn, Instagram, Threads, TikTok.

For each, include:
- Character limits (post body, headline if relevant)
- Format rules (paragraphs, line breaks, links)
- Hashtag rules
- What kind of opening hook performs there
- What loses on that platform

Use my actual research on each platform, not assumptions. If unsure, say so. Save to /context/.
```

#### `content-themes.md`

```
Help me define 5 to 6 content pillars for my brand. Ask me about:
- The transformation I sell or stand for
- The 3 biggest mistakes my audience makes
- The 3 frameworks or insights I'm known for
- What I want to be famous for in my niche

Output a content-themes.md file with each pillar named, described in 2 lines, with example post angles for each. Save to /context/.
```

#### `brand-style.md` (optional — only for custom Nano Banana visuals)

```
Help me write a brand-style.md file that defines my visual identity for AI-generated carousel slides. Ask me about:
- Primary background colour (hex code)
- Accent colour or colours (hex codes, max 2)
- Background texture or pattern (e.g. circuit lines, watercolour wash, gradient mesh, paper texture, none)
- Overall style direction (photoreal, 3D illustrated, minimal flat, hand-drawn, retro)
- Typography preference (sans-serif, monospace, serif, mixed)
- Repeating visual components I want on slides (e.g. terminal mockups, quote frames, polaroid frames, sticker callouts)
- Whether I have a character or avatar that should appear on cover and closing slides (describe if yes)
- The closing element on every slide (handle, watermark, logo position)
- The aspect ratio I post in (4:5 for IG carousel, 1:1 for square, 9:16 for TikTok stills)

Output a brand-style.md file with two parts:
1. The full brand brief (above answers, structured)
2. A "brand block": one paragraph under 400 characters that I can paste at the top of every Nano Banana prompt to keep visuals consistent. Include the background, accent colours, texture, style, and aspect ratio in the block.

Save to /context/.
```

### Step 3 — Build your skills

Use Cowork's built-in `skill-creator`. Build skills 1, 4, and 6 first (Research, Instagram, Visual) — the rest can come later. Each skill prompt is in this file; expand the section you need and paste it into Cowork.

<details>
<summary>Skill 1 — Research Agent</summary>

```
Use the skill-creator skill to build me a "Research Agent" skill.

What it does:
Given a topic, run web research and produce a one-page brief I can use to draft content. The brief should be sharp, opinionated, and sourced.

When to trigger it:
"Research [topic]"
"Find me angles on [topic]"
"What's new with [topic]"

What it should produce:
A markdown brief with:
1. The 3 most interesting angles (one line each)
2. Top 3 stats or data points (with source links)
3. The contrarian take most people miss
4. 2 to 3 example hooks I could open a post with
5. What to avoid (overused angles, fluff takes)

How it should work:
1. Read /context/brand-voice.md and /context/audience-profile.md first
2. Use web search to pull fresh sources from the last 3 months
3. Filter angles through my brand voice and audience pain points
4. Save the brief to /research/[topic-slug]-[date].md
5. Print a 4-line summary in chat so I can decide if it's worth drafting from

Voice rule: apply the rules in /context/brand-voice.md. Lead with value, never with theory.
```

</details>

<details>
<summary>Skill 2 — LinkedIn Writer</summary>

```
Use the skill-creator skill to build me a "LinkedIn Writer" skill.

What it does:
Drafts a LinkedIn post in my brand voice, optimised for LinkedIn's format and audience.

When to trigger it:
"Draft a LinkedIn post on [topic]"
"Turn this brief into a LinkedIn post"

What it should produce:
A LinkedIn-ready post saved to /drafts/linkedin/[topic-slug]-[date].md.

How it should work:
1. Read /context/brand-voice.md, /context/audience-profile.md, /context/platform-rules.md, /context/content-themes.md
2. If I gave it a research brief, use it. If not, ask me one clarifying question to lock the angle.
3. Draft the post using LinkedIn's best format: short paragraphs, line breaks for breathing room, clear hook in line 1, payoff in line 2 or 3.
4. Apply every voice rule from /context/brand-voice.md and every LinkedIn-specific rule from /context/platform-rules.md. Do not invent rules that aren't in those files. If a rule seems missing, flag it and ask me before drafting.
5. Universal best practice: lead with the insight (not a setup line), end with a question or a clear takeaway (not a generic CTA), keep it tight.
6. Length: defer to whatever /context/platform-rules.md specifies. If unspecified, aim for 1200 to 1800 characters and go shorter when sharper.
7. Output the post in chat, then save the file.
8. Ask me if I want to iterate before moving on.
```

</details>

<details>
<summary>Skill 3 — Threads Writer</summary>

```
Use the skill-creator skill to build me a "Threads Writer" skill.

What it does:
Drafts a Threads post (or a 2-3 post chain) in my voice.

When to trigger it:
"Draft a Threads post on [topic]"
"Threads version of this"

What it should produce:
A Threads-ready draft saved to /drafts/threads/[topic-slug]-[date].md.

How it should work:
1. Read all four context files first.
2. Threads is short, sharp, and conversational. Defer to /context/platform-rules.md for character limit and chain length, otherwise default to 500 characters max per post and 3 posts max in a chain.
3. Hook must land in the first 6 words.
4. Format: short lines, lots of white space, plain English.
5. Apply every voice rule from /context/brand-voice.md. Do not invent rules that aren't in that file.
6. If the topic is heavy, use a multi-post chain. If it's a single insight, one post is better.
7. Output in chat, save to file, ask me if I want to iterate.
```

</details>

<details>
<summary>Skill 4 — Instagram Writer</summary>

```
Use the skill-creator skill to build me an "Instagram Writer" skill.

What it does:
Drafts Instagram captions for two formats:
1. Carousel post caption (paired with a carousel built by the Visual Generator)
2. Single-image or feed post caption

When to trigger it:
"Draft an Instagram caption for this carousel"
"IG version of this"
"Instagram feed post on [topic]"

What it should produce:
A draft saved to /drafts/instagram/[topic-slug]-[date].md.

How it should work:
1. Read all four context files first.
2. Ask which format: carousel caption or feed post.
3. For a carousel caption:
   - First line is the hook. Has to land in 8 words or less because Instagram truncates.
   - 2 to 4 short paragraphs after the hook.
   - End with a clear ManyChat trigger: "Comment [KEYWORD] and I'll DM you the [resource]."
   - Length: 800 to 1500 characters.
4. For a feed post:
   - Same hook rule.
   - Tighter overall, 400 to 800 characters.
5. Hashtag rules: defer to /context/platform-rules.md. If unspecified, default to 8 to 15 hashtags, mix of broad/niche/tool-specific, placed at the end of the caption.
6. Apply every voice rule from /context/brand-voice.md.
7. Output in chat, save the file, ask me if I want to iterate.
```

</details>

<details>
<summary>Skill 5 — TikTok Hook + Script</summary>

```
Use the skill-creator skill to build me a "TikTok Hook + Script" skill.

What it does:
Generates a TikTok hook (first 3 seconds) and a 30 to 45 second script body.

When to trigger it:
"Write a TikTok script on [topic]"
"TikTok version of this"

What it should produce:
A draft saved to /drafts/tiktok/[topic-slug]-[date].md.

How it should work:
1. Read all four context files.
2. Generate 3 hook options. Each must be under 12 words and make the viewer need the next sentence.
3. After I pick a hook, write the full script:
   - Hook (chosen)
   - 1-line setup (what we're solving)
   - The demo or insight (the main 20 to 30 seconds)
   - 1-line payoff
   - 1-line CTA: "comment [keyword] and I'll DM you the [resource]"
4. Apply every voice rule from /context/brand-voice.md. Universal craft notes: spoken English, short sentences, no jargon, no fluff.
5. Output in chat, save the file, ask me if I want to iterate.
```

</details>

<details>
<summary>Skill 6A — Visual Generator (template-based)</summary>

```
Use the skill-creator skill to build me a "Visual Generator" skill.

What it does:
Generates branded visuals for my posts using Blotato's pre-built templates.

When to trigger it:
"Generate a visual for this post"
"Make a carousel for this idea"

What it should produce:
An image URL I can use when scheduling, plus the visual saved or referenced from /assets/.

How it should work:
1. Read /context/brand-voice.md to understand the visual tone.
2. Look at the post draft I'm working with.
3. Recommend 2 or 3 Blotato templates that fit the content type, with one line each on why. Wait for me to pick.
4. Common matches:
   - How-to or step-by-step: whiteboard infographic template
   - Bold stat or contrarian take: billboard template
   - Educational with character: classroom template
   - Tool launch or news: TV news broadcast template
   - Quote or pull-line: quote card template
5. Once I pick, generate the visual via Blotato. Poll status until done.
6. Return the image URL and ask if I want to use it or regenerate.
```

</details>

<details>
<summary>Skill 6B — Visual Generator (custom branded via Nano Banana)</summary>

```
Use the skill-creator skill to build me a "Visual Generator (Custom)" skill.

What it does:
Generates a fully branded carousel for my post using Blotato's slideshow template plus Nano Banana. Every slide is a custom image rendered in my brand style.

When to trigger it:
"Generate a custom carousel for this post"
"Build me a Nano Banana carousel"
"Custom visual for this brief"

What it should produce:
A folder of slide URLs in carousel order, plus a saved prompts file I can reuse.

Prerequisites:
- Blotato MCP connected.
- /context/brand-style.md exists with a "brand block" defined.
- A post draft or carousel brief in /drafts/.

How it should work:

1. Read /context/brand-style.md and pull out the brand block (the under-400-char paragraph).
2. Read the post draft or carousel brief I'm working with. Extract:
   - Slide count (default 7 if not specified)
   - Slide-by-slide structure (cover, body slides, CTA close)
   - Headlines, subheads, key copy per slide
3. Confirm the structure with me before writing prompts. Don't guess slide content.
4. For each slide, write a Nano Banana prompt with three parts:
   - The brand block from brand-style.md (identical on every slide)
   - The slide-specific block: layout, copy, any repeating components
   - A closing element (handle, logo, watermark) from brand-style.md
5. Save all slide prompts to /drafts/carousel-briefs/[slug]-nano-banana-prompts-[date].md so I can reuse or tweak them.

Hard rules for prompt writing:
- Every prompt under 900 characters. Count and trim if needed.
- Never use "/" as a separator inside subheads. Rewrite as "First line reads: X. Second line reads: Y."
- Headlines must be the LARGEST text on every slide. State this in the prompt.
- If a slide uses a repeating component (terminal mockup, quote frame, etc.), describe it explicitly using the spec from brand-style.md.

Generation workflow:

6. Cover dry-test first. Generate slide 1 alone. Use blotato_create_visual with:
   - templateId: 53cfec04-2500-41cf-8cc1-ba670d2c341a
   - model: nano-banana-pro
   - aspectRatio: 4:5 (or whatever brand-style.md specifies)
   - slidePrompts: [slide 1 prompt]
7. Poll blotato_get_visual_status until done. Return the cover URL to me. Wait for approval. Iterate until it's right.
8. Once cover is approved, generate slides 2 to N in a single Blotato call with the full slidePrompts array.
9. Poll status. Render time is roughly 30 seconds per slide. Re-poll every 60 seconds while in generating-script or generating-media.
10. When done, return all image URLs in carousel order.
11. If any individual slide has a clear text-render error, regenerate that slide alone via single-slide call. Don't rerun the whole batch.

Output:
- All slide URLs printed in chat in order.
- Prompts file saved to /drafts/carousel-briefs/.
- Ask me if I want to use the set, regenerate any specific slide, or tweak the brand block.
```

</details>

<details>
<summary>Skill 7 — Auto-Scheduler</summary>

```
Use the skill-creator skill to build me an "Auto-Scheduler" skill.

What it does:
Schedules an approved post to one or more platforms via Blotato.

When to trigger it:
"Schedule this post for [date and time]"
"Schedule the LinkedIn version for tomorrow at 9am"

What it should produce:
A confirmed scheduled post in Blotato.

How it should work:
1. Confirm the platform, the post body, the visual URL (if any), and the exact date and time with me.
2. Never schedule without my explicit yes.
3. Call the Blotato post creation tool with all required fields.
4. Confirm in chat once scheduled, with a link to the scheduled post.
5. Move the draft from /drafts/ to /published/ once scheduled.
```

</details>

<details>
<summary>Skill 8 — Performance Reviewer</summary>

```
Use the skill-creator skill to build me a "Performance Reviewer" skill.

What it does:
Reviews my last 30 days of content performance and updates my context files so the system gets smarter.

When to trigger it:
"Run my monthly performance review"
"Performance review for [month]"

What it should produce:
A monthly review file in /performance/[month]-review.md, plus updated context files where relevant.

How it should work:
1. Ask me to upload or paste my last 30 days of analytics (CSVs from each platform, or screenshots, or manual numbers).
2. Read my current /context/ files and /published/ posts so it knows what was tested.
3. Identify:
   - Top 3 performing posts (and what they had in common)
   - Bottom 3 performing posts (and what dragged them)
   - Hooks that landed vs flopped
   - Topics that resonated vs missed
   - Format patterns (carousel vs single image vs text-only)
4. Output a one-page review with clear recommendations.
5. Ask my permission, then update /context/best-performers.md with the top examples and tweak /context/content-themes.md if a theme is dying or a new one is emerging.
6. Save everything to /performance/.
```

</details>

<details>
<summary>Weekly Session wrapper (optional)</summary>

```
Use the skill-creator skill to build me a "Weekly Session" skill.

What it does:
Runs my full weekly content production sequence end to end, from one input to scheduled posts.

When to trigger it:
"Run my weekly content session for [topic]"
"Weekly session"

How it should work:
1. Confirm the topic and the input source (transcript file, paste, URL, or topic line) before starting.
2. Run Research Agent and present the brief. Wait for my approval.
3. Run Instagram Writer, LinkedIn Writer, Threads Writer, and TikTok Hook + Script in that order. After each draft, pause for me to approve or iterate.
4. Run Visual Generator for the Instagram carousel and the LinkedIn carousel. Confirm the template before generating.
5. Once everything is approved, ask me for the schedule (date and time per platform).
6. Run Auto-Scheduler.
7. Print a final summary: what got drafted, what got scheduled, anything flagged for review.
```

</details>

### Step 4 — Connect Blotato to Cowork

1. Sign up at [blotato.com](https://blotato.com) on a paid plan (Starter covers everything here).
2. Inside Blotato → Settings → connect every social platform you'll post to (LinkedIn, Instagram, Threads, TikTok, Facebook, YouTube). Verify each shows green "connected".
3. Settings → API Keys → "Create new key". Save it.
4. In Cowork → Settings → Connectors → search Blotato → Connect. Use OAuth if available; otherwise add MCP server manually with URL `https://mcp.blotato.com/mcp`, header `blotato-api-key`, value = your API key.
5. Test in a fresh chat: `Use Blotato to list my connected accounts.`
6. Discover and save template IDs: `Use Blotato to list available visual templates and save the IDs to /context/blotato-templates.md.`

For the custom Nano Banana path, the only template ID needed is the slideshow: `53cfec04-2500-41cf-8cc1-ba670d2c341a`.

### Step 5 — Set up ManyChat (Instagram capture loop)

1. Sign up at [manychat.com](https://manychat.com). Free tier works to start; ManyChat Pro ($15/mo) unlocks the Claude integration.
2. Connect Instagram (and Facebook business page if you have one). Skip TikTok.
3. Build first automation: Trigger = keyword in a comment on a specific IG post (e.g. `SYSTEM`). Action = DM the resource link.
4. Test from a friend's account before going live.
5. Use the same keyword across content for the same offer. On TikTok / LinkedIn CTAs: "Comment SYSTEM on my Instagram post and I'll DM you the guide."

Optional Claude upgrade: ManyChat Pro + an Anthropic API key (separate from Claude Pro) → ManyChat → Settings → Integrations → Claude → paste API key. Use a Claude action block inside flows to draft adaptive replies and store the response in a custom field referenced as `{{custom_field}}` in the DM template.

### Step 6 — Run weekly + Step 7 — Monthly review

Weekly: drop a transcript / idea / URL into `/transcripts/` and ask Cowork "Run my weekly content session for [topic]". Approve at each gate.

Monthly: trigger Performance Reviewer on day 30. Don't wait.

## Build order recommendation

1. Context files (Step 2) — non-negotiable foundation.
2. Skills 1, 4, and 6 — get one full Instagram carousel out the door first.
3. Connect Blotato (Step 4).
4. Skill 7 (scheduler) once you have approved drafts.
5. Skills 2, 3, 5, 8 + Weekly Session wrapper.
6. ManyChat (Step 5) once content is live and you have a lead magnet ready.
