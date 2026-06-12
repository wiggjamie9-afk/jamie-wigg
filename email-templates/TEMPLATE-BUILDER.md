# Email Template Builder Guide

A reference guide for building, customizing, and deploying email templates across all 10 apps.

## Quick Start

### Template Naming Convention

```
{app-slug}-{sequence-type}-{position}.html

Examples:
- language-lens-onboarding-1.html    → Welcome email
- fit-coach-pro-upsell-2.html        → Feature deep-dive
- study-mate-retention-3.html        → Feature launch
```

### Available Sequences

- **Onboarding** (5 emails) → `onboarding-1` through `onboarding-5`
- **Upsell** (3 emails) → `upsell-1` through `upsell-3`
- **Retention** (4 emails) → `retention-1` through `retention-4`

---

## Template Structure (Standard)

Every template follows this responsive, ESP-compatible structure:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Subject</title>
    <style>
        /* All CSS inline (no <style> in body) */
        * { margin: 0; padding: 0; }
        body { font-family: system fonts; }
        .container { max-width: 600px; }
        /* ... responsive breakpoints ... */
    </style>
</head>
<body>
    <div class="container">
        <!-- Header with gradient -->
        <div class="header">
            <h1>Main Title</h1>
            <p>Subheader</p>
        </div>

        <!-- Content section -->
        <div class="content">
            <p>Body copy with {{personalization}}</p>
            <!-- Features, stats, benefits -->
        </div>

        <!-- CTA button -->
        <div style="text-align: center;">
            <a href="{{ctaUrl}}" class="cta-button">Button Text</a>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>Footer text</p>
            <a href="{{unsubscribeUrl}}">Unsubscribe</a>
        </div>
    </div>
</body>
</html>
```

---

## Key Components

### 1. Header Section

**Purpose:** Brand introduction, subject line reinforcement

```html
<div class="header" style="background: linear-gradient(135deg, #6366F1 0%, #818CF8 100%); padding: 40px 20px; text-align: center; color: white;">
    <h1 style="font-size: 32px; font-weight: 700; margin-bottom: 10px;">Welcome to [AppName]!</h1>
    <p style="font-size: 16px; opacity: 0.95;">Subheader/tagline</p>
</div>
```

**Customization:**
- Change gradient colors to match app brand colors
- Update h1 text to match subject line
- Adjust font sizes for mobile: `h1 { font-size: 24px; }` at 600px breakpoint

### 2. Hero Image

```html
<img src="{{heroImageUrl}}" alt="Email Hero" class="hero-image" style="width: 100%; max-width: 600px; height: auto; display: block;">
```

**Notes:**
- Always include alt text for accessibility
- Set max-width to 600px (container width)
- Use `height: auto` to preserve aspect ratio

### 3. Content Area

**Body Copy:**
```html
<div class="content" style="padding: 40px 20px;">
    <p style="font-size: 16px; margin-bottom: 20px; line-height: 1.8;">
        Hi {{firstName}},<br><br>
        Main message here...
    </p>
</div>
```

**Features List:**
```html
<ul class="feature-list" style="list-style: none; padding: 0;">
    <li style="padding: 8px 0 8px 25px; position: relative;">
        <span style="position: absolute; left: 0; color: #6366F1;">✓</span>
        Feature text
    </li>
</ul>
```

**Stats/Highlight Box:**
```html
<div style="background: #f0f4ff; border-left: 4px solid #6366F1; padding: 20px; border-radius: 4px; margin: 20px 0;">
    <strong style="color: #6366F1;">Stat:</strong> {{statValue}}
</div>
```

### 4. Call-to-Action Button

**Primary CTA:**
```html
<a href="{{ctaUrl}}" style="display: inline-block; background-color: #6366F1; color: white; padding: 14px 40px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 30px 0; font-size: 16px;">
    Button Text
</a>
```

**Secondary CTA:**
```html
<a href="{{ctaUrl}}" style="display: inline-block; background-color: transparent; border: 2px solid #6366F1; color: #6366F1; padding: 14px 40px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 15px 0; font-size: 16px;">
    Secondary Button
