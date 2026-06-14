#!/bin/bash

################################################################################
# GENERATE-ALL-17-BOOKS.sh
# ========================
# Master orchestration script for complete 17-book generation pipeline
#
# Books: Sunny's Cozy Bedtime Tales 1-17
# Pipeline: Higgsfield images → ElevenLabs narration → FFmpeg assembly → YouTube
#
# Usage:
#   bash GENERATE-ALL-17-BOOKS.sh [options]
#
# Options:
#   --book N              Generate only book N (1-17)
#   --batch B             Generate only batch B (1-4: books 2-4, 5-8, 9-12, 13-17)
#   --skip-book1          Skip Book 1, start with books 2-17
#   --dry-run             Show plan without executing
#   --verbose             Show detailed progress for each step
#   --no-upload           Generate videos but skip YouTube upload
#   --resume              Resume from last failed batch
#
# Examples:
#   bash GENERATE-ALL-17-BOOKS.sh                    # Full 17-book pipeline
#   bash GENERATE-ALL-17-BOOKS.sh --book 5           # Generate only Book 5
#   bash GENERATE-ALL-17-BOOKS.sh --skip-book1       # Skip Book 1, do books 2-17
#   bash GENERATE-ALL-17-BOOKS.sh --dry-run          # Show pipeline plan
#
# Timeline:
#   • Single book: ~15 min (3 min images + 5 min narration + 7 min assembly)
#   • 17 books sequential: ~4 hours
#   • 17 books parallel (4x4): ~1 hour (4 books simultaneous)
#   • With YouTube upload: +2 min per book
#
# Output:
#   GENERATION-LOG-YYYY-MM-DD-HHmmss.txt   Master log with timestamps
#   Book folders:
#     BOOK-2-COMPLETE/                     Images + narration + video
#     BOOK-3-COMPLETE/
#     ... BOOK-17-COMPLETE/
#
# Error handling:
#   • Failed steps are skipped with warnings
#   • Successful books continue
#   • Summary report shows which books completed/failed
#   • Retry failed uploads up to 2 times
#
################################################################################

set -o pipefail

# ============================================================================
# CONFIGURATION
# ============================================================================

REPO_ROOT="/home/user/jamie-wigg"
TIMESTAMP=$(date +%Y-%m-%d-%H%M%S)
LOG_FILE="${REPO_ROOT}/GENERATION-LOG-${TIMESTAMP}.txt"
RESUME_FILE="${REPO_ROOT}/.generation-resume.json"

# Pipeline scripts
SCRIPT_HIGGSFIELD="${REPO_ROOT}/generate-book1-higgsfield-images.py"
SCRIPT_NARRATION="${REPO_ROOT}/generate-book1-narration.py"
SCRIPT_ASSEMBLY="${REPO_ROOT}/assemble-book1-final-video.py"
SCRIPT_UPLOAD="${REPO_ROOT}/upload-book1-to-youtube.py"

# Output directories
OUTPUT_BASE="${REPO_ROOT}"
VIDEOS_DIR="${REPO_ROOT}/videos"
BOOKS_COMPLETE_DIR="${REPO_ROOT}/BOOKS-COMPLETE"

# Batch configuration
declare -A BATCHES=(
    [1]="2 3 4"
    [2]="5 6 7 8"
    [3]="9 10 11 12"
    [4]="13 14 15 16 17"
)

# Timing estimates
TIME_HIGGSFIELD=180      # 3 minutes for Higgsfield image generation
TIME_NARRATION=300       # 5 minutes for ElevenLabs TTS
TIME_ASSEMBLY=420        # 7 minutes for FFmpeg assembly
TIME_UPLOAD=120          # 2 minutes per YouTube upload
TIME_PER_BOOK=$((TIME_HIGGSFIELD + TIME_NARRATION + TIME_ASSEMBLY + TIME_UPLOAD))

# Limits
MAX_RETRIES=2
MAX_PARALLEL=4

# Flags
FLAG_BOOK=""
FLAG_BATCH=""
FLAG_SKIP_BOOK1=false
FLAG_DRY_RUN=false
FLAG_VERBOSE=false
FLAG_NO_UPLOAD=false
FLAG_RESUME=false

# Tracking
FAILED_BOOKS=()
COMPLETED_BOOKS=()
SKIPPED_BOOKS=()
TOTAL_START_TIME=$(date +%s)

