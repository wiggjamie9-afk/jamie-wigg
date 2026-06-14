# Deployment Guide — 38 AI Buddy Apps

Everything you need to deploy the 38 buddy apps to production.

## Quick Deployment Options

### Option 1: GitHub Pages (Easiest)

```bash
# 1. Push to main branch
git checkout main
git merge claude/session-01wjfhumnnmaa9p8eyjmhzsfw-006tP
git push origin main

# 2. GitHub Pages auto-deploys
# Your site is live at: https://yourgithub.com/jamie-wigg/apps/
```

Files served:
- `apps/index.html` — Landing page
- `apps/buddies.html` — Launcher hub
- `apps/buddy-{1..38}.html` — All 38 apps
- `apps/buddy-personalities.js` — Personality library
- `apps/sw.js` — Service Worker
- `apps/manifest.webmanifest` — PWA manifest
- `apps/BUDDIES-README.md` — Setup guide

**Important:** Avatar generation still requires the local proxy on your Mac.

### Option 2: Vercel (Recommended for Performance)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
cd jamie-wigg
vercel

# Follow prompts:
#   - Framework: Other
#   - Output directory: .
#   - Include source files for Edge Functions: No

# Your site is live at: https://jamie-wigg.vercel.app
```

**Vercel Benefits:**
- Fast global CDN
- Auto HTTPS
- Automatic deployments on git push
- Analytics included

### Option 3: Netlify (Also Great)

```bash
# 1. Connect your GitHub repo
# Visit: https://app.netlify.com/signup

# 2. Configure:
#   - Base directory: (empty)
#   - Build command: (empty)
#   - Publish directory: .

# 3. Deploy
# Netlify auto-deploys on every push to main

# Your site is live at: https://your-site.netlify.app
```

### Option 4: Self-Hosted (Docker + Caddy)

```bash
# 1. Create Dockerfile
cat > Dockerfile << 'DOCKERFILE'
FROM nginx:alpine
COPY apps/ /usr/share/nginx/html/apps/
COPY . /usr/share/nginx/html/
EXPOSE 80
DOCKERFILE

# 2. Build and run
docker build -t buddy-apps .
docker run -p 80:80 buddy-apps

# Your site is live at: http://localhost
```

### Option 5: Traditional Server (Apache/Nginx)

```bash
# 1. SSH into your server
ssh user@yourdomain.com

# 2. Clone the repo
git clone https://github.com/yourgithub/jamie-wigg.git
cd jamie-wigg

# 3. Point your web server to /apps/
# Apache: DocumentRoot /path/to/jamie-wigg/apps
# Nginx: root /path/to/jamie-wigg/apps;

# 4. Restart web server
sudo systemctl restart apache2  # or nginx
```

## Pre-Deployment Checklist

- [ ] All 38 buddy apps tested locally (`python3 -m http.server 8000`)
- [ ] Claude API key works (test in Settings tab)
- [ ] ElevenLabs key optional but recommended (test voice synthesis)
- [ ] Higgsfield proxy ready for avatar generation (proxy still needs to run on your Mac)
- [ ] Service Worker registered (check browser DevTools → Application → Service Workers)
- [ ] Offline mode tested: disable internet, verify chat/notes still work
- [ ] Landing page loads (index.html)
- [ ] Launcher hub loads (buddies.html)
- [ ] At least one buddy app tested (buddy-2.html recommended)
- [ ] Mobile responsive check (iPhone + Android simulation)

## Post-Deployment Testing

Once deployed, test everything:

```bash
# 1. Visit landing page
https://yourdomain.com/apps/index.html

# 2. Visit launcher hub
https://yourdomain.com/apps/buddies.html

# 3. Open a buddy app
https://yourdomain.com/apps/buddy-29.html  # Dating & Romance Coach

# 4. Test features on phone:
# - Settings: paste Claude API key
# - Chat: send a message to your buddy
# - Health: measure heart rate (requires camera)
# - Avatar: generate a face (requires proxy on Mac)
# - Offline: airplane mode, verify chat still works

# 5. PWA installation
# iPhone Safari: Share → Add to Home Screen
# Android Chrome: Menu → Install app

# 6. Check performance
# DevTools → Lighthouse → Performance score (aim for 90+)
```

## Monitoring & Analytics

The apps use zero tracking/analytics by design. To add monitoring:

### Option A: Sentry (Error Tracking)

```html
<!-- Add to buddy-app-template.html -->
<script>
  import * as Sentry from "https://browser.sentry-cdn.com/7.91.0/bundle.min.js";
  Sentry.init({
    dsn: "https://your-sentry-dsn@sentry.io/your-project-id",
    environment: "production",
  });
</script>
```

### Option B: Plausible Analytics (Privacy-Friendly)

```html
<!-- Add to index.html / buddies.html -->
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

No cookies, no tracking, just aggregate stats.

## Customization Before Deployment

### 1. Update Landing Page (index.html)

Replace with your own branding:
- Title: `38 AI Buddy Apps` → your app name
- Description: customize tagline
- Colors: update gradient colors (`#8b5cf6` → your brand color)
- Links: update GitHub links

### 2. Update Buddy App Names

