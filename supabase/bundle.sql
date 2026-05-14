-- ==================================================================
-- RHYTHMIX — Supabase migration bundle
--
-- Generated from supabase/migrations/*.sql by scripts/build-sql-bundle.sh
--
-- HOW TO USE:
--   1. Create a project at https://supabase.com/dashboard
--   2. Open the SQL Editor
--   3. Paste this whole file and click Run
--   4. Verify in the Table Editor that 5 tables now exist:
--      profiles, tracks, track_likes, payments, generation_jobs
--
-- Idempotent: safe to re-run during development.
-- ==================================================================

-- ------------------------------------------------------------------
-- 20260514000001_init_schema.sql
-- ------------------------------------------------------------------
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


-- ------------------------------------------------------------------
-- 20260514000002_rls_policies.sql
-- ------------------------------------------------------------------
-- Row Level Security policies for RHYTHMIX.
-- Default-deny: every table is locked down, then opened up policy by policy.

----------------------------------------------------------------------
-- profiles
----------------------------------------------------------------------
alter table public.profiles enable row level security;

drop policy if exists "profiles: self read" on public.profiles;
create policy "profiles: self read" on public.profiles
  for select using (auth.uid() = id);

-- Lightweight public lookup of display_name + avatar (no PII, no entitlements).
-- Apps that need this can query a view; we keep the raw table self-only.
drop policy if exists "profiles: self upsert" on public.profiles;
create policy "profiles: self upsert" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles: self update" on public.profiles;
create policy "profiles: self update" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Service role bypass is implicit; admin actions (entitlements) go through Edge Functions
-- using the service_role key.

----------------------------------------------------------------------
-- tracks
----------------------------------------------------------------------
alter table public.tracks enable row level security;

drop policy if exists "tracks: owner read" on public.tracks;
create policy "tracks: owner read" on public.tracks
  for select using (owner_id = auth.uid());

drop policy if exists "tracks: public read" on public.tracks;
create policy "tracks: public read" on public.tracks
  for select using (is_public = true);

drop policy if exists "tracks: owner insert" on public.tracks;
create policy "tracks: owner insert" on public.tracks
  for insert with check (owner_id = auth.uid());

drop policy if exists "tracks: owner update" on public.tracks;
create policy "tracks: owner update" on public.tracks
  for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());

drop policy if exists "tracks: owner delete" on public.tracks;
create policy "tracks: owner delete" on public.tracks
  for delete using (owner_id = auth.uid());

----------------------------------------------------------------------
-- track_likes
----------------------------------------------------------------------
alter table public.track_likes enable row level security;

drop policy if exists "track_likes: self read" on public.track_likes;
create policy "track_likes: self read" on public.track_likes
  for select using (user_id = auth.uid());

drop policy if exists "track_likes: self insert" on public.track_likes;
create policy "track_likes: self insert" on public.track_likes
  for insert with check (user_id = auth.uid());

drop policy if exists "track_likes: self delete" on public.track_likes;
create policy "track_likes: self delete" on public.track_likes
  for delete using (user_id = auth.uid());

----------------------------------------------------------------------
-- payments  (read-only for the owner; only Edge Functions write)
----------------------------------------------------------------------
alter table public.payments enable row level security;

drop policy if exists "payments: self read" on public.payments;
create policy "payments: self read" on public.payments
  for select using (user_id = auth.uid());

----------------------------------------------------------------------
-- generation_jobs (read-only for the owner)
----------------------------------------------------------------------
alter table public.generation_jobs enable row level security;

drop policy if exists "generation_jobs: self read" on public.generation_jobs;
create policy "generation_jobs: self read" on public.generation_jobs
  for select using (user_id = auth.uid());


-- ------------------------------------------------------------------
-- 20260514000003_storage.sql
-- ------------------------------------------------------------------
-- Storage buckets + per-path RLS for RHYTHMIX.
--
-- Buckets:
--   user-audio   — generated/uploaded audio files, public-read so the mobile player can stream
--                  without minting signed URLs on every play; namespaced by user id so users
--                  can only WRITE under their own prefix.
--   artwork      — track cover art, same shape.
--   avatars      — profile avatars, public.

insert into storage.buckets (id, name, public)
values
  ('user-audio', 'user-audio', true),
  ('artwork',    'artwork',    true),
  ('avatars',    'avatars',    true)
on conflict (id) do update set public = excluded.public;

----------------------------------------------------------------------
-- user-audio
----------------------------------------------------------------------
drop policy if exists "user-audio: owner write" on storage.objects;
create policy "user-audio: owner write" on storage.objects
  for insert with check (
    bucket_id = 'user-audio'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "user-audio: owner update" on storage.objects;
create policy "user-audio: owner update" on storage.objects
  for update using (
    bucket_id = 'user-audio'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "user-audio: owner delete" on storage.objects;
create policy "user-audio: owner delete" on storage.objects
  for delete using (
    bucket_id = 'user-audio'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

----------------------------------------------------------------------
-- artwork
----------------------------------------------------------------------
drop policy if exists "artwork: owner write" on storage.objects;
create policy "artwork: owner write" on storage.objects
  for insert with check (
    bucket_id = 'artwork'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "artwork: owner update" on storage.objects;
create policy "artwork: owner update" on storage.objects
  for update using (
    bucket_id = 'artwork'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "artwork: owner delete" on storage.objects;
create policy "artwork: owner delete" on storage.objects
  for delete using (
    bucket_id = 'artwork'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

----------------------------------------------------------------------
-- avatars
----------------------------------------------------------------------
drop policy if exists "avatars: owner write" on storage.objects;
create policy "avatars: owner write" on storage.objects
  for insert with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "avatars: owner update" on storage.objects;
create policy "avatars: owner update" on storage.objects
  for update using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "avatars: owner delete" on storage.objects;
create policy "avatars: owner delete" on storage.objects
  for delete using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );


-- ------------------------------------------------------------------
-- 20260514000004_functions_triggers.sql
-- ------------------------------------------------------------------
-- Triggers + helper functions.

----------------------------------------------------------------------
-- Auto-create a profile row when a new auth.users row appears.
----------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

----------------------------------------------------------------------
-- Maintain updated_at on profiles / tracks / generation_jobs.
----------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();

drop trigger if exists tracks_touch_updated_at on public.tracks;
create trigger tracks_touch_updated_at
  before update on public.tracks
  for each row execute function public.touch_updated_at();

drop trigger if exists generation_jobs_touch_updated_at on public.generation_jobs;
create trigger generation_jobs_touch_updated_at
  before update on public.generation_jobs
  for each row execute function public.touch_updated_at();

----------------------------------------------------------------------
-- Keep tracks.like_count in sync with track_likes.
----------------------------------------------------------------------
create or replace function public.sync_track_like_count()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' then
    update public.tracks set like_count = like_count + 1 where id = new.track_id;
  elsif tg_op = 'DELETE' then
    update public.tracks set like_count = greatest(0, like_count - 1) where id = old.track_id;
  end if;
  return null;
end;
$$;

drop trigger if exists track_likes_sync_count on public.track_likes;
create trigger track_likes_sync_count
  after insert or delete on public.track_likes
  for each row execute function public.sync_track_like_count();

----------------------------------------------------------------------
-- Increment play_count atomically (call from app via rpc).
----------------------------------------------------------------------
create or replace function public.increment_play_count(track uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.tracks set play_count = play_count + 1 where id = track;
$$;

revoke all on function public.increment_play_count(uuid) from public;
grant  execute on function public.increment_play_count(uuid) to authenticated;


