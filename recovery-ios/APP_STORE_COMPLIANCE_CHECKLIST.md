# App Store Review Compliance Checklist

**App Name:** Reset  
**Bundle ID:** au.com.rhythmixapp.reset  
**Target OS:** iOS 13.0+  
**Category:** Health & Fitness  

---

## Pre-Submission Checklist

Use this checklist before every App Store submission to ensure compliance with App Store Review Guidelines. Rejections are common; addressing these upfront saves time.

---

## 1. Functionality & Performance

### 1.1 Core Functionality
- [ ] App launches without crashes
- [ ] All features work as described
- [ ] No placeholder text or lorem ipsum
- [ ] Navigation flows logically
- [ ] Buttons and links respond correctly
- [ ] No broken or dead links
- [ ] Loading screens have timeouts (not infinite loops)
- [ ] Error messages are user-friendly

### 1.2 Performance
- [ ] App responds within 2-3 seconds
- [ ] No excessive battery drain
- [ ] Memory usage is reasonable
- [ ] No memory leaks (test with Instruments)
- [ ] Handles network timeouts gracefully
- [ ] Works on iPhone SE (smallest screen) and Plus models
- [ ] Handles orientation changes correctly
- [ ] Background task doesn't drain battery

### 1.3 Crashing & Stability
- [ ] Test on iOS 13.0 and latest iOS
- [ ] Test on various devices (iPhone 8, XS, 11, 12, 13, 14, 15)
- [ ] No crash logs in Console
- [ ] No memory warnings
- [ ] Handles interruptions (calls, alerts, low memory)
- [ ] Survives device rotation
- [ ] Handles rapid user interaction

---

## 2. Privacy & Security

### 2.1 Privacy Policy & Terms
- [ ] Privacy Policy is complete and accurate
- [ ] Privacy Policy URL works and is accessible
- [ ] Terms of Service provided if applicable
- [ ] Privacy Policy mentions all data collection
- [ ] Explains third-party data usage
- [ ] Explains retention policies
- [ ] Privacy Policy is in English (or localized)
- [ ] No placeholder text ("Add your privacy policy here")

### 2.2 Data Permissions

#### 2.2.1 Health & Fitness Data
- [ ] Requests HealthKit permission with clear explanation
- [ ] Info.plist has `NSHealthShareUsageDescription`
- [ ] Info.plist has `NSHealthUpdateUsageDescription`
- [ ] Only requests permissions actually used
- [ ] Handles permission denial gracefully
- [ ] Privacy policy explains Health data handling
- [ ] No automatic Apple Health sync without user consent

#### 2.2.2 Location
- [ ] If using location: has `NSLocationWhenInUseUsageDescription`
- [ ] Explains why location is needed
- [ ] Not used for marketing/tracking without consent
- [ ] Stops requesting location when not in use

#### 2.2.3 Calendar/Contacts
- [ ] If accessing: has appropriate Info.plist descriptions
- [ ] Only accesses with explicit user consent
- [ ] Doesn't share without permission

#### 2.2.4 Camera/Microphone
- [ ] If used: has usage descriptions
- [ ] User can deny access
- [ ] App works (degraded) without them

#### 2.2.5 Photo Library
- [ ] If used: has `NSPhotoLibraryUsageDescription`
- [ ] Only accesses user-selected photos
- [ ] Doesn't auto-save without permission

### 2.3 Data Collection & Sharing
- [ ] All data collection methods disclosed
- [ ] Analytics tracking disclosed in Privacy Policy
- [ ] No tracking without user consent
- [ ] No sharing with third parties without disclosure
- [ ] IDFA collection documented if used
- [ ] No fingerprinting or UDID collection
- [ ] No unauthorized data collection from other apps

