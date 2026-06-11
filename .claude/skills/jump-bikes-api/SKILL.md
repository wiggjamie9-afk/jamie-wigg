---
name: jump-bikes-api
description: JUMP bikes and scooters API reference and reverse engineering guide. Complete authentication workflow (5-step OAuth via Uber), Android app reverse engineering with certificate pinning bypass, and MitM traffic capture techniques. Covers API endpoints for micromobility asset discovery. Technical reference for building mobility tracking apps, API client libraries, and security testing. Portable patterns for Lime, Bird, Voi, and other shared mobility platforms.
metadata:
  tags: api, authentication, reverse-engineering, mobile-security, micromobility, bikes, scooters, certificate-pinning, mitm, 100-apps
---

## When to use

User asks for:
- "How do I authenticate with JUMP/Lime bikes API?"
- "Build a micromobility tracker for delivery workers"
- "Reverse engineer a mobile app to get API endpoints"
- "Bypass certificate pinning for traffic inspection"
- "Extract data from bike/scooter sharing platforms"
- "Set up MitM traffic capture with Burp Suite"

Perfect for:
- 100 APPS mission: delivery/logistics apps using shared mobility
- Building mobility tracking for gig workers, freelancers
- Learning mobile app security and reverse engineering
- API client development for dockless bike/scooter platforms
- Micromobility data aggregation for underserved markets
- Traffic analysis and security testing

## Overview

**JUMP Bikes** (now acquired by Lime) operated electric dockless bikeshares and scooters globally. The API authentication process involved a complex 5-step OAuth flow with Uber's backend, requiring phone verification, 2FA, and password confirmation.

**Current Status**: JUMP scooters are now integrated into Lime's API with `"brand": "jump"`. However, the authentication patterns and reverse engineering techniques documented here remain applicable to other mobility platforms (Lime, Bird, Voi, etc.).

**Key Characteristics:**
- ✅ Requires phone number and SMS 2FA
- ✅ Uber authentication backend
- ✅ Certificate pinning for HTTPS protection
- ✅ Root detection in Android app
- ✅ Location-based vehicle search with radius parameter

## Prerequisites

### For API Access (Web)
- JUMP account (or Lime account with JUMP brand)
- Phone number for SMS verification
- Willingness to complete 5-step authentication flow

### For Reverse Engineering (Mobile)
- Android device (API 23+, not rooted, USB debugging enabled)
- Apktool (latest version)
- Split APK Installer (SAI) app
- Android SDK Platform Tools (`adb`, `zipalign`)
- Burp Suite Community Edition
- OpenSSL (macOS/Linux standard)
- Java keytool (for signing keys)
- Google Cloud Platform API key (Maps SDK)

**Tested On**: JUMP app v2.39.10000 on Android 6.0.1

## Part 1: API Authentication (5-Step Workflow)

The complete authentication requires parsing HTML/JavaScript, extracting tokens, and managing session state across 5 requests.

### Setup: Token Parsing Helper

Create `parse.py` to extract CSRF tokens and session IDs from HTML:

```python
#!/usr/bin/env python3

import sys
from html.parser import HTMLParser

token_path = "tokens.txt"

class MyHTMLParser(HTMLParser):
    def handle_starttag(self, tag, attrs):
        if tag != 'input':
            return

        if len(attrs) != 3:
            return

        if attrs[1][1] == 'sess':
            with open(token_path, 'a') as token_file:
                token_file.write(f"sess={attrs[2][1]}\n")

        if attrs[1][1] == 'x-csrf-token':
            with open(token_path, 'a') as token_file:
                token_file.write(f"csrf={attrs[2][1]}\n")

        if attrs[1][1] == 'inAuthSessionID':
            with open(token_path, 'a') as token_file:
                token_file.write(f"auth={attrs[2][1]}\n")


tmp = open(token_path, 'w')
tmp.close()

parser = MyHTMLParser()
with open(sys.argv[1], 'r') as html_file:
    parser.feed(html_file.read())
```

**Usage**: Run after each step to extract fresh tokens.

### Step 1: Request Authentication

Initiates Uber's OAuth flow and creates session cookies:

