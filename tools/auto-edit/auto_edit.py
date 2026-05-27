#!/usr/bin/env python3
"""auto-edit: detect repeated takes in a transcript, rank them, emit a rough cut.

Inspired by the AutoEdit TikTok demo (eleven+percent). Heuristic-first; uses
Claude only as a tiebreaker when two candidates score within --tiebreak-margin.

Pipeline:
    video|transcript -> transcribe? -> detect groups -> rank takes
                     -> emit cutlist.json + stitch.sh + composition/

Subcommands:
    run         end-to-end on a video or transcript
    transcribe  shell out to `npx hyperframes transcribe`
    detect      group near-duplicate consecutive segments
    rank        score + pick the winner of each group (optional Claude tiebreak)
    compose     emit stitch.sh + HyperFrames composition from a cutlist

Transcript schema (Whisper JSON): { "segments": [{ "start", "end", "text" }, ...] }
"""

from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import urllib.error
import urllib.request
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import Iterable

FILLERS = {
    "um", "uh", "uhh", "umm", "er", "erm", "ah", "kinda", "sorta",
    "actually", "basically", "literally",
}
FILLER_BIGRAMS = {("you", "know"), ("i", "mean"), ("sort", "of"), ("kind", "of")}

MISTAKE_MARKERS = [
    "wait no", "wait, no", "scratch that", "messed up", "one more time",
    "let me try again", "let me go again", "sorry let me", "sorry, let me",
    "let me redo", "dang it", "take it back", "start over", "do that again",
    "i misspoke", "wait sorry",
]

MISTAKE_HINTS = ["sorry", "wait", "dang", "again", "redo"]

DEFAULT_SIMILARITY = 0.28
DEFAULT_TIEBREAK_MARGIN = 0.15
MAX_GROUP_GAP_SECONDS = 45.0


@dataclass
class Segment:
    start: float
    end: float
    text: str

    @property
    def duration(self) -> float:
        return max(0.0, self.end - self.start)


@dataclass
class Candidate:
    start: float
    end: float
    text: str
    score: float
    label: str
    ai_recommended: bool = False
    reasons: list[str] = field(default_factory=list)


@dataclass
class Group:
    group_id: int
    candidates: list[Candidate]
    selected_index: int


# ---------- text normalization & similarity ----------

_WORD_RE = re.compile(r"[a-z0-9']+")


def _tokens(text: str) -> list[str]:
    return _WORD_RE.findall(text.lower())


def _content_tokens(text: str) -> list[str]:
    toks = _tokens(text)
    out: list[str] = []
    i = 0
    while i < len(toks):
        if i + 1 < len(toks) and (toks[i], toks[i + 1]) in FILLER_BIGRAMS:
            i += 2
            continue
        if toks[i] not in FILLERS:
            out.append(toks[i])
        i += 1
    return out


def _bigrams(toks: list[str]) -> set[tuple[str, str]]:
    return {(toks[i], toks[i + 1]) for i in range(len(toks) - 1)}


def jaccard(a: Iterable, b: Iterable) -> float:
    sa, sb = set(a), set(b)
    if not sa and not sb:
        return 1.0
    if not sa or not sb:
        return 0.0
    return len(sa & sb) / len(sa | sb)


def longest_common_phrase(a: list[str], b: list[str]) -> int:
    """Length of the longest contiguous shared content-token subsequence (DP)."""
    if not a or not b:
        return 0
    prev = [0] * (len(b) + 1)
    best = 0
    for i in range(1, len(a) + 1):
        curr = [0] * (len(b) + 1)
        for j in range(1, len(b) + 1):
            if a[i - 1] == b[j - 1]:
                curr[j] = prev[j - 1] + 1
                if curr[j] > best:
                    best = curr[j]
        prev = curr
    return best


def text_similarity(a: str, b: str) -> float:
    """Blend bag-of-words and shared-phrase signals.

    A long shared content phrase (e.g. 'as a video editor') is a strong retake signal
    even when surrounding filler/error words differ a lot.
    """
    ta, tb = _content_tokens(a), _content_tokens(b)
    uni = jaccard(ta, tb)
    bi = jaccard(_bigrams(ta), _bigrams(tb))
    blended = 0.4 * uni + 0.6 * bi
    phrase = longest_common_phrase(ta, tb)
    if phrase >= 3:
        return max(blended, 0.5 + 0.1 * (phrase - 3))
    return blended


# ---------- scoring ----------


