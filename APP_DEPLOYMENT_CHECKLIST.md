# App Deployment & Polish Checklist

## Priority 1: Main Apps (Deploy First)

### 1. EventAI Academy (event-platform/)
- [ ] Verify responsive design (mobile-first)
- [ ] Test carousel/gallery responsiveness
- [ ] Fix any layout issues for iPhone 17
- [ ] Optimize images
- [ ] Test form inputs (email capture)
- [ ] Deploy to Vercel
- [ ] URL: buildtheeventai.com

### 2. STARLIGHTMIX Studio (studio/)
- [ ] Verify responsive design
- [ ] Test file upload on mobile
- [ ] Optimize performance (large app)
- [ ] Test touch interactions
- [ ] Deploy to Cloudflare Pages
- [ ] URL: studio.starlightmix.com

### 3. HerdCheck (livestock/)
- [ ] Test camera functionality on iPhone
- [ ] Verify offline mode (service worker)
- [ ] Test form inputs
- [ ] Optimize images
- [ ] Test carousel for livestock screening
- [ ] Deploy to Vercel
- [ ] URL: herdcheck.vercel.app

### 4. Reset (recovery/)
- [ ] Test all PWA features
- [ ] Verify offline functionality
- [ ] Test form inputs
- [ ] Responsive design check
- [ ] Deploy to Vercel
- [ ] URL: reset.vercel.app

### 5. Roomtone (apps/roomtone/)
- [ ] Test PWA functionality
- [ ] Verify offline
- [ ] Responsive design
- [ ] Deploy to Vercel
- [ ] URL: roomtone.vercel.app

## Priority 2: HTML Apps (If Time)
- [ ] Review all 39 HTML apps in apps/
- [ ] Deploy best 5-10 to Vercel
- [ ] Create launcher page with all apps

## Deployment Checklist (Per App)

For each app:
- [ ] Run build/test locally
- [ ] Check responsive breakpoints
- [ ] Verify mobile touch targets (44px+)
- [ ] Test forms/inputs
- [ ] Optimize images
- [ ] Check performance (Lighthouse)
- [ ] Deploy to Vercel/Cloudflare
- [ ] Test live URL on iPhone 17
- [ ] Document any issues fixed
- [ ] Commit changes

## Live URLs to Create

After deployment, all apps accessible at:
- buildtheeventai.com — EventAI Academy
- studio.starlightmix.com — STARLIGHTMIX Studio
- herdcheck.vercel.app — HerdCheck
- reset.vercel.app — Reset
- roomtone.vercel.app — Roomtone

## Final Check

- [ ] All apps load on iPhone 17
- [ ] All carousels work (swipe/scroll)
- [ ] All forms work (keyboard, input)
- [ ] All buttons are tappable (44px+)
- [ ] No horizontal scroll
- [ ] Safe area respected (notch)
- [ ] Offline features work (PWAs)
- [ ] Performance is smooth (no lag)
- [ ] All images load properly
- [ ] Navigation works on mobile

