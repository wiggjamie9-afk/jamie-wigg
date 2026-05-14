-- RHYTHMIX core schema
-- Idempotent: safe to re-run during development.

create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";

----------------------------------------------------------------------
-- profiles  (1:1 with auth.users)
----------------------------------------------------------------------
create table if not exists public.profiles (
  id                  uuid primary key references auth.users(id) on delete cascade,
  display_name        text,
  avatar_url          text,
  bio                 text,

  -- Push targeting
  expo_push_token     text,
  platform            text check (platform in ('ios', 'android', 'web')),

  -- Entitlements (mirrors RevenueCat / Stripe webhooks)
  lifetime_unlocked   boolean       not null default false,
  unlocked_at         timestamptz,
  unlock_provider     text          check (unlock_provider in ('stripe', 'iap', null)),

  -- Stripe
  stripe_customer_id  text unique,

  created_at          timestamptz   not null default now(),
  updated_at          timestamptz   not null default now()
);

create index if not exists profiles_lifetime_unlocked_idx
  on public.profiles (lifetime_unlocked) where lifetime_unlocked = true;

----------------------------------------------------------------------
-- tracks  (one row per generated or uploaded audio track)
----------------------------------------------------------------------
create table if not exists public.tracks (
  id            uuid primary key default uuid_generate_v4(),
  owner_id      uuid not null references public.profiles(id) on delete cascade,

  title         text not null,
  artist        text not null default 'You',

  -- Public-readable URLs (signed or public-bucket URLs from storage)
  audio_url     text not null,
  artwork_url   text,

  duration_sec  numeric(8,3),

  -- Generation provenance
  prompt        text,
  genre         text,
  model         text,                          -- e.g. 'musicgen-melody-large'
  seed          bigint,
  job_id        text,                          -- Replicate prediction id

  -- Lifecycle
  status        text not null default 'ready'
                  check (status in ('queued', 'running', 'ready', 'failed')),
  error         text,
  progress      real default 0
                  check (progress >= 0 and progress <= 1),

  -- Social
  is_public     boolean not null default false,
  play_count    integer not null default 0,
  like_count    integer not null default 0,

  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists tracks_owner_id_created_idx on public.tracks (owner_id, created_at desc);
create index if not exists tracks_public_created_idx   on public.tracks (created_at desc) where is_public = true;
create index if not exists tracks_status_idx           on public.tracks (status);
create index if not exists tracks_title_trgm_idx       on public.tracks using gin (title gin_trgm_ops);
create index if not exists tracks_job_id_idx           on public.tracks (job_id) where job_id is not null;

----------------------------------------------------------------------
-- track_likes  (many-to-many)
----------------------------------------------------------------------
create table if not exists public.track_likes (
  track_id  uuid not null references public.tracks(id)   on delete cascade,
  user_id   uuid not null references public.profiles(id) on delete cascade,
  liked_at  timestamptz not null default now(),
  primary key (track_id, user_id)
);

create index if not exists track_likes_user_idx on public.track_likes (user_id, liked_at desc);

----------------------------------------------------------------------
-- payments  (audit log of completed transactions, from both Stripe + IAP)
----------------------------------------------------------------------
create table if not exists public.payments (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  provider      text not null check (provider in ('stripe', 'iap')),
  amount_cents  integer not null,
  currency      text not null default 'usd',
  external_id   text not null,                -- Stripe PI id or transaction id
  sku           text not null default 'lifetime',
  status        text not null default 'succeeded'
                  check (status in ('succeeded', 'refunded')),
  raw           jsonb,                         -- full webhook payload, for forensics
  created_at    timestamptz not null default now(),
  unique (provider, external_id)
);

create index if not exists payments_user_idx on public.payments (user_id, created_at desc);

----------------------------------------------------------------------
-- generation_jobs  (server-side job log for diagnostics)
----------------------------------------------------------------------
create table if not exists public.generation_jobs (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid not null references public.profiles(id) on delete cascade,
  external_id    text not null,
  prompt         text not null,
  genre          text,
  duration_sec   numeric(8,3),
  status         text not null default 'queued'
                  check (status in ('queued', 'running', 'succeeded', 'failed')),
  progress       real default 0,
  error          text,
  track_id       uuid references public.tracks(id) on delete set null,
  raw            jsonb,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists generation_jobs_user_idx     on public.generation_jobs (user_id, created_at desc);
create index if not exists generation_jobs_external_idx on public.generation_jobs (external_id);
