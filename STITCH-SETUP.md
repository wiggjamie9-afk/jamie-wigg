# Google Stitch MCP Setup

## Status
⚠️ Google Stitch MCP requires OAuth authentication via browser. Setup steps below.

## What You Need

Google Stitch is Google's AI-powered wireframe generation tool. To use it with Claude Code:

1. **Google Cloud Project** (free tier available)
2. **OAuth 2.0 Credentials** for desktop application
3. **Stitch API enabled** on your Google Cloud project

## Setup Steps (One-Time)

### Step 1: Create Google Cloud Project
```bash
# Visit: https://console.cloud.google.com/
# 1. Click "Create Project" → name it "rhythmix-stitch"
# 2. Go to APIs & Services → Enable APIs
# 3. Search and enable: "Generative AI API" or "Stitch API"
```

### Step 2: Create OAuth Credentials
```bash
# In Google Cloud Console:
# 1. Go to APIs & Services → Credentials
# 2. Click "Create Credentials" → OAuth 2.0 Client ID
# 3. Choose "Desktop application"
# 4. Download as JSON (save locally)
```

### Step 3: Run Stitch Setup
```bash
# In the repo root, run:
npx google-stitch-mcp init --client claude-code --transport http

# This will:
# - Open browser for OAuth login
# - Create local credentials at ~/.stitch-mcp/config
# - Generate MCP configuration
```

### Step 4: Verify Setup
```bash
npx google-stitch-mcp doctor
```

## Alternative: Use Existing Stitch Project

If you have an existing Google Stitch workspace:
1. Get your Project ID from https://stitch.google.com/
2. Set in `.env`:
   ```
   GOOGLE_CLOUD_PROJECT=your-project-id
   ```
3. Run `npx google-stitch-mcp init` to authenticate

## Using Stitch for Wireframes

Once authenticated, Claude can use Stitch MCP to:
- **List projects**: View all Stitch projects
- **Generate screens**: Create wireframes from descriptions
- **View screens**: Browse existing designs
- **Export designs**: Download as HTML/React/Figma

## What Happens Next

Once Stitch is set up:
1. I'll use Google Stitch MCP to generate wireframes for all 13 apps
2. Designs will follow the 8-step Stitch pipeline
3. All wireframes will match cross-platform architecture (Web, iOS, Android, Windows, Mac)
4. Designs become the foundation for the React + TypeScript core build

## Troubleshooting

**"Google Cloud CLI not found"**
- The setup will install gcloud locally if needed

**"Not authenticated"**
- Run: `npx google-stitch-mcp init`
- Complete the browser OAuth flow

**"Could not obtain access token"**
- Credentials may have expired
- Re-run: `npx google-stitch-mcp init --yes`

## Cost

Google Stitch is **free** during beta/preview. Check pricing at https://stitch.google.com/pricing when it goes to production.