# ============================================================================
# UTILITIES
# ============================================================================

log() {
    local level="$1"
    shift
    local msg="$@"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')

    case "$level" in
        INFO)  echo "[$timestamp] ℹ️  $msg" | tee -a "$LOG_FILE" ;;
        OK)    echo "[$timestamp] ✅ $msg" | tee -a "$LOG_FILE" ;;
        WARN)  echo "[$timestamp] ⚠️  $msg" | tee -a "$LOG_FILE" ;;
        ERROR) echo "[$timestamp] ❌ $msg" | tee -a "$LOG_FILE" ;;
        DEBUG) [[ "$FLAG_VERBOSE" == true ]] && echo "[$timestamp] 🔍 $msg" | tee -a "$LOG_FILE" ;;
    esac
}

log_section() {
    local title="$1"
    echo "" | tee -a "$LOG_FILE"
    echo "================================================================================" | tee -a "$LOG_FILE"
    echo "$title" | tee -a "$LOG_FILE"
    echo "================================================================================" | tee -a "$LOG_FILE"
    echo "" | tee -a "$LOG_FILE"
}

format_time() {
    local seconds=$1
    local hours=$((seconds / 3600))
    local minutes=$(((seconds % 3600) / 60))
    local secs=$((seconds % 60))

    if (( hours > 0 )); then
        printf "%dh %dm %ds" $hours $minutes $secs
    elif (( minutes > 0 )); then
        printf "%dm %ds" $minutes $secs
    else
        printf "%ds" $secs
    fi
}

estimate_time() {
    local book_count=$1
    local parallel=$2
    local time_per_book=$3

    # If running in parallel, divide by parallel factor (but min 1 batch)
    local batches=$(( (book_count + parallel - 1) / parallel ))
    local estimated=$((batches * time_per_book))
    echo "$estimated"
}

check_prerequisites() {
    log_section "Checking Prerequisites"

    local missing=0

    # Check Python 3
    if ! command -v python3 &> /dev/null; then
        log ERROR "Python 3 not installed"
        missing=$((missing + 1))
    else
        log OK "Python 3: $(python3 --version)"
    fi

    # Check required Python packages
    local packages=("requests" "google-auth-oauthlib" "elevenlabs" "google-api-python-client")
    for pkg in "${packages[@]}"; do
        if python3 -c "import ${pkg//-/_}" 2>/dev/null; then
            log OK "Package: $pkg"
        else
            log WARN "Package missing: $pkg (install with: pip install $pkg)"
            missing=$((missing + 1))
        fi
    done

    # Check .env file for API credentials
    if [[ -f "${REPO_ROOT}/.env" ]]; then
        log OK ".env file found"

        local has_higgsfield=false
        local has_elevenlabs=false
        local has_youtube=false

        if grep -q "HIGGSFIELD_API_KEY" "${REPO_ROOT}/.env"; then
            log OK "Higgsfield API key configured"
            has_higgsfield=true
        else
            log WARN "Higgsfield API key not in .env"
        fi

        if grep -q "ELEVENLABS_API_KEY" "${REPO_ROOT}/.env"; then
            log OK "ElevenLabs API key configured"
            has_elevenlabs=true
        else
            log WARN "ElevenLabs API key not in .env"
        fi

        if [[ -f "${REPO_ROOT}/kids-channel/token.json" ]]; then
            log OK "YouTube credentials found"
            has_youtube=true
        else
            log WARN "YouTube token.json not found"
        fi
    else
        log WARN ".env file not found (images/narration may fail)"
        missing=$((missing + 1))
    fi

    # Check script files
    local scripts=("$SCRIPT_HIGGSFIELD" "$SCRIPT_NARRATION" "$SCRIPT_ASSEMBLY" "$SCRIPT_UPLOAD")
    for script in "${scripts[@]}"; do
        if [[ -f "$script" ]]; then
            log OK "Script found: $(basename $script)"
        else
            log ERROR "Script missing: $(basename $script)"
            missing=$((missing + 1))
        fi
    done

    # Check output directories
    mkdir -p "$VIDEOS_DIR" "$BOOKS_COMPLETE_DIR"
    log OK "Output directories created"

    if (( missing > 0 )); then
        log WARN "$missing prerequisites need attention (pipeline may fail)"
    fi

    return 0
}