```bash
curl -X GET \
    -H "Accept-Encoding: gzip, deflate" \
    --cookie-jar "cookie.jar" \
    --url "https://auth.uber.com/login/?uber_client_name=jump" \
    | gzip -dc \
    | tee index.html \
    && python3 parse.py index.html
```

**Output Files:**
- `cookie.jar` — Session cookies
- `tokens.txt` — CSRF token + session ID
- `index.html` — Full HTML response

**Files Created**: 3

### Step 2: Submit Phone Number

Submit phone for SMS verification:

```bash
CSRF=$(grep csrf tokens.txt | cut -d '=' -f2 | sed 's/ *$//')
SESS=$(grep sess tokens.txt | cut -d '=' -f2 | sed 's/ *$//')

COUNTRY_CODE="49"   # ISO country code (Germany example)
PHONE="1234567"     # Without leading 0 or country code

curl -X POST \
    -H "Accept-Encoding: gzip, deflate" \
    --data "countryCode=$COUNTRY_CODE" \
    --data "phoneNumber=$PHONE" \
    --data "autoSMSVerificationSupported=false" \
    --data "uberClientName=jump" \
    --data "type=INPUT_MOBILE" \
    --data "x-csrf-token=$CSRF" \
    --data "sess=$SESS" \
    -b "cookie.jar" \
    --cookie-jar "cookie.jar" \
    --url "https://auth.uber.com/login/session" \
    | gzip -dc \
    | tee index.html \
    && python3 parse.py index.html
```

**Trigger**: SMS sent to phone with 4-digit 2FA code

**Files Updated**: All 3

### Step 3: Confirm 2FA Code

Submit the 4-digit SMS code:

```bash
CSRF=$(grep csrf tokens.txt | cut -d '=' -f2 | sed 's/ *$//')
SESS=$(grep sess tokens.txt | cut -d '=' -f2 | sed 's/ *$//')
AUTH=$(grep auth tokens.txt | cut -d '=' -f2 | sed 's/ *$//')

CODE="1234" # 4-digit SMS code received on phone

curl -X POST \
    -H "Accept-Encoding: gzip, deflate" \
    --data "type=SMS_OTP" \
    --data "autoSMSVerificationSupported=false" \
    --data "uberClientName=jump" \
    --data "smsOTP=$CODE" \
    --data "x-csrf-token=$CSRF" \
    --data "sess=$SESS" \
    --data "inAuthSessionID=$AUTH" \
    -b "cookie.jar" \
    --cookie-jar "cookie.jar" \
    --url "https://auth.uber.com/login/session" \
    | gzip -dc \
    | tee index.html \
    && python3 parse.py index.html
```

**Files Updated**: All 3

### Step 4: Submit Password

Verify account password:

```bash
CSRF=$(grep csrf tokens.txt | cut -d '=' -f2 | sed 's/ *$//')
SESS=$(grep sess tokens.txt | cut -d '=' -f2 | sed 's/ *$//')
AUTH=$(grep auth tokens.txt | cut -d '=' -f2 | sed 's/ *$//')

PW="your_password_here"

curl -X POST \
    -H "Accept-Encoding: gzip, deflate" \
    --data "type=VERIFY_PASSWORD" \
    --data "autoSMSVerificationSupported=false" \
    --data "uberClientName=jump" \
    --data "password=$PW" \
    --data "x-csrf-token=$CSRF" \
    --data "sess=$SESS" \
    --data "inAuthSessionID=$AUTH" \
    -b "cookie.jar" \
    --url "https://auth.uber.com/login/session" \
    | sed -nE 's/.*#code=(.*)&in_auth_session_id=.*/\1/p'
```

**Output**: UUID string (format: `123abcde-abcd-01234-abcd-123456789abc`)

**Save this UUID** — needed for step 5.

### Step 5: Confirm & Get API Token

Final confirmation to receive API token:

