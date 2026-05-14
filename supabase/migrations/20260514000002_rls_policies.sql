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