validate_api_credentials() {
    log_section "Validating API Credentials"

    if [[ ! -f "${REPO_ROOT}/.env" ]]; then
        log WARN "No .env file found"
        return 1
    fi

    # Source the .env file
    set -a
    source "${REPO_ROOT}/.env"
    set +a

    # Test Higgsfield
    if [[ -z "$HIGGSFIELD_API_KEY" ]]; then
        log WARN "HIGGSFIELD_API_KEY not set"
    else
        log OK "Higgsfield API key loaded"
    fi

    # Test ElevenLabs
    if [[ -z "$ELEVENLABS_API_KEY" ]]; then
        log WARN "ELEVENLABS_API_KEY not set"
    else
        log OK "ElevenLabs API key loaded"
    fi

    return 0
}

generate_book_higgsfield() {
    local book_num=$1
    local book_dir="${OUTPUT_BASE}/BOOK-${book_num}-COMPLETE"

    mkdir -p "$book_dir"

    log INFO "Book $book_num: Generating Higgsfield character ref + 16 images (est. 3 min)"

    if [[ "$FLAG_DRY_RUN" == true ]]; then
        log DEBUG "DRY RUN: python3 $SCRIPT_HIGGSFIELD (book_num=$book_num)"
        sleep 1
        return 0
    fi

    if python3 "$SCRIPT_HIGGSFIELD" --book "$book_num" --output "$book_dir" >> "$LOG_FILE" 2>&1; then
        log OK "Book $book_num: Higgsfield images complete"
        return 0
    else
        log ERROR "Book $book_num: Higgsfield generation failed"
        return 1
    fi
}

generate_book_narration() {
    local book_num=$1
    local book_dir="${OUTPUT_BASE}/BOOK-${book_num}-COMPLETE"

    mkdir -p "$book_dir"

    log INFO "Book $book_num: Generating narration (est. 5 min)"

    if [[ "$FLAG_DRY_RUN" == true ]]; then
        log DEBUG "DRY RUN: python3 $SCRIPT_NARRATION (book_num=$book_num)"
        sleep 1
        return 0
    fi

    if python3 "$SCRIPT_NARRATION" --book "$book_num" --output "$book_dir" >> "$LOG_FILE" 2>&1; then
        log OK "Book $book_num: Narration complete"
        return 0
    else
        log ERROR "Book $book_num: Narration generation failed"
        return 1
    fi
}

assemble_book_video() {
    local book_num=$1
    local book_dir="${OUTPUT_BASE}/BOOK-${book_num}-COMPLETE"
    local output_video="${VIDEOS_DIR}/BOOK-${book_num}-final.mp4"

    log INFO "Book $book_num: Assembling video with FFmpeg (est. 7 min)"

    if [[ "$FLAG_DRY_RUN" == true ]]; then
        log DEBUG "DRY RUN: python3 $SCRIPT_ASSEMBLY (book_num=$book_num)"
        sleep 1
        return 0
    fi

    if python3 "$SCRIPT_ASSEMBLY" --book "$book_num" --input "$book_dir" --output "$output_video" >> "$LOG_FILE" 2>&1; then
        log OK "Book $book_num: Video assembly complete ($output_video)"
        return 0
    else
        log ERROR "Book $book_num: Video assembly failed"
        return 1
    fi
}

upload_book_youtube() {
    local book_num=$1
    local output_video="${VIDEOS_DIR}/BOOK-${book_num}-final.mp4"
    local retry_count=0

    if [[ "$FLAG_NO_UPLOAD" == true ]]; then
        log INFO "Book $book_num: Skipping YouTube upload (--no-upload flag)"
        return 0
    fi

    log INFO "Book $book_num: Uploading to YouTube (est. 2 min)"

    if [[ "$FLAG_DRY_RUN" == true ]]; then
        log DEBUG "DRY RUN: python3 $SCRIPT_UPLOAD (book_num=$book_num)"
        sleep 1
        return 0
    fi

    while (( retry_count < MAX_RETRIES )); do
        if python3 "$SCRIPT_UPLOAD" --book "$book_num" --video "$output_video" >> "$LOG_FILE" 2>&1; then
            log OK "Book $book_num: YouTube upload complete"
            return 0
        else
            retry_count=$((retry_count + 1))
            if (( retry_count < MAX_RETRIES )); then
                log WARN "Book $book_num: Upload failed, retrying ($retry_count/$MAX_RETRIES)"
                sleep 5
            fi
        fi
    done

    log ERROR "Book $book_num: YouTube upload failed after $MAX_RETRIES retries"
    return 1
}

