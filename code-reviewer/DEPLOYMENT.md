# Deployment Guide - Code Reviewer

Deploy the Code Reviewer to Vercel in 5 minutes.

## Prerequisites

1. **Vercel Account**: Create one at https://vercel.com
2. **GitHub Repository**: Push the code to GitHub
3. **API Keys** (optional but recommended):
   - **Claude API Key**: https://console.anthropic.com/
   - **DeepSeek API Key**: https://platform.deepseek.com/

## Option 1: Deploy from GitHub (Recommended)

### Step 1: Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/code-reviewer.git
git push -u origin main
```

### Step 2: Import on Vercel Dashboard
1. Go to https://vercel.com/new
2. Select "Import Git Repository"
3. Paste: `https://github.com/YOUR_USERNAME/code-reviewer`
4. Click "Import"

### Step 3: Configure Environment Variables
On the Vercel import screen, add:

| Variable | Value |
|----------|-------|
| `ANTHROPIC_API_KEY` | Your Claude API key (get from https://console.anthropic.com/) |
| `DEEPSEEK_API_KEY` | Your DeepSeek API key (get from https://platform.deepseek.com/) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | (Optional) Stripe publishable key |
| `STRIPE_SECRET_KEY` | (Optional) Stripe secret key |

### Step 4: Deploy
Click "Deploy" and wait ~2-3 minutes.

✅ Your app will be live at: `https://code-reviewer-xxx.vercel.app`

---

## Option 2: Deploy via Vercel CLI

### Step 1: Link Project
```bash
cd code-reviewer
vercel link
```

### Step 2: Add Environment Variables
```bash
vercel env add ANTHROPIC_API_KEY
vercel env add DEEPSEEK_API_KEY
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY  # optional
vercel env add STRIPE_SECRET_KEY                    # optional
```

### Step 3: Deploy to Production
```bash
vercel --prod
```

✅ Your app will be live at the URL shown in the output.

---

## Option 3: Manual Deployment

### Step 1: Build Locally
```bash
npm run build
```

### Step 2: Deploy with Vercel CLI
```bash
vercel --prod --env ANTHROPIC_API_KEY=xxx --env DEEPSEEK_API_KEY=xxx
```

---

## Post-Deployment

### Verify Deployment
```bash
# Check deployment status
vercel ls

# View logs
vercel logs
```

### Add Custom Domain
1. Go to Vercel Project Settings
2. Click "Domains"
3. Add your domain (e.g., `code-reviewer.example.com`)
4. Update DNS records as shown

### Set Up GitHub Deployments
- Automatic deploys on `main` push
- Preview deployments on pull requests
- All configured in Vercel dashboard

---

## Troubleshooting

### "API Key not found"
Make sure environment variables are set in Vercel Dashboard:
1. Go to Project Settings → Environment Variables
2. Add missing keys

### "Build failed"
```bash
# Check Next.js build locally
npm run build

# Check for TypeScript errors
npm run lint
```

### "Deployment stuck"
```bash
# Redeploy
vercel --prod --force
```

---

## Cost Estimates

| Service | Cost per Review | Monthly (1000 reviews) |
|---------|-----------------|------------------------|
| DeepSeek (Free tier) | ~$0.0001 | ~$0.10 |
| Claude (Pro tier) | ~$0.01 | ~$10 |
| **Vercel** | Free (< 100 GB bandwidth) | Free - $25/mo |

---

## Next Steps

1. ✅ Deploy to Vercel
2. Add Stripe integration for payments
3. Set up custom domain
4. Configure monitoring & error tracking (Sentry)
5. Add analytics (Vercel Analytics)

## Support

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Issues: Create a GitHub issue
