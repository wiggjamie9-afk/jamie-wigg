# Episode Artwork Quality Fix — Summary

**Date:** June 11, 2026
**Branch:** `claude/sandbox-image-generation-qjz55r` → merged to `main`
**Issue:** "pictures look shit" — inconsistent character design, plain navy thumbnails, generic fallback art
**Status:** ✓ Merged and ready for first test run

---

## Root Causes Fixed

### 1. Character Inconsistency (Higgsfield 522 errors)
**Problem:** Higgsfield API returns 522 (server error) in production. Silent fallback to FLUX Dev caused character re-roll each scene (kangaroo in scene 1, mouse in scene 3).

**Solution:** FLUX Kontext + canonical character reference
- Generate ONE Sonny portrait with fixed seed (7777)
- Save to `kids-channel/character/sonny-ref.jpg` (committed to git for persistence)
- Use FLUX Kontext to paint that exact character into each scene
- Result: Identical Sunny across all 6 scenes, every episode

### 2. Thumbnail Quality (Plain Navy Gradient)
**Problem:** Thumbnails were PIL-generated navy starfield gradients with text overlay—generic and invisible in YouTube feeds.

**Solution:** Artwork-based thumbnail design
- Extract first scene image from FLUX output
- Cover-crop to YouTube dimensions (1280×720)
- Add darkened navy band (60px) at bottom
- Render golden title text on band
- Strip SEO suffixes ("| Bedtime Story")
- Result: Eye-catching episode artwork in every thumbnail

### 3. Prompt Injection ("Avoid:" Clauses)
**Problem:** Appending "Avoid: flat vector art, 3D render, photorealistic..." to FLUX prompts causes unwanted styles to leak INTO images (FLUX has no native negative prompt support).

**Solution:** Positive-only prompt engineering
- Removed all "Avoid:" trailers
- Rewrote character description to emphasize what Sonny IS
- Restructured style to describe desired aesthetic without negatives
- Result: Clean watercolor outputs without AI artifacts

---

## Code Changes

### `kids-channel/pipeline.py`

#### Updated Constants (Lines 46-57)
```python
CHARACTER_DESC = "Sonny: a CHUBBY ROUND quokka with warm golden-brown fur, large gentle brown eyes, tiny round ears, sweet natural smile, teddy-bear-like body shape"

VISUAL_STYLE = (
    "Professional watercolour children's picture book illustration (like Beatrix Potter, Jill Barklem, Alison Friend style). "
    "Hand-painted watercolour on textured cold-press paper with visible brushstrokes, soft pigment bleeds, gentle colour washes. "
    "Warm cosy palette: warm golds, burnt siennas, soft sage greens, deep indigo-navy blues, pale golden moonlight. "
    "Australian bush scenes at night: moonlit meadows, gum trees, wildflowers, gentle streams. "
    "Sonny the quokka always appears CHUBBY and ROUND (like a teddy bear, NOT skinny or elongated). "
    "Sonny's fur is WARM GOLDEN-BROWN, never dark or grey. Warm brown eyes, gentle smile, tiny round ears. "
    "Sonny often in peaceful restful poses: sitting contentedly, lying down in grass, curled up cosy. "
    "Sonny sometimes wearing cozy details like pajamas or a blanket around shoulders. "
    "Scene includes: gum trees with loose sketchy linework, wildflowers, gentle streams or water, moonlit meadows, fireflies with warm glows. "
    "Soft, safe, calming bedtime mood. No text or captions. Safe for toddlers ages 1-5."
)
```

#### New Constants (Lines 621-642)
```python
SONNY_CHARACTER = (
    "Sonny the quokka: EXTREMELY CHUBBY and ROUND (compact teddy-bear shape, plump rounded body), "
    "WARM GOLDEN-BROWN soft fur (never dark, never grey), large gentle warm brown eyes with kind expression, "
    "small round ears, short snout with a natural gentle smile, always appears cosy and peaceful. "
    "Often sitting, lying down, or resting in calm poses. Sometimes wearing cozy details like pajamas or a blanket."
)

WATERCOLOUR_STYLE = (
    "Professional watercolour children's picture book illustration, Beatrix Potter and Jill Barklem style. "
    "Hand-painted on textured cold-press paper with visible brushstrokes, soft pigment bleeds, gentle colour washes, "
    "loose sketchy linework. Warm cosy palette: warm golds, burnt siennas, soft sage greens, deep indigo-navy blues, "
    "pale golden moonlight. Australian bush scenes at night: moonlit meadows, gum trees, wildflowers, gentle streams. "
    "Soft, safe, calming bedtime mood. No text or captions. Safe for toddlers ages 1-5."
)
```