</a>
```

**Best Practices:**
- Use contrasting colors (brand color or high-contrast accent)
- Button text should be action-oriented ("Download Now", "Upgrade", "Start Learning")
- Padding: 14px vertical, 40px horizontal (scales to 12px/30px on mobile)
- Always include `text-decoration: none` to prevent link underline
- Use `display: inline-block` for proper centering

### 5. Footer

```html
<div class="footer" style="background: #f9fafb; padding: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center;">
    <p style="margin-bottom: 10px;">Company Name - Brand Tagline</p>
    <div class="social-links" style="margin: 15px 0;">
        <a href="https://twitter.com/yourhandle" style="color: #6366F1; text-decoration: none; margin: 0 10px;">Twitter</a>
        <a href="https://instagram.com/yourhandle" style="color: #6366F1; text-decoration: none; margin: 0 10px;">Instagram</a>
    </div>
    <p style="margin-top: 15px;">
        You're receiving this because you signed up for {{appName}}.<br>
        <a href="{{unsubscribeUrl}}" style="color: #6366F1; text-decoration: none;">Unsubscribe</a> | 
        <a href="{{preferencesUrl}}" style="color: #6366F1; text-decoration: none;">Preferences</a>
    </p>
</div>
```

**CAN-SPAM Compliance:**
- Always include unsubscribe link (required by law)
- Include company name/address (or link to it)
- Honor unsubscribe requests within 10 days

---

## Responsive Design Patterns

### Mobile Breakpoint (600px and below)

```css
@media (max-width: 600px) {
    .header h1 { font-size: 24px; }
    .content { padding: 20px 15px; }
    .stats-grid { grid-template-columns: 1fr; }
    .cta-button { padding: 12px 30px; font-size: 14px; }
}
```

### Grid Layouts

**2-Column Stats (responsive):**
```html
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
    <div style="background: #f3f4f6; padding: 15px; text-align: center;">
        <div style="font-size: 24px; font-weight: 700; color: #6366F1;">Stat</div>
        <div style="font-size: 12px; color: #6b7280;">Label</div>
    </div>
    <div><!-- second column --></div>
</div>

@media (max-width: 600px) {
    /* Change to 1 column on mobile */
    div { grid-template-columns: 1fr; }
}
```

### Tables (for comparisons)

```html
<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
    <tr style="background: #f3f4f6;">
        <th style="padding: 12px; text-align: left; border: 1px solid #e5e7eb;">Feature</th>
        <th style="padding: 12px; text-align: left; border: 1px solid #e5e7eb;">Free</th>
        <th style="padding: 12px; text-align: left; border: 1px solid #e5e7eb;">Premium</th>
    </tr>
    <tr>
        <td style="padding: 12px; border: 1px solid #e5e7eb;">Feature Name</td>
        <td style="padding: 12px; border: 1px solid #e5e7eb;">-</td>
        <td style="padding: 12px; border: 1px solid #e5e7eb; color: #10B981;">✓</td>
    </tr>
