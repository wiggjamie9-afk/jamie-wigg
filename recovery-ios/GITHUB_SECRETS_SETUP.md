# GitHub Actions Secrets Setup Guide

**Purpose:** Configure GitHub Actions secrets for automated iOS TestFlight builds

**Time Required:** 15-20 minutes

---

## Overview

The GitHub Actions workflow (`ios-testflight.yml`) requires several secrets to securely access your Apple Developer credentials and code signing certificates. This guide walks through obtaining and storing each secret.

---

## Step 1: Get Apple ID & App-Specific Password

### 1.1 Your Apple ID

**What it is:** Your Apple ID email address  
**Value:** `jamie.jack.28@hotmail.com`

### 1.2 App-Specific Password

This is NOT your regular Apple ID password. It's a unique password for GitHub Actions.

**How to generate:**

1. Go to https://appleid.apple.com
2. Sign in with: `jamie.jack.28@hotmail.com`
3. Click **Security** (on the left)
4. Under **App Passwords**, click **Generate an app password**
5. Choose app: Select **Custom** and type "GitHub Actions"
6. Click **Generate**
7. **Copy the password** (16 characters, with spaces)
8. **Do NOT close this page yet** — you need this in the next step

**Example format:** `XXXX-XXXX-XXXX-XXXX`

---

## Step 2: Get Apple Team ID

### 2.1 From Xcode

Fastest method:

1. Open Xcode: `open recovery-ios/ios/App/App.xcodeproj`
2. Select **App** target
3. Go to **Build Settings** tab
4. Search for: `DEVELOPMENT_TEAM`
5. You'll see your Team ID (10 uppercase alphanumeric characters)

**Example:** `XXXXXXXXXX`

### 2.2 From Apple Developer Account

Alternative method:

1. Go to https://developer.apple.com/account/resources/identifiers/list
2. Sign in
3. Look at the top-right corner — see "Team ID: XXXXXXXXXX"

---

## Step 3: Export & Encode Signing Certificate

### 3.1 Export .p12 Certificate from Keychain

1. Open **Keychain Access** (Mac app)
2. In the left sidebar, click **Keychains** → **login**
3. Search for: `iPhone Distribution` or `iPhone Developer`
4. Right-click on the certificate
5. Choose **Export "iPhone Distribution..."** (or "iPhone Developer...")
6. Save with filename: `ios-signing-cert.p12`
7. Set a secure password (e.g., 16+ characters)
8. **Save this password** — you'll need it for GitHub Secrets

**Example password:** `SecureP12Password2024`

### 3.2 Base64 Encode the Certificate

```bash
# Navigate to where you saved the .p12 file
cd ~/Downloads

# Encode to base64
base64 -i ios-signing-cert.p12 > cert-base64.txt

# Copy the entire output
cat cert-base64.txt | pbcopy

# Or view it
cat cert-base64.txt
```

You now have a very long string (base64-encoded certificate). **Keep this secure.**

### 3.3 Secure Cleanup

```bash
# Delete the .p12 file (you have it encoded)
rm ~/Downloads/ios-signing-cert.p12

# Delete the text file
rm ~/Downloads/cert-base64.txt
```

---

## Step 4: Add Secrets to GitHub

### 4.1 Navigate to Secrets

1. Go to your GitHub repository
2. Click **Settings** (top menu)
3. Click **Secrets and variables** (left sidebar)
4. Click **Actions**

### 4.2 Add Required Secrets

Click **"New repository secret"** and add each:

#### Secret 1: APPLE_ID

- **Name:** APPLE_ID
- **Value:** jamie.jack.28@hotmail.com
- Click **Add secret**

#### Secret 2: APPLE_ID_PASSWORD

- **Name:** APPLE_ID_PASSWORD
- **Value:** (app-specific password from Step 1.2, without spaces)
  - Example: `XXXXXXXXXXXX` (remove the dashes)
- Click **Add secret**

#### Secret 3: APPLE_TEAM_ID

- **Name:** APPLE_TEAM_ID
- **Value:** (10-character team ID from Step 2)
  - Example: `XXXXXXXXXX`
- Click **Add secret**

#### Secret 4: SIGNING_CERTIFICATE_P12_DATA

