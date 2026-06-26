# Android Keystore Setup Guide

This guide explains how to create and manage the keystore for signing Neural Twin Android releases.

## Overview

An Android keystore is required to:
- Sign APKs and App Bundles for Play Store submission
- Maintain app identity across updates
- Ensure only authorized developers can update the app

**⚠️ Important:** The keystore file and passwords are sensitive security credentials. Never commit to version control. Never share with unauthorized parties.

---

## 1. Generate Keystore (One-Time Setup)

### Prerequisites
- Java/Android SDK installed
- `keytool` available (comes with JDK)

### Steps

**Option A: Using keytool (Recommended)**

```bash
cd neural-twin-app/android

keytool -genkey -v \
  -keystore keystore.jks \
  -keyalg RSA \
  -keysize 4096 \
  -validity 10950 \
  -alias neural_twin_key \
  -storepass your_keystore_password \
  -keypass your_key_password
```

**Interactive Prompts (Option B):**

```bash
cd neural-twin-app/android
keytool -genkey -v -keystore keystore.jks -keyalg RSA -keysize 4096 -validity 10950
```

Then answer prompts:
```
Enter keystore password: [your_keystore_password]
Re-enter new password: [your_keystore_password]
What is your first and last name? Jamie Wigg
What is the name of your organizational unit? Engineering
What is the name of your organization? Neural Twin
What is the name of your City or Locality? [Your City]
What is the name of your State or Province? [Your State]
What is the two-letter country code for this unit? US
Is CN=Jamie Wigg, OU=Engineering, O=Neural Twin, L=[City], ST=[State], C=US correct? yes
Enter key password (RETURN if same as keystore password): [your_key_password or press ENTER]
```

### Key Parameters Explained

| Parameter | Value | Purpose |
|-----------|-------|---------|
| `-keystore` | `keystore.jks` | File name (keep as-is) |
| `-keyalg` | `RSA` | Key algorithm (standard for Android) |
| `-keysize` | `4096` | Key strength in bits (secure) |
| `-validity` | `10950` | Valid for ~30 years (covers app lifetime) |
| `-alias` | `neural_twin_key` | Key identifier (must match build config) |

### Output
```
Your keystore contains 1 entry:
neural_twin_key, [date], PrivateKeyEntry,
Certificate fingerprint (SHA-256): XX:XX:XX:...
```

**Save the SHA-256 fingerprint** - you'll need it for Firebase, App Links, etc.

---

## 2. Store Credentials Securely

### Local Development Setup

**File: `signing.properties` (git-ignored)**

```properties
SIGNING_STORE_FILE=keystore.jks
SIGNING_STORE_PASSWORD=your_keystore_password
SIGNING_KEY_ALIAS=neural_twin_key
SIGNING_KEY_PASSWORD=your_key_password
```

**DO NOT** commit this file. Check `.gitignore`:

```bash
# Verify keystore is ignored
cat neural-twin-app/.gitignore | grep -E "(keystore|signing.properties)"
```

Should output:
```
android/*.jks
android/*.keystore
android/signing.properties
```

### Password Manager Setup

Use a password manager to store:
```
Keystore Password: [password]
Key Alias: neural_twin_key
Key Password: [password]
Keystore File: keystore.jks (local backup)
```

Recommended tools:
- 1Password
- LastPass
- Bitwarden
- macOS Keychain

---

## 3. GitHub Actions Integration

### Set GitHub Secrets

Go to repo **Settings → Secrets and variables → Actions**:

1. **KEYSTORE_FILE** (File as Base64)
   ```bash
   base64 -i android/keystore.jks | pbcopy  # macOS
   # or
   base64 < android/keystore.jks | xclip -selection clipboard  # Linux
   ```
   Then paste entire base64 output in GitHub Secrets

2. **KEYSTORE_PASSWORD**
   ```
   [your_keystore_password]
   ```

3. **KEY_ALIAS**
   ```
   neural_twin_key
   ```

4. **KEY_PASSWORD**
   ```
   [your_key_password]
   ```

### Verification

The GitHub Actions workflow will:
1. Decode `KEYSTORE_FILE` from base64
2. Write to `android/keystore.jks`
3. Create `signing.properties` with credentials
4. Build and sign APK/AAB
5. Clean up sensitive files

---

## 4. Verify Keystore

### View Keystore Contents

```bash
keytool -list -v -keystore android/keystore.jks
```

**Output includes:**
- Certificate validity dates
- SHA-1 and SHA-256 fingerprints
- Key algorithm and size
- Owner information

### Check Certificate Validity

```bash
keytool -list -v -keystore android/keystore.jks | grep "Valid from"
```

Should show expiration date ~30 years in future.

### Export Certificate (for App Links)

```bash
keytool -exportcert -alias neural_twin_key -keystore android/keystore.jks \
  -storepass [password] | openssl x509 -inform der -text -noout
```

---

## 5. Security Best Practices

### Local File Security

```bash
# Protect keystore file
chmod 600 android/keystore.jks

# Verify permissions
ls -l android/keystore.jks
# Should output: -rw------- (600 permissions)
```

### Backup Strategy

1. **Encrypted Backup**
   ```bash
   # Backup to secure location
   cp android/keystore.jks ~/Backups/neural-twin-keystore-backup.jks
   
   # Encrypt with GPG
   gpg --symmetric android/keystore.jks
   # Creates: keystore.jks.gpg
   ```