```bash
UUID="123abcde-abcd-01234-abcd-123456789abc"  # From step 4

curl -X POST \
    -H "Accept-Encoding: gzip, deflate" \
    -H "Connection: close" \
    -H "Content-Type: application/json; charset=UTF-8" \
    --data "{\"formContainerAnswer\":{\"inAuthSessionID\":\"$UUID\",\"formAnswer\":{\"flowType\":\"SIGN_IN\",\"screenAnswers\":[{\"screenType\":\"SESSION_VERIFICATION\",\"fieldAnswers\":[{\"fieldType\":\"SESSION_VERIFICATION_CODE\",\"sessionVerificationCode\":\"$UUID\"}]}]}}}" \
    --url "https://cn-geo1.uber.com/rt/silk-screen/submit-form" \
    | gzip -dc
```

**Response**: JSON with `apiToken` field

**Extract API Token**:
```bash
curl ... | gzip -dc | jq -r '.apiToken'
```

**You now have**: `apiToken` (UUID format, ready for API requests)

## Part 2: API Requests

### Vehicle Search Endpoint

Query for bikes/scooters in a geographic area:

```bash
API_TOKEN="abcde123-abcd-01234-abcd-123456789abc"

curl -X POST \
    -H "x-uber-token: $API_TOKEN" \
    -H "Content-Type: application/json; charset=UTF-8" \
    -H "Accept-Encoding: gzip, deflate" \
    --data '{
      "latitude": 52.528038680440716,
      "longitude": 13.401972334831953,
      "radius": 1000
    }' \
    --url "https://cn-geo1.uber.com/rt/emobility/search-assets" \
    | gzip -dc | jq
```

**Parameters:**
- `latitude` — Center point latitude
- `longitude` — Center point longitude
- `radius` — Search radius in meters (max ~500m empirically)

**Response**: JSON array of vehicle objects with:
- `id` — Vehicle ID
- `latitude`, `longitude` — Current location
- `type` — "SCOOTER" or "BIKE"
- `brand` — "jump" or other
- `battery` — Battery percentage
- `state` — "AVAILABLE", "RESERVED", etc.

### Response Example

```json
{
  "assets": [
    {
      "id": "jump-scooter-12345",
      "latitude": 52.528,
      "longitude": 13.402,
      "type": "SCOOTER",
      "brand": "jump",
      "battery": 85,
      "state": "AVAILABLE",
      "pricePerMinute": 0.25
    }
  ]
}
```

## Part 3: Reverse Engineering (Mobile)

For apps with certificate pinning or additional authentication layers, you may need to reverse engineer the Android app to discover hidden endpoints or bypass security measures.

### Prerequisites Checklist

- [ ] Android device (non-rooted, USB debugging enabled)
- [ ] Apktool installed
- [ ] Split APK Installer (SAI) on device
- [ ] Android SDK tools (adb, zipalign)
- [ ] Burp Suite Community Edition
- [ ] OpenSSL available
- [ ] Java keytool available
- [ ] Google Cloud Maps API key

### Phase 1: Burp Suite Setup

#### Configure Burp Proxy

1. Open Burp Suite
2. Go to **Proxy** tab → **Options**
3. Select "localhost" proxy, click **Edit**
4. Change port to `9999`
5. Set "Specific Address" to your computer's IP
6. Click **OK**

**Burp is now listening** on `<your-ip>:9999`

#### Configure Android Proxy

On Android device:
1. Settings → Wi-Fi
2. Long-press your Wi-Fi network → **Edit Network**
3. Scroll to **Proxy settings** → **Manual**
4. Enter:
   - Proxy hostname: Your computer's IP
   - Proxy port: `9999`
5. **Save**

#### Install Burp Certificate

On Android device:
1. Open browser, go to `http://burp`
2. Download CA certificate (top right)
3. Rename to `cert.cer` (important: not `.der`)
4. Settings → **Security** → **Install certificates from storage**
5. Select `cert.cer`
6. Follow prompts (choose name as desired)

**Verification**: Visit any HTTPS site in browser. You should see traffic in Burp's **Proxy** tab → **HTTP history**.

### Phase 2: Certificate Extraction & Fingerprint

#### Export Burp CA Certificate

In Burp:
1. **Proxy** tab → **Options**
2. Click **Import/Export CA certificate**
3. Export as **DER format** to absolute path (e.g., `/tmp/burp.der`)

