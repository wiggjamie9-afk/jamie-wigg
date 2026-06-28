# HookLab — Free Viral Hook Generator

A free, no-cost web tool that gives people scroll-stopping video hooks (the
first line of a TikTok/Reel/Short). It runs 100% in the browser — no server,
no API keys, no monthly fees. It's also your **lead magnet**: every visitor
can join your email list.

**Live URL (after this deploys):**
`https://rhythmixapp.com.au/tools/hook-generator/`

---

## Why this tool (the strategy)

A product only makes money if people see it. A genuinely useful *free* tool:

1. Pulls free traffic over time (people search "tiktok hook generator").
2. Gives you something real to post about ("I built a free hook tool →").
3. Turns visitors into **email subscribers** — that list is the real asset.
4. Later, you sell to that list (a hooks ebook, templates, a course).

So the flow is: **post videos → people visit the tool → they join your list → you sell to them.**

---

## Set it up (2 minutes, optional)

Open `index.html` and edit the two lines at the top of the `<script>` CONFIG block:

```js
const BIO_URL = "https://hoo.be";   // 1) your real hoo.be link
const FORM_ENDPOINT = "";           // 2) your email form endpoint
```

### 1. `BIO_URL`
Paste your hoo.be page link. It's used in the footer ("Follow me →").

### 2. `FORM_ENDPOINT` (to actually collect emails)
The tool works without this — emails are saved in the visitor's browser and a
success message shows. To collect emails **for real**, get a free endpoint:

1. Go to [formspree.io](https://formspree.io) → sign up free.
2. Create a **New form** → copy its URL (looks like `https://formspree.io/f/abcd1234`).
3. Paste it as `FORM_ENDPOINT`.

That's it — every signup now lands in your Formspree inbox (free tier covers
50 submissions/month; upgrade later if needed). You can also swap in
Mailchimp, ConvertKit, Beehiiv, etc. — anything that accepts a POST.

---

## How to drive traffic to it

1. **Add it to hoo.be:** open your page → *Add content* → link →
   title "🪝 Free Hook Generator" → paste the live URL.
2. **Post about it:** make 3–5 short videos like
   *"I made a free tool that writes your video hooks — here's how"* and point
   to your bio link.
3. **Pin a comment** with the link on every post.
4. Repeat. Consistency beats perfection.

---

## Editing the hooks

The hook templates live in the `FRAMEWORKS` object inside `index.html`.
Each line uses `{t}` (your topic) or `{T}` (capitalised topic). Add your own
lines anytime — no build step, just save and re-upload.

---

*Built as a starting point. The tool is the easy 20%; posting consistently is
the other 80%. You've got this.*
