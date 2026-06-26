# App Store Connect Setup Guide

**App Name:** Reset  
**Bundle ID:** au.com.rhythmixapp.reset  
**Status:** Ready for TestFlight upload  

---

## 1. Create App on App Store Connect

### 1.1 Initial Setup

1. Go to **App Store Connect** → https://appstoreconnect.apple.com
2. Sign in with Apple ID: `jamie.jack.28@hotmail.com`
3. Click **"Apps"** in the sidebar
4. Click **"+"** → **"New App"**
5. Select platform: **iOS**
6. Fill in:
   - **Name:** Reset
   - **Primary Language:** English
   - **Bundle ID:** au.com.rhythmixapp.reset (must match Xcode)
   - **SKU:** reset-au (unique identifier, can't change)
   - **User Access:** Select team members (optional)

7. Click **"Create"**

### 1.2 App Information

After creation, navigate to **App Store** tab:

1. **Name:** Reset (30 characters max)
2. **Subtitle:** Recovery tracking for team sport (30 characters max)
3. **Description:** 
```
Reset is your personal recovery companion for team sport. Track workouts, 
monitor recovery metrics, and receive personalized recommendations to 
optimize your performance.

Key features:
• Recovery logging and tracking
• Personalized recovery insights
• Apple Health integration
• Coaching resources
• Community support

**Medical Disclaimer:** Reset provides general wellness guidance and is not 
a substitute for professional medical advice. Always consult healthcare 
professionals before starting new recovery routines.
```

4. **Privacy Policy URL:** https://rhythmixapp.com.au/privacy-policy.html
   *(Create this HTML page and host it)*
5. **Support URL:** support@rhythmixapp.com.au
6. **Category:** Health & Fitness
7. **Subcategory:** Health (if available)

---

## 2. Version Configuration

### 2.1 Add New Version (TestFlight)

1. In App Store Connect → **App Store** tab
2. Look for **"Pricing and Availability"** → Confirm pricing (Free)
3. Scroll to **Versions** section
4. Click **"Create version"** or use existing

### 2.2 Version Details

1. **Version Number:** 1.0
2. **Build Number:** (auto-linked when uploading)
3. **Release Notes:**
```
Initial Release

• Launch of Reset recovery app
• Apple Health integration
• Recovery tracking and logging
• Personalized recommendations
• Community features
```

### 2.3 Release Schedule

- **Automatic Release:** Publish immediately after approval (recommended for first release)
- **Manual Release:** Release later (if you want to coordinate announcement)

Select: **Automatically release this version**

---

## 3. App Preview and Screenshots

### 3.1 Screenshots

Upload 5-6 screenshots per device type showing key features:

**Device Types to Support:**
- iPhone 6.7-inch (iPhone 15 Pro Max)
- iPhone 6.1-inch (iPhone 15)
- iPhone 5.8-inch (iPhone 14 Pro)
- iPhone 5.5-inch (iPhone 8 Plus)

**Screenshot Sizes:**
| Device | Orientation | Size |
|--------|-------------|------|
| iPhone 6.7" | Portrait | 1290 x 2796 |
| iPhone 6.1" | Portrait | 1170 x 2532 |
| iPhone 5.8" | Portrait | 1125 x 2436 |
| iPhone 5.5" | Portrait | 1242 x 2208 |

**Content per Screenshot:**
1. **Home/Dashboard** — Main recovery overview
2. **Tracking** — Logging a recovery session
3. **Insights** — Personalized recommendations
4. **Apple Health** — Health integration
5. **Settings** — Customization options
6. **Achievement** — Progress/milestones

### 3.2 Screenshot Best Practices

- Use real app UI (not mockups)
- Include text overlays for clarity (optional):
  ```
  Screenshot 1: "Track Your Recovery"
  Screenshot 2: "Get Personalized Insights"
  Screenshot 3: "Sync with Apple Health"
  ```
- Ensure text is readable (minimum 15pt in screenshot)
- Show notch-safe design
- Portrait orientation preferred

### 3.3 App Preview Video (Optional)

Create 15-30 second preview video showing:
- App launch
- Key features in action
- Recovery tracking workflow
- Results/insights

**Video Requirements:**
- Format: MP4 or MOV
- Resolution: 1080p or 4K
- Frame rate: 30 fps
- Aspect ratio: 9:16 (portrait)
- No audio required (Apple adds music)
- Max file size: 500 MB

Upload in App Store Connect → **App Preview**

---

## 4. Ratings and Age Restrictions

### 4.1 Age Rating Questionnaire

Complete the questionnaire for:
- **Violence:** None
- **Sexual Content:** None
- **Language:** None
- **Alcohol/Tobacco:** None
- **Medical Information:** Yes (recovery guidance)
  - Implied medical treatment (select: "None")

**Recommended Rating:** 4+ (General Audiences)

### 4.2 Age Restrictions

If all questions answered appropriately:
- **Rating:** 4+
- **View restricted:** None needed

---

## 5. Pricing and Availability

### 5.1 Pricing Tier

1. **Free App:** Recommended for launch
2. If future IAP/subscriptions planned:
   - Add separate in-app purchase entries
   - Set pricing per market

### 5.2 Availability

1. **Available in:** Select all markets (or specific regions)
2. **Date:** Immediately after approval
3. **Territories:** At least:
   - Australia (primary)
   - United States
   - United Kingdom
   - Canada
   - And others as desired

---

## 6. App Privacy and Data

### 6.1 Privacy Manifest

Starting with iOS 17.4, Apple requires privacy manifest:

1. Create `PrivacyInfo.xcprivacy` in Xcode project (if not auto-generated)
2. Declare data collected:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>NSPrivacyTracking</key>
    <false/>
    <key>NSPrivacyTrackingDomains</key>
    <array/>
    <key>NSPrivacyCollectedDataTypes</key>
    <array>
        <dict>
            <key>NSPrivacyCollectedDataType</key>
            <string>NSPrivacyCollectedDataTypeHealthCareData</string>
            <key>NSPrivacyCollectedDataTypeLinked</key>
            <true/>
            <key>NSPrivacyCollectedDataTypeTracking</key>
            <false/>
            <key>NSPrivacyCollectedDataTypePurposes</key>
            <array>
                <string>NSPrivacyCollectedDataTypePurposeAppFunctionality</string>
            </array>
        </dict>
        <dict>
            <key>NSPrivacyCollectedDataType</key>
            <string>NSPrivacyCollectedDataTypeUserID</string>
            <key>NSPrivacyCollectedDataTypeLinked</key>
            <true/>
            <key>NSPrivacyCollectedDataTypeTracking</key>
            <false/>
            <key>NSPrivacyCollectedDataTypePurposes</key>
            <array>
                <string>NSPrivacyCollectedDataTypePurposeAppFunctionality</string>
            </array>
        </dict>
    </array>
</dict>
</plist>
```

### 6.2 Data & Privacy Questions

Answer in App Store Connect → **App Privacy**:

1. **Does this app collect or use data?** Yes
2. **Does this app use third-party analytics SDKs?** 
   - Firebase: Yes (if used)
   - Segment: Yes (if used)
3. **Does this app contain ads?** No
4. **Does this app use health data?** Yes
   - Health: Yes (Apple Health integration)
   - Fitness: Yes (if tracking workouts)

---

## 7. TestFlight Setup

### 7.1 Internal Testers

1. **App Store Connect** → **TestFlight** tab
2. **Internal Testing** → Add internal testers:
   - Add yourself: jamie.jack.28@hotmail.com
   - Add team members as needed

### 7.2 External Testers (Beta)

1. **External Testing** → Create group:
   - **Name:** Reset Beta Testers
   - **Max Testers:** 10,000 (start with 25 for launch)

2. **Add Testers:** Import email list or share link

3. **Build Distribution:**
   - Select build to distribute
   - Submit for review (Apple reviews beta builds)
   - Review usually takes 24-48 hours

### 7.3 Testing Instructions

Send testers:
```
Welcome to Reset Beta!

Please test these features:
1. Create account
2. Log a recovery session
3. Connect Apple Health
4. Check personalized insights
5. Report any crashes

Feedback link: [In-app or email]
Duration: 2 weeks
```

---

## 8. Build Upload Process

### 8.1 Using Fastlane (Recommended)

```bash
cd recovery-ios

# Build and upload
bundle exec fastlane ios testflight_complete

# Or manually
xcodebuild archive -scheme App
bundle exec fastlane ios upload_testflight
```

### 8.2 Manual Upload via Xcode

1. In Xcode: **Window** → **Organizer**
2. Select archive for "App"
3. Click **"Distribute App"**
4. Select **"App Store Connect"**
5. Choose signing/capabilities
6. Agree to terms
7. Upload

### 8.3 Transporter App (Alternative)

```bash
# Download Transporter from Mac App Store
# Or use CLI:
xcrun altool --upload-app -f App.ipa \
  -t ios \
  -u jamie.jack.28@hotmail.com \
  -p "app-specific-password"
```

---

## 9. App Store Connect Users & Permissions

### 9.1 Add Team Members

1. **Users and Access** (top menu)
2. Click **"+"** to add user
3. Assign roles:
   - **Admin:** Full access (keep limited)
   - **Marketing:** Screenshots, metadata, pricing
   - **Developer:** Can upload builds
   - **Viewer:** Read-only access

### 9.2 Roles Matrix

| Role | Uploads | Edit Metadata | Approve Release |
|------|---------|---------------|-----------------|
| Admin | Yes | Yes | Yes |
| Developer | Yes | No | No |
| Marketing | No | Yes | No |
| Viewer | No | No | No |

---

## 10. Pre-Launch Checklist

- [ ] App created in App Store Connect
- [ ] Bundle ID matches Xcode (au.com.rhythmixapp.reset)
- [ ] App name, subtitle, description finalized
- [ ] Privacy Policy URL working and complete
- [ ] Support contact email verified
- [ ] Screenshots (5-6) uploaded for all device types
- [ ] Age rating questionnaire completed
- [ ] Privacy manifest configured
- [ ] Data & Privacy questions answered
- [ ] TestFlight internal testers added
- [ ] First build uploaded and processed
- [ ] Version 1.0 configured
- [ ] Release notes written
- [ ] Pricing set to Free
- [ ] Availability set correctly
- [ ] No placeholder text in app
- [ ] Health disclaimer visible in app

---

## 11. Upload First Build to TestFlight

### 11.1 Prepare Build

```bash
cd recovery-ios/ios/App

# Update version
sed -i '' 's/MARKETING_VERSION = .*/MARKETING_VERSION = 1.0;/g' App.xcodeproj/project.pbxproj
sed -i '' 's/CURRENT_PROJECT_VERSION = .*/CURRENT_PROJECT_VERSION = 1;/g' App.xcodeproj/project.pbxproj

# Archive
xcodebuild archive -scheme App \
  -archivePath build/App.xcarchive \
  -configuration Release
```

### 11.2 Export IPA

```bash
xcodebuild -exportArchive \
  -archivePath build/App.xcarchive \
  -exportOptionsPlist ExportOptions.plist \
  -exportPath build/Exports
```

### 11.3 Upload to TestFlight

```bash
cd recovery-ios
bundle exec fastlane ios upload_testflight \
  ipa_path:"../ios/App/build/Exports/App.ipa"
```

### 11.4 Monitor Upload

1. In App Store Connect → **TestFlight** tab
2. Wait for "Processing builds..." status
3. Should complete within 10-15 minutes
4. Build appears in **Builds** section
5. Submit for TestFlight Review

---

## 12. TestFlight Review

### 12.1 Submit for Review

1. In TestFlight → **Builds** section
2. Select your build
3. Click **"Submit for Review"**
4. Answer release notes/contents questions
5. Confirm metadata accuracy
6. Submit

### 12.2 Review Timeline

- **Internal testers:** Immediate access (no review)
- **External testers:** Review takes 24-48 hours (sometimes faster)
- **Reason for rejection:** Usually metadata or health claims issues

### 12.3 If Rejected

Review feedback and fix:
- Missing disclaimer?
- Incorrect privacy policy?
- Build crashes?

Fix issues, increment build number, and resubmit.

---

## 13. Monitor TestFlight Feedback

1. **Feedback** tab in TestFlight
2. Collect crash reports
3. Monitor user feedback
4. Fix critical bugs before App Store submission
5. Run 2-3 weeks of beta testing minimum

---

## 14. Submit to App Store Review

### 14.1 Prepare for Review

After successful TestFlight beta:

1. Fix any reported bugs
2. Increment version to 1.0 (final)
3. Increment build number
4. Verify all metadata is final
5. Review App Store Compliance Checklist (see APP_STORE_COMPLIANCE_CHECKLIST.md)

### 14.2 Submit for App Store Review

1. App Store Connect → **App Store** tab
2. Select version
3. Click **"Prepare for Submission"**
4. Review metadata:
   - Verify all fields
   - Screenshots look good
   - Description accurate
5. Click **"Submit for Review"**
6. Answer submission questions:
   - "Does your app use encryption?" → Usually "No"
   - "Does your app contain cryptography?" → Check if needed
   - Any export compliance questions
7. Confirm submission

### 14.3 Review Timeline

- **First review:** 1-3 days (can be 5-7 during holidays)
- **Resubmission:** Usually faster (24-48 hours)
- **Monitor:** Check App Store Connect daily for status

---

## 15. After Approval

### 15.1 Release Options

1. **Automatic Release:** Published immediately
2. **Manual Release:** Schedule or release on demand

Select **"Manually release this version"** to control launch timing.

### 15.2 Launch Communication

- Announce on social media
- Email announcement to waitlist
- Blog post if applicable
- Social media campaign

### 15.3 Monitor After Launch

- Check crash rates
- Monitor reviews
- Respond to negative reviews
- Fix bugs quickly
- Plan for v1.0.1 patch if needed

---

## 16. Common Issues & Solutions

### Issue: "Build rejected: Guideline 2.3.1"
**Problem:** Health claims without disclaimer  
**Solution:** Add clear disclaimer in app UI and privacy policy

### Issue: "Missing Privacy Policy URL"
**Problem:** URL not working or not provided  
**Solution:** Ensure URL is accessible and reachable from any network

### Issue: "Build fails to process"
**Problem:** Invalid code signing, bitcode issues, or architecture mismatch  
**Solution:** 
- Verify 64-bit architecture
- Check code signing certificate is valid
- Rebuild and re-upload

### Issue: "Metadata rejected: Misleading description"
**Problem:** Screenshots don't match description  
**Solution:** Update screenshots to accurately represent features shown in description

---

## 17. Reference Documentation

- [App Store Connect Help](https://help.apple.com/app-store-connect/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [TestFlight Documentation](https://help.apple.com/testflight/)
- [Privacy Manifest Documentation](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files)

---

**Setup Status:** Ready for TestFlight  
**Last Updated:** June 26, 2024
