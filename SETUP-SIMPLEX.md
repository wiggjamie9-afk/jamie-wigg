# SimpleX Chat — Setup & Reference

## Overview

[SimpleX Chat](https://simplex.chat) is **the first messaging platform with no
user identifiers of any kind** — not even random numbers. Instead of profile IDs,
it uses **pairwise per-queue identifiers** (disposable, unidirectional message
queues relayed through redundant servers), so the *network graph* — who talks to
whom, and when — is hidden from servers and observers. It's "100% private by
design," not just end-to-end encrypted content.

Highlights:

- **No user identifiers** — you can't be contacted unless you share a one-time
  invite link or an optional temporary address; strong anti-spam by construction.
- **Double-ratchet E2E encryption** (same algorithm as Signal) with an
  **additional encryption layer**, plus **post-quantum** key exchange on every
  ratchet step.
- **Client-owned data** — all contacts/groups/messages live on the client
  (locally encrypted); relay servers hold messages only until delivered and keep
  no user records.
- **Self-hostable** — run your own SMP (messaging) and XFTP (file) relays and
  still talk to people on other servers; the protocols are public-domain.
- **Apps everywhere** — Android, iOS, desktop, plus a **terminal/CLI** that
  doubles as a local **WebSocket server** for building chat bots.

**Site**: https://simplex.chat · **Docs / whitepaper**: linked from the site ·
**Repo**: https://github.com/simplex-chat/simplex-chat ·
License: **AGPLv3** (name/logo/assets are *not* covered — separate trademark &
asset licenses).

> ### How this fits the RHYTHMIX repo
> **Niche but real fit** as a *private control + notification channel* for the
> agent/render tooling — not as anything user-facing on the marketing site:
> - **Chat-bot / messaging gateway** — the terminal CLI runs as a local
>   WebSocket server, so a bot can trigger or report on renders. This is the same
>   role `SETUP-HERMES.md` calls out (Telegram/Discord gateways to "drive renders
>   from phone/cron") — SimpleX is the privacy-first alternative to those, with
>   no phone number or account to leak.
> - **TypeScript client** — there's an official TS client + JS chat-bot example,
>   which is the natural integration surface for this repo's Node/TS tooling if a
>   bot is ever wired up.
> - **Private ops notifications** — a self-hosted SMP relay could carry build /
>   deploy / "render finished" pings without standing up an account on a
>   third-party service.
>
> **Not** a fit for: the static marketing site (root `*.html`, GitHub Pages — no
> backend, no comms surface), STARLIGHTMIX Studio auth (that's `SETUP-LOGTO.md`),
> or anything that needs to ship *inside* a distributed binary — note the
> **AGPLv3** copyleft below before linking any SimpleX code into repo software.

## Getting started

### Mobile / desktop apps

Install from Google Play, App Store, F-Droid, or the APK (links on
[simplex.chat](https://simplex.chat)). A desktop client is also available.

### Terminal app / CLI (the relevant one for bots here)

```bash
# Install the terminal client
curl -o- https://raw.githubusercontent.com/simplex-chat/simplex-chat/stable/install.sh | bash

# Then run it
simplex-chat
```

> ⚠️ This pipes a remote script straight into `bash`. Review the script first,
> and in this repo's **ephemeral cloud sandbox** it's of limited use — a CLI
> install here doesn't persist and isn't reachable from your devices. Run it on a
> **persistent host** (your machine or a VPS) where the bot should actually live.

### Self-hosting relays

Run your own **SMP** (messaging) and **XFTP** (file) servers — one-click deploy
options exist (e.g. Linode) and the servers have no external dependencies
(in-memory message storage, persisting only queue records). See the SimpleX repo
and whitepaper for server deployment.

## Key capabilities

| Capability | What it gives you |
|---|---|
| **No user identifiers** | Pairwise per-queue IDs hide the connection graph from servers/observers. |
| **Double-ratchet E2E + extra layer** | Forward secrecy, break-in recovery, plus a second encryption layer. |
| **Post-quantum key exchange** | PQ-resistant ratchet steps on top of the Signal-style protocol. |
| **Client-owned, encrypted data** | Contacts/messages live on-device, locally encrypted; relays are transient. |
| **Self-hosted relays** | Run SMP/XFTP servers and still federate with the wider network. |
| **Tor + private message routing** | IP-address protection from relays; per-message transport anonymity. |
| **Terminal CLI as WebSocket server** | Build chat bots / automations in any language. |
| **TypeScript client + bot API** | Official TS client and JS bot example for integrations. |

## Notes

- **License caveat (important):** SimpleX Chat is **AGPLv3**. The trademark/name
  and graphic assets are under *separate* licenses and need explicit permission.
  Texts may be quoted with attribution. Factor AGPL copyleft in before linking
  any SimpleX code into repo software.
- The **whitepaper and SimpleX Chat Protocol docs are the source of truth** for
  the queue model, server deployment, and the bot API — pin a release and check
  them before relying on specifics.
- In this repo the highest-value use is a **self-hosted, privacy-first bot /
  notification channel** for the render + agent pipeline, parallel to the
  Hermes/Telegram/Discord gateways already documented in `SETUP-HERMES.md`.
- Security reviews: protocol/cryptography assessed by **Trail of Bits**
  (Oct 2022 + Jul 2024). Report vulnerabilities via their Security Policy —
  **not** GitHub issues.

## License

GNU Affero General Public License v3 (**AGPLv3**) for the software. SimpleX /
SimpleX Chat name, logo, branding, and graphic assets are excluded and governed
by the project's TRADEMARK and ASSETS_LICENSE files.