</table>
```

---

## Personalization Tokens (Variables)

### User-Level
```
{{firstName}}           # John
{{lastName}}            # Doe
{{userEmail}}           # john@example.com
{{signupDate}}          # June 2024
{{currentTier}}         # free / premium
```

### App-Level
```
{{appName}}             # LanguageLens
{{appSlug}}             # language-lens
{{userCount}}           # 200K+
{{communityCount}}      # 50K+
{{premiumCount}}        # 25K+
```

### Progress/Stats (app-specific)
```
{{workoutsCompleted}}   # FitCoach
{{caloriesBurned}}      # FitCoach
{{streakDays}}          # FitCoach / StudyMate
{{progressPercent}}     # Any app with goals
{{hoursStudied}}        # StudyMate
{{itemsRemaining}}      # Any app with checklists
```

### Links
```
{{ctaUrl}}              # Primary CTA destination
{{learnMoreUrl}}        # Learn more link
{{supportUrl}}          # Support/contact link
{{preferencesUrl}}      # Email preferences
{{unsubscribeUrl}}      # Unsubscribe (required)
{{continueUrl}}         # Continue/re-engagement link
{{upgradeUrl}}          # Upgrade to premium
```

### Media
```
{{logoUrl}}             # App logo (100x100px recommended)
{{heroImageUrl}}        # Hero image (600x400px recommended)
{{featureImageUrl}}     # Feature showcase images
{{testimonialImageUrl}} # User photo
```

### Time-Based
```
{{currentMonth}}        # June
{{weekStart}}           # June 2, 2026
{{weekEnd}}             # June 8, 2026
{{expiryDate}}          # When offer expires
{{nextSessionDate}}     # Next event/session date
```

---

## Color Schemes by App

Each app uses a specific color palette (from JSON configs):

| App | Primary | Accent | Usage |
|---|---|---|---|
| LanguageLens | #6366F1 | #818CF8 | Headers, CTAs, accents |
| SpellingBuddy | #EC4899 | #F472B6 | Headers, CTAs, accents |
| StudyMate | #10B981 | #34D399 | Headers, CTAs, accents |
| FitCoach Pro | #F59E0B | #FBBF24 | Headers, CTAs, accents |
| NutriAI | #06B6D4 | #22D3EE | Headers, CTAs, accents |
| CodeMentor | #8B5CF6 | #A78BFA | Headers, CTAs, accents |
| StoryStudio | #EF4444 | #F87171 | Headers, CTAs, accents |
| VoiceJournal | #06B6D4 | #22D3EE | Headers, CTAs, accents |
| SmartGrocery | #10B981 | #34D399 | Headers, CTAs, accents |
| MeetingMind | #3B82F6 | #60A5FA | Headers, CTAs, accents |

**Template Swap:** To customize a template for a different app, replace the primary color throughout:

```css
/* Before (LanguageLens) */
.header { background: linear-gradient(135deg, #6366F1 0%, #818CF8 100%); }
.cta-button { background-color: #6366F1; }

/* After (SpellingBuddy) */
.header { background: linear-gradient(135deg, #EC4899 0%, #F472B6 100%); }
.cta-button { background-color: #EC4899; }
```

---

## Testing Checklist

Before deploying any template:

- [ ] **Rendering:** Test in Gmail, Outlook, Apple Mail, Yahoo Mail
- [ ] **Mobile:** Test on iPhone 13/14 and Android devices
- [ ] **Dark Mode:** Verify readability in dark mode (email clients)
- [ ] **Images:** Confirm all `{{imageUrl}}` placeholders will load
- [ ] **Links:** Test all CTAs and footer links work
- [ ] **Personalization:** Verify merge field syntax for your ESP
- [ ] **Spam Score:** Run through Mailchimp spam checker
- [ ] **Alt Text:** Ensure all images have alt text
- [ ] **Contrast:** Confirm text/button colors meet WCAG AA standards
- [ ] **File Size:** Keep under 100KB (including images)
- [ ] **Unsubscribe:** Confirm unsubscribe link is functional
- [ ] **Mobile Width:** Verify layout at 320px, 480px, 600px widths

---

## Common Customizations

### Change Button Color

```css
/* Replace #6366F1 with your brand color */
.cta-button {
    background-color: #EC4899; /* New color */
    transition: background-color 0.3s ease;
}
.cta-button:hover {
    background-color: #F472B6; /* Lighter shade on hover */
}
```

### Add Social Links

```html
<div class="social-links" style="margin: 15px 0; text-align: center;">
    <a href="https://twitter.com/yourhandle" style="display: inline-block; width: 36px; height: 36px; background: #e5e7eb; border-radius: 50%; text-align: center; line-height: 36px; margin: 0 5px; text-decoration: none; color: #6366F1;">f</a>
    <a href="https://instagram.com/yourhandle" style="display: inline-block; width: 36px; height: 36px; background: #e5e7eb; border-radius: 50%; text-align: center; line-height: 36px; margin: 0 5px; text-decoration: none; color: #6366F1;">📷</a>
</div>
```

### Create Featured Content Box

```html
<div style="background: linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%); border: 2px solid #6366F1; border-radius: 8px; padding: 25px; margin: 20px 0;">
    <h2 style="color: #6366F1; font-size: 18px; margin-bottom: 15px;">Featured: [Title]</h2>
    <p style="color: #4b5563; font-size: 14px; margin-bottom: 15px;">
        Description of the featured content...
    </p>
    <a href="{{ctaUrl}}" style="display: inline-block; background-color: #6366F1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-size: 13px;">Learn More →</a>
</div>
```

### Add Progress/Progress Bar

```html
<div style="margin: 20px 0;">
    <p style="font-size: 13px; color: #6b7280; margin-bottom: 8px;">Goal Progress: {{progressPercent}}%</p>
    <div style="background-color: #e5e7eb; height: 8px; border-radius: 4px; overflow: hidden;">
        <div style="background-color: #10B981; height: 100%; width: {{progressPercent}}%;"></div>
    </div>
</div>
```

---

## Typography Recommendations

### Font Stack (Safe for all ESPs)
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
```

### Font Sizes
- **H1 (Main title):** 32px desktop, 24px mobile
- **H2/H3 (Section headers):** 18-20px
- **Body copy:** 14-16px
- **Small text (footer, labels):** 12-13px

### Line Heights
- **Body copy:** 1.6-1.8 (easier to read in email)
- **Headings:** 1.2 (tighter spacing)
- **Labels/small text:** 1.4

---

## Accessibility Best Practices

1. **Color Contrast:** Text should have 4.5:1 contrast ratio (WCAG AA)
   - Light text on dark: Good
   - Dark text on light: Good
   - Never rely on color alone to convey info

2. **Alt Text on Images:**
   ```html
   <img src="..." alt="A brief, descriptive text of what the image shows">
   ```

3. **Link Text:** Avoid "click here", use descriptive text
   ```html
   <!-- Bad -->
   <a href="...">Click here</a> to learn more

   <!-- Good -->
   <a href="...">Learn more about LanguageLens</a>
   ```

4. **Heading Hierarchy:** Use H1 for main title, H2/H3 for sections (not for styling)

5. **Lists:** Use actual `<ul>` or `<ol>`, not bullet characters in text

---

## Common Pitfalls & Fixes

| Problem | Cause | Fix |
|---|---|---|
| Images don't show | Image URL is broken | Test {{imageUrl}} links in browser |
| Button text wraps | Button padding too small | Increase padding or use shorter text |
| Email looks broken on mobile | No responsive CSS | Add `@media (max-width: 600px)` styles |
| Personalization doesn't work | Wrong merge field syntax | Check your ESP's token format ({{}} vs *\|\|*) |
| Colors look wrong in Outlook | No fallback colors | Use hex codes, avoid gradients in Outlook |
| Links are underlined | No `text-decoration: none` | Add style to all `<a>` tags |
| Footer gets cut off | Unsubscribe link not accessible | Always include and test unsubscribe link |
| Rendering issues in Yahoo | Complex CSS not supported | Stick to basic CSS, test in Litmus/Email on Acid |

---

## Template Export & Import

### For Mailchimp
1. Go to **Campaigns → Templates**
2. Click **Create Template → Code your own**
3. Paste entire HTML (including `<html>`, `<head>`, `<body>`)
4. Save and give it a name: `language-lens-onboarding-1`
5. Use in campaigns via **Design → Import Template**

### For ConvertKit
1. Go to **Broadcasts → Create new broadcast**
2. Click **HTML** tab (switch from visual editor)
3. Paste template HTML
4. Click **Preview** to test
5. Replace ConvertKit merge fields: `<% subscriber.first_name %>` (instead of {{firstName}})

### For HubSpot
1. Go to **Content → Email templates**
2. Create **New template**
3. Choose **Design Manager** or **Drag & Drop**
4. For code-based: Use **HTML** module, paste entire template
5. Set email properties (subject, from name, etc.)

---

## Version Control

Store templates in Git:

```bash
# Structure
email-templates/
├── language-lens-onboarding-1.html
├── language-lens-onboarding-2.html
├── ... (all 120+ templates)

# Before updating:
git add email-templates/
git commit -m "Update language-lens-onboarding-1 subject line"
git push origin main
```

---

## Questions?

Refer to:
- **ESP Docs:** Mailchimp (merge fields), ConvertKit (liquid), HubSpot (variables)
- **Email Standards:** [Email Geek Group](https://www.emailgeeks.org/)
- **Testing Tools:** [Mailmodo](https://mailmodo.com/), [Stripo](https://stripo.email/), [Dyspatch](https://dyspatch.io/)
- **Template Resources:** [MJML](https://mjml.io/) (responsive email markup language)

---

**Last Updated:** June 2026
**Templates Included:** 30+ production-ready HTML templates
**Apps Covered:** 10 (LanguageLens, SpellingBuddy, StudyMate, FitCoach Pro, NutriAI, CodeMentor, StoryStudio, VoiceJournal, SmartGrocery, MeetingMind)
