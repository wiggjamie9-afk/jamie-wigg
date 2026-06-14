#!/bin/bash

################################################################################
# setup-book-metadata.sh
# ======================
# Helper script to create metadata.json and PLAN.md templates for books 2-17
#
# Usage:
#   bash setup-book-metadata.sh
#   bash setup-book-metadata.sh --books 2-5
#   bash setup-book-metadata.sh --only-metadata
#   bash setup-book-metadata.sh --only-plans
#
# Creates:
#   BOOK-N-COMPLETE/metadata.json (title, description, tags for YouTube)
#   BOOK-N-COMPLETE/PLAN.md (scene descriptions for Higgsfield image generation)
#   BOOK-N-COMPLETE/script.txt (narration script)
#
################################################################################

set -e

REPO_ROOT="/home/user/jamie-wigg"
FLAG_BOOKS=""
FLAG_ONLY_METADATA=false
FLAG_ONLY_PLANS=false

# Parse args
while [[ $# -gt 0 ]]; do
    case "$1" in
        --books)
            FLAG_BOOKS="$2"
            shift 2
            ;;
        --only-metadata)
            FLAG_ONLY_METADATA=true
            shift
            ;;
        --only-plans)
            FLAG_ONLY_PLANS=true
            shift
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Default to all books if not specified
if [[ -z "$FLAG_BOOKS" ]]; then
    FLAG_BOOKS="2-17"
fi

# Book titles and themes
declare -A BOOK_TITLES=(
    [2]="Sunny and the Sleeping Glow Worms"
    [3]="Sunny's Moon River Adventure"
    [4]="Sunny and the Starlight Garden"
    [5]="Sunny's Dream of Flying"
    [6]="Sunny and the Peaceful Waterhole"
    [7]="Sunny's Forest Lullaby"
    [8]="Sunny and the Golden Sunset"
    [9]="Sunny's Cozy Cave"
    [10]="Sunny and the Fireflies' Dance"
    [11]="Sunny's Rainbow Dreams"
    [12]="Sunny and the Sleeping Animals"
    [13]="Sunny's Twilight Wishes"
    [14]="Sunny and the Evening Breeze"
    [15]="Sunny's Starry Night Quest"
    [16]="Sunny and the Peaceful Meadow"
    [17]="Sunny's Forever Bedtime"
)

declare -A BOOK_THEMES=(
    [2]="glow worms, twilight magic, bioluminescence"
    [3]="moon, river, water reflections"
    [4]="stars, garden flowers, constellations"
    [5]="flying, dreams, sky exploration"
    [6]="water, peace, animal friends"
    [7]="forest sounds, lullaby, nature"
    [8]="sunset, golden hour, day's end"
    [9]="cave, shelter, comfort"
    [10]="fireflies, dancing lights, wonder"
    [11]="rainbow colors, dreams, magic"
    [12]="sleeping animals, rest time"
    [13]="wishes, twilight, hope"
    [14]="evening breeze, gentle wind"
    [15]="star quest, adventure, discovery"
    [16]="meadow, flowers, peace"
    [17]="forever sleep, bedtime security"
)

create_metadata_file() {
    local book_num=$1
    local title="${BOOK_TITLES[$book_num]}"
    local themes="${BOOK_THEMES[$book_num]}"

    local output_dir="${REPO_ROOT}/BOOK-${book_num}-COMPLETE"
    mkdir -p "$output_dir"

    local metadata_file="${output_dir}/metadata.json"

    cat > "$metadata_file" << EOF
{
  "book_number": $book_num,
  "title": "Sunny's Bedtime Tales - $title",
  "short_title": "$title",
  "description": "Join Little Sunny the quokka on her magical bedtime adventure with $themes. A gentle, calming bedtime story for toddlers and preschoolers.\\n\\n🌙 Perfect for:\\n• Bedtime routines\\n• Toddlers & preschoolers\\n• Nature lovers\\n• Calming stories and sleep\\n\\n📚 More Sunny Stories coming soon!\\n\\nSubscribe for new episodes: https://www.youtube.com/@SunnyBedtimeTales",
  "tags": [
    "bedtime story",
    "toddler",
    "kids cartoon",
    "quokka",
    "Australian animals",
    "gentle stories",
    "sleep story",
    "nature for kids",
    "calm cartoon",
    "Sunny's Cozy Bedtime Tales",
    "$themes"
  ],
  "theme": "$themes",
  "duration_seconds": 360,
  "target_age": "1-5 years"
}
EOF

    echo "✅ Created: $metadata_file"
}

