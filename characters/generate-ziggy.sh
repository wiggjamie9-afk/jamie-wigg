#!/bin/bash

# SURGE Character Generation - ZIGGY
# Professional 2D Cartoon Illustration using FLUX 1.1 Pro

if [ -z "$REPLICATE_API_TOKEN" ]; then
  echo "Error: REPLICATE_API_TOKEN not set"
  exit 1
fi

PROMPT="Professional 2D cartoon character design sheet in the style of Vectteezy and modern animation studios. Ziggy, energetic middle-school ADHD superhero protagonist. Center (largest): Full-body character standing confidently, friendly smile, arms raised with energy. Top row: 3 head variations - front facing, 3/4 left turn, 3/4 right turn. Show spiky dark hair, bright expressive eyes, warm smile. Right side expressions: 4 variations - happy/excited, focused/determined, nervous/anxious, powerful/confident. Animated eyes with shine. Bottom row: 4 action poses - running forward, jumping, thinking/hand on chin, celebrating with fist pump. Character design: Warm peachy skin tone, short dark spiky hair with shine/movement, big bright eyes with highlights. Clothing: VIBRANT ORANGE (#FF8C00) hoodie - primary focus, ELECTRIC BLUE (#00D8FF) trim on cuffs/zipper/pockets, comfortable fit. Posture shows constant barely-contained energy - always in motion, hopeful, brilliant. Color palette: Orange, Electric Blue, Warm skin tones, bright happy colors. Style: Clean bold lines, cel-shading friendly, vibrant colors, professional 2D cartoon illustration. No shadows - bright flat colors like Vectteezy style. White background. High quality studio illustration."

echo "Generating ZIGGY character design sheet..."
echo "This may take 1-2 minutes..."

curl -X POST https://api.replicate.com/v1/predictions \
  -H "Authorization: Token $REPLICATE_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d @- <<EOF > /tmp/ziggy-response.json
{
  "version": "black-forest-labs/flux-1.1-pro",
  "input": {
    "prompt": "$PROMPT",
    "aspect_ratio": "16:9",
    "output_format": "png",
    "output_quality": 95,
    "safety_tolerance": 2,
    "prompt_upsampling": true
  }
}
EOF

# Check response
if grep -q "\"error\"" /tmp/ziggy-response.json; then
  echo "❌ Generation failed:"
  cat /tmp/ziggy-response.json
  exit 1
fi

# Get prediction ID
PRED_ID=$(grep -o '"id":"[^"]*"' /tmp/ziggy-response.json | head -1 | cut -d'"' -f4)
echo "Prediction ID: $PRED_ID"

# Poll for completion
echo "Waiting for generation to complete..."
while true; do
  curl -s -H "Authorization: Token $REPLICATE_API_TOKEN" \
    https://api.replicate.com/v1/predictions/$PRED_ID > /tmp/ziggy-status.json

  STATUS=$(grep -o '"status":"[^"]*"' /tmp/ziggy-status.json | cut -d'"' -f4)

  if [ "$STATUS" = "succeeded" ]; then
    IMAGE_URL=$(grep -o '"url":"[^"]*"' /tmp/ziggy-status.json | head -1 | cut -d'"' -f4)
    echo "✅ Generation complete!"
    echo "Image URL: $IMAGE_URL"

    # Download image
    echo "Downloading image..."
    curl -L "$IMAGE_URL" -o ziggy-illustrated.png

    if [ -f "ziggy-illustrated.png" ]; then
      echo "✅ Saved: ziggy-illustrated.png"
      ls -lh ziggy-illustrated.png
    fi
    break
  elif [ "$STATUS" = "failed" ]; then
    echo "❌ Generation failed"
    cat /tmp/ziggy-status.json
    exit 1
  else
    echo "Status: $STATUS... (waiting)"
    sleep 5
  fi
done
