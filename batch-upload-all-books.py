#!/usr/bin/env python3
"""
Batch Upload All Books - Orchestrator for "Sunny's Cozy Quokka Bedtime Tales"
Uploads Books 1-17 sequentially with rate limiting and comprehensive logging.
"""

import os
import sys
import json
import time
import subprocess
import argparse
from pathlib import Path
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Color codes for terminal output
class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

def print_header(text):
    print(f"\n{Colors.HEADER}{Colors.BOLD}{'='*70}")
    print(f"{text.center(70)}")
    print(f"{'='*70}{Colors.ENDC}\n")

def print_success(text):
    print(f"{Colors.OKGREEN}✓ {text}{Colors.ENDC}")

def print_info(text):
    print(f"{Colors.OKCYAN}ℹ {text}{Colors.ENDC}")

def print_warning(text):
    print(f"{Colors.WARNING}⚠ {text}{Colors.ENDC}")

def print_error(text):
    print(f"{Colors.FAIL}✗ {text}{Colors.ENDC}")

def format_time(seconds):
    """Format seconds to human readable time"""
    if seconds < 60:
        return f"{seconds:.0f}s"
    elif seconds < 3600:
        return f"{seconds/60:.1f}m"
    else:
        return f"{seconds/3600:.1f}h"

def get_story_titles():
    """Get all story titles"""
    return {
        1: "Sunny Watches the Stars Come Out",
        2: "Sunny and the Autumn Leaves",
        3: "Sunny Finds the Fireflies",
        4: "Sunny's Forest Friends",
        5: "Sunny and the Gentle Moon",
        6: "Sunny in the Garden",
        7: "Sunny and the Soft Rain",
        8: "Sunny's Cosy Burrow",
        9: "Sunny Listens to the Night",
        10: "Sunny and the Gentle Breeze",
        11: "Sunny's Dream Adventure",
        12: "Sunny Watches the Sunset",
        13: "Sunny and the Wildflowers",
        14: "Sunny Under the Tree",
        15: "Sunny's Quiet Moment",
        16: "Sunny and the Stars Again",
        17: "Sunny's Beautiful Night"
    }