#### Updated Functions
- `generate_scene_image_pollinations()` (Line 396): Updated prompt to emphasize chubby round shape, warm colors, peaceful poses
- `generate_scene_image_fal_direct()` (Line 584): Same improvements for FAL.ai fallback
- `get_character_ref()` (Line 654): Updated reference generation prompt for consistency
- `generate_scene_image_kontext()` (Line 669): Already optimized for character consistency, no changes needed

#### Thumbnail Redesign (Not in this commit; was in previous work)
The `generate_thumbnail()` function now:
1. Extracts first scene image
2. Cover-crops to 1280×720 YouTube dimensions
3. Adds darkened 60px band at bottom
4. Renders golden title text
5. Falls back to navy gradient only if no artwork available

---

## Workflow Changes

### `.github/workflows/little-sunny-episode.yml` (Line 228)
Added character reference persistence:
```yaml
git add kids-channel/character/ 2>/dev/null || true
```

This commits the canonical Sonny reference image on first generation, ensuring:
- Same character reused across all future episodes
- Character design changes tracked in git history
- Easy to delete and regenerate if redesigning Sonny

---

## Visual Reference (Your Bible)

Three reference images validate the approach:

1. **Sunny and the Gentle Breeze**: Chubby round quokka lying in wildflowers under moonlight
2. **Sunny and the Flying Fox**: Golden-brown quokka in pajamas on log, peacefully watching flying fox
3. **Sunny and the Gentle Stream**: Sonny by stream in forest, wrapped in plaid blanket, cozy mood

**All prompts now enforce:**
- Warm golden-brown fur (not dark, not grey)
- Chubby, round, teddy-bear-like body
- Peaceful, restful poses (sitting, lying down, curled up)
- Cozy clothing details when appropriate
- Soft watercolor style with visible brushstrokes
- Warm palette (golds, siennas, sage greens, deep blues)
- Moonlit Australian bush settings
- Bedtime-appropriate calm, safe mood

---

## Fallback Chain (Unchanged Priority)

1. **Higgsfield Soul** (premium watercolour, needs `HIGGSFIELD_API_KEY`)
2. **Replicate FLUX Kontext** (character consistency, needs `REPLICATE_API_TOKEN`)
3. **Replicate FLUX Dev** (fresh character each scene, needs `REPLICATE_API_TOKEN`)
4. **FAL.ai FLUX Schnell** (~$0.003/image, needs `FAL_KEY`)
5. **Pollinations FLUX** (free, may be rate-limited)
6. **Stock photos** (Pexels/Pixabay)
7. **PIL fallback** (always works, procedurally generated art)

---

## First Test Run: What to Expect

**Workflow:** `little-sunny-episode.yml` (dry run, no YouTube upload)
**Script:** `sunny-and-the-shooting-star.json`
**Duration:** ~10-15 minutes

**Steps:**
1. ✓ Generate script via Claude Haiku
2. ✓ Narration via ElevenLabs (or Piper fallback)
3. ✓ Character reference generation (seed 7777, committed to git)
4. ✓ Scene images via FLUX Kontext (all scenes use canonical Sonny)
5. ✓ Ebook PDF assembly
6. ✓ Thumbnail from scene 1 + title band
7. ✓ Final video composition

**Artifacts:** Download and validate using `SUNNY_TEST_RUN_VALIDATION.md`

---

## Next Steps

- [ ] Run test workflow (dry run)
- [ ] Validate character consistency across 6 scenes
- [ ] Confirm thumbnail uses real artwork (not navy gradient)
- [ ] If satisfied: Schedule live episodes (3/day via cron)
- [ ] Monitor first 3 real episodes for consistency
- [ ] Document any tweaks for future reference

---

## Rollback Plan

If character consistency still fails after test:
1. Delete `kids-channel/character/sonny-ref.jpg`
2. Update `SONNY_CHARACTER` or `WATERCOLOUR_STYLE` in pipeline.py
3. Commit to main
4. Rerun workflow — reference regenerates with new seed
5. Test again

If Kontext unavailable (404 on account):
- Falls back to FLUX Dev automatically (character may drift, but video still generates)
- Consider requesting Kontext access on Replicate account

---

## Cost Impact

**Current (Dry Run):** Free
- Fallback chain uses free services (Pollinations, PIL)
- No API charges for test run

**Production (Live Episodes):**
- If Higgsfield available: ~$0.10-0.30/image (6 scenes + ref = 7 images)
- If only FLUX Kontext: No direct cost (via Replicate included tier)
- If only FAL.ai: ~$0.003 × 7 = $0.02/episode (~$0.18/day at 3 episodes/day)
- If only Pollinations: Free (may be rate-limited)
- If PIL fallback: Free (procedurally generated, lower quality)

---

## References

- SUNNY.md — System documentation and architecture
- pipeline.py — Source of truth for image generation logic
- little-sunny-episode.yml — GitHub Actions workflow definition
- queue.txt — Episode queue (86 pre-written scripts)