- **Name:** SIGNING_CERTIFICATE_P12_DATA
- **Value:** (entire base64-encoded string from Step 3.2)
  - This is a very long string (multiple lines)
- Click **Add secret**

#### Secret 5: SIGNING_CERTIFICATE_PASSWORD

- **Name:** SIGNING_CERTIFICATE_PASSWORD
- **Value:** (password you set when exporting .p12 in Step 3.1)
  - Example: `SecureP12Password2024`
- Click **Add secret**

---

## Step 5: Optional Secrets

### 5.1 Fastlane Session (Optional)

Fastlane can cache your authentication to speed up subsequent builds.

```bash
cd recovery-ios
bundle install
bundle exec fastlane spaceshipauth_login
# Follow prompts, signs in to Apple
# Creates ~/.fastlane/spaceship_*.json
```

Then:

1. **GitHub** → **Settings** → **Secrets** → **New secret**
2. **Name:** FASTLANE_SESSION
3. **Value:** (contents of `~/.fastlane/spaceship_*.json`)

### 5.2 Slack Notifications (Optional)

To get build notifications on Slack:

1. Create Slack incoming webhook: https://api.slack.com/apps
2. Click **"Create New App"** → **"From scratch"**
3. Name: "GitHub iOS Builds"
4. Select your workspace
5. Go to **Incoming Webhooks** → Enable
6. Click **"Add New Webhook to Workspace"**
7. Choose channel (e.g., #builds)
8. Copy webhook URL

Then:

1. **GitHub** → **Settings** → **Secrets** → **New secret**
2. **Name:** SLACK_WEBHOOK_URL
3. **Value:** (webhook URL from Slack)

### 5.3 Match Git URL (Optional but Recommended)

For secure certificate storage via Fastlane Match:

1. Create private GitHub repo: `rhythmix-match-certs`
2. Get URL: `https://github.com/YOUR_ORG/rhythmix-match-certs.git`

Then:

1. **GitHub** → **Settings** → **Secrets** → **New secret**
2. **Name:** MATCH_GIT_URL
3. **Value:** https://github.com/wiggjamie9-afk/rhythmix-match-certs.git

Also add match passphrase:

1. **Name:** MATCH_PASSPHRASE
2. **Value:** (random secure passphrase, e.g., 32-character random string)

---

## Verification Checklist

After adding secrets, verify they're set:

- [ ] **APPLE_ID** - Set to your Apple ID email
- [ ] **APPLE_ID_PASSWORD** - Set to app-specific password (no dashes)
- [ ] **APPLE_TEAM_ID** - Set to 10-character team ID
- [ ] **SIGNING_CERTIFICATE_P12_DATA** - Set to long base64 string
- [ ] **SIGNING_CERTIFICATE_PASSWORD** - Set to certificate export password
- [ ] *(Optional)* **FASTLANE_SESSION** - Set if using Fastlane
- [ ] *(Optional)* **SLACK_WEBHOOK_URL** - Set if using Slack notifications
- [ ] *(Optional)* **MATCH_GIT_URL** - Set if using Fastlane Match
- [ ] *(Optional)* **MATCH_PASSPHRASE** - Set if using Fastlane Match

---

## Testing Secrets

### Test 1: Verify Secrets Are Accessible

Secrets added to GitHub are not visible in logs. To verify they're set:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Each secret should show a green checkmark
3. You should see "Last used" date after first build attempt

### Test 2: Run First Build

```bash
git push origin main
# Go to GitHub Actions
# Click iOS TestFlight Build & Upload
# Click "Run workflow"
# Select: build_type=testflight, increment_build=true
# Click "Run workflow"
```

Watch the workflow:
- If secrets are correct, build succeeds
- If secrets are wrong, build fails with auth error

### Test 3: Check Logs (No Secrets Exposed)

1. Click workflow run
2. Click job "build-and-upload"
3. View logs — secrets should NOT appear (GitHub masks them)
4. Should see "Imported signing certificate" message

---

## Troubleshooting Secrets

### ❌ Error: "Couldn't decrypt certificate"

**Problem:** `SIGNING_CERTIFICATE_PASSWORD` is wrong or corrupted  
**Solution:**
1. Re-export .p12 from Keychain
2. Update `SIGNING_CERTIFICATE_PASSWORD` secret
3. Re-encode certificate to base64
4. Update `SIGNING_CERTIFICATE_P12_DATA` secret
5. Re-run workflow

### ❌ Error: "Invalid Apple ID or password"

**Problem:** `APPLE_ID` or `APPLE_ID_PASSWORD` wrong  
**Solution:**
1. Verify `APPLE_ID` is your Apple ID email
2. Go to https://appleid.apple.com → Security
3. Generate NEW app-specific password
4. Update `APPLE_ID_PASSWORD` (remove dashes)
5. Re-run workflow

### ❌ Error: "Team ID not found"

**Problem:** `APPLE_TEAM_ID` is wrong or in wrong format  
**Solution:**
1. Open Xcode project
2. Check Build Settings → DEVELOPMENT_TEAM (exact value)
3. Copy and update `APPLE_TEAM_ID` secret
4. Re-run workflow

### ❌ Build succeeds but doesn't upload to TestFlight

**Problem:** Secret is correct but app-specific password needs re-creation  
**Solution:**
1. Go to https://appleid.apple.com → Security
2. Delete old "GitHub Actions" app password
3. Generate new one
4. Update `APPLE_ID_PASSWORD` in GitHub
5. Re-run workflow

---

## Security Best Practices

### ✅ Do This

- [ ] Use app-specific passwords (not your main Apple ID password)
- [ ] Keep GitHub secrets private (not in code or docs)
- [ ] Rotate secrets every 6 months
- [ ] Limit who has access to repository settings
- [ ] Use GitHub branch protection rules
- [ ] Audit GitHub Actions logs for unusual activity

### ❌ Don't Do This

- [ ] Commit secrets to git (even accidentally)
- [ ] Share secrets in emails or chat
- [ ] Use same password for multiple apps
- [ ] Leave old certificates/passwords in GitHub
- [ ] Give secrets access to untrusted workflows

---

## Rotation & Maintenance

### Every 6 Months

1. Generate new app-specific password (Apple ID)
2. Update `APPLE_ID_PASSWORD` in GitHub
3. Export new signing certificate (if expiring)
4. Update `SIGNING_CERTIFICATE_P12_DATA` in GitHub
5. Test with dry-run workflow

### When Certificate Expires

1. Request new certificate from Apple Developer
2. Download and install in Keychain
3. Export new .p12 file
4. Base64 encode
5. Update GitHub secrets
6. Re-run workflow

---

## Reference

| Secret | Format | Expires | Example |
|--------|--------|---------|---------|
| APPLE_ID | Email | Never | jamie.jack.28@hotmail.com |
| APPLE_ID_PASSWORD | 12 chars | 1 year | XXXXXXXXXXXX |
| APPLE_TEAM_ID | 10 chars | Never | XXXXXXXXXX |
| SIGNING_CERTIFICATE_P12_DATA | Base64 string | 3 years | (long base64) |
| SIGNING_CERTIFICATE_PASSWORD | Secure password | Forever | SecurePassword2024 |
| FASTLANE_SESSION | JSON | 3 months | (JSON) |
| SLACK_WEBHOOK_URL | URL | Forever | https://hooks.slack.com/... |
| MATCH_GIT_URL | Git URL | Forever | https://github.com/... |
| MATCH_PASSPHRASE | Passphrase | Forever | RandomPassphrase |

---

## Troubleshooting Workflow

If a build fails:

1. **Check secret values** — Visit Settings → Secrets → Verify all are set
2. **Check typos** — Secret names are case-sensitive
3. **Check password format** — App-specific password has no dashes in GitHub
4. **Check expiration** — Certificates expire in 3 years; passwords in 1 year
5. **Check permissions** — Ensure your Apple ID has admin access to app
6. **Try again** — Sometimes Apple servers are slow; retry after 5 minutes

---

## Support

- **GitHub Secrets Help:** https://docs.github.com/en/actions/security-for-github-actions
- **Apple App-Specific Passwords:** https://support.apple.com/en-us/HT204397
- **Xcode Build Settings:** https://help.apple.com/xcode/mac/current/

---

**Completed:** Once all required secrets are added ✓  
**Next Step:** Run first GitHub Actions workflow in `ios-testflight.yml`