process_book() {
    local book_num=$1
    local start_time=$(date +%s)

    log_section "BOOK $book_num / 17"

    # Step 1: Higgsfield images
    if ! generate_book_higgsfield "$book_num"; then
        FAILED_BOOKS+=($book_num)
        log WARN "Book $book_num: Skipping remaining steps due to image generation failure"
        return 1
    fi

    # Step 2: Narration
    if ! generate_book_narration "$book_num"; then
        FAILED_BOOKS+=($book_num)
        log WARN "Book $book_num: Skipping video assembly and upload due to narration failure"
        return 1
    fi

    # Step 3: Video assembly
    if ! assemble_book_video "$book_num"; then
        FAILED_BOOKS+=($book_num)
        log WARN "Book $book_num: Skipping YouTube upload due to assembly failure"
        return 1
    fi

    # Step 4: YouTube upload
    if ! upload_book_youtube "$book_num"; then
        FAILED_BOOKS+=($book_num)
        log WARN "Book $book_num: Completed but upload failed"
        return 1
    fi

    COMPLETED_BOOKS+=($book_num)

    local end_time=$(date +%s)
    local elapsed=$((end_time - start_time))
    log OK "Book $book_num: Complete in $(format_time $elapsed)"
}

process_book_parallel() {
    local book_num=$1
    local output_log="${REPO_ROOT}/.book-${book_num}.log"

    {
        process_book "$book_num"
    } > "$output_log" 2>&1

    local exit_code=$?
    cat "$output_log" >> "$LOG_FILE"
    rm -f "$output_log"

    return $exit_code
}

process_batch() {
    local batch_num=$1
    local books="${BATCHES[$batch_num]}"
    local batch_start_time=$(date +%s)

    log_section "BATCH $batch_num: Books $books"

    local pids=()

    for book_num in $books; do
        process_book_parallel "$book_num" &
        pids+=($!)

        # Limit parallelism
        if (( ${#pids[@]} >= MAX_PARALLEL )); then
            wait ${pids[0]}
            pids=("${pids[@]:1}")
        fi
    done

    # Wait for remaining books
    for pid in "${pids[@]}"; do
        wait $pid
    done

    local batch_end_time=$(date +%s)
    local batch_elapsed=$((batch_end_time - batch_start_time))

    log OK "Batch $batch_num: Complete in $(format_time $batch_elapsed)"
}

process_book1() {
    if [[ "$FLAG_SKIP_BOOK1" == true ]]; then
        log INFO "Book 1: Skipping (--skip-book1 flag)"
        return 0
    fi

    process_book 1
}

# ============================================================================
# MAIN PIPELINE
# ============================================================================

show_usage() {
    head -30 "$0" | tail -23
}

show_plan() {
    log_section "Generation Plan"

    local book_count=17
    local parallel=$MAX_PARALLEL

    if [[ -n "$FLAG_BOOK" ]]; then
        book_count=1
        log INFO "Mode: Single book generation (Book $FLAG_BOOK)"
    elif [[ -n "$FLAG_BATCH" ]]; then
        book_count=${#BATCHES[$FLAG_BATCH]//[^0-9]/}
        book_count=$(echo "${BATCHES[$FLAG_BATCH]}" | wc -w)
        log INFO "Mode: Single batch (Batch $FLAG_BATCH: ${BATCHES[$FLAG_BATCH]})"
    elif [[ "$FLAG_SKIP_BOOK1" == true ]]; then
        book_count=16
        log INFO "Mode: Books 2-17 only"
    else
        log INFO "Mode: Full pipeline (Books 1-17)"
    fi

    local est_time=$(estimate_time "$book_count" "$parallel" "$TIME_PER_BOOK")

    log INFO "Books to generate: $book_count"
    log INFO "Parallelism: up to $parallel books"
    log INFO "Time per book: $(format_time $TIME_PER_BOOK)"
    log INFO "Estimated total time: $(format_time $est_time)"
    log INFO ""
    log INFO "Pipeline steps per book:"
    log INFO "  1. Higgsfield images (16 pages + char ref): 3 min"
    log INFO "  2. ElevenLabs narration: 5 min"
    log INFO "  3. FFmpeg assembly: 7 min"
    log INFO "  4. YouTube upload: 2 min"

    if [[ "$FLAG_DRY_RUN" == true ]]; then
        log INFO ""
        log INFO "DRY RUN MODE: No files will be created or uploaded"
    fi
}

parse_args() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --help|-h)
                show_usage
                exit 0
                ;;
            --book)
                FLAG_BOOK="$2"
                shift 2
                ;;
            --batch)
                FLAG_BATCH="$2"
                shift 2
                ;;
            --skip-book1)
                FLAG_SKIP_BOOK1=true
                shift
                ;;
            --dry-run)
                FLAG_DRY_RUN=true
                shift
                ;;
            --verbose)
                FLAG_VERBOSE=true
                shift
                ;;
            --no-upload)
                FLAG_NO_UPLOAD=true
                shift
                ;;
            --resume)
                FLAG_RESUME=true
                shift
                ;;
            *)
                echo "Unknown option: $1"
                show_usage
                exit 1
                ;;
        esac
    done
}

