#!/bin/bash

# SURGE Pilot — Act 1 Keyframe Generation
# 4 flat 2D animation reference frames

OUTDIR="/home/user/jamie-wigg/production/surge-pilot/assets/keyframes"

echo "Generating 4 Act 1 keyframes using FLUX 1.1 Pro..."
echo ""

# Shot 1: Classroom Establishing
echo "[1/4] Shot 1: Classroom Establishing"
curl -s -X POST https://api.replicate.com/v1/predictions \
  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "version": "8b409ce2f7d73c8e98c3e8f1a7b0a8c5",
    "input": {
      "prompt": "Flat 2D animation style illustration of a bright elementary school classroom, morning light from windows, fluorescent ceiling lights, empty desks in rows, one teacher'\''s desk, bulletin boards, teacher at front preparing for class. Cool color palette: light gray walls, soft blue accents, muted greens. Simple geometric shapes, bold outlines, no shading. Craig of the Creek meets Infinity Train aesthetic. 1920x1080.",
      "aspect_ratio": "16:9",
      "output_format": "png"
    }
  }' | jq -r '.output[0]' > "$OUTDIR/shot-01-classroom-establishing.png" 2>/dev/null && echo "✓ Shot 1 generated" || echo "✗ Shot 1 failed"

# Shot 3: Ziggy at Desk
echo "[2/4] Shot 3: Ziggy at Desk"
curl -s -X POST https://api.replicate.com/v1/predictions \
  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "version": "8b409ce2f7d73c8e98c3e8f1a7b0a8c5",
    "input": {
      "prompt": "Flat 2D animation style close-up of a 10-year-old boy with circle head, messy asymmetrical dark hair, Electric Blue (#0052CC) eyes that are wide and moving, wearing a bright blue hoodie and one sock up/one sock down. He'\''s sitting at a school desk, pencil in hand, looking slightly anxious. Minimal background (just desk edge, subtle jittery lines around him suggesting nervous energy). Bold outlines, geometric shapes, simple colors. 1920x1080.",
      "aspect_ratio": "16:9",
      "output_format": "png"
    }
  }' | jq -r '.output[0]' > "$OUTDIR/shot-03-ziggy-desk.png" 2>/dev/null && echo "✓ Shot 3 generated" || echo "✗ Shot 3 failed"

# Shot 4a: Sensory Montage (Fluorescent Hum)
echo "[3/4] Shot 4a: Sensory Montage (Fluorescent Hum)"
curl -s -X POST https://api.replicate.com/v1/predictions \
  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "version": "8b409ce2f7d73c8e98c3e8f1a7b0a8c5",
    "input": {
      "prompt": "Flat 2D animation still of a ceiling with fluorescent lights, close-up, very bright white-blue light. Suggest shimmer/hum with wavy lines around the light fixture. Minimal detail, geometric shapes, bold lines. Cool color palette (light gray, pale blue). The shimmer should feel overwhelming and present. 1920x1080.",
      "aspect_ratio": "16:9",
      "output_format": "png"
    }
  }' | jq -r '.output[0]' > "$OUTDIR/shot-04a-sensory-hum.png" 2>/dev/null && echo "✓ Shot 4a generated" || echo "✗ Shot 4a failed"

# Shot 15: Shame Moment
echo "[4/4] Shot 15: Shame Moment"
curl -s -X POST https://api.replicate.com/v1/predictions \
  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "version": "8b409ce2f7d73c8e98c3e8f1a7b0a8c5",
    "input": {
      "prompt": "Flat 2D animation close-up of the same 10-year-old boy (Ziggy), face zoomed in, eyes downcast and pupils constricted, mouth slightly open (embarrassed), surrounded by a Deep Burgundy (#5D1E3B) color cast overlay. The background should be very desaturated/grayscale with burgundy wash. Convey dissociation, shame, freeze response. Minimal lines, heavy outlines, expression shows shutdown. 1920x1080.",
      "aspect_ratio": "16:9",
      "output_format": "png"
    }
  }' | jq -r '.output[0]' > "$OUTDIR/shot-15-shame-moment.png" 2>/dev/null && echo "✓ Shot 15 generated" || echo "✗ Shot 15 failed"

echo ""
echo "Generation complete. Keyframes saved to $OUTDIR"
ls -lah "$OUTDIR"/shot-*.png

