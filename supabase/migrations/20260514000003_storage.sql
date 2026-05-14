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
