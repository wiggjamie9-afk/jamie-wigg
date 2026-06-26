# Google Play Store Submission Requirements

Neural Twin App must meet Google Play Store policies and technical requirements before publication.

---

## 1. App Listing Information

### App Title (50 chars max)
```
Neural Twin
```

### App Description (4000 chars max)

**Short Description (80 chars):**
```
Your AI-powered health companion with Health Connect integration
```

**Full Description:**
```
Neural Twin is your personal health and wellness companion, powered by artificial 
intelligence to understand your unique health patterns and provide personalized insights.

FEATURES:
• Health Connect Integration - Seamlessly sync with your device's health ecosystem
• Audio Recording - Voice memos for health notes and personal observations
• Real-Time Location - Location-aware health features and local wellness resources
• Camera Integration - Capture health measurements and reference photos
• Offline-First - Full functionality without internet connection via local database
• Modern Interface - Beautiful Material Design 3 UI built with Jetpack Compose

WHY NEURAL TWIN?
✓ Privacy-First - Your data stays on your device by default
✓ AI-Powered - Machine learning insights tailored to your health patterns
✓ Health Connect Compatible - Works seamlessly with Android's native health platform
✓ Fast & Responsive - Built with modern Kotlin and Compose for blazing performance
✓ No Ads - Clean, ad-free experience focused on your wellness

PERMISSIONS:
We request only essential permissions:
• Internet - Backend API communication for AI features
• Camera - Biometric measurements and health photo capture
• Audio - Voice note recording for health journaling
• Location - Location-based wellness and medical resources
• Health Connect - Access to your health data (requires explicit consent)

PRIVACY & SECURITY:
Neural Twin respects your privacy. Review our Privacy Policy for complete details
on data handling and your rights.

FEEDBACK:
Questions? Issues? Feature requests? Contact us at wiggjamie28@gmail.com

Start your health journey with Neural Twin today!
```

### Screenshots
Required: 2-8 screenshots. Recommended: 4-6.

**Screenshot 1: Main Dashboard**
- Show primary health metrics
- Display real-time health insights
- Demonstrate Material Design 3 UI

**Screenshot 2: Health Sync**
- Show Health Connect integration
- Display synced health data
- Highlight integration features

**Screenshot 3: Audio Recording**
- Show voice memo interface
- Display transcribed notes
- Demonstrate ease of use

**Screenshot 4: Settings**
- Show permission management
- Display privacy controls
- Highlight offline capabilities

**Dimensions:**
- Minimum: 320x426px
- Maximum: 3840x2160px
- Recommended: 1080x1920px (portrait)
- Format: JPG or PNG

### Feature Graphic
- **Dimensions:** 1024x500px (exactly)
- **Format:** JPG or PNG
- **Content:** App logo, tagline, visual design showcase
- **Purpose:** Displayed on app store listing

### Icon / App Logo
- **Dimensions:** 512x512px
- **Format:** PNG with transparent background
- **Content:** Clear, recognizable app icon
- **Style:** Aligns with Material Design 3

### Video Preview (Optional but Recommended)
- **Format:** MP4 or MOV
- **Duration:** 15-30 seconds
- **Aspect Ratio:** 9:16 or 16:9
- **Content Ideas:**
  - Quick app walkthrough
  - Key feature demo
  - Health sync workflow
  - User testimonial

---

## 2. Technical Requirements

### Build & Signing
- ✅ Target SDK: 34 (Android 14)
- ✅ Minimum SDK: 28 (Android 9)
- ✅ 64-bit support: Yes (via Kotlin/ARM64)
- ✅ APK signed with release key: Required
- ✅ App Bundle (AAB) format: Required for production

### Code Quality
- ✅ ProGuard/R8 enabled: Yes (minification active)
- ✅ Debuggable flag: False in release build
- ✅ All permissions justified: Yes
- ✅ No hardcoded credentials: Verified