class UploadBatch:
    def __init__(self, start_book=1, end_book=17, status='unlisted', delay_between=60):
        self.start_book = start_book
        self.end_book = end_book
        self.status = status
        self.delay_between = delay_between
        self.results = []
        self.start_time = None
        self.story_titles = get_story_titles()

    def upload_book(self, book_number):
        """Upload a single book"""
        print_header(f"Uploading Book {book_number}/{self.end_book}")

        story_title = self.story_titles.get(book_number, "")
        print(f"Title: {story_title}\n")

        # Prepare command
        cmd = [
            'python3', 'upload-book-to-youtube.py',
            '--book', str(book_number),
            '--status', self.status
        ]

        try:
            # Run upload
            book_start = time.time()
            result = subprocess.run(cmd, capture_output=False, text=True)
            book_duration = time.time() - book_start

            if result.returncode == 0:
                print_success(f"Book {book_number} uploaded in {format_time(book_duration)}")
                return {
                    'book': book_number,
                    'status': 'success',
                    'duration': book_duration,
                    'timestamp': datetime.now().isoformat()
                }
            else:
                print_error(f"Book {book_number} upload failed")
                return {
                    'book': book_number,
                    'status': 'failed',
                    'duration': book_duration,
                    'timestamp': datetime.now().isoformat()
                }

        except Exception as e:
            print_error(f"Exception uploading Book {book_number}: {str(e)}")
            return {
                'book': book_number,
                'status': 'error',
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }

    def rate_limit_delay(self, current_book, total_books):
        """Apply rate limiting between uploads"""
        if current_book < total_books:
            minutes = self.delay_between // 60
            seconds = self.delay_between % 60

            print_info(f"Rate limiting: waiting {format_time(self.delay_between)} before next upload")
            print(f"  YouTube API quota resets hourly | Recommended: 1 upload per minute")

            # Show countdown
            remaining = self.delay_between
            while remaining > 0:
                mins, secs = divmod(remaining, 60)
                print(f"\r  Next upload in: {mins:02d}:{secs:02d}", end='', flush=True)
                time.sleep(1)
                remaining -= 1
            print()  # New line

    def run(self):
        """Run batch upload"""
        print(f"\n{Colors.OKBLUE}{Colors.BOLD}")
        print("""
        ╔═══════════════════════════════════════════════════════════════════╗
        ║    Sunny's Cozy Quokka Bedtime Tales - Batch Upload (Books 1-17)  ║
        ║                    Sequential Upload Orchestrator                 ║
        ╚═══════════════════════════════════════════════════════════════════╝
        """)
        print(Colors.ENDC)

        # Check prerequisites
        print_info("Checking prerequisites...")
        if not os.path.exists('.youtube_token.pickle'):
            print_error(".youtube_token.pickle not found")
            print_info("Run: python3 setup-youtube-channel.py")
            return 1

        if not os.getenv('YOUTUBE_CHANNEL_ID'):
            print_error("YOUTUBE_CHANNEL_ID not in .env")
            return 1

        # Show configuration
        print_header("Batch Configuration")
        total_books = self.end_book - self.start_book + 1
        print(f"Books to upload: {self.start_book} → {self.end_book} ({total_books} total)")
        print(f"Privacy status: {self.status.upper()}")
        print(f"Delay between uploads: {format_time(self.delay_between)}")
        print(f"Estimated duration: {format_time(self.delay_between * (total_books - 1))}")

        # Show books to upload
        print(f"\n{Colors.BOLD}Books:{Colors.ENDC}")
        for i in range(self.start_book, min(self.end_book + 1, self.start_book + 3)):
            print(f"  {i}. {self.story_titles.get(i, '')}")
        if total_books > 3:
            print(f"  ... and {total_books - 3} more")

        # Confirm
        response = input(f"\n{Colors.WARNING}Proceed with batch upload? (y/n) {Colors.ENDC}")
        if response.lower() != 'y':
            print_info("Batch upload cancelled")
            return 0

        # Run uploads
        self.start_time = time.time()
        print_header("Batch Upload Starting")
        print_info(f"Start time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")

        for book_number in range(self.start_book, self.end_book + 1):
            # Upload book
            result = self.upload_book(book_number)
            self.results.append(result)

            # Rate limit delay
            if book_number < self.end_book:
                self.rate_limit_delay(book_number, self.end_book)

        # Generate report
        self.print_summary()
        self.save_batch_log()

        return 0

    def print_summary(self):
        """Print batch upload summary"""
        total_duration = time.time() - self.start_time
        successful = sum(1 for r in self.results if r['status'] == 'success')
        failed = sum(1 for r in self.results if r['status'] != 'success')

        print_header("Batch Upload Complete")

        print(f"{Colors.OKGREEN}Statistics:{Colors.ENDC}")
        print(f"  Total books: {len(self.results)}")
        print(f"  Successful: {successful}")
        print(f"  Failed: {failed}")
        print(f"  Success rate: {(successful/len(self.results)*100):.1f}%")
        print(f"  Total time: {format_time(total_duration)}")

        if self.results:
            avg_duration = sum(r.get('duration', 0) for r in self.results) / len(self.results)
            print(f"  Average upload time: {format_time(avg_duration)}")

        print(f"\n{Colors.OKGREEN}Results:{Colors.ENDC}")
        for result in self.results:
            book = result['book']
            status = result['status']
            duration = format_time(result.get('duration', 0))

            if status == 'success':
                icon = '✓'
                color = Colors.OKGREEN
            else:
                icon = '✗'
                color = Colors.FAIL

            print(f"  {color}{icon} Book {book:2d}: {status.upper():8s} ({duration}){Colors.ENDC}")

        # Additional info
        print(f"\n{Colors.OKGREEN}Next Steps:{Colors.ENDC}")
        print(f"  1. Review videos on YouTube Studio")
        print(f"  2. Optimize descriptions and tags")
        print(f"  3. Set custom thumbnails if not done")
        print(f"  4. Create premiere schedule for releases")
        print(f"  5. Promote on social media")

        print(f"\n{Colors.OKGREEN}Files:{Colors.ENDC}")
        print(f"  Upload log: youtube_upload_log.json")
        print(f"  Batch log: youtube_batch_log.json")

    def save_batch_log(self):
        """Save batch upload log to file"""
        log_data = {
            'batch_id': datetime.now().strftime('%Y%m%d_%H%M%S'),
            'timestamp': datetime.now().isoformat(),
            'configuration': {
                'start_book': self.start_book,
                'end_book': self.end_book,
                'privacy_status': self.status,
                'delay_between': self.delay_between
            },
            'results': self.results,
            'summary': {
                'total': len(self.results),
                'successful': sum(1 for r in self.results if r['status'] == 'success'),
                'failed': sum(1 for r in self.results if r['status'] != 'success'),
                'duration_seconds': time.time() - self.start_time
            }
        }

        log_file = 'youtube_batch_log.json'
        with open(log_file, 'w') as f:
            json.dump(log_data, f, indent=2)

        print_success(f"Batch log saved to {log_file}")

def main():
    parser = argparse.ArgumentParser(
        description='Batch upload all Sunny\'s Cozy Quokka Bedtime Tales books to YouTube',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python3 batch-upload-all-books.py
  python3 batch-upload-all-books.py --start 5 --end 10
  python3 batch-upload-all-books.py --status public --delay 120
  python3 batch-upload-all-books.py --start 1 --end 17 --status unlisted --delay 90
        """
    )
    parser.add_argument('--start', type=int, default=1, help='Start book number (default: 1)')
    parser.add_argument('--end', type=int, default=17, help='End book number (default: 17)')
    parser.add_argument('--status', choices=['public', 'unlisted', 'private'], default='unlisted',
                        help='Video privacy status (default: unlisted)')
    parser.add_argument('--delay', type=int, default=60,
                        help='Delay between uploads in seconds (default: 60)')

    args = parser.parse_args()

    # Validate arguments
    if args.start < 1 or args.start > 17:
        print_error(f"Invalid start: {args.start}. Must be between 1 and 17.")
        return 1

    if args.end < 1 or args.end > 17:
        print_error(f"Invalid end: {args.end}. Must be between 1 and 17.")
        return 1

    if args.start > args.end:
        print_error(f"Start ({args.start}) must be <= end ({args.end})")
        return 1

    if args.delay < 30:
        print_warning(f"Delay of {args.delay}s is very short. YouTube API rate limiting recommended.")

    # Create and run batch
    batch = UploadBatch(
        start_book=args.start,
        end_book=args.end,
        status=args.status,
        delay_between=args.delay
    )

    return batch.run()

if __name__ == '__main__':
    sys.exit(main())
