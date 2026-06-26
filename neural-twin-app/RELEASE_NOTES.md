# Neural Twin App - Release Notes

## Version 0.1.0 (Initial Release)

### Overview
Neural Twin is a comprehensive health and wellness companion app built with Compose, featuring Health Connect integration, audio recording, and real-time location services.

### Key Features
- **Health Integration** - Seamless Health Connect API integration for tracking health metrics
- **Audio Recording** - Native audio recording capabilities for voice memos and health notes
- **Location Services** - Fine and coarse location access for health-based location features
- **Camera Support** - Built-in camera integration for biometric measurements
- **Offline-First** - Room database for robust offline functionality
- **Modern UI** - Material Design 3 with Jetpack Compose

### Technical Improvements
- Dagger Hilt dependency injection for scalable architecture
- Retrofit + OkHttp for efficient networking
- Gson serialization with custom annotations
- ProGuard/R8 optimization for minimal APK size
- Kotlin Coroutines for asynchronous operations

### Permissions
- `INTERNET` - Backend API communication
- `RECORD_AUDIO` - Voice note recording
- `CAMERA` - Health measurement capture
- `READ_EXTERNAL_STORAGE` - Media access
- `ACCESS_FINE_LOCATION` - Precise location
- `ACCESS_COARSE_LOCATION` - Approximate location
- `ACCESS_HEALTH` - Health Connect access

### Supported Devices
- **Minimum SDK:** Android 9 (API 28)
- **Target SDK:** Android 14 (API 34)
- **Recommended:** Android 13+

### Known Limitations
- Initial beta release
- Some features may be incomplete pending user feedback

### Migration Notes
N/A (Initial release)

### Support & Feedback
- **Issue Tracker:** GitHub Issues
- **Email:** wiggjamie28@gmail.com
- **Privacy:** See [Privacy Policy](../../../privacy.md)

---

## Template for Future Releases

### Version X.Y.Z (Release Date)

#### New Features
- Feature 1
- Feature 2

#### Enhancements
- Enhancement 1
- Improvement to existing feature

#### Bug Fixes
- Fixed issue with [component]
- Corrected behavior in [feature]

#### Performance
- Reduced APK size by X%
- Improved load time for [feature]

#### Breaking Changes
N/A or list any

#### Deprecations
- Deprecated method/class: use X instead

#### Security
- Patched vulnerability in [library]
- Updated [dependency] to v[version]

#### Known Issues
- Issue 1: workaround available
- Issue 2: will be fixed in next release

---

## Release Checklist

Before each release:

- [ ] Update version code and version name in `build.gradle.kts`
- [ ] Update this `RELEASE_NOTES.md` file
- [ ] Run `./gradlew lint` and ensure no critical issues
- [ ] Run `./gradlew bundleRelease` and test the AAB locally
- [ ] Test on both emulator and physical device (if possible)
- [ ] Verify all permissions are intentional and documented
- [ ] Check ProGuard configuration is correct
- [ ] Commit and push changes to main branch
- [ ] GitHub Actions will automatically build APK/AAB
- [ ] Download the AAB artifact and upload to Google Play Console
- [ ] Create release in Google Play Console with these notes
- [ ] Perform staged rollout (10% → 50% → 100%)
- [ ] Monitor crash reports and ratings

## Deployment Instructions

### Step 1: Build Artifacts
1. Push changes to `main` branch touching `neural-twin-app/android/**`
2. GitHub Actions automatically builds APK and AAB
3. Download artifacts: `neural-twin-aab` and `neural-twin-apk`

### Step 2: Google Play Console Setup
1. Visit [Google Play Console](https://play.google.com/console)
2. Navigate to Neural Twin app
3. Select **Internal testing** → **Releases**

### Step 3: Upload to Play Store
1. Click **Create release**
2. Upload the `.aab` file (Android App Bundle)
3. Add release notes from this file
4. Review and confirm version details

### Step 4: Staged Rollout
1. Set initial rollout to **10% of users**
2. Monitor crash reports for 24-48 hours
3. Increase to **50%** if stable
4. Full **100%** rollout after 48 hours

### Step 5: Beta Testing Track (Optional)
1. Use **Closed testing** track for beta testers
2. Share app link with internal testers first
3. Collect feedback before public release
4. Promote to **Production** when ready

## Version Numbering Scheme

Follow [Semantic Versioning](https://semver.org/):
- **MAJOR.MINOR.PATCH**
- `0.1.0` → `0.2.0` (new features)
- `0.1.0` → `0.1.1` (bug fixes)
- `0.1.0` → `1.0.0` (breaking changes / public launch)

Increment **Version Code** by 1 for every release (Play Store requirement).

## Troubleshooting

### Build Failures
- Ensure Java 17+ is installed
- Run `./gradlew clean` before rebuilding
- Check ProGuard rules for library conflicts

### APK Won't Install
- Verify signature matches uploaded to Play Store
- Check device's Android version meets minimum SDK requirement
- Clear Play Store cache and retry

### Crash Reports
- Download crash logs from Google Play Console
- Cross-reference with ProGuard mapping file
- File GitHub issue with deobfuscated stack trace
