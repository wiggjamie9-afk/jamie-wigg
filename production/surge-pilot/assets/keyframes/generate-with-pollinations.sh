#!/bin/bash

# SURGE Pilot — Act 1 Keyframe Generation via Pollinations (free tier)

OUTDIR="/home/user/jamie-wigg/production/surge-pilot/assets/keyframes"

echo "Generating 4 Act 1 keyframes using Pollinations FLUX..."
echo ""

# Helper function to download image
download_image() {
  local url="$1"
  local outfile="$2"
  curl -s -o "$outfile" "$url" && echo "✓ $(basename $outfile) generated" || echo "✗ $(basename $outfile) failed"
}

# Shot 1: Classroom Establishing
echo "[1/4] Shot 1: Classroom Establishing"
PROMPT_1="Flat 2D animation style illustration of a bright elementary school classroom, morning light from windows, fluorescent ceiling lights, empty desks in rows, one teacher desk, bulletin boards, teacher at front preparing for class. Cool color palette: light gray walls, soft blue accents, muted greens. Simple geometric shapes, bold outlines, no shading. Craig of the Creek meets Infinity Train aesthetic."
ENCODED_1=$(echo -n "$PROMPT_1" | jq -sRr @uri)
URL_1="https://image.pollinations.ai/prompt/$ENCODED_1?width=1920&height=1080&model=flux&seed=1"
download_image "$URL_1" "$OUTDIR/shot-01-classroom-establishing.png"

# Shot 3: Ziggy at Desk
echo "[2/4] Shot 3: Ziggy at Desk"
PROMPT_3="Flat 2D animation style close-up of a 10-year-old boy with circle head, messy asymmetrical dark hair, bright blue eyes wide and moving, wearing a bright blue hoodie and one sock up one sock down. Sitting at school desk with pencil, looking slightly anxious. Minimal background, subtle jittery lines suggesting nervous energy. Bold outlines, geometric shapes, simple colors."
ENCODED_3=$(echo -n "$PROMPT_3" | jq -sRr @uri)
URL_3="https://image.pollinations.ai/prompt/$ENCODED_3?width=1920&height=1080&model=flux&seed=2"
download_image "$URL_3" "$OUTDIR/shot-03-ziggy-desk.png"

# Shot 4a: Sensory Montage (Fluorescent Hum)
echo "[3/4] Shot 4a: Sensory Montage (Fluorescent Hum)"
PROMPT_4A="Flat 2D animation still of a ceiling with fluorescent lights, close-up, very bright white-blue light. Shimmer and hum effect with wavy lines around light fixture. Minimal detail, geometric shapes, bold lines. Cool color palette light gray, pale blue. Overwhelming shimmer effect."
ENCODED_4A=$(echo -n "$PROMPT_4A" | jq -sRr @uri)
URL_4A="https://image.pollinations.ai/prompt/$ENCODED_4A?width=1920&height=1080&model=flux&seed=3"
download_image "$URL_4A" "$OUTDIR/shot-04a-sensory-hum.png"

# Shot 15: Shame Moment
echo "[4/4] Shot 15: Shame Moment"
PROMPT_15="Flat 2D animation close-up of 10-year-old boy (Ziggy), face zoomed in, eyes downcast and pupils constricted, mouth slightly open embarrassed, surrounded by deep burgundy color cast overlay. Background very desaturated grayscale with burgundy wash. Dissociation, shame, freeze response. Minimal lines, heavy outlines, expression shows shutdown."
ENCODED_15=$(echo -n "$PROMPT_15" | jq -sRr @uri)
URL_15="https://image.pollinations.ai/prompt/$ENCODED_15?width=1920&height=1080&model=flux&seed=4"
download_image "$URL_15" "$OUTDIR/shot-15-shame-moment.png"

echo ""
echo "Generation complete. Keyframes saved to $OUTDIR"
ls -lah "$OUTDIR"/shot-*.png