#### Convert DER to PEM

```bash
openssl x509 -inform der -in /tmp/burp.der -out /tmp/burp.pem
```

#### Extract SHA256 Fingerprint

```bash
openssl x509 -in /tmp/burp.pem -pubkey -noout \
    | openssl rsa -pubin -outform der \
    | openssl dgst -sha256 -binary \
    | openssl enc -base64
```

**Output**: Base64-encoded SHA256 fingerprint (for certificate pinning bypass)

### Phase 3: APK Signing Key

Create a key for signing the modified APK:

```bash
keytool -genkey \
    -v -keystore jump.keystore \
    -alias jump-key \
    -keyalg RSA \
    -keysize 2048 \
    -validity 10000
```

**Remember**: The alias name (`jump-key`) for later signing steps.

### Phase 4: Download & Decompile APK

#### Get APK from Device

1. Open **Split APK Installer (SAI)** on device
2. Find and export JUMP app
3. On computer: `adb pull /sdcard/<exported-app> jump.apks`

#### Unpack APKS (it's a ZIP)

```bash
unzip jump.apks
# Produces: base.apk, split_config.*.apk, etc.
```

#### Decompile Split APKs

For each `split_config*.apk`:

```bash
apktool d -r split_config_density.apk
apktool d -r split_config_language.apk
# ... repeat for all split configs
```

The `-r` flag skips resource decompilation to avoid errors.

#### Decompile Base APK (Two Passes)

**Pass 1** — Full decompilation with resources:
```bash
apktool d base.apk -o base.complete/
```

**Pass 2** — Resources only (for later manifest merge):
```bash
apktool d -r base.apk
# Produces: base/ directory
```

### Phase 5: Patching

#### Add Google Maps API Key

Edit `base.complete/AndroidManifest.xml`:

1. Find: `com.google.android.geo.API_KEY`
2. Replace `@string/...` with your actual API key
3. Remove any malformed spaces in permission strings (around line 5)

#### Recompile base.complete (with manifest fix)

```bash
apktool b base.complete/ -o base.tmp.apk
```

If errors occur (duplicate resource definitions), manually remove duplicates from resource files, then retry.

#### Extract Fixed Manifest

```bash
apktool d -r base.tmp.apk -o base.tmp/
cp base.tmp/AndroidManifest.xml base/
```

#### Bypass Certificate Pinning

Search for certificate fingerprints in `.smali` files:

```bash
grep -r "sha256/" . --include="*.smali"
```

**Find the file containing two base64 fingerprints:**

1. Replace both `sha256/...` entries with your Burp certificate fingerprint
2. Find `*.uber.com` pattern → replace with `*`
3. Update certificate validity date

**Example:**
```smali
# Before
const-string v0, "sha256/original_fingerprint_here"
const-string v1, "*.uber.com"
const-string v2, "2025-12-31"

# After
const-string v0, "sha256/your_burp_fingerprint_here"
const-string v1, "*"
const-string v2, "2026-12-31"
```

### Phase 6: Rebuild & Sign

#### Recompile APKs

```bash
apktool b -f base/ -o base.unaligned.apk
apktool b -f split_config_density/ -o split_config_density.unaligned.apk
# ... repeat for all splits
```

The `-f` flag forces recompilation of the modified `AndroidManifest.xml`.

#### Sign APKs

```bash
jarsigner -verbose \
    -sigalg MD5withRSA \
    -digestalg SHA1 \
    -keystore jump.keystore \
    -storepass your_keystore_password \
    base.unaligned.apk \
    jump-key
```

**Repeat for all `.unaligned.apk` files.**

#### Align APKs

```bash
zipalign -v 4 base.unaligned.apk base.apk
zipalign -v 4 split_config_density.unaligned.apk split_config_density.apk
# ... repeat for all
```

### Phase 7: Deploy Modified App

#### Push APKs to Device

```bash
adb push base.apk split_config_*.apk /sdcard/
```

#### Install via SAI

1. Open **SAI** on device
2. Settings → Enable **APK signing**
3. Home → **Install APKs**
4. Navigate to `/sdcard/`
5. Select **all APKs at once**
6. Tap **Install**
7. Wait ~2-3 minutes for completion

