#!/usr/bin/env python3
"""
YouTube Shorts Script Quality Scorer

Grades scripts on:
- Hook strength (first 3 seconds)
- Pacing (visual transitions, narrative flow)
- Engagement (conflict, curiosity gaps)
- Emotional resonance (for ADHD teen audience)
- Resolution clarity

Blocks render if score < 40/100 with specific feedback.

This version uses local heuristic evaluation (no API required).
Can be upgraded to Claude API scoring when available.
"""

import json
import sys
from pathlib import Path
import re

def score_script_local(script_text: str) -> dict:
    """
    Grade a script using heuristic rules.

    This is a local implementation that doesn't require API calls.
    Can be replaced with Claude API call for smarter feedback.
    """

    # Normalize script
    script_lower = script_text.lower()
    lines = script_text.split('\n')
    sentences = re.split(r'[.!?]+', script_text)

    scores = {}

    # 1. HOOK STRENGTH (0-30)
    hook_lines = '\n'.join(lines[:3]) if len(lines) >= 3 else script_text[:100]
    hook_score = 0

    if any(word in script_lower for word in ['wait', 'okay', 'literally', 'OMG', 'no way', 'so']):
        hook_score += 8  # Conversational opening
    if any(word in hook_lines for word in ['finally', 'organized', 'but', 'also', 'chaos']):
        hook_score += 8  # Relevant to ADHD
    if len(hook_lines) < 50:
        hook_score += 6  # Short, punchy
    if '?' in hook_lines:
        hook_score += 8  # Question creates curiosity

    scores['hook_strength'] = min(hook_score, 30)

    # 2. PACING & STRUCTURE (0-25)
    pacing_score = 0

    if len(sentences) >= 3:
        pacing_score += 8  # Multiple thought units
    if any(word in script_lower for word in ['then', 'but', 'also', 'wait', 'suddenly']):
        pacing_score += 8  # Scene/pacing changes
    if 'where' in script_lower or 'what' in script_lower:
        pacing_score += 5  # Questions create rhythm
    if 'brain' in script_lower or 'chaos' in script_lower or 'hyperfocus' in script_lower:
        pacing_score += 4  # ADHD-specific pacing

    scores['pacing'] = min(pacing_score, 25)

    # 3. CONFLICT & ENGAGEMENT (0-20)
    conflict_score = 0

    if any(word in script_lower for word in ['organized', 'chaos', 'lost', 'forgot', 'stuck', 'overwhelmed']):
        conflict_score += 10  # Clear problem
    if any(word in script_lower for word in ['but', 'also me', 'literally me', 'same', 'never']):
        conflict_score += 7  # Relatability
    if 'why' in script_lower:
        conflict_score += 3  # Curiosity gap

    scores['conflict'] = min(conflict_score, 20)

    # 4. EMOTIONAL RESONANCE (0-15)
    emotion_score = 0

    adhd_keywords = ['procrastinate', 'hyperfocus', 'brain', 'chaos', 'adhd', 'rejection',
                     'time blindness', 'scattered', 'organizing', 'priorities', 'browser tabs']
    matches = sum(1 for word in adhd_keywords if word in script_lower)
    emotion_score += min(matches * 3, 10)

    if any(word in script_lower for word in ['literally', 'same', 'me irl', 'no cap', 'fr fr']):
        emotion_score += 5  # Gen Z authenticity

    scores['emotion'] = min(emotion_score, 15)

    # 5. CLARITY & CONCLUSION (0-10)
    clarity_score = 0

    if any(word in script_lower for word in ['this is', 'that\'s', 'no filter', 'just']):
        clarity_score += 5  # Clear message
    if len(script_text) > 80:  # Not too short
        clarity_score += 3
    if lines[-1].strip():  # Has conclusion
        clarity_score += 2

    scores['clarity'] = min(clarity_score, 10)

    # Calculate overall
    overall_score = sum(scores.values())

    # Generate feedback
    strengths = []
    if scores['hook_strength'] >= 20:
        strengths.append("Strong opening that stops the scroll")
    if scores['conflict'] >= 15:
        strengths.append("Clear problem that makes viewers care")
    if scores['emotion'] >= 10:
        strengths.append("Authentic ADHD relatability")

    improvements = []
    if scores['hook_strength'] < 20:
        improvements.append({
            "area": "hook",
            "feedback": "First 3 seconds need more punch. Try opening with the chaos/problem instead of explanation."
        })
    if scores['pacing'] < 15:
        improvements.append({
            "area": "pacing",
            "feedback": "Add scene transitions or topic shifts to maintain pace. Every 2-3 seconds, introduce something new."
        })
    if scores['conflict'] < 15:
        improvements.append({
            "area": "conflict",
            "feedback": "Clarify the problem/tension. Why should viewers care about this? What's the relatable struggle?"
        })
    if scores['emotion'] < 10:
        improvements.append({
            "area": "emotion",
            "feedback": "Make it more ADHD-specific. Use authentic language & situations Gen Z recognizes."
        })

    return {
        "overall_score": overall_score,
        "category_scores": scores,
        "summary": f"{'Strong' if overall_score >= 65 else 'Decent' if overall_score >= 45 else 'Weak'} script with good {'hook' if scores['hook_strength'] >= 25 else 'concept'} and relevant ADHD humor." if strengths else "Script needs stronger hook and clearer conflict.",
        "strengths": strengths if strengths else ["Reasonable length", "ADHD-adjacent themes"],
        "improvements": improvements if improvements else [{"area": "polish", "feedback": "Minor refinements only needed."}],
        "render_decision": "GO" if overall_score >= 40 else "REVISE",
        "revision_priority": "NICE_TO_HAVE" if overall_score >= 60 else "MEDIUM" if overall_score >= 40 else "CRITICAL"
    }


