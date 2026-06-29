# Logto — Auth Overview & Setup Reference

## Overview

[Logto](https://logto.io) is a **modern, open-source auth infrastructure for
SaaS and AI apps**. It takes the pain out of **OIDC** and **OAuth 2.1** and makes
it straightforward to ship secure, production-ready authentication with
**multi-tenancy**, **enterprise SSO**, and **RBAC** — without hand-rolling the
protocol plumbing.

Built for teams scaling SaaS, AI, and agent-based platforms, Logto gives you:

- **Multi-tenancy, enterprise SSO, and RBAC** ready out of the box — no workarounds.
- **Pre-built sign-in flows**, customizable UIs, and SDKs for **30+ frameworks**.
- Full support for **OIDC, OAuth 2.1, and SAML** without the protocol pain.
- First-class support for **Model Context Protocol (MCP)** and **agent-based AI**
  architectures.

**Site**: https://logto.io · **Cloud**: https://cloud.logto.io ·
**Docs**: https://docs.logto.io · **Repo**: https://github.com/logto-io/logto ·
License: **MPL-2.0** (Mozilla Public License).

> ### How this fits the RHYTHMIX repo
> **Good fit** for two specific auth surfaces here, and worth keeping on the
> radar for the agent tooling:
> - **STARLIGHTMIX Studio (`studio/`)** — Next.js 15 (App Router) + React 19.
>   Logto ships an official Next.js SDK, so it slots into the App Router without
>   custom OIDC code. Note the Studio constraint: it's a **static export**
>   (`output: "export"`, no server runtime) deployed to Cloudflare Pages, so the
>   browser-side SPA flow (`@logto/react` / PKCE) is the natural fit — not the
>   server-component SDK that assumes a Node runtime. Today Studio is
>   token-paste + `localStorage`/IndexedDB with **no accounts**; Logto is the
>   path if hosted accounts/entitlements are ever wanted.
> - **Cloudflare Workers (`studio/workers/`)** — the `license` Worker validates
>   Gumroad licenses against a KV cache. Logto's OIDC/OAuth 2.1 + RBAC could back
>   a proper authenticated API tier (M2M tokens, scopes) if the license endpoint
>   grows beyond a single product check. Audit the Worker first per
>   `docs/security/shannon.md` before adding an auth dependency.
> - **MCP + agents** — the repo runs many MCP servers (`.mcp.json`) and an agent
>   roster. Logto's MCP/agent auth support is relevant if any of those servers
>   ever need authenticated, multi-tenant access rather than a single shared key
>   in `.env`.
>
> **Not** a fit for the static marketing site (root `*.html` on GitHub Pages) —
> there's no backend to protect there. This is an *app-layer* auth dependency,
> so introduce it only on `studio/` or the Workers, never the Pages root.

## Getting started

Pick the path that matches the surface you're securing.

### Logto Cloud (fastest)

Fully managed, zero setup. Sign up at [cloud.logto.io](https://cloud.logto.io)
and create an application + API resource in the console.

### Try it in GitPod

Launch Logto OSS in seconds via the GitPod button in the
[repo README](https://github.com/logto-io/logto). Wait for
`App is running at https://3002-...gitpod.io`, then open the `https://3002-` URL.

### Local development

```bash
# Using Docker Compose (requires Docker Desktop)
curl -fsSL https://raw.githubusercontent.com/logto-io/logto/HEAD/docker-compose.yml | \
  docker compose -p logto -f - up

# Using Node.js (requires PostgreSQL)
npm init @logto
```

Full OSS installation guide: https://docs.logto.io/logto-oss/get-started-with-oss

## Integrating Studio (`studio/`)

Studio is a static export, so use the **browser SPA** flow rather than the
server SDK:

```bash
# from studio/
pnpm add @logto/react
```

```tsx
// app providers — SPA / PKCE flow, no server runtime required
import { LogtoProvider, LogtoConfig } from "@logto/react";

const config: LogtoConfig = {
  endpoint: process.env.NEXT_PUBLIC_LOGTO_ENDPOINT!, // e.g. https://you.logto.app
  appId: process.env.NEXT_PUBLIC_LOGTO_APP_ID!,
};

export function Providers({ children }: { children: React.ReactNode }) {
  return <LogtoProvider config={config}>{children}</LogtoProvider>;
}
```

Register the app as a **Single Page Application** in the Logto console and set
the redirect URIs to the Studio origin (`http://localhost:3000` for dev,
`https://studio.starlightmix.com` for prod). Keep `NEXT_PUBLIC_LOGTO_*` values in
the build environment, not committed — secrets stay out of the repo, matching the
`.env` (gitignored) pattern used by the MCP integrations.

> Use **Context7** for current, version-pinned `@logto/react` / `@logto/next`
> setup steps before wiring this in — the SDK API moves faster than this doc.

## Key capabilities

| Capability | What it gives you |
|---|---|
| **OIDC / OAuth 2.1** | Standards-based auth without writing the protocol layer. |
| **SAML / enterprise SSO** | Connect Okta, Azure AD, Google Workspace, and more. |
| **Multi-tenancy & organizations** | Org RBAC, member invites, just-in-time provisioning. |
| **RBAC** | Roles, scopes, and permission checks for users and M2M clients. |
| **Pre-built sign-in experience** | Sign-up, sign-in, social login, Google One Tap, MFA, SSO. |
| **30+ framework SDKs** | React, Next.js, Angular, Vue, Flutter, Go, Python, and more. |
| **Connectors** | Social IdPs (Google, Facebook, GitHub) + email/SMS providers. |
| **MCP / agent auth** | Works out-of-the-box for Model Context Protocol and agent architectures. |

## Integrate anywhere

- **SDKs for 30+ frameworks** — React, Next.js, Angular, Vue, Flutter, Go, Python.
- **Connect any IdP** — Google, Facebook, Azure AD, Okta, and more.
- **Flexible integration** — SPAs, web apps, mobile apps, APIs, M2M, CLI tools.
- **Ready for MCP and agent-based architectures.**

Quick starts: https://docs.logto.io/quick-starts ·
Connectors: https://docs.logto.io/connectors

## Notes

- The upstream **docs at [docs.logto.io](https://docs.logto.io) are the single
  source of truth** for SDK APIs, connector setup, and self-host flags. This doc
  is a deliberately minimal overview/reference snapshot — pin a release and check
  the docs before relying on specifics.
- For Studio, the **SPA/PKCE flow is mandatory** because of the static export
  (no Node server runtime). Don't reach for the server-component SDK.
- If Logto ever backs the `license` Worker, scope it as an API resource with
  M2M tokens and review the endpoint per `docs/security/shannon.md` first.
- Keep all Logto endpoints/IDs/secrets in the build env or `.env` (gitignored) —
  never commit them.

## License

Mozilla Public License, v2.0 (**MPL-2.0**). © Logto / Silverhand Inc.
