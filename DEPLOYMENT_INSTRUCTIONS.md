# Deployment Instructions - Complete Ecosystem

Deploy the PDF Analyzer ecosystem to production: Railway (API) + Vercel (Web).

## Prerequisites

1. **Railway Account**: https://railway.app (free tier available)
2. **Vercel Account**: https://vercel.com (free tier)
3. **GitHub Repository**: Push code to GitHub first
4. **API Keys**:
   - Claude: https://console.anthropic.com/
   - Optional: DeepSeek: https://platform.deepseek.com/

---

## Part 1: Deploy Backend to Railway

### Step 1: Install Railway CLI

```bash
# macOS/Linux
npm install -g @railway/cli

# Windows
choco install railway
# or use npm
npm install -g @railway/cli
```

Verify installation:
```bash
railway --version
```

### Step 2: Login to Railway

```bash
railway login
```

This opens your browser to authenticate. Complete the login and return to terminal.

### Step 3: Create Railway Project

From the `pdf-analyzer-api` directory:

```bash
cd pdf-analyzer-api
railway init
```

Select:
- **New project**: Yes
- **Name**: `pdf-analyzer-api`
- **Region**: Closest to you

### Step 4: Set Environment Variables

```bash
railway variables set ANTHROPIC_API_KEY=sk-ant-...
railway variables set PORT=8000
```

Or add via Railway dashboard:
1. Go to https://railway.app/dashboard
2. Select your project
3. Variables tab
4. Add `ANTHROPIC_API_KEY` and `PORT`

### Step 5: Deploy

```bash
railway up
```

This:
1. Builds your Python project
2. Installs dependencies from `requirements.txt`
3. Runs `python main.py`
4. Gives you a public URL

✅ **Your API is live!** 
- URL: `https://your-project-name.railway.app`
- API Docs: `https://your-project-name.railway.app/docs`

### Verify Deployment

```bash
# Test the API
curl https://your-project-name.railway.app/

# Should return:
# {"status":"healthy","service":"PDF Analyzer API",...}
```

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

Verify:
```bash
vercel --version
```

### Step 2: Login to Vercel

```bash
vercel login
```

This opens your browser. Complete the login.

### Step 3: Configure Environment Variable

In the `pdf-analyzer-web` directory, update `.env.production`:

```bash
cd pdf-analyzer-web
cp .env.example .env.production
```

Edit `.env.production`:
```
NEXT_PUBLIC_API_URL=https://your-railway-api-url.railway.app
```

Replace with your actual Railway URL from Step 1.

### Step 4: Deploy to Vercel

```bash
vercel --prod
```

Follow the prompts:
- **Scope**: Select your account
- **Project**: Create new project `pdf-analyzer-web`
- **Directory**: `.` (current)
- **Build Command**: `next build`
- **Output Directory**: `.next`

### Step 5: Add Production Environment Variable

Option A: Via CLI
```bash
vercel env add NEXT_PUBLIC_API_URL
# Enter: https://your-railway-api-url.railway.app
vercel --prod
```

Option B: Via Dashboard
1. Go to https://vercel.com/dashboard
2. Select `pdf-analyzer-web` project
3. Settings → Environment Variables
4. Add `NEXT_PUBLIC_API_URL` = your Railway URL
5. Redeploy

✅ **Your frontend is live!**
- URL: `https://pdf-analyzer-web-xxx.vercel.app`

### Verify Deployment

Visit: `https://pdf-analyzer-web-xxx.vercel.app`
- Upload a PDF
- Test analysis
- Check that it connects to Railway API

---

## Troubleshooting Deployments

### Railway Issues

**"Port already in use"**
- Railway manages PORT, set in environment variables
- Don't hardcode port in main.py

**"API key not found"**
```bash
railway variables set ANTHROPIC_API_KEY=sk-ant-...
railway up
```

**"Build failed"**
```bash
# Check requirements.txt
cat requirements.txt

# Test locally
python main.py
```

**Logs**
```bash
railway logs
# or via dashboard
```

### Vercel Issues

**"API connection error"**
- Check `NEXT_PUBLIC_API_URL` is set correctly
- Verify Railway API is running
- Check CORS enabled in FastAPI