def score_segment(text: str) -> tuple[float, list[str]]:
    """Heuristic quality score in [0, 1]. Lower = more likely a bad take."""
    reasons: list[str] = []
    score = 1.0
    lower = text.lower()

    for marker in MISTAKE_MARKERS:
        if marker in lower:
            score -= 0.45
            reasons.append(f"mistake-marker:{marker!r}")
            break

    if score >= 0.7:
        for hint in MISTAKE_HINTS:
            if re.search(rf"\b{hint}\b", lower):
                score -= 0.15
                reasons.append(f"mistake-hint:{hint!r}")
                break

    toks = _tokens(text)
    if toks:
        filler_count = sum(1 for t in toks if t in FILLERS)
        ratio = filler_count / len(toks)
        if ratio > 0.08:
            penalty = min(0.35, (ratio - 0.08) * 2.0)
            score -= penalty
            reasons.append(f"filler-ratio:{ratio:.2f}")

    if "..." in text or text.rstrip().endswith(("--", "—")):
        score -= 0.1
        reasons.append("incomplete-trailing")

    if len(toks) < 4:
        score -= 0.2
        reasons.append("very-short")

    return max(0.0, min(1.0, score)), reasons


# ---------- grouping ----------


def group_takes(
    segments: list[Segment],
    similarity_threshold: float = DEFAULT_SIMILARITY,
    max_gap_seconds: float = MAX_GROUP_GAP_SECONDS,
) -> list[list[Segment]]:
    """Group near-duplicate segments. Greedy single-pass over consecutive pairs."""
    if not segments:
        return []

    groups: list[list[Segment]] = [[segments[0]]]
    for seg in segments[1:]:
        best_gi, best_sim = -1, 0.0
        for gi in range(len(groups) - 1, -1, -1):
            g = groups[gi]
            if seg.start - g[-1].end > max_gap_seconds:
                break
            sim = max(text_similarity(prev.text, seg.text) for prev in g)
            if sim > best_sim:
                best_sim, best_gi = sim, gi
        if best_gi >= 0 and best_sim >= similarity_threshold:
            groups[best_gi].append(seg)
        else:
            groups.append([seg])
    return groups


# ---------- Claude tiebreak ----------


