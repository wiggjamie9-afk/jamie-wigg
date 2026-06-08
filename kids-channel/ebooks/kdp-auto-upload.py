#!/usr/bin/env python3
"""
Automated Amazon KDP ebook uploader for Sunny bedtime stories.
Uses Selenium browser automation to upload 149 ebooks to KDP.

NOTE: Requires KDP account login credentials in environment variables.
"""

import os
import csv
import json
import time
from pathlib import Path
from typing import Optional, Dict, List

try:
    from selenium import webdriver
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from selenium.webdriver.common.keys import Keys
except ImportError:
    print("⚠️ Selenium not installed. Install with: pip install selenium")
    print("   Or use: pip install selenium-wire")
    exit(1)


class KDPUploader:
    """Automate Amazon KDP ebook uploads."""

    def __init__(self, email: str, password: str, episodes_dir: Path):
        self.email = email
        self.password = password
        self.episodes_dir = episodes_dir
        self.driver = None
        self.wait = None
        self.uploaded_count = 0
        self.failed_count = 0
        self.skipped_count = 0

    def start_browser(self):
        """Initialize browser session."""
        print("[KDP] Starting browser...")
        self.driver = webdriver.Chrome()  # or Firefox(), Safari(), etc.
        self.wait = WebDriverWait(self.driver, 20)

    def login(self):
        """Login to Amazon KDP."""
        print("[KDP] Logging into Amazon KDP...")
        self.driver.get("https://kdp.amazon.com")
        time.sleep(2)

        try:
            # Click sign in
            sign_in = self.wait.until(
                EC.element_to_be_clickable((By.LINK_TEXT, "Sign in"))
            )
            sign_in.click()
            time.sleep(2)

            # Enter email
            email_field = self.wait.until(
                EC.presence_of_element_located((By.ID, "ap_email"))
            )
            email_field.send_keys(self.email)
            email_field.send_keys(Keys.RETURN)
            time.sleep(2)

            # Enter password
            password_field = self.wait.until(
                EC.presence_of_element_located((By.ID, "ap_password"))
            )
            password_field.send_keys(self.password)
            password_field.send_keys(Keys.RETURN)
            time.sleep(3)

            print("✓ Logged in successfully")
            return True

        except Exception as e:
            print(f"✗ Login failed: {e}")
            return False

    def upload_ebook(self, episode_data: Dict, pdf_path: Path) -> bool:
        """Upload single ebook to KDP."""
        title = episode_data.get("KDP Title", "")
        episode_num = episode_data.get("Episode #", "")

        print(f"\n[{episode_num}/149] Uploading: {title}")

        try:
            # Navigate to create new book
            self.driver.get("https://kdp.amazon.com/create")
            time.sleep(2)

            # Click "Create Kindle eBook"
            create_btn = self.wait.until(
                EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Create')]"))
            )
            create_btn.click()
            time.sleep(2)

            # Fill in title
            title_field = self.wait.until(
                EC.presence_of_element_located((By.ID, "bookTitle"))
            )
            title_field.clear()
            title_field.send_keys(title)
            time.sleep(1)

            # Fill in subtitle
            subtitle = episode_data.get("Subtitle", "")
            try:
                subtitle_field = self.driver.find_element(By.ID, "subtitle")
                subtitle_field.clear()
                subtitle_field.send_keys(subtitle)
            except:
                pass

            # Click Save and Continue
            save_btn = self.wait.until(
                EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Save')]"))
            )
            save_btn.click()
            time.sleep(3)

            # Upload PDF manuscript
            pdf_input = self.wait.until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "input[type='file']"))
            )
            pdf_input.send_keys(str(pdf_path.absolute()))
            time.sleep(5)  # Wait for upload to complete

            # Fill in description
            desc_file = Path(__file__).parent / "kdp-descriptions" / f"ep{episode_num:03d}-description.txt"
            if desc_file.exists():
                with open(desc_file) as f:
                    description = f.read()

                desc_field = self.wait.until(
                    EC.presence_of_element_located((By.ID, "bookDescription"))
                )
                desc_field.clear()
                desc_field.send_keys(description)

            # Set price
            price = episode_data.get("Price (USD)", "4.99")
            try:
                price_field = self.driver.find_element(By.ID, "price")
                price_field.clear()
                price_field.send_keys(price)
            except:
                pass

            # Set royalty
            royalty = episode_data.get("Royalty %", "70%")
            try:
                royalty_select = self.driver.find_element(By.ID, "royaltyOption")
                royalty_select.send_keys(royalty)
            except:
                pass

            # Publish (or save draft)
            publish_btn = self.wait.until(
                EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Publish')]"))
            )
            publish_btn.click()
            time.sleep(3)

            print(f"  ✓ Uploaded successfully")
            self.uploaded_count += 1
            return True

        except Exception as e:
            print(f"  ✗ Upload failed: {e}")
            self.failed_count += 1
            return False

    def upload_all(self, csv_file: Path) -> Dict:
        """Upload all ebooks from CSV metadata."""
        results = {
            "uploaded": 0,
            "failed": 0,
            "skipped": 0,
            "total": 0
        }

        print("\n" + "="*70)
        print("🚀 AMAZON KDP AUTOMATIC UPLOADER")
        print("="*70)
        print(f"Reading: {csv_file}")

        try:
            with open(csv_file) as f:
                reader = csv.DictReader(f)
                episodes = list(reader)

            results["total"] = len(episodes)
            print(f"Total episodes to upload: {results['total']}\n")

            for episode_data in episodes:
                episode_num = episode_data.get("Episode #", "")
                story_title = episode_data.get("Story Title", "")

                # Build PDF path
                pdf_path = self.episodes_dir / story_title.lower().replace(" ", "-") / f"Sunny the Quokka - {story_title}.pdf"

                # Alternative path format
                if not pdf_path.exists():
                    queue_file = episode_data.get("Queue File", "")
                    if queue_file:
                        episode_slug = Path(queue_file).stem
                        pdf_path = self.episodes_dir / episode_slug / f"Sunny the Quokka - {story_title}.pdf"

                if not pdf_path.exists():
                    print(f"[{episode_num}/149] {story_title:<50} ⏭️  (PDF not found)")
                    self.skipped_count += 1
                    results["skipped"] += 1
                    continue

                # Upload
                success = self.upload_ebook(episode_data, pdf_path)
                if success:
                    results["uploaded"] += 1
                else:
                    results["failed"] += 1

            # Summary
            print("\n" + "="*70)
            print("✅ KDP UPLOAD SUMMARY")
            print("="*70)
            print(f"Total processed: {results['total']}")
            print(f"Uploaded: {results['uploaded']} ✓")
            print(f"Failed: {results['failed']} ✗")
            print(f"Skipped: {results['skipped']} ⏭️")
            print(f"Success rate: {100*results['uploaded']/max(1, results['uploaded']+results['failed']):.0f}%")
            print("="*70)

            return results

        except Exception as e:
            print(f"✗ Batch upload failed: {e}")
            return results

        finally:
            if self.driver:
                self.driver.quit()


def main():
    """Main entry point."""
    # Get credentials from environment
    email = os.getenv("AMAZON_EMAIL")
    password = os.getenv("AMAZON_PASSWORD")

    if not email or not password:
        print("❌ Missing credentials!")
        print("Set environment variables:")
        print("  export AMAZON_EMAIL='your@email.com'")
        print("  export AMAZON_PASSWORD='your_password'")
        print("\nThen run: python3 kdp-auto-upload.py")
        return 1

    episodes_dir = Path(__file__).parent.parent / "episodes"
    csv_file = Path(__file__).parent / "amazon-kdp-batch.csv"

    uploader = KDPUploader(email, password, episodes_dir)
    uploader.start_browser()

    if uploader.login():
        results = uploader.upload_all(csv_file)
        return 0 if results["failed"] == 0 else 1
    else:
        return 1


if __name__ == "__main__":
    exit(main())