**"Build failed"**
```bash
# Test locally
npm run build

# Check for TypeScript errors
npm run lint
```

**Hot reload not working**
- Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Clear cache: DevTools → Network → Disable cache → Refresh

---

## Production Checklist

### Backend (Railway)

- [ ] Created Railway account
- [ ] Installed Railway CLI
- [ ] Logged in with `railway login`
- [ ] Set `ANTHROPIC_API_KEY`
- [ ] Deployed with `railway up`
- [ ] Verified API at `/` endpoint
- [ ] Got public Railway URL
- [ ] API Docs working at `/docs`

### Frontend (Vercel)

- [ ] Created Vercel account
- [ ] Installed Vercel CLI
- [ ] Logged in with `vercel login`
- [ ] Set `NEXT_PUBLIC_API_URL` to Railway URL
- [ ] Built with `npm run build`
- [ ] Deployed with `vercel --prod`
- [ ] Got public Vercel URL
- [ ] Frontend loads without errors
- [ ] Can upload and analyze PDFs

### Integration

- [ ] Frontend can reach backend API
- [ ] PDF uploads work
- [ ] Analysis produces results
- [ ] Chat functionality works
- [ ] Text extraction works
- [ ] No CORS errors in console
- [ ] No API key errors in logs

---

## Cost Estimates (Monthly)

| Service | Free Tier | Pro Tier |
|---------|-----------|----------|
| Railway | Free (512 MB RAM) | $5-50+ |
| Vercel | Free (100 GB bandwidth) | $20+ |
| Claude API | — | ~$0.01 per review |
| **Total** | **Free** | **$5-70+** |

---

## Environment Variables Summary

### Railway (Backend)

```
ANTHROPIC_API_KEY=sk-ant-...
PORT=8000
ENV=production
```

### Vercel (Frontend)

```
NEXT_PUBLIC_API_URL=https://your-railway-url.railway.app
```

---

## Updating Deployments

### Update Backend

```bash
# Make changes
cd pdf-analyzer-api
git add .
git commit -m "Update API"

# Deploy
railway up
```

### Update Frontend

```bash
# Make changes
cd pdf-analyzer-web
git add .
git commit -m "Update UI"

# Deploy
vercel --prod
```

---

## DNS & Custom Domain (Optional)

### Railway

1. Railway dashboard → Domain
2. Add custom domain
3. Update DNS records (Railway provides instructions)

### Vercel

1. Vercel dashboard → Settings → Domains
2. Add your domain
3. Update DNS records (Vercel provides instructions)

---

## Monitoring & Logs

### Railway

```bash
# View logs
railway logs

# Follow logs in real-time
railway logs --follow

# Or via dashboard:
# https://railway.app/dashboard → Logs tab
```

### Vercel

- Dashboard: https://vercel.com/dashboard
- Deployments tab: View logs for each deployment
- Functions tab: Monitor serverless functions

---

## Next Steps After Deployment

1. ✅ Test both services
2. ✅ Verify integration works
3. ✅ Set up monitoring (Sentry for errors)
4. ✅ Configure custom domains
5. ✅ Set up CI/CD for auto-deployment
6. ✅ Monitor costs

---

## CI/CD Auto-Deployment

### Railway + GitHub

1. Railway dashboard → Project settings
2. Deployments → GitHub integration
3. Connect repository
4. Select branch to auto-deploy
5. Done! Deploys on every push

### Vercel + GitHub

1. Vercel dashboard → Integration
2. GitHub app → Install
3. Select repository
4. Auto-deploys on push
5. Preview deployments on PRs

---

## Support & Resources

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **Claude API**: https://anthropic.com/docs
- **FastAPI**: https://fastapi.tiangolo.com/deployment/
- **Next.js**: https://nextjs.org/docs/deployment

---

## Quick Reference

```bash
# Railway
railway login
railway init
railway variables set KEY=value
railway up
railway logs

# Vercel
vercel login
vercel --prod
vercel env add KEY value
vercel logs

# Git
git push origin main  # Triggers auto-deploy if configured
```

---

**Deployment time:** ~5-10 minutes per service

**Total cost:** ~$5-70/month (depending on usage)

**Result:** Production-ready PDF analyzer ecosystem! 🚀