def claude_pick(candidates: list[Candidate], api_key: str, model: str) -> tuple[int, str] | None:
    """Ask Claude to pick the best candidate. Returns (index, reasoning) or None on failure."""
    numbered = "\n".join(
        f"{i}. [score={c.score:.2f}] {c.text!r}" for i, c in enumerate(candidates)
    )
    prompt = (
        "You are picking the best take from a set of near-duplicate spoken takes "
        "recorded back-to-back. Pick the one a video editor would keep in the final cut. "
        "Prefer takes that: are complete sentences, contain no filler ('um', 'uh'), no "
        "self-corrections ('wait, no', 'sorry let me'), and read most naturally.\n\n"
        f"Takes:\n{numbered}\n\n"
        'Reply with JSON ONLY: {"index": <int>, "reason": "<one sentence>"}.'
    )

    body = json.dumps(
        {
            "model": model,
            "max_tokens": 200,
            "messages": [{"role": "user", "content": prompt}],
        }
    ).encode("utf-8")

    req = urllib.request.Request(
        "https://api.anthropic.com/v1/messages",
        data=body,
        headers={
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            payload = json.loads(resp.read())
    except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError) as e:
        print(f"warn: Claude tiebreak failed ({e}); falling back to heuristic", file=sys.stderr)
        return None

    parts = payload.get("content") or []
    text = next((p.get("text", "") for p in parts if p.get("type") == "text"), "")
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        return None
    try:
        parsed = json.loads(match.group(0))
        idx = int(parsed["index"])
        if 0 <= idx < len(candidates):
            return idx, str(parsed.get("reason", ""))
    except (json.JSONDecodeError, KeyError, ValueError):
        pass
    return None


# ---------- pipeline stages ----------


def load_transcript(path: Path) -> list[Segment]:
    data = json.loads(path.read_text())
    raw = data.get("segments") or data.get("chunks") or data
    if not isinstance(raw, list):
        raise SystemExit(f"unrecognized transcript shape: {path}")
    out: list[Segment] = []
    for item in raw:
        text = (item.get("text") or "").strip()
        if not text:
            continue
        start = float(item.get("start", item.get("timestamp", [0, 0])[0]))
        end = float(item.get("end", item.get("timestamp", [0, 0])[1]))
        out.append(Segment(start=start, end=end, text=text))
    return out


def detect_groups(segments: list[Segment], similarity: float, max_gap: float) -> list[list[Segment]]:
    return group_takes(segments, similarity_threshold=similarity, max_gap_seconds=max_gap)


def rank_groups(
    groups: list[list[Segment]],
    use_llm: bool,
    tiebreak_margin: float,
    api_key: str | None,
    model: str,
) -> list[Group]:
    ranked: list[Group] = []
    for gi, group in enumerate(groups):
        candidates: list[Candidate] = []
        for seg in group:
            score, reasons = score_segment(seg.text)
            label = "good_take" if score >= 0.7 else ("ok_take" if score >= 0.45 else "bad_take")
            candidates.append(
                Candidate(
                    start=seg.start,
                    end=seg.end,
                    text=seg.text,
                    score=score,
                    label=label,
                    reasons=reasons,
                )
            )

        order = sorted(range(len(candidates)), key=lambda i: candidates[i].score, reverse=True)
        winner = order[0]

        if (
            use_llm
            and api_key
            and len(candidates) >= 2
            and (candidates[order[0]].score - candidates[order[1]].score) < tiebreak_margin
        ):
            result = claude_pick(candidates, api_key=api_key, model=model)
            if result is not None:
                winner, reason = result
                candidates[winner].reasons.append(f"claude-tiebreak: {reason}")

        candidates[winner].ai_recommended = True
        ranked.append(Group(group_id=gi, candidates=candidates, selected_index=winner))
    return ranked


def build_cutlist(source_video: str | None, ranked: list[Group], drop_bad: bool = False) -> dict:
    selected: list[dict] = []
    for g in ranked:
        chosen = g.candidates[g.selected_index]
        if drop_bad and chosen.label == "bad_take":
            continue
        selected.append({"start": chosen.start, "end": chosen.end, "text": chosen.text})
    selected.sort(key=lambda s: s["start"])
    total_duration = sum(s["end"] - s["start"] for s in selected)
    return {
        "source": source_video,
        "total_duration": round(total_duration, 3),
        "selected_segments": selected,
        "groups": [
            {
                "group_id": g.group_id,
                "selected_index": g.selected_index,
                "candidates": [asdict(c) for c in g.candidates],
            }
            for g in ranked
        ],
    }


# ---------- emitters ----------


def emit_stitch_script(cutlist: dict, out_dir: Path) -> Path:
    source = cutlist.get("source") or "INPUT.mp4"
    lines = [
        "#!/usr/bin/env bash",
        "# Generated by auto_edit.py — stitch selected takes into a rough cut MP4.",
        "set -euo pipefail",
        f'SOURCE="${{1:-{source}}}"',
        'OUT="${2:-rough-cut.mp4}"',
        'WORK=$(mktemp -d)',
        'trap \'rm -rf "$WORK"\' EXIT',
        'i=0',
    ]
    for seg in cutlist["selected_segments"]:
        start = seg["start"]
        duration = max(0.05, seg["end"] - seg["start"])
        lines.append(
            f'ffmpeg -nostdin -y -loglevel error -ss {start:.3f} -i "$SOURCE" '
            f'-t {duration:.3f} -c:v libx264 -preset veryfast -crf 18 -c:a aac '
            f'"$WORK/seg-$(printf %04d $i).mp4"'
        )
        lines.append("i=$((i+1))")
    lines.extend(
        [
            'ls "$WORK"/seg-*.mp4 | sort | sed "s|^|file \'|;s|$|\'|" > "$WORK/list.txt"',
            'ffmpeg -nostdin -y -loglevel error -f concat -safe 0 -i "$WORK/list.txt" -c copy "$OUT"',
            'echo "✓ wrote $OUT"',
        ]
    )
    path = out_dir / "stitch.sh"
    path.write_text("\n".join(lines) + "\n")
    path.chmod(0o755)
    return path


def emit_composition(cutlist: dict, out_dir: Path, width: int = 1920, height: int = 1080) -> Path:
    comp_dir = out_dir / "composition"
    comp_dir.mkdir(parents=True, exist_ok=True)

    segments = cutlist["selected_segments"]
    cum = 0.0
    scenes_html: list[str] = []
    for i, seg in enumerate(segments):
        duration = max(0.1, seg["end"] - seg["start"])
        caption = seg["text"].replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
        scenes_html.append(
            f'      <div class="scene clip" data-start="{cum:.3f}" '
            f'data-duration="{duration:.3f}" data-track-index="{i}">\n'
            f'        <div class="caption">{caption}</div>\n'
            f'      </div>'
        )
        cum += duration
    total = round(cum, 3)

    html = f"""<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width={width}, height={height}" />
    <style>
      * {{ margin: 0; padding: 0; box-sizing: border-box; }}
      html, body {{
        width: {width}px; height: {height}px; overflow: hidden;
        background: #08050d; color: #fff;
        font-family: "Space Grotesk", system-ui, sans-serif;
      }}
      .scene {{
        position: absolute; inset: 0; width: 100%; height: 100%;
        display: flex; align-items: flex-end; justify-content: center;
        padding: 0 120px 120px;
      }}
      .caption {{
        font-size: 48px; line-height: 1.2; font-weight: 600;
        text-align: center; max-width: 1600px;
        background: rgba(0, 0, 0, 0.72);
        padding: 24px 36px; border-radius: 16px;
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
      }}
    </style>
  </head>
  <body>
    <div
      id="root"
      data-composition-id="auto-edit-cut"
      data-start="0"
      data-duration="{total}"
      data-width="{width}"
      data-height="{height}"
    >
{chr(10).join(scenes_html)}
    </div>
  </body>
</html>
"""
    path = comp_dir / "index.html"
    path.write_text(html)
    (comp_dir / "hyperframes.json").write_text(json.dumps({"version": "0.4.42"}) + "\n")
    return path


# ---------- transcription wrapper ----------


def transcribe_video(video: Path, out_path: Path) -> Path:
    if not shutil.which("npx"):
        raise SystemExit("npx not found; install Node.js to use transcribe")
    print(f"transcribing {video} -> {out_path}", file=sys.stderr)
    subprocess.run(
        ["npx", "--yes", "hyperframes", "transcribe", str(video)],
        check=True,
    )
    # hyperframes writes <stem>.json beside the input
    produced = video.with_suffix(".json")
    if produced != out_path:
        produced.replace(out_path)
    return out_path


# ---------- CLI ----------


def cmd_transcribe(args: argparse.Namespace) -> None:
    out = Path(args.out) if args.out else Path(args.input).with_suffix(".json")
    transcribe_video(Path(args.input), out)
    print(out)


def cmd_detect(args: argparse.Namespace) -> None:
    segments = load_transcript(Path(args.input))
    groups = detect_groups(segments, similarity=args.similarity, max_gap=args.max_gap)
    payload = {
        "groups": [
            {
                "group_id": gi,
                "segments": [asdict(s) for s in group],
            }
            for gi, group in enumerate(groups)
        ]
    }
    _emit_json(payload, args.out)


def cmd_rank(args: argparse.Namespace) -> None:
    if Path(args.input).read_text().lstrip().startswith("{") and "groups" in Path(args.input).read_text():
        data = json.loads(Path(args.input).read_text())
        groups = [
            [Segment(**{k: v for k, v in s.items() if k in {"start", "end", "text"}}) for s in g["segments"]]
            for g in data["groups"]
        ]
    else:
        segments = load_transcript(Path(args.input))
        groups = detect_groups(segments, similarity=args.similarity, max_gap=args.max_gap)

    ranked = rank_groups(
        groups,
        use_llm=not args.no_llm,
        tiebreak_margin=args.tiebreak_margin,
        api_key=os.environ.get("ANTHROPIC_API_KEY"),
        model=args.model,
    )
    cutlist = build_cutlist(args.source_video, ranked, drop_bad=args.drop_bad)
    _emit_json(cutlist, args.out)


def cmd_compose(args: argparse.Namespace) -> None:
    cutlist = json.loads(Path(args.input).read_text())
    if args.source_video:
        cutlist["source"] = args.source_video
    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)
    stitch = emit_stitch_script(cutlist, out_dir)
    comp = emit_composition(cutlist, out_dir, width=args.width, height=args.height)
    print(f"✓ stitch:      {stitch}")
    print(f"✓ composition: {comp}")