### Performance
- ✅ APK size: < 100MB (uncompressed limit: 150MB)
- ✅ Memory usage: Minimal overhead, Compose optimized
- ✅ Startup time: < 5 seconds on target device
- ✅ Crash rate: Must be < 1%

### Security Checklist
- ✅ Network: HTTPS only (network_security_config.xml)
- ✅ Backup: Uses encrypted backup rules (data_extraction_rules.xml)
- ✅ Permissions: Minimal, justified, runtime-requested
- ✅ Dependencies: All up-to-date, no known CVEs
- ✅ Keys: Release keystore secured, not in repo

---

## 3. Content Rating Questionnaire

Fill out this form on Google Play Console:

### Content Classification
- **Violence:** None
- **Sexual Content:** None
- **Offensive Language:** None
- **Substance Abuse:** Tobacco/alcohol features may be mentioned in health tracking
- **Gambling:** None
- **Medical Information:** Yes (health tracking app)
- **Financial Information:** None

**Declare as:** Health/Medical (likely T for Teen or E for Everyone)

---

## 4. Privacy Policy

**Required:** Yes, and must be publicly available.

### Location
Host at: `https://neuraltwin.example.com/privacy`

Or create an in-app Privacy Policy accessible from:
- **Settings > About > Privacy Policy**
- **App Store Listing > Privacy Policy link**

### What to Include

```markdown
# Privacy Policy for Neural Twin

Last Updated: [Date]

## Data Collection
- Health Connect data (with explicit user consent)
- Location data (only when features enabled)
- Audio recordings (stored locally)
- Camera usage (stored locally)

## Data Storage
- Primary: Local on-device (Room database)
- Backup: Optional cloud sync (encrypted)
- No third-party sharing

## Your Rights
- Access: View all collected data
- Deletion: Wipe data anytime
- Opt-out: Disable features in settings
- Contact: wiggjamie28@gmail.com

## Security
- End-to-end encryption for backend sync
- TLS 1.3+ for all network communication
- Regular security audits

[Include all required sections per your jurisdiction]
```

**Compliance Notes:**
- Include contact email (required)
- Explain GDPR compliance if serving EU users
- Include CCPA disclosures if serving California users
- Be specific about what data is collected

---

## 5. Store Listing Metadata

### Category
- **Primary:** Health & Fitness
- **Secondary:** Medical (optional)

### Type
- **Application**

### Supported Languages
- **English (United States)** - minimum required
- Optional: Add more languages via translated listings

### Website
```
https://neuraltwin.example.com
```
(Create a simple landing page if not available)

### Email
```
wiggjamie28@gmail.com
```

### Phone (Optional)
- Leave blank or use support contact

### Targeted Regions
- Worldwide (unless restricted by law)

---

## 6. Pricing & Distribution

### Pricing
- **Free or Paid:** Recommended: Free (can monetize via IAP)
- **In-App Purchases:** Optional (e.g., Premium features)

### Device Compatibility
- ✅ Android 9 (API 28) and higher
- ✅ ARM64 supported
- ✅ Tablet compatible (Material 3 responsive)

### Countries
- Default: Worldwide
- Restrictions: None currently identified

---

## 7. Content Policy Compliance

### Data & Privacy
- ✅ Permission requests justified
- ✅ Privacy policy clearly linked
- ✅ No undisclosed tracking
- ✅ Health data handled securely

### Ad Policy
- ✅ No inappropriate ads (app is ad-free)
- ✅ No spam/misleading content
- ✅ No deceptive practices

### Intellectual Property
- ✅ App icon: Original or licensed
- ✅ Screenshots: Original content
- ✅ Copy: Original (no plagiarism)
- ✅ Third-party assets: Properly licensed

### Family Policy
- ✅ Intended audience: Adults 18+
- ✅ No content targeting children
- ✅ Clear age guidance

---

## 8. Pre-Submission Checklist

### 48 Hours Before Launch