Edit `buddy-personalities.js`:

```javascript
1: {
  name: "My Buddy",  // Change to your app name
  ...
}
```

Then regenerate:

```bash
node generate-apps.mjs
```

### 3. Customize Proxy URL

For production, update default proxy URL in `buddy-app-template.html`:

```javascript
state.proxyUrl = 'https://your-proxy-url.com:3001'  // Change from localhost
```

If deploying the proxy to production (advanced):

1. Deploy `avatar-proxy-local.mjs` to a server (Node.js hosting like Heroku, Railway, Render)
2. Update apps to use that proxy URL
3. Set `HIGGSFIELD_API_KEY` and `HIGGSFIELD_SECRET` as environment variables on the server

## Troubleshooting

### Apps Load but Chat Doesn't Work

**Problem:** "Error: Missing Claude API key"

**Solution:**
1. Click Settings tab
2. Paste your Claude API key (get from https://console.anthropic.com)
3. Click Save

### Avatar Generation Fails

**Problem:** "Error: Connection refused" or "Cannot reach proxy"

**Solution:**
1. Ensure proxy is running: `node avatar-proxy-local.mjs`
2. Check proxy is listening on `http://localhost:3001`
3. In Settings tab, verify proxy URL is correct
4. If on phone, proxy URL must be your Mac's IP: `http://192.168.1.100:3001`

### Service Worker Not Registering

**Problem:** Offline mode doesn't work

**Solution:**
1. Check DevTools → Application → Service Workers
2. Verify `sw.js` is accessible (browser can load it)
3. HTTPS requirement: Service Workers only work on HTTPS (except localhost)
4. If self-hosted, ensure HTTPS certificate is valid

### Mobile App Installation Doesn't Work

**Problem:** "Add to Home Screen" not available

**Solution:**
1. Ensure HTTPS is enabled (required for PWA)
2. Check `manifest.webmanifest` is linked in HTML
3. Verify theme colors are set
4. Test on native browser (Safari on iOS, Chrome on Android)

## Performance Optimization

### Reduce App Bundle Size

All 38 apps are ~300KB each (HTML + embedded CSS + JS). To optimize:

1. **Minify HTML/CSS/JS:**

```bash
npm install -g html-minifier-terser
html-minifier-terser apps/buddy-*.html --output apps/buddy-%.html
```

2. **Compress with Gzip:**

Most hosting (Vercel, Netlify) auto-gzips. If self-hosted:

```bash
# Nginx: add to nginx.conf
gzip on;
gzip_types text/html text/css application/javascript;

# Apache: enable mod_deflate
a2enmod deflate
```

3. **Cache Busting:**

The Service Worker already handles caching intelligently. No changes needed.

### Monitor Performance

Use Lighthouse:

```bash
# Chrome: DevTools → Lighthouse
# Or: https://web.dev/measure/
```

Target scores:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 90+

## Domain & HTTPS

### Buy a Domain

Any registrar (Namecheap, GoDaddy, Route53):

```bash
# Example: buddies.app
# Point A record to your hosting IP (or CNAME to GitHub Pages)
```

### HTTPS Certificate

Auto-provisioned by:
- GitHub Pages ✅ (automatic)
- Vercel ✅ (automatic)
- Netlify ✅ (automatic)
- Self-hosted: use Let's Encrypt (free)

```bash
# Self-hosted with Certbot
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d yourdomain.com
```

## Going Live Checklist

- [ ] All 38 apps deployed
- [ ] Landing page live and beautiful
- [ ] Domain pointed to hosting
- [ ] HTTPS certificate valid
- [ ] Service Worker caching working
- [ ] Offline mode tested
- [ ] Mobile PWA installation works
- [ ] Claude API key setup documented
- [ ] Proxy setup documented
- [ ] Performance optimized (Lighthouse 90+)
- [ ] Analytics enabled (optional)
- [ ] Error tracking enabled (optional)

## Support & Maintenance

### Updating Apps

```bash
# 1. Make changes to buddy-personalities.js or template
# 2. Regenerate all 38 apps
node generate-apps.mjs

# 3. Commit and push
git add apps/
git commit -m "Update buddy personalities"
git push origin main

# 4. Hosting auto-deploys (GitHub Pages, Vercel, Netlify)
```

### Monitoring Errors

Check browser console for errors:
- Chrome: F12 → Console tab
- Safari: Develop → Show Error Console
- Firefox: F12 → Console tab

If using Sentry, errors auto-log to dashboard.

### Performance Monitoring

- Vercel: https://vercel.com/dashboard
- Netlify: https://app.netlify.com
- GitHub Pages: No built-in analytics (add Plausible)

## Next Steps

1. **Deploy now:** Pick one option above (GitHub Pages easiest)
2. **Test on phone:** Open your deployed URL, test all 38 apps
3. **Customize:** Update landing page, buddy names, colors
4. **Share:** Send link to friends. No installation needed — PWA works in browser.
5. **Iterate:** Add new buddies, update personalities, monitor usage

Your 38 AI buddies are ready for the world. 🚀

---

**Questions?** See `BUDDIES-README.md` for full feature documentation.
