# SimpleX Chat — Setup & Reference

## Overview

**SimpleX Chat** is a privacy-first messaging platform with **no user identifiers
of any kind** — not even random numbers. Instead of profile IDs, it uses
**pairwise per-queue identifiers** (separate addresses for each one-directional
message queue), so the servers and any observers never learn your contact graph —
who you talk to and when. Messages are passed through redundant, disposable relay
nodes; servers hold messages only until delivered (current SMP relays use
in-memory storage) and keep no user records.

Security model in one line: **double-ratchet end-to-end encryption** (same family
as Signal) with an **additional NaCl cryptobox layer**, a **post-quantum-resistant
key exchange** on every ratchet step, and metadata sealed inside the encrypted
envelope. Protocols and cryptography were reviewed by Trail of Bits (Oct 2022 +
Jul 2024). Licensed **AGPLv3** (name/logo/assets are trademarked separately).

> ### How this fits the RHYTHMIX repo
> A reference doc, not a pipeline tool. Two practical angles for this repo:
> 1. **Private dev/ops channel** — a metadata-private way to coordinate
>    drops, share links, or receive alerts (it runs a **terminal CLI** on
>    macOS/Linux/Windows and as desktop apps).
> 2. **Chat bots / automations** — the CLI runs as a local **WebSocket server**,
>    so you can drive notifications or build bots in any language (TypeScript
>    client + JS bot examples exist; Haskell templates too). That overlaps with
>    the repo's automation interest (n8n workflows, Hermes/Telegram gateways) —
>    e.g. a render-finished or "new download bundle" notifier that's fully private.
>
> It is **not** an AI coding agent (unlike `SETUP-OPENCODE.md` /
> `SETUP-FREEBUFF.md`) and it doesn't replace any RHYTHMIX skill.

## Install — mobile & desktop apps

| Platform | Where |
|---|---|
| Android | Google Play, or direct **APK** |
| Android (open-source store) | **F-Droid** |
| iOS | App Store, or **TestFlight** preview (new features 1–2 weeks early, capped at 10,000 users) |
| Desktop | Linux / macOS / Windows desktop client |

Links are on the [SimpleX site](https://simplex.chat). The desktop app can use a
mobile profile (link the two via a quantum-resistant protocol).

## Install — terminal (console) CLI

The CLI runs on Linux, macOS, and Windows. Quick install:

```bash
curl -o- https://raw.githubusercontent.com/simplex-chat/simplex-chat/stable/install.sh | bash
```

Then start it:

```bash
simplex-chat
```

See the upstream docs for installing and using the terminal app. On this repo's
Mac, the SimpleX CLI is wired into **`Install-Downloads.command`** (it runs the
official install script above, and skips if `simplex-chat` is already present).

## Making a connection

There are no usernames to search. To connect you **share a one-time invitation
link or scan a QR code** (in person, on a video call, or over any channel where
you can confirm the sender). The sharing channel doesn't have to be secure — you
just need to trust who sent it. After connecting you can verify a **security
code** out-of-band. An optional, temporary **user address** can be shared more
broadly and revoked later — this is also the spam/abuse defense: with no
identifier, nobody can contact you unless you handed them a link.

## For developers / bots

You can build chat bots and chat-based services by running the **`simplex-chat`
CLI as a local WebSocket server** and talking to it over WS:

- Execute individual chat commands from a shell script (e.g. send a message as
  part of a render/deploy pipeline).
- Use the **TypeScript SimpleX Chat client** + the **JavaScript chat-bot example**.
- Haskell: simple and advanced bot templates.
- New **bot API reference** is largely auto-generated from the core library types,
  so it tracks the implementation.

Community: the `#simplex-devs` group (join via the app) is for people building on
the platform — bots, integrations, social apps.

## Privacy notes & limitations

- **What's protected:** identity, profile, contacts, and metadata (who/when),
  message content (double ratchet + extra layer), message size (content padding),
  server-side timestamps (sealed in the encrypted envelope). TLS 1.2/1.3 only,
  restricted cipher suites; `tlsunique` channel binding to resist replay.
- **IP-address protection:** from v6.0 clients use **private message routing** by
  default; messaging servers can also be reached over **Tor**; the local database
  is encrypted with a passphrase.
- **Still a work in progress:** it's a relatively early-stage platform (mobile
  apps launched Mar 2022). Planned but not fully shipped: automatic queue
  rotation/redundancy, message "mixing" (timing-correlation defense), reproducible
  client builds. Decide if the current state fits your threat model.
- **Servers:** default servers are best-effort (historically >99.9% uptime, no
  SLA). You can run **your own SMP/XFTP servers** and still talk to people on the
  preset servers.

## Sources

- Site & docs: <https://simplex.chat>
- Whitepaper, SimpleX Chat Protocol, and Trail of Bits audit announcements are
  linked from the site.
- **Security issues:** follow the upstream Security Policy — do **not** file
  security vulnerabilities as GitHub issues.