2. **Cloud Storage**
   - Store encrypted backup in AWS S3 (private, versioned)
   - Or 1Password Secure Document
   - NEVER unencrypted on Dropbox/Google Drive

3. **Recovery Procedure**
   ```bash
   # Restore from backup
   gpg -d android/keystore.jks.gpg > android/keystore.jks
   ```

### Password Security

- ✅ Use strong, unique passwords (20+ chars)
- ✅ Store in password manager only
- ✅ Never commit to git
- ✅ Never share via email/Slack
- ✅ Don't hardcode in build scripts
- ❌ Don't reuse passwords across services
- ❌ Don't write down passwords
- ❌ Don't use simple passphrases

### Team Access Control

**If sharing with teammates:**

1. Generate new key for their machine
2. Export signed APK, don't share keystore
3. Use CI/CD (GitHub Actions) for builds
4. Store credentials only in CI secrets

**Never:**
- Email the keystore file
- Share passwords in plain text
- Commit to version control
- Store in shared cloud folders

---

## 6. Signing Configuration

The build system reads credentials from environment variables or `signing.properties`:

**File: `build.gradle.kts`**

```kotlin
signingConfigs {
    create("release") {
        storeFile = file(System.getenv("SIGNING_STORE_FILE") ?: "keystore.jks")
        storePassword = System.getenv("SIGNING_STORE_PASSWORD") ?: ""
        keyAlias = System.getenv("SIGNING_KEY_ALIAS") ?: ""
        keyPassword = System.getenv("SIGNING_KEY_PASSWORD") ?: ""
    }
}
```

**Precedence:**
1. Environment variables (GitHub Actions)
2. `signing.properties` file (local development)
3. Default values (build will fail if missing)

---

## 7. Build & Sign APK/AAB

### Local Release Build

```bash
cd neural-twin-app/android

# Create signing.properties first
cat > signing.properties << EOF
SIGNING_STORE_FILE=keystore.jks
SIGNING_STORE_PASSWORD=your_keystore_password
SIGNING_KEY_ALIAS=neural_twin_key
SIGNING_KEY_PASSWORD=your_key_password
EOF

# Build signed APK
./gradlew assembleRelease

# Build signed App Bundle (AAB)
./gradlew bundleRelease
```

### Verify Signature

```bash
# Check APK signature
keytool -printcert -jarfile app/build/outputs/apk/release/app-release.apk

# Expected output shows Certificate Owner with your info
```

### Output Locations

- **APK:** `app/build/outputs/apk/release/app-release.apk`
- **AAB:** `app/build/outputs/bundle/release/app-release.aab`

---

## 8. Rotate Keystore (Advanced)

### When to Rotate

- ⚠️ Keystore compromised
- ⚠️ Password leaked
- ⚠️ Developer leaves team

### How to Rotate

**Step 1: Create new keystore**

```bash
keytool -genkey -v \
  -keystore keystore-new.jks \
  -keyalg RSA -keysize 4096 -validity 10950 \
  -alias neural_twin_key_v2
```

**Step 2: Request Play Store app signing**

Google Play Console can take over signing via their **Play App Signing** service:
1. Console → App signing → Opt into Play App Signing
2. Upload existing APK with old signature once
3. Google takes over signing from then on
4. You only need to upload the AAB (unsigned)

This is **strongly recommended** for production apps.

**Step 3: Update CI/CD credentials**

```bash
# Update GitHub secrets with new keystore
base64 -i keystore-new.jks | pbcopy
# Then update KEYSTORE_FILE secret in GitHub
```

---

## 9. Troubleshooting

### Error: "Keystore was tampered with, or password was incorrect"

```bash
# Verify keystore integrity
keytool -list -keystore android/keystore.jks

# Re-enter correct password
```

### Error: "Key was rejected"

This usually means key password is wrong:

```bash
# Reset key password
keytool -keypasswd -keystore android/keystore.jks -alias neural_twin_key
```

### APK Not Signing

1. Check `signing.properties` exists in `android/` directory
2. Verify file permissions: `chmod 600 signing.properties`
3. Test keystore: `keytool -list -v -keystore android/keystore.jks`
4. Run clean build: `./gradlew clean assembleRelease`

### Fingerprint Mismatch

If Play Store rejects APK for signature mismatch:

```bash
# Get current APK fingerprint
keytool -printcert -jarfile app/build/outputs/apk/release/app-release.apk | grep SHA-256

# Compare with Play Store's expected fingerprint
# If different, keystore may have changed
```

---

## 10. Checklist

Before submitting to Play Store:

- [ ] Keystore created with 4096-bit RSA key
- [ ] Validity date is ~30 years in future
- [ ] `signing.properties` is .gitignore'd
- [ ] GitHub secrets configured (KEYSTORE_FILE, password, alias)
- [ ] Local build signs successfully: `./gradlew bundleRelease`
- [ ] APK signature verified
- [ ] Encrypted backup created and stored securely
- [ ] Team has access via CI/CD (no shared keystore)
- [ ] Backup recovery tested

---

## References

- [Android Key and Certificate Formats](https://developer.android.com/studio/publish/app-signing)
- [App Signing by Google Play](https://support.google.com/googleplay/android-developer/answer/7384423)
- [Gradle Build Signing](https://developer.android.com/build/building-cmdline)
- [keytool Documentation](https://docs.oracle.com/javase/8/docs/technotes/tools/unix/keytool.html)

---

## Support

For help:
- Email: wiggjamie28@gmail.com
- GitHub Issues: [Neural Twin App](https://github.com/)