### 2.4 Data Security
- [ ] User data encrypted in transit (HTTPS only)
- [ ] Sensitive data encrypted at rest
- [ ] No hardcoded API keys or secrets
- [ ] No password stored in plain text
- [ ] Biometric authentication for sensitive features (optional)
- [ ] No data transmission to servers without user awareness
- [ ] Complies with GDPR/CCPA if applicable

### 2.5 Account & Authentication
- [ ] Account creation is optional (or clearly explained)
- [ ] Secure password requirements
- [ ] Option to delete account
- [ ] No forced login to use app features
- [ ] Account recovery mechanism
- [ ] Session timeout for inactive users

---

## 3. Content & Appropriateness

### 3.1 Age Rating
- [ ] App rated correctly (4+, 12+, 17+)
- [ ] No inappropriate content for rating
- [ ] Mature content disclosed (violence, language, etc.)
- [ ] Recovery content appropriate for claimed age group

### 3.2 Metadata Accuracy
- [ ] Screenshots accurately represent app features
- [ ] Description matches actual functionality
- [ ] Keywords are relevant and honest
- [ ] Subtitle is accurate and appealing
- [ ] No misleading claims
- [ ] No competitor bashing

### 3.3 Prohibited Content
- [ ] No medical claims without disclaimers
- [ ] No claims to cure/diagnose conditions
- [ ] Includes "Not a substitute for medical advice" disclaimer
- [ ] No sexually explicit content
- [ ] No hate speech or discrimination
- [ ] No violence or gore
- [ ] No harassment or bullying features
- [ ] No gambling or loot boxes
- [ ] No illegal activity references

### 3.4 Health & Medical
- [ ] Includes health disclaimer
- [ ] Recommends consulting healthcare professionals
- [ ] No diagnosis or treatment claims
- [ ] Recovery recommendations are reasonable
- [ ] Warnings for contraindications (pregnancy, etc.)
- [ ] Age-appropriate guidance
- [ ] No encouraging dangerous behavior

---

## 4. User Interface & Usability

### 4.1 Navigation
- [ ] Intuitive navigation structure
- [ ] Clear back/close buttons
- [ ] No navigation traps
- [ ] Consistent layout across screens

### 4.2 Text & Readability
- [ ] Readable font sizes (minimum 11pt)
- [ ] Good contrast ratio (WCAG AA compliance)
- [ ] No tiny unreadable text
- [ ] Proper spelling and grammar
- [ ] Professional language

### 4.3 Accessibility
- [ ] VoiceOver support for visually impaired
- [ ] Button labels for screen reader
- [ ] Color not only differentiator
- [ ] Haptic feedback support
- [ ] Dynamic Type support (adjustable text size)
- [ ] No element obstructed by notch/Dynamic Island
- [ ] Touch targets at least 44x44pt

### 4.4 App Icons & Visual Assets
- [ ] App icon is 1024x1024px (minimum)
- [ ] Icon clearly represents app
- [ ] No trademark/copyright violations
- [ ] Preview images show app UI (not marketing graphics)
- [ ] Screenshots have readable text
- [ ] No misleading screenshots

---

## 5. App Store Connect Configuration

### 5.1 App Information
- [ ] Correct bundle ID
- [ ] Correct app name
- [ ] Primary category: Health & Fitness
- [ ] Secondary category (if applicable)
- [ ] App rating completed
- [ ] Privacy questions answered accurately
- [ ] Contact information provided

### 5.2 Version Release Notes
- [ ] Release notes describe changes (not empty)
- [ ] No advertising or misleading claims
- [ ] English or localized
- [ ] References current build version
- [ ] Changelog describes improvements

### 5.3 Screenshots & Preview Video
- [ ] At least one screenshot per device size
- [ ] Screenshots show actual app functionality
- [ ] Text readable in screenshots
- [ ] 5-6 screenshots showing key features
- [ ] Optimal placement for notch/Dynamic Island
- [ ] Preview video (30-30 seconds) optional but recommended

