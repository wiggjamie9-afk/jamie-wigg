# GitHub Integration Setup

## GitHub Actions Workflows

Two workflows are configured:

### 1. `test.yml` — Automated Testing
Runs on every push to any branch. Tests:
- ✓ npm dependencies
- ✓ Jest/Vitest test suite
- ✓ TypeScript type checking
- ✓ ESLint linting
- ✓ Agent Builder build

### 2. `deploy-agent-builder.yml` — CI/CD Deployment
Deploys to Cloudflare Pages on push to main:
- Preview deployment on feature branches
- Production deployment on main (requires approval)

---

## GitHub Secrets Required

Set these in **Settings → Secrets and variables → Actions**:

| Secret | Value | Where to get |
|--------|-------|--------------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token | https://dash.cloudflare.com/profile/api-tokens |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Account ID | https://dash.cloudflare.com (bottom left) |
| `GITHUB_TOKEN` | (auto-generated) | GitHub provides this automatically |

### How to get Cloudflare credentials:

1. Go to https://dash.cloudflare.com/profile/api-tokens
2. Click "Create Token"
3. Use "Edit Cloudflare Workers" template
4. Copy token → paste into GitHub Secrets as `CLOUDFLARE_API_TOKEN`
5. Go to https://dash.cloudflare.com, find Account ID (bottom left sidebar)
6. Copy → paste into GitHub as `CLOUDFLARE_ACCOUNT_ID`

---

## Branch Strategy

### Feature branches (`claude/*`)
- Tests run automatically
- Preview deployment to Cloudflare
- No production deployment

### Main branch (`main`)
- Tests run automatically
- **Requires approval** before deploying to production
- Production deployment to Cloudflare Pages

### Protected branches (optional)
Set in **Settings → Branches → Add rule**:
- Require status checks to pass
- Require pull requests
- Require code review approvals

---

## Deployment Targets

### Cloudflare Pages Projects

**Agent Builder**:
- Project: `starlightmix-studio`
- Preview: `https://<branch>.starlightmix-studio.pages.dev`
- Production: `https://studio.starlightmix.com` (via custom domain)

---

## Manual Deployment

If automated deployment fails, deploy manually:

```bash
# Build locally
cd agent-builder
npm run build

# Deploy with Wrangler
npx wrangler pages deploy out \
  --project-name=starlightmix-studio \
  --branch=main

# Or use Cloudflare dashboard:
# 1. Go to Pages → starlightmix-studio
# 2. Click "Deployments"
# 3. Click "Create deployment"
# 4. Select branch & confirm
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "API token invalid" | Regenerate token at https://dash.cloudflare.com/profile/api-tokens |
| "Project not found" | Verify project name in workflow matches Cloudflare |
| "Deployment failed" | Check build logs: Actions tab → workflow run → logs |
| "Tests failing" | Run `npm test` locally, fix issues, push again |

---

## Next Steps on iMac

1. Fork this repo (if needed)
2. Go to Settings → Secrets and variables → Actions
3. Add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`
4. Push to main → watch deployment in Actions tab