def format_score_report(score_data: dict) -> str:
    """Format score data into readable report."""

    if "error" in score_data:
        return f"❌ Scoring Error: {score_data['error']}\n{score_data.get('raw_response', '')}"

    overall = score_data.get("overall_score", 0)
    decision = score_data.get("render_decision", "?")
    priority = score_data.get("revision_priority", "")

    # Color-coded decision
    if decision == "GO":
        decision_emoji = "✅ GO"
    else:
        decision_emoji = f"⚠️  REVISE ({priority})"

    report = f"""
{'='*60}
SCRIPT QUALITY SCORE: {overall}/100
{'='*60}

Decision: {decision_emoji}
Summary: {score_data.get('summary', 'N/A')}

CATEGORY BREAKDOWN:
  🎯 Hook Strength:     {score_data['category_scores'].get('hook_strength', 0):2d}/30
  ⚡ Pacing:            {score_data['category_scores'].get('pacing', 0):2d}/25
  🔥 Conflict:          {score_data['category_scores'].get('conflict', 0):2d}/20
  💙 Emotional:         {score_data['category_scores'].get('emotion', 0):2d}/15
  ✨ Clarity:           {score_data['category_scores'].get('clarity', 0):2d}/10

STRENGTHS:
{chr(10).join(f"  ✓ {s}" for s in score_data.get('strengths', []))}

IMPROVEMENTS NEEDED:
{chr(10).join(f"  • [{item['area'].upper()}] {item['feedback']}" for item in score_data.get('improvements', []))}

{'='*60}
"""
    return report


def main():
    """Main entry point."""

    if len(sys.argv) < 2:
        print("Usage: python script_scorer.py <script_file.txt>")
        print("   or: python script_scorer.py --interactive")
        sys.exit(1)

    if sys.argv[1] == "--interactive":
        print("🎬 YouTube Shorts Script Scorer (Interactive)")
        print("=" * 60)
        print("Paste your script below. Press Ctrl+D (Mac) or Ctrl+Z then Enter (Windows) when done:")
        print()

        script_lines = []
        try:
            while True:
                line = input()
                script_lines.append(line)
        except EOFError:
            pass

        script_text = "\n".join(script_lines)
    else:
        script_file = Path(sys.argv[1])
        if not script_file.exists():
            print(f"Error: File not found: {script_file}")
            sys.exit(1)

        script_text = script_file.read_text()

    if not script_text.strip():
        print("Error: Script is empty")
        sys.exit(1)

    print(f"\n📝 Analyzing script ({len(script_text)} characters)...")
    print("⏳ Scoring in progress...\n")

    # Score the script
    score_data = score_script_local(script_text)

    # Print formatted report
    report = format_score_report(score_data)
    print(report)

    # Render decision
    decision = score_data.get("render_decision", "?")
    overall = score_data.get("overall_score", 0)

    if decision == "GO":
        print(f"\n✅ APPROVED FOR RENDER (Score: {overall}/100)")
        print("This script is ready to animate. Proceed to HyperFrames composition.\n")
        sys.exit(0)
    else:
        priority = score_data.get("revision_priority", "MEDIUM")
        print(f"\n⚠️  SCRIPT NEEDS REVISION ({priority} priority)")
        print(f"Current score: {overall}/100 (minimum 40 required)")
        print("Implement the improvements above, then re-run scorer.\n")
        sys.exit(1)


if __name__ == "__main__":
    main()
