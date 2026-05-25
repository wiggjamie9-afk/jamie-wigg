# Requirements: Chapel

## Problem
Small church volunteer admins — often non-technical volunteers working 5 hours a week — manage Sunday service rosters via shared Google Sheets and text chains. There is no simple, mobile-first tool built for their scale (under 150 members) that handles scheduling, reminders, and attendance without overwhelming them.

## Goal
Ship a focused web app that lets a small church admin schedule volunteers for Sunday services, send automatic email reminders, and track attendance — all from their phone in under 10 minutes a week.

## Functional Requirements

- **R1**: A church admin can sign up, create a church organisation, and invite team members via email using magic-link authentication (no password required).
- **R2**: The system isolates each church's data — members, roles, schedules, and attendance are never visible across organisations.
- **R3**: An admin can define custom service roles for their church (e.g. Sound, Greeting, Reading, Communion, Worship Team, Kids Ministry).
- **R4**: An admin can add members to the directory with name, email address, and which roles they are available for.
- **R5**: An admin can create a Sunday service schedule by selecting a date and assigning members to roles for that service.
- **R6**: The system sends automatic email reminders to scheduled volunteers 3 days before their service date, showing their name, role, and service date.
- **R7**: An admin can mark attendance for a completed Sunday (present / absent per member who was scheduled).
- **R8**: The free tier supports up to 30 members; the paid tier ($12/month) supports up to 150 members. The app enforces this limit at the member-add boundary.
- **R9**: The UI is mobile-first and usable on an iPhone without pinching or horizontal scrolling.

## Non-Functional Requirements

- **N1**: Supabase Row-Level Security policies enforce org isolation at the database layer — no application-layer filtering alone.
- **N2**: Email reminders are sent via Resend; delivery failure is logged but does not crash the schedule flow.
- **N3**: The app loads its main dashboard in under 2 seconds on a 4G mobile connection.
- **N4**: Auth tokens are managed by Supabase; no custom session handling.

## Out of Scope

- Giving / donation tracking (v2).
- SMS reminders (v2 — email only in v1).
- Recurring / auto-rotating schedules (v2).
- In-app chat or announcements.
- Multi-admin roles beyond a single org admin in v1.
- Native iOS / Android app — PWA-quality web app only.

## Open Questions

- None — all resolved in spec session.