### 5.4 App Description
- [ ] Concise (max 2-3 paragraphs)
- [ ] Describes key features
- [ ] Explains value proposition
- [ ] No marketing hype
- [ ] No competitor comparison
- [ ] Accurate to app functionality

### 5.5 Keywords
- [ ] 5-10 relevant keywords
- [ ] Searchable terms users would use
- [ ] No keyword stuffing
- [ ] No competitor names
- [ ] Accurate (not misleading)

---

## 6. Technical Requirements

### 6.1 Code Quality
- [ ] No hardcoded strings (use localization)
- [ ] No console debug logging for public functions
- [ ] No commented-out code
- [ ] No private APIs (approved only)
- [ ] No obfuscation (code must be reviewable)
- [ ] No exploit techniques

### 6.2 Build & Submission
- [ ] Minimum iOS version: 13.0+
- [ ] Compiled with latest Xcode
- [ ] 64-bit architecture support
- [ ] No bitcode (deprecated)
- [ ] App Thinning enabled
- [ ] Build runs without warnings (or justified)
- [ ] Code signing valid
- [ ] Provisioning profile valid

### 6.3 Third-Party Libraries
- [ ] All dependencies have compatible licenses
- [ ] No GPL-licensed libraries (if distributed)
- [ ] Libraries are up-to-date (security patches)
- [ ] Third-party SDKs disclosed
- [ ] No malware or suspicious libraries

### 6.4 Networking
- [ ] All traffic over HTTPS (no HTTP)
- [ ] HTTPS certificate valid and trusted
- [ ] API endpoints documented (for review)
- [ ] No hardcoded server addresses (except config)
- [ ] Handles network errors gracefully
- [ ] Timeout implemented for slow networks

---

## 7. Specific Feature Checks

### 7.1 Apple Health Integration (if implemented)
- [ ] Uses HealthKit framework correctly
- [ ] Requests only necessary permissions
- [ ] Permissions requested at first use
- [ ] User can revoke access
- [ ] Doesn't share data without consent
- [ ] Privacy Policy explains Health data usage
- [ ] Complies with Apple's HealthKit guidelines

### 7.2 In-App Purchases (if implemented)
- [ ] Prices in all required currencies
- [ ] Purchase receipt validation on server
- [ ] Restoring purchases works
- [ ] Offers value for money
- [ ] Terms & pricing clear in app
- [ ] No forced purchases to access core features
- [ ] Complies with App Store pricing rules

### 7.3 Subscriptions (if implemented)
- [ ] Free trial period clearly shown
- [ ] Subscription benefits explained
- [ ] Auto-renewal terms in Settings
- [ ] User can cancel easily
- [ ] Price in local currency
- [ ] Clear billing language
- [ ] No dark patterns

### 7.4 External Links & Web Content
- [ ] All URLs use HTTPS
- [ ] External web content is reputable
- [ ] No phishing or malware sites
- [ ] Links to legitimate sources
- [ ] "Opens in Safari" clearly shown

---

## 8. Localization (if applicable)

- [ ] Strings localized for target countries
- [ ] Translations professional and accurate
- [ ] RTL languages supported (if applicable)
- [ ] Currency/date formats correct per region
- [ ] Images localized where needed
- [ ] Privacy Policy in app language

---

## 9. Marketing & Store Presence

### 9.1 Marketing Compliance
- [ ] No false or misleading claims
- [ ] Medical/health claims include disclaimers
- [ ] Screenshots accurately represent features
- [ ] No competitor names in keywords
- [ ] No hidden keywords/black hat SEO

### 9.2 Support & Contact
- [ ] Support email provided
- [ ] Website URL provided (if applicable)
- [ ] Support responds to feedback
- [ ] In-app feedback mechanism optional

---

## 10. Legal Compliance

### 10.1 Licenses & Attribution
- [ ] Third-party attributions included
- [ ] License compliance documented
- [ ] No GPL violations
- [ ] Open source disclosures