**Success**: JUMP app is now installed with Burp certificate pinning bypassed.

### Phase 8: Traffic Inspection

Once the modified app is running:

1. Open JUMP app on device
2. All traffic routes through Burp proxy
3. In Burp: **Proxy** tab → **HTTP history**
4. Inspect all requests/responses
5. Note endpoints, authentication headers, request/response formats

## Authentication Patterns

### Token-Based (API)

```bash
Header: x-uber-token: <api-token>
Method: POST
Content-Type: application/json
```

### Session-Based (Web OAuth)

```
Step 1: GET /login → CSRF + session ID
Step 2: POST /login/session (phone) → new CSRF/session/auth
Step 3: POST /login/session (2FA code) → new tokens
Step 4: POST /login/session (password) → UUID
Step 5: POST /silk-screen/submit-form (UUID) → apiToken
```

## 100 APPS Integration

### Micromobility Tracker App

Use JUMP/Lime API to build delivery/logistics app for gig workers:

```
Target: Informal delivery workers, freelancers
Use Case: Find nearest bike/scooter for last-mile delivery
Features:
├─ Real-time vehicle availability
├─ Battery status + distance calculation
├─ Estimated pricing
├─ Route optimization
└─ Offline caching (store last-known positions)
```

### Architecture

```
Frontend (React Native / Flutter)
├─ Map view (current location + nearby vehicles)
├─ Vehicle details (battery, price, distance)
└─ Booking/unlock flow

Backend (Node.js / Python)
├─ JUMP API client (with token refresh)
├─ Caching layer (Redis)
├─ User authentication
└─ Analytics (usage patterns, cost optimization)

Database
├─ User accounts
├─ Saved routes
└─ Usage history
```

### Cost Savings

For delivery workers in India/Africa:
- JUMP/Lime: ~$0.25/min (~$15/hour)
- App aggregates across platforms → find cheapest option
- Potential 20-30% savings through smart routing

## Portable Patterns

These reverse-engineering techniques work for other mobility APIs:

| Platform | Auth Model | Certificate Pinning |
|----------|-----------|-------------------|
| **Lime** | Similar to JUMP | Yes |
| **Bird** | Different (check) | Likely yes |
| **Voi** | Check docs | Varies |
| **Ofo** | Legacy, mostly defunct | Yes |

Key differences to investigate per platform:
- OAuth backend (Uber vs custom)
- Endpoint structure
- Required API keys
- Rate limiting

## Troubleshooting

### App Won't Connect with Modified Certificate

**Problem**: "Certificate verification failed"
- Ensure Burp cert is installed as **system certificate** (not user)
- Try reinstalling via SAI with signing enabled
- Check certificate fingerprint matches patched value

### Traffic Not Appearing in Burp

**Problem**: No requests in Proxy history
- Verify Android proxy settings (Wi-Fi → Edit Network)
- Restart app after proxy config change
- Check that Burp is listening on correct IP:port

### Apktool Compilation Errors

**Problem**: "Unknown reference @0x..."
- Resource file has duplicate definitions
- Manually open problematic XML and remove duplicates
- Retry compilation with `-f` flag

### Zipalign Fails

**Problem**: "File not found" or permission errors
- Ensure absolute paths to input/output APK files
- Check file exists: `ls -la base.unaligned.apk`
- Run with proper permissions: `sudo zipalign ...` if needed

## Summary

**JUMP Bikes API** demonstrates:
✅ Complex OAuth workflows with multiple verification steps  
✅ Certificate pinning as a security measure  
✅ Root detection in mobile apps  
✅ Location-based asset discovery  
✅ Mobile app reverse engineering techniques  

**For 100 APPS**: Build micromobility trackers for gig economy workers in underserved markets. The API patterns and reverse engineering knowledge transfer directly to Lime, Bird, and other platforms.

**Ethical Note**: Reverse engineering should be for:
- Educational purposes (learning security concepts)
- Legitimate API access (after terms of service review)
- Security research (with disclosure)

NOT for:
- Unauthorized data extraction
- Terms of Service violations
- Competitive intelligence gathering