def cmd_run(args: argparse.Namespace) -> None:
    input_path = Path(args.input)
    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)

    if input_path.suffix.lower() in {".mp4", ".mov", ".mkv", ".webm", ".mp3", ".wav", ".m4a"}:
        transcript_path = out_dir / "transcript.json"
        transcribe_video(input_path, transcript_path)
        source_video: str | None = str(input_path)
    else:
        transcript_path = input_path
        source_video = args.source_video

    segments = load_transcript(transcript_path)
    groups = detect_groups(segments, similarity=args.similarity, max_gap=args.max_gap)
    ranked = rank_groups(
        groups,
        use_llm=not args.no_llm,
        tiebreak_margin=args.tiebreak_margin,
        api_key=os.environ.get("ANTHROPIC_API_KEY"),
        model=args.model,
    )
    cutlist = build_cutlist(source_video, ranked, drop_bad=args.drop_bad)

    cutlist_path = out_dir / "cutlist.json"
    cutlist_path.write_text(json.dumps(cutlist, indent=2) + "\n")

    if not args.no_cut:
        emit_stitch_script(cutlist, out_dir)
    if not args.no_compose:
        emit_composition(cutlist, out_dir, width=args.width, height=args.height)

    _print_summary(cutlist, out_dir)


def _emit_json(payload: dict, out: str | None) -> None:
    text = json.dumps(payload, indent=2) + "\n"
    if out and out != "-":
        Path(out).write_text(text)
        print(out)
    else:
        sys.stdout.write(text)


