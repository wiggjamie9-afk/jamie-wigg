#!/usr/bin/env python3
"""
build_batch.py — the LOOP. Build a finished 9:16 reel for every listing in a
folder, in parallel. This is the production engine: drop N listings in,
get N reels out, unattended.

Usage:
    python ugc/build_batch.py                 # builds every ugc/listings/*/
    python ugc/build_batch.py --in ugc/listings --out ugc/out --workers 3
    python ugc/build_batch.py --watch 300     # re-scan every 5 min (cron-style loop)

Each subfolder of --in that contains a listing.json is one listing.
Already-built reels are skipped unless --force.
"""
from __future__ import annotations
import argparse, time, traceback
from concurrent.futures import ProcessPoolExecutor, as_completed
from pathlib import Path
import build_reel  # same dir


def find_listings(root: Path):
    return sorted(p for p in root.iterdir() if p.is_dir() and (p / "listing.json").exists())


def build_one(listing_dir: str, out_root: str, force: bool):
    ld = Path(listing_dir)
    out = Path(out_root) / ld.name / "reel.mp4"
    if out.exists() and not force:
        return (ld.name, "skip", str(out))
    try:
        build_reel.build(ld, out)
        return (ld.name, "ok", f"{out} ({out.stat().st_size/1e6:.1f} MB)")
    except Exception as e:
        return (ld.name, "FAIL", f"{e}\n{traceback.format_exc(limit=2)}")


def run_once(in_root: Path, out_root: Path, workers: int, force: bool):
    listings = find_listings(in_root)
    if not listings:
        print(f"No listings in {in_root}"); return 0
    print(f"▶ {len(listings)} listing(s) → building with {workers} worker(s)")
    done = 0
    with ProcessPoolExecutor(max_workers=workers) as ex:
        futs = {ex.submit(build_one, str(l), str(out_root), force): l for l in listings}
        for f in as_completed(futs):
            name, status, info = f.result()
            mark = {"ok": "✓", "skip": "·", "FAIL": "✗"}.get(status, "?")
            print(f"  {mark} {name}: {info.splitlines()[0]}")
            if status == "ok":
                done += 1
    print(f"done: {done} built")
    return done


def main():
    ap = argparse.ArgumentParser(description="Batch-build property reels (the loop).")
    ap.add_argument("--in", dest="in_root", default="ugc/listings")
    ap.add_argument("--out", dest="out_root", default="ugc/out")
    ap.add_argument("--workers", type=int, default=2)
    ap.add_argument("--force", action="store_true", help="rebuild even if reel exists")
    ap.add_argument("--watch", type=int, default=0,
                    help="seconds between re-scans (0 = run once). Cron-style loop.")
    a = ap.parse_args()
    in_root, out_root = Path(a.in_root), Path(a.out_root)
    if a.watch <= 0:
        run_once(in_root, out_root, a.workers, a.force)
        return
    print(f"⟳ watch mode: scanning {in_root} every {a.watch}s (Ctrl-C to stop)")
    while True:
        run_once(in_root, out_root, a.workers, a.force)
        time.sleep(a.watch)


if __name__ == "__main__":
    main()
