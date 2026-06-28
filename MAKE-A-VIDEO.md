# Make a video from a text prompt (from your phone)

Plain-English guide. No coding. You type one line; a video comes back.

> **Why not SkyReels-V2?** SkyReels-V2 needs a powerful graphics card (GPU) on
> the machine running it. This setup has no GPU, and a phone can't run it
> either. Instead this uses a **hosted** AI (runs on someone else's GPU in the
> cloud) so you get the same "type a prompt → get a video" result with nothing
> to install and no machine to rent. You pay a few cents per clip.

---

## One-time setup (about 2 minutes, do this once)

You need a **Replicate token**. Replicate is the service that actually makes the
video. Think of the token as a password that lets this project use your account.

1. Go to **https://replicate.com** and sign up (free to make an account).
2. Open **https://replicate.com/account/api-tokens** and copy the token
   (it starts with `r8_`).
3. In Claude Code, just say: **"Here's my Replicate token: r8_…"**
   Claude saves it for you in a private file that is **never shared or committed**
   to GitHub.

That's it. You never have to do this again.

> Billing: add a card on Replicate. A short clip costs a few cents. You can set
> spend limits in your Replicate account.

---

## The one command

Once your token is saved, this is the **only** thing you type to make a video:

```
/dream <describe your video>
```

Real examples you can copy and change the words:

```
/dream a lone red fox stepping slowly through a snowy pine forest at dawn, soft morning light, shallow depth of field, slow camera push-in, photorealistic
```

```
/dream a coffee cup on a wooden table, steam rising gently, warm kitchen light, steady camera, cinematic
```

Claude makes the clip and hands you back the file. It does **not** post or
publish anything — it just makes the video and waits for you.

---

## How to write a prompt that looks good

The video lives or dies on the prompt. Fill in the brackets:

**A scene from scratch**
```
A [WHAT IT IS] in [WHERE], [WHAT IT'S DOING], [LIGHTING],
[CAMERA MOVE], photorealistic, highly detailed.
```

**Tip:** describe the **light** and the **camera move**, not just the subject.
That's the difference between "looks AI-made" and "looks filmed."

---

## Good to know

- **No sound.** Video only — no music or voices. (You can add audio after, or
  ask Claude to generate music/voiceover separately with `/dream`.)
- **First clip is the slowest** while the cloud warms up; later ones are quicker.
- **Blurry/weird result?** Usually a vague prompt. Add detail about lighting and
  camera movement and try again.
- **Length:** keep it short (a few seconds) for best quality and lowest cost.

---

## If something breaks

Just tell Claude what it said. Common ones:

| Message | What it means | Say to Claude |
|---|---|---|
| `REPLICATE_API_TOKEN is not set` | Token not saved yet | "Save my Replicate token: r8_…" |
| A clip fails or looks wrong | Prompt or model hiccup | "Try again with more detail" / "make it shorter" |
| You want higher quality | Default model is the cheap one | "Use Veo 3 for this one" (costs more) |

---

*Technical note for anyone curious: the one command `/dream` routes a video
request to the `replicate_video` tool in the `creative-stack` MCP server
(`.claude/mcp/creative-stack/`), which calls HunyuanVideo on Replicate by
default. Token lives in `.claude/settings.local.json` (gitignored). Setup details
in `.claude/mcp/creative-stack/README.md`.*