### 10.2 Export Controls
- [ ] App doesn't violate export restrictions
- [ ] Encryption disclosures if needed
- [ ] No ITAR-controlled technology

### 10.3 Regional Compliance
- [ ] GDPR compliance (EU users)
- [ ] CCPA compliance (California users)
- [ ] Age verification if needed
- [ ] Regional content restrictions

---

## 11. Common Rejection Reasons

### Rejected: "Guideline 2.1 - Information Needed"
**Fix:** Provide complete Privacy Policy URL and accurate app description.

### Rejected: "Guideline 2.3.1 - Health Claims"
**Fix:** Add disclaimer "Not a substitute for professional medical advice."

### Rejected: "Guideline 2.4.1 - Misleading Metadata"
**Fix:** Update screenshots to show actual app UI, not marketing graphics.

### Rejected: "Guideline 5.1.1 - Legal"
**Fix:** Ensure privacy policy is complete and accessible.

### Rejected: "Guideline 4.2 - Minimum Functionality"
**Fix:** Test on iOS 13.0; ensure all features work without crashes.

### Rejected: "Guideline 1.1 - Spam"
**Fix:** Remove keyword stuffing; ensure app is unique and useful.

---

## 12. Pre-Submission Testing Checklist

### Device Testing
- [ ] iPhone SE (small screen)
- [ ] iPhone 14/15 (standard)
- [ ] iPhone 14/15 Plus (large screen)
- [ ] iPad (if landscape supported)

### iOS Version Testing
- [ ] iOS 13.0 (minimum)
- [ ] iOS 15, 16, 17 (current)
- [ ] Test latest beta if available

### Network Testing
- [ ] Test on WiFi
- [ ] Test on cellular (4G/5G)
- [ ] Test with no network (airplane mode)
- [ ] Test with poor signal

### Battery/Performance
- [ ] Low Power Mode enabled
- [ ] Memory stress test
- [ ] Battery drain test (30 min usage)
- [ ] App background/foreground transitions

---

## 13. Submission Checklist

- [ ] All checklist items reviewed and passed
- [ ] Screenshots uploaded (all device sizes)
- [ ] App description and keywords finalized
- [ ] Version notes written and reviewed
- [ ] Privacy Policy URL verified working
- [ ] Terms of Service reviewed (if applicable)
- [ ] Support email verified
- [ ] Build number incremented
- [ ] Version number set correctly
- [ ] No beta/test data in production build
- [ ] Final testing on TestFlight passed
- [ ] Screenshots reviewed for accuracy
- [ ] Code signing certificate valid
- [ ] Provisioning profile valid
- [ ] Ready for submission

---

## 14. Post-Submission

### Awaiting Review
- Apple review typically takes 1-3 days
- Monitor App Store Connect for updates
- Don't resubmit unless requested

### If Rejected
- [ ] Read rejection reason carefully
- [ ] Do not ignore specific guideline reference
- [ ] Fix issues in new build
- [ ] Increment build number
- [ ] Test fixes thoroughly
- [ ] Resubmit with explanation

### If Approved
- [ ] Schedule release date (immediate or future)
- [ ] Plan marketing announcement
- [ ] Monitor for crashes/feedback
- [ ] Prepare for v1.0.1 bug fixes if needed

---

## 15. Ongoing Maintenance

### Regular Reviews (Every Release)
- [ ] Test on current iOS versions
- [ ] Update third-party dependencies
- [ ] Monitor App Store reviews for issues
- [ ] Fix bugs and crashes promptly
- [ ] Update privacy policy if needed

### Seasonal Updates
- [ ] Test on new iOS beta versions
- [ ] Update for new device sizes
- [ ] Refresh screenshots and marketing copy

---

## Reference

- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Apple Privacy Overview](https://www.apple.com/privacy/)

---

**Checklist Version:** 1.0  
**Last Updated:** June 26, 2024  
**Status:** Ready for TestFlight