**Code & Build:**
- [ ] Run `./gradlew lint` - no critical issues
- [ ] Run `./gradlew bundleRelease` - successful build
- [ ] Verify signing config is correct
- [ ] Test APK/AAB on physical device + emulator
- [ ] Check crash reports in Firebase (if integrated)
- [ ] Verify ProGuard rules work (no runtime crashes)

**Metadata:**
- [ ] App title finalized
- [ ] Description proofread (no typos)
- [ ] Screenshots added and tested
- [ ] Feature graphic created (1024x500px)
- [ ] Icon uploaded and looks correct
- [ ] Video preview tested (if added)

**Policies:**
- [ ] Privacy Policy written and published
- [ ] Terms of Service (if applicable)
- [ ] Support email verified
- [ ] Website working (or landing page created)

**Store Setup:**
- [ ] App listing created in Google Play Console
- [ ] Content rating questionnaire completed
- [ ] Pricing set (free or price point)
- [ ] Target regions selected
- [ ] Supported devices configured

**Legal:**
- [ ] No trademark/copyright issues
- [ ] Open source licenses acknowledged
- [ ] GDPR compliance verified (if EU users)
- [ ] No export restrictions violated

---

## 9. After Launch

### Monitor
- Daily crash rate (target: < 1%)
- ANR (Application Not Responding) rate
- Negative reviews and feedback
- Performance metrics

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Crashes on startup | Check ProGuard rules, test on API 28 device |
| Permissions denied | Verify runtime permission requests, check AndroidManifest |
| Battery drain | Profile with Android Studio Profiler |
| High APK size | Enable ProGuard more aggressively |
| Store rejection | Check console messages, review content policy |

### Support Workflow
1. Monitor Google Play Console daily
2. Respond to reviews within 48 hours
3. File GitHub issues for bugs reported
4. Push bug fixes to `main` branch
5. GitHub Actions auto-builds new release
6. Create new Play Store release
7. Staged rollout: 10% → 50% → 100%

---

## 10. Marketing & Launch

### Social Media
- Announce launch on Twitter/X, LinkedIn, Reddit
- Use hashtags: #AndroidApp #HealthTech #HealthConnect
- Share links to Play Store listing

### App Store Optimization (ASO)
- Keyword research: "health app", "health connect android", "wellness tracker"
- Update listing tags with high-volume keywords
- Monitor search impressions and conversion rate

### Beta Testing
1. Internal Testing Track (your team)
2. Closed Testing Track (20-50 testers)
3. Open Testing Track (anyone with link)
4. Collect feedback for 2 weeks before promoting to Production

### Version Updates
- Plan updates quarterly
- Maintain backwards compatibility
- Test on multiple API levels before release

---

## 11. Versioning

Current Version: **0.1.0** (Build Code: 1)

**Version Code Must Increment:** Every release to Play Store
- v0.1.0 = 1
- v0.1.1 = 2
- v0.2.0 = 3
- v1.0.0 = 4
- etc.

**Version Name Format:** MAJOR.MINOR.PATCH
- `0.1.0` - Initial release
- `0.2.0` - New features
- `0.1.1` - Bug fixes
- `1.0.0` - Production ready

---

## Contact & Support

**For Google Play Specific Questions:**
- Google Play Console Help: https://support.google.com/googleplay/android-developer
- Policy Center: https://support.google.com/googleplay/android-developer/answer/9859455

**For App Support:**
- Email: wiggjamie28@gmail.com
- Issue Tracker: GitHub Issues
- Privacy Inquiries: wiggjamie28@gmail.com

---

## References

- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [Target API Level Requirements](https://support.google.com/googleplay/android-developer/answer/11926180)
- [Content Rating Guidelines](https://support.google.com/googleplay/android-developer/answer/188189)
- [Privacy Policy Requirements](https://support.google.com/googleplay/android-developer/answer/10787469)
- [App Bundle Format](https://developer.android.com/guide/app-bundle)