main() {
    parse_args "$@"

    # Initialize log
    {
        echo "================================================================================"
        echo "SUNNY'S COZY BEDTIME TALES: 17-BOOK GENERATION PIPELINE"
        echo "================================================================================"
        echo ""
        echo "Start time: $(date)"
        echo "Log file: $LOG_FILE"
        echo ""
    } | tee -a "$LOG_FILE"

    # Check prerequisites
    check_prerequisites
    validate_api_credentials
    show_plan

    if [[ "$FLAG_DRY_RUN" == true ]]; then
        log INFO ""
        log INFO "DRY RUN: Would process:"
        if [[ -n "$FLAG_BOOK" ]]; then
            log INFO "  Book $FLAG_BOOK"
        elif [[ -n "$FLAG_BATCH" ]]; then
            log INFO "  Batch $FLAG_BATCH: ${BATCHES[$FLAG_BATCH]}"
        elif [[ "$FLAG_SKIP_BOOK1" == true ]]; then
            log INFO "  Books 2-17 (4 batches)"
        else
            log INFO "  Books 1-17 (5 steps total: setup + 4 batches)"
        fi
        log INFO ""
        log INFO "To run for real, remove --dry-run flag"
        exit 0
    fi

    log_section "Starting Generation Pipeline"

    # Single book mode
    if [[ -n "$FLAG_BOOK" ]]; then
        process_book "$FLAG_BOOK"
        show_summary
        exit $?
    fi

    # Single batch mode
    if [[ -n "$FLAG_BATCH" ]]; then
        process_batch "$FLAG_BATCH"
        show_summary
        exit $?
    fi

    # Full pipeline: Book 1 setup + 4 batches
    process_book1

    process_batch 1
    process_batch 2
    process_batch 3
    process_batch 4

    show_summary
}

show_summary() {
    log_section "Generation Summary"

    local total_end_time=$(date +%s)
    local total_elapsed=$((total_end_time - TOTAL_START_TIME))

    log INFO "Total time: $(format_time $total_elapsed)"
    log OK "Completed: ${#COMPLETED_BOOKS[@]} books"
    log WARN "Failed: ${#FAILED_BOOKS[@]} books"

    if (( ${#COMPLETED_BOOKS[@]} > 0 )); then
        log INFO "Completed books: ${COMPLETED_BOOKS[*]}"
    fi

    if (( ${#FAILED_BOOKS[@]} > 0 )); then
        log ERROR "Failed books: ${FAILED_BOOKS[*]}"
    fi

    log INFO ""
    log INFO "Full log saved to: $LOG_FILE"

    if (( ${#FAILED_BOOKS[@]} == 0 )); then
        log OK "All books generated successfully!"

        log INFO ""
        log INFO "YouTube URLs:"
        for book in {1..17}; do
            local video_file="${VIDEOS_DIR}/BOOK-${book}-final.mp4"
            if [[ -f "$video_file" ]]; then
                log INFO "  Book $book: https://youtube.com/watch?v=<video-id>"
            fi
        done

        return 0
    else
        log ERROR "Some books failed. Review log for details."
        return 1
    fi
}

# ============================================================================
# ENTRY POINT
# ============================================================================

main "$@"
