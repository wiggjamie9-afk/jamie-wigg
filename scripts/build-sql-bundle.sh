#!/usr/bin/env bash
set -euo pipefail
out=supabase/bundle.sql
{
  printf "%s\n" "-- =================================================================="
  printf "%s\n" "-- RHYTHMIX — Supabase migration bundle"
  printf "%s\n" "--"
  printf "%s\n" "-- Generated from supabase/migrations/*.sql by scripts/build-sql-bundle.sh"
  printf "%s\n" "--"
  printf "%s\n" "-- HOW TO USE:"
  printf "%s\n" "--   1. Create a project at https://supabase.com/dashboard"
  printf "%s\n" "--   2. Open the SQL Editor"
  printf "%s\n" "--   3. Paste this whole file and click Run"
  printf "%s\n" "--   4. Verify in the Table Editor that 5 tables now exist:"
  printf "%s\n" "--      profiles, tracks, track_likes, payments, generation_jobs"
  printf "%s\n" "--"
  printf "%s\n" "-- Idempotent: safe to re-run during development."
  printf "%s\n" "-- =================================================================="
  printf "\n"

  for f in supabase/migrations/*.sql; do
    printf "%s\n" "-- ------------------------------------------------------------------"
    printf "%s\n" "-- $(basename "$f")"
    printf "%s\n" "-- ------------------------------------------------------------------"
    cat "$f"
    printf "\n\n"
  done
} > "$out"
echo "Wrote $out ($(wc -l < "$out") lines)"
