#!/bin/bash

# Generate JORDAN character design sheet using Replicate FLUX Pro
# Usage: bash generate-jordan.sh

set -e

API_TOKEN="${REPLICATE_API_TOKEN}"
if [ -z "$API_TOKEN" ]; then
  echo "Error: REPLICATE_API_TOKEN not set. Set it in .env or export it:"
  echo "  export REPLICATE_API_TOKEN=your_token_here"
  exit 1
fi

OUTPUT_FILE="jordan-character-sheet.png"

# Read the detailed prompt from the spec
PROMPT='Professional 2D cartoon character design sheet (16:9 landscape, white studio background, organized grid layout with clear sections).

**CENTER FULL-BODY FIGURE - JORDAN:**
Middle-school student, thoughtful and observant with internal intensity. Medium skin tone with warm features and expressive, slightly anxious eyes conveying intelligence and depth. Distinctly styled hair with subtle texture (slightly wavy, asymmetrical cut, or personal styling choice—shows care and individuality). Dressed in casual student clothing: comfortable BLUE or PURPLE hoodie/jacket (primary color for calm, introspection, stability), simple shirt underneath, casual pants, optional secondary-color accessory (earth tone like rust, sage, or warm brown).

Posture conveys both vulnerability and quiet capability. Default stance: slightly closed, hands at front, comfortable. Design should feel approachable, age-appropriate, and authentic—not stereotypically "anxious kid" cliché.

**TOP ROW - 3 HEAD VARIATIONS:**
1. **Front View (Calm/Neutral):** Symmetrical face, both eyes visible, hair frames face, calm introspective expression
2. **3/4 Profile (Thoughtful Angle):** Head slightly turned, shows hair volume and texture, one eye visible, thoughtful observing expression
3. **Pure Profile (Distinctive Hair):** Head 90-degree profile, full silhouette, distinctive hair styling prominent, calm neutral expression

**MIDDLE ROWS - 4 EXPRESSION VARIATIONS (same character):**
1. **Anxious/Worried:** Furrowed brow with crease, wider worried eyes, tightened mouth, shoulders slightly raised. Conveys social stress or sensory overwhelm, not helplessness.
2. **Focused/Concentrating:** Slightly knitted brow, narrow intense eyes, lip bite or determined line, forward-leaning posture. Shows hyperfocus, problem-solving, creative engagement.
3. **Uncertain/Hesitant:** Raised soft brow, eyes looking away or seeking reassurance, nervous expression, withdrawn posture, hands together or crossed. Conveys decision-making uncertainty, not defeat.
4. **Confident/Capable:** Relaxed calm brow, direct assured eyes, genuine smile or calm neutral mouth, upright grounded posture. Shows inner strength, standing by work, trusted moment.

**BOTTOM ROWS - 4 ACTION POSES (full body, clear context):**
1. **Thinking/Introspective:** Hands clasped or near chin in front of body, head tilted slightly down or to side, slightly turned angle, introspective focus. Suggests reflection and processing.
2. **Observing/Watching:** Relaxed hands at sides or holding small object, head turned attentively, still but engaged posture, focused outward gaze. Shows attentive presence in classroom or social moment.
3. **Creating/Working:** Seated at desk or standing at workspace, hands engaged with task (writing, typing, drawing, building), head bent slightly forward in flow state, concentrated expression. Shows hyperfocus on interest or project.
4. **Standing Proud/Grounded:** Fully upright relaxed posture, hands at sides open, head straight forward, calm confident expression with optional small smile. Conveys accomplishment, pride, and grounded capability.

**STYLE & EXECUTION:**
- Clean bold black outlines throughout, professional 2D cartoon illustration
- Expressive, large eyes as focal point (show intelligence, depth, slight worry/thoughtfulness)
- Hair texture and styling clearly visible and distinctive, suggesting personality and care
- Cool BLUE or PURPLE primary color palette (suggests calm, introspection, stability)
- WARM EARTH TONE secondary accents (rust, sage green, warm brown—suggests grounding and approachability)
- Age-appropriate (~12-13 years), neither stereotypically athletic nor fragile
- Expressions readable at small sizes, body language communicates emotion
- Design celebrates neurodivergent identity: anxiety and autism are part of personality, not deficits
- Conveys thoughtfulness, quiet strength, authentic anxiety, hidden capabilities, kindness

**DESIGN PHILOSOPHY:**
JORDAN should feel real, capable, and proud. Not broken, pitiful, or stereotypically "sad anxious kid." Different = depth, not deficit. Authentic neurodivergent representation for educational and narrative contexts.

**TECHNICAL:**
16:9 landscape, white studio background, high-quality professional 2D cartoon, all sections clearly visible and organized.'

echo "=========================================="
echo "JORDAN Character Design Generation"
echo "=========================================="
echo ""
echo "Model: FLUX 1.1 Pro (black-forest-labs/flux-1.1-pro)"
echo "Output: $OUTPUT_FILE"
echo "Aspect Ratio: 16:9"
echo ""
echo "Generating character design sheet..."
echo ""

# Call Replicate API
RESPONSE=$(curl -s -X POST https://api.replicate.com/v1/predictions \
  -H "Authorization: Token $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d @- << EOF
{
  "version": "12a4eef66e1aa8aba2acfda183abc21f2ad53ce63dcf51052a56a162aad74a86",
  "input": {
    "prompt": "$PROMPT",
    "aspect_ratio": "16:9",
    "output_format": "png"
  }
}
EOF
)

echo "API Response:"
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"

# Extract prediction ID and URLs
PREDICTION_ID=$(echo "$RESPONSE" | jq -r '.id // empty')
if [ -z "$PREDICTION_ID" ]; then
  echo ""
  echo "Error: Failed to create prediction. Check REPLICATE_API_TOKEN."
  exit 1
fi

echo ""
echo "Prediction ID: $PREDICTION_ID"
echo "Polling for completion..."
echo ""

# Poll for completion
MAX_ATTEMPTS=60
ATTEMPT=0
while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
  ATTEMPT=$((ATTEMPT + 1))
  POLL=$(curl -s -X GET "https://api.replicate.com/v1/predictions/$PREDICTION_ID" \
    -H "Authorization: Token $API_TOKEN")

  STATUS=$(echo "$POLL" | jq -r '.status // "unknown"')
  echo "[$ATTEMPT/$MAX_ATTEMPTS] Status: $STATUS"

  if [ "$STATUS" == "succeeded" ]; then
    OUTPUT_URL=$(echo "$POLL" | jq -r '.output[0] // empty')
    if [ -n "$OUTPUT_URL" ]; then
      echo ""
      echo "Generation complete!"
      echo "Output URL: $OUTPUT_URL"
      echo ""
      echo "Downloading image..."
      curl -s -o "$OUTPUT_FILE" "$OUTPUT_URL"

      if [ -f "$OUTPUT_FILE" ]; then
        SIZE=$(du -h "$OUTPUT_FILE" | cut -f1)
        echo "Saved: $OUTPUT_FILE ($SIZE)"
        echo ""
        echo "Success! JORDAN character design sheet ready."
        exit 0
      fi
    fi
  elif [ "$STATUS" == "failed" ]; then
    ERROR=$(echo "$POLL" | jq -r '.error // "Unknown error"')
    echo "Error: $ERROR"
    exit 1
  fi

  sleep 2
done

echo "Timeout waiting for generation to complete."
exit 1
