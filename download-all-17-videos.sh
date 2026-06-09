#!/bin/bash
# Download all 17 Sunny's Bedtime Tales videos for YouTube upload

echo "🎬 SUNNY'S BEDTIME TALES — DOWNLOAD SCRIPT"
echo "==========================================="
echo ""
echo "Total Size: 66 MB (17 videos)"
echo "Each video: ~3.8 MB, 2m 38s duration"
echo ""

SOURCE_DIR="/home/user/jamie-wigg/SUNNY-17-FINAL-UPLOAD"
DOWNLOAD_DIR="./SUNNY-17-VIDEOS"

# Create download directory
mkdir -p "$DOWNLOAD_DIR"

echo "📥 Downloading 17 videos..."
echo ""

# Copy all MP4 files
cp "$SOURCE_DIR"/book-033/BOOK-033-UPLOAD.mp4 "$DOWNLOAD_DIR/01-Sunny-and-the-Flying-Fox.mp4"
cp "$SOURCE_DIR"/book-034/BOOK-034-UPLOAD.mp4 "$DOWNLOAD_DIR/02-Sunny-and-the-Fog.mp4"
cp "$SOURCE_DIR"/book-035/BOOK-035-UPLOAD.mp4 "$DOWNLOAD_DIR/03-Sunny-and-the-Gentle-Breeze.mp4"
cp "$SOURCE_DIR"/book-041/BOOK-041-UPLOAD.mp4 "$DOWNLOAD_DIR/04-Sunny-and-the-Gentle-Stream.mp4"
cp "$SOURCE_DIR"/book-043/BOOK-043-UPLOAD.mp4 "$DOWNLOAD_DIR/05-Sunny-and-the-Gentle-Thunder.mp4"
cp "$SOURCE_DIR"/book-046/BOOK-046-UPLOAD.mp4 "$DOWNLOAD_DIR/06-Sunny-and-the-Golden-Hour.mp4"
cp "$SOURCE_DIR"/book-047/BOOK-047-UPLOAD.mp4 "$DOWNLOAD_DIR/07-Sunny-and-the-Gumnut-Babies.mp4"
cp "$SOURCE_DIR"/book-048/BOOK-048-UPLOAD.mp4 "$DOWNLOAD_DIR/08-Sunny-and-the-Hidden-Star.mp4"
cp "$SOURCE_DIR"/book-049/BOOK-049-UPLOAD.mp4 "$DOWNLOAD_DIR/09-Sunny-and-the-Honey-Bee.mp4"
cp "$SOURCE_DIR"/book-050/BOOK-050-UPLOAD.mp4 "$DOWNLOAD_DIR/10-Sunny-and-the-Kangaroo-Joey.mp4"
cp "$SOURCE_DIR"/book-051/BOOK-051-UPLOAD.mp4 "$DOWNLOAD_DIR/11-Sunny-and-the-Kookaburra-Chick.mp4"
cp "$SOURCE_DIR"/book-052/BOOK-052-UPLOAD.mp4 "$DOWNLOAD_DIR/12-Sunny-and-the-Lily-Pads.mp4"
cp "$SOURCE_DIR"/book-053/BOOK-053-UPLOAD.mp4 "$DOWNLOAD_DIR/13-Sunny-and-the-Little-Gecko.mp4"
cp "$SOURCE_DIR"/book-054/BOOK-054-UPLOAD.mp4 "$DOWNLOAD_DIR/14-Sunny-and-the-Little-Quoll.mp4"
cp "$SOURCE_DIR"/book-055/BOOK-055-UPLOAD.mp4 "$DOWNLOAD_DIR/15-Sunny-and-the-Little-Turtle.mp4"
cp "$SOURCE_DIR"/book-056/BOOK-056-UPLOAD.mp4 "$DOWNLOAD_DIR/16-Sunny-and-the-Lorikeet-Rainbow.mp4"
cp "$SOURCE_DIR"/book-060/BOOK-060-UPLOAD.mp4 "$DOWNLOAD_DIR/17-Sunny-and-the-Lyrebird.mp4"

echo "✅ All 17 videos downloaded to: $DOWNLOAD_DIR"
echo ""
echo "Videos ready for YouTube upload:"
ls -lh "$DOWNLOAD_DIR"/*.mp4 | awk '{print "  " $9 " — " $5}'
echo ""
echo "Total downloaded: $(du -sh $DOWNLOAD_DIR | cut -f1)"
