# Sunny Test Run Validation Checklist

## What This Test Run Does

**Workflow:** Little Sunny — New Episode (dry run)
**Script:** `sunny-and-the-shooting-star.json` (top of queue)
**Character Generation:** Canonical Sonny with seed 7777 (will commit to git)
**Scene Generation:** FLUX Kontext (paints canonical character into each scene)

---

## ✓ Validation Checklist

After the workflow completes, download the episode artifacts and verify:

### 1. Character Consistency (Critical)
- [ ] **Scene 1 (scene_01.jpg)**: Sunny appears with warm golden-brown fur, round body, gentle eyes
- [ ] **Scene 2-6 (scene_02 through scene_06.jpg)**: **Same Sunny** — identical fur color, body shape, facial features across ALL scenes
- [ ] **No character drift**: No scene shows Sunny as darker, skinnier, or with different proportions
- [ ] **Reference match**: Sunny matches the three reference images you provided (chubby, round, golden-brown, peaceful)

### 2. Color Palette (Critical)
- [ ] **Fur color**: Consistently WARM GOLDEN-BROWN (not dark, not grey, not tan)
- [ ] **Sky colors**: Deep navy/indigo night sky with stars in all scenes
- [ ] **Warm tones**: Ochres, burnt siennas, soft greens visible in landscapes
- [ ] **Moonlight**: Soft golden/pale yellow moonlight, not harsh white

### 3. Art Style (Critical)
- [ ] **Watercolor effect**: Visible brushstrokes and pigment bleeds
- [ ] **Textured paper**: Cold-press paper texture apparent (not glossy, not flat digital)
- [ ] **No AI artifacts**: No weird shapes, extra limbs, malformed details
- [ ] **Children's book quality**: Soft edges, painterly, safe for toddlers

### 4. Thumbnail (Important)
- [ ] **Uses real artwork**: Thumbnail is first scene (scene_01.jpg) cover-cropped, NOT plain navy gradient
- [ ] **Readable title**: Golden/pale text on darkened band at bottom
- [ ] **Proper dimensions**: 1280×720 pixels
- [ ] **SEO suffix removed**: Title shows "Sunny and the Shooting Star" not "...| Bedtime Story"

### 5. Ebook PDF (Important)
- [ ] **6 scene pages**: One scene image + narration text per page
- [ ] **Title page**: Navy night sky with golden title, show name
- [ ] **Closing page**: "Sweet dreams!" sign-off
- [ ] **Images readable**: Scene artwork is clear and visible

### 6. Video (Important)
- [ ] **Duration**: ~55 seconds (6 scenes × ~8-9s each)
- [ ] **Audio**: Narration plays clearly
- [ ] **Transitions**: Smooth scene-to-scene fades
- [ ] **Quality**: HD resolution (1920×1080)

### 7. Git State (Technical)
- [ ] **Character reference committed**: `kids-channel/character/sonny-ref.jpg` appears in git
- [ ] **Queue advanced**: `sunny-and-the-shooting-star.json` removed from queue.txt
- [ ] **Next script ready**: queue.txt top now shows next episode

---

## If Character is Inconsistent

If Sunny drifts between scenes (different colors, body shape, expression):
1. Delete `kids-channel/character/sonny-ref.jpg` from git
2. Update `SONNY_CHARACTER` or `WATERCOLOUR_STYLE` in pipeline.py
3. Commit changes
4. Rerun workflow — it will regenerate the reference with new seed

---

## If Colors are Wrong

- **Too dark/grey**: Add "WARM" emphasis in SONNY_CHARACTER
- **Too saturated**: Adjust palette description in WATERCOLOUR_STYLE
- **Wrong mood**: Check that watercolor style mentions "soft", "gentle", "calm"

---

## Next Steps After Validation

✓ If test passes → Ready to schedule live episodes (3/day via cron)
✓ If tweaks needed → Make adjustments, run one more test
✓ Once confident → Set queue for full automation

---

## Key Metrics

- **Execution time**: Should complete in 10-15 minutes
- **Character consistency**: 100% (same character in all 6 scenes)
- **File sizes**: Each scene ~500KB-2MB, final video ~50-80MB
- **Cost**: Free for first few runs (uses fallbacks); FLUX Kontext/FAL would cost ~$0.20-0.50/episode with real keys
