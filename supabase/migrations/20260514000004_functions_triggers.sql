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