create_plan_file() {
    local book_num=$1
    local title="${BOOK_TITLES[$book_num]}"

    local output_dir="${REPO_ROOT}/BOOK-${book_num}-COMPLETE"
    mkdir -p "$output_dir"

    local plan_file="${output_dir}/PLAN.md"

    cat > "$plan_file" << EOF
# Book $book_num: $title

**Theme:** ${BOOK_THEMES[$book_num]}
**Target age:** Toddlers (1-5 years)
**Style:** Watercolor, warm, gentle, sleepy

## Scene Descriptions for Higgsfield Image Generation

Each scene description will be used to generate one page (16 pages total + 1 cover).

### Cover Page
Sunny the quokka in a cozy bedtime scene with "$title" text, moon, stars.
Warm colors (navy, gold, cream), professional illustration style.
Book title and author (Jamie Wigg) at bottom.

### Page 1
[DESCRIBE SCENE 1 HERE]
Style: Watercolor, soft colors, peaceful, dreamy
Include: Sunny character, scene elements, bedtime mood

### Page 2
[DESCRIBE SCENE 2 HERE]

### Page 3
[DESCRIBE SCENE 3 HERE]

### Page 4
[DESCRIBE SCENE 4 HERE]

### Page 5
[DESCRIBE SCENE 5 HERE]

### Page 6
[DESCRIBE SCENE 6 HERE]

### Page 7
[DESCRIBE SCENE 7 HERE]

### Page 8
[DESCRIBE SCENE 8 HERE]

### Page 9
[DESCRIBE SCENE 9 HERE]

### Page 10
[DESCRIBE SCENE 10 HERE]

### Page 11
[DESCRIBE SCENE 11 HERE]

### Page 12
[DESCRIBE SCENE 12 HERE]

### Page 13
[DESCRIBE SCENE 13 HERE]

### Page 14
[DESCRIBE SCENE 14 HERE]

### Page 15
[DESCRIBE SCENE 15 HERE]

### Page 16
[DESCRIBE SCENE 16 HERE - THE ENDING]
Sunny settling to sleep, final peace and rest.

---

## Character Notes

**Sunny the Quokka:**
- Warm brown and grey fur
- Big gentle eyes
- Friendly, peaceful demeanor
- Always calm and safe
- Warm smile

**Art Style Requirements:**
- Watercolor texture
- Soft, rounded shapes
- Warm color palette (navy, golds, creams, warm pinks)
- Professional quality
- Suitable for children 1-5 years old
- Calming and peaceful mood throughout
- Consistent character appearance across all pages
EOF

    echo "✅ Created: $plan_file"
    echo "   ⚠️  Edit this file to add scene descriptions (currently templated)"
}

create_script_file() {
    local book_num=$1
    local title="${BOOK_TITLES[$book_num]}"

    local output_dir="${REPO_ROOT}/BOOK-${book_num}-COMPLETE"
    mkdir -p "$output_dir"

    local script_file="${output_dir}/script.txt"

    cat > "$script_file" << EOF
# Book $book_num: $title
# Narration Script for ElevenLabs TTS

[Add narration script here - approximately 300-350 words for 90-second audio]

This is the full spoken narration that will be generated as audio by ElevenLabs.
Read by a warm, motherly voice (Grace, Emily, or Julia).

---

[PLACEHOLDER: Replace this with the actual story narration for Book $book_num]

The story should:
- Be gentle and calming
- Feature Sunny as the main character
- Include references to: ${BOOK_THEMES[$book_num]}
- End with Sunny falling asleep peacefully
- Approximately 350-400 words (3-5 minutes)
- Use simple, poetic language suitable for young children

---

[END OF SCRIPT]
EOF

    echo "✅ Created: $script_file"
    echo "   ⚠️  Edit this file to add the actual narration script"
}

# Parse book range
parse_range() {
    local range=$1

    if [[ "$range" == *"-"* ]]; then
        local start=${range%-*}
        local end=${range#*-}
        echo $(seq $start $end)
    else
        echo "$range"
    fi
}

# Main
echo "================================================================================"
echo "Setting up Book Metadata and Plans (Books $FLAG_BOOKS)"
echo "================================================================================"
echo ""

books=$(parse_range "$FLAG_BOOKS")

for book_num in $books; do
    echo ""
    echo "Book $book_num: ${BOOK_TITLES[$book_num]}"
    echo "─────────────────────────────────────────────────────────────"

    if [[ "$FLAG_ONLY_PLANS" != true ]]; then
        create_metadata_file "$book_num"
    fi

    if [[ "$FLAG_ONLY_METADATA" != true ]]; then
        create_plan_file "$book_num"
        create_script_file "$book_num"
    fi
done

echo ""
echo "================================================================================"
echo "✅ Setup Complete!"
echo "================================================================================"
echo ""
echo "Next steps:"
echo "1. Edit the PLAN.md files to add scene descriptions for Higgsfield"
echo "2. Edit the script.txt files to add narration (or paste from existing files)"
echo "3. Run: bash GENERATE-ALL-17-BOOKS.sh --dry-run"
echo "4. Run: bash GENERATE-ALL-17-BOOKS.sh"
echo ""
