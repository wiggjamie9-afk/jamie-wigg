"""
Automated notification system for OpenManus results.
Send results via email and Slack after tasks complete.
"""

import os
import json
from datetime import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import requests
from typing import Dict, List, Optional


class NotificationManager:
    """Handle email and Slack notifications for OpenManus results."""

    def __init__(self):
        # Email configuration
        self.email_enabled = os.getenv("EMAIL_ENABLED", "false").lower() == "true"
        self.smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.email_sender = os.getenv("EMAIL_SENDER", "")
        self.email_password = os.getenv("EMAIL_PASSWORD", "")

        # Slack configuration
        self.slack_enabled = os.getenv("SLACK_ENABLED", "false").lower() == "true"
        self.slack_webhook = os.getenv("SLACK_WEBHOOK_URL", "")

    def send_email(
        self,
        recipient: str,
        subject: str,
        body: str,
        html_body: Optional[str] = None
    ) -> bool:
        """
        Send email notification.

        Args:
            recipient: Email address to send to
            subject: Email subject
            body: Plain text body
            html_body: Optional HTML body

        Returns:
            True if successful, False otherwise
        """
        if not self.email_enabled or not self.email_sender:
            print("⚠️  Email not configured. Set EMAIL_ENABLED=true and EMAIL_SENDER")
            return False

        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = self.email_sender
            msg["To"] = recipient

            # Attach plain text
            msg.attach(MIMEText(body, "plain"))

            # Attach HTML if provided
            if html_body:
                msg.attach(MIMEText(html_body, "html"))

            # Send via SMTP
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.email_sender, self.email_password)
                server.send_message(msg)

            print(f"✅ Email sent to {recipient}")
            return True

        except Exception as e:
            print(f"❌ Email failed: {e}")
            return False

    def send_slack(
        self,
        message: str,
        blocks: Optional[List[Dict]] = None,
        thread_ts: Optional[str] = None
    ) -> bool:
        """
        Send Slack notification.

        Args:
            message: Simple text message (fallback)
            blocks: Slack Block Kit blocks for rich formatting
            thread_ts: Optional thread ID to reply in thread

        Returns:
            True if successful, False otherwise
        """
        if not self.slack_enabled or not self.slack_webhook:
            print("⚠️  Slack not configured. Set SLACK_ENABLED=true and SLACK_WEBHOOK_URL")
            return False

        try:
            payload = {
                "text": message,
            }

            if blocks:
                payload["blocks"] = blocks

            if thread_ts:
                payload["thread_ts"] = thread_ts

            response = requests.post(self.slack_webhook, json=payload)
            response.raise_for_status()

            print("✅ Slack message sent")
            return True

        except Exception as e:
            print(f"❌ Slack failed: {e}")
            return False

    def notify_task_complete(
        self,
        task_name: str,
        result: Dict,
        client_email: Optional[str] = None,
        client_slack_channel: Optional[str] = None
    ):
        """
        Send notification when OpenManus task completes.

        Args:
            task_name: Name of the task
            result: Task results/output
            client_email: Email to notify (optional)
            client_slack_channel: Slack channel/webhook to notify (optional)
        """
        timestamp = datetime.now().isoformat()

        # Format result as JSON for readability
        result_json = json.dumps(result, indent=2)

        # === EMAIL NOTIFICATION ===
        if client_email:
            email_subject = f"✅ OpenManus Task Complete: {task_name}"
            email_body = f"""
Task: {task_name}
Status: Complete
Timestamp: {timestamp}

Results:
{result_json}

---
OpenManus Automated Reporting
"""

            email_html = f"""
<html>
<body style="font-family: Arial, sans-serif;">
    <h2>✅ Task Complete</h2>
    <p><strong>Task:</strong> {task_name}</p>
    <p><strong>Status:</strong> Complete</p>
    <p><strong>Time:</strong> {timestamp}</p>

    <h3>Results:</h3>
    <pre style="background-color: #f4f4f4; padding: 10px; border-radius: 5px;">
{result_json}
    </pre>

    <hr>
    <p style="color: #666; font-size: 12px;">OpenManus Automated Reporting</p>
</body>
</html>
"""

            self.send_email(
                client_email,
                email_subject,
                email_body,
                email_html
            )

        # === SLACK NOTIFICATION ===
        if client_slack_channel:
            slack_blocks = [
                {
                    "type": "header",
                    "text": {
                        "type": "plain_text",
                        "text": f"✅ {task_name} Complete"
                    }
                },
                {
                    "type": "section",
                    "fields": [
                        {
                            "type": "mrkdwn",
                            "text": f"*Status:*\nComplete"
                        },
                        {
                            "type": "mrkdwn",
                            "text": f"*Time:*\n{timestamp}"
                        }
                    ]
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": f"```{result_json[:500]}{'...' if len(result_json) > 500 else ''}```"
                    }
                }
            ]

            self.send_slack(
                f"✅ {task_name} completed successfully",
                blocks=slack_blocks
            )

    def notify_task_error(
        self,
        task_name: str,
        error: str,
        client_email: Optional[str] = None,
        client_slack_channel: Optional[str] = None
    ):
        """Send error notification when task fails."""
        timestamp = datetime.now().isoformat()

        # === EMAIL ===
        if client_email:
            email_subject = f"❌ OpenManus Task Failed: {task_name}"
            email_body = f"""
Task: {task_name}
Status: FAILED
Timestamp: {timestamp}

Error:
{error}

---
OpenManus Automated Reporting
"""

            self.send_email(client_email, email_subject, email_body)

        # === SLACK ===
        if client_slack_channel:
            slack_blocks = [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": f"❌ *{task_name} Failed*\n```{error[:200]}```"
                    }
                }
            ]

            self.send_slack(
                f"❌ {task_name} failed",
                blocks=slack_blocks
            )


# Usage example
if __name__ == "__main__":
    notifier = NotificationManager()

    # Example: Send completion notification
    result = {
        "status": "success",
        "items_processed": 150,
        "errors": 0,
        "timestamp": datetime.now().isoformat()
    }

    notifier.notify_task_complete(
        task_name="Data Entry Automation",
        result=result,
        client_email="client@example.com",
        client_slack_channel="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
    )