def _print_summary(cutlist: dict, out_dir: Path) -> None:
    n_groups = len(cutlist["groups"])
    n_bad = sum(
        1
        for g in cutlist["groups"]
        for i, c in enumerate(g["candidates"])
        if i != g["selected_index"]
    )
    print(f"✓ {n_groups} take-groups, {n_bad} bad/duplicate takes dropped")
    print(f"  cut total: {cutlist['total_duration']:.2f}s")
    print(f"  output:    {out_dir}/")


def main() -> None:
    p = argparse.ArgumentParser(prog="auto_edit", description=__doc__.splitlines()[0])
    sub = p.add_subparsers(dest="cmd", required=True)

    common_detect = argparse.ArgumentParser(add_help=False)
    common_detect.add_argument("--similarity", type=float, default=DEFAULT_SIMILARITY)
    common_detect.add_argument("--max-gap", type=float, default=MAX_GROUP_GAP_SECONDS)

    common_rank = argparse.ArgumentParser(add_help=False)
    common_rank.add_argument("--no-llm", action="store_true", help="skip Claude tiebreak")
    common_rank.add_argument("--tiebreak-margin", type=float, default=DEFAULT_TIEBREAK_MARGIN)
    common_rank.add_argument("--model", default="claude-haiku-4-5-20251001")

    common_compose = argparse.ArgumentParser(add_help=False)
    common_compose.add_argument("--width", type=int, default=1920)
    common_compose.add_argument("--height", type=int, default=1080)

    common_select = argparse.ArgumentParser(add_help=False)
    common_select.add_argument(
        "--drop-bad", action="store_true", help="omit groups whose winner is still labeled bad_take"
    )

    sp = sub.add_parser("transcribe", help="wrap hyperframes transcribe")
    sp.add_argument("input")
    sp.add_argument("--out")
    sp.set_defaults(func=cmd_transcribe)

    sp = sub.add_parser("detect", parents=[common_detect], help="group near-duplicate takes")
    sp.add_argument("input", help="transcript JSON")
    sp.add_argument("--out", default="-")
    sp.set_defaults(func=cmd_detect)

    sp = sub.add_parser(
        "rank",
        parents=[common_detect, common_rank, common_select],
        help="score + pick winners",
    )
    sp.add_argument("input", help="transcript JSON (or detect output)")
    sp.add_argument("--out", default="-")
    sp.add_argument("--source-video")
    sp.set_defaults(func=cmd_rank)

    sp = sub.add_parser("compose", parents=[common_compose], help="emit stitch + composition")
    sp.add_argument("input", help="cutlist.json")
    sp.add_argument("--out", required=True, help="output directory")
    sp.add_argument("--source-video")
    sp.set_defaults(func=cmd_compose)

    sp = sub.add_parser(
        "run",
        parents=[common_detect, common_rank, common_compose, common_select],
        help="end-to-end pipeline",
    )
    sp.add_argument("input", help="video or transcript JSON")
    sp.add_argument("--out", required=True, help="output directory")
    sp.add_argument("--source-video", help="source video path to record in cutlist")
    sp.add_argument("--no-cut", action="store_true", help="skip stitch.sh emission")
    sp.add_argument("--no-compose", action="store_true", help="skip HyperFrames composition")
    sp.set_defaults(func=cmd_run)

    args = p.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
