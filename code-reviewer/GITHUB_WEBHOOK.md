# GitHub Webhook Integration

Automatically review pull requests with AI when they're opened.

## Setup Steps

### 1. Generate GitHub Token

1. Go to https://github.com/settings/tokens/new
2. Create a **Personal Access Token (Classic)**:
   - **Token name**: `code-reviewer-bot`
   - **Expiration**: 90 days
   - **Scopes**: Check `repo` (Full control of private repositories)
3. Copy the token (you won't see it again!)

### 2. Generate Webhook Secret

Create a secure random string for signing webhooks:

```bash
# macOS/Linux
openssl rand -hex 32

# Windows (PowerShell)
[System.Convert]::ToHexString([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(16))
```

Save this secret somewhere safe.

### 3. Deploy to Production

Deploy your Code Reviewer to Vercel first (see `DEPLOYMENT.md`).

### 4. Add Environment Variables to Vercel

In your Vercel project settings, add:

| Variable | Value |
|----------|-------|
| `GITHUB_TOKEN` | Your GitHub token from step 1 |
| `GITHUB_WEBHOOK_SECRET` | Your secret from step 2 |
| `ANTHROPIC_API_KEY` | Claude API key (for better reviews) |

### 5. Configure GitHub Webhook

1. Go to your repository settings: `https://github.com/YOUR_USERNAME/YOUR_REPO/settings/hooks`
2. Click **"Add webhook"**
3. Fill in:
   - **Payload URL**: `https://your-deployed-site.vercel.app/api/webhook/github`
   - **Content type**: `application/json`
   - **Secret**: Paste your webhook secret
   - **Events**: Select "Let me select individual events"
   - Check: **Pull requests**
4. Click **"Add webhook"**

### 6. Test It!

1. Open a test PR on your repo
2. The webhook should automatically review it
3. Check the PR comments for the AI review

## Webhook Events

The webhook listens for `pull_request` events with action `opened`:

```json
{
  "action": "opened",
  "pull_request": {
    "number": 123,
    "title": "Add new feature",
    "diff_url": "..."
  },
  "repository": {
    "full_name": "owner/repo"
  }
}
```

When a PR is opened:
1. ✅ Webhook signature is verified
2. ✅ PR files are fetched from GitHub API
3. ✅ Diffs are compiled and sent to Claude
4. ✅ Review is posted as a comment

## API Endpoint

**POST** `/api/webhook/github`

Headers:
```
X-Hub-Signature-256: sha256=...  (GitHub calculates and sends this)
```

Request body:
```json
{
  "action": "opened",
  "pull_request": {...},
  "repository": {...}
}
```

## Webhook Signature Verification

GitHub signs webhooks with HMAC-SHA256:

```
signature = 'sha256=' + HMAC-SHA256(body, GITHUB_WEBHOOK_SECRET)
```

Our endpoint verifies:
```typescript
crypto.timingSafeEqual(digest, signature)
```

This prevents unauthorized webhook calls.

## Testing Locally

For local testing, you can use ngrok to expose your dev server:

```bash
# Terminal 1: Run dev server
npm run dev

# Terminal 2: Expose with ngrok
ngrok http 3000

# Use ngrok URL in GitHub webhook setup
# https://abc123.ngrok.io/api/webhook/github
```

## Troubleshooting

### Webhook not firing
1. Check GitHub webhook deliveries: Repo Settings → Webhooks → Click webhook → Deliveries
2. Verify `Payload URL` is correct
3. Check deployment logs: `vercel logs`

### "Unauthorized" error
- [ ] `GITHUB_WEBHOOK_SECRET` is set in Vercel
- [ ] Secret matches GitHub webhook settings
- [ ] Webhook signature verification failing

### "Invalid signature" error
- [ ] Secret in Vercel matches GitHub webhook settings
- [ ] Check webhook delivery response in GitHub

### No review comment appearing
- [ ] Check Vercel logs for errors
- [ ] Verify `GITHUB_TOKEN` has `repo` scope
- [ ] Make sure `ANTHROPIC_API_KEY` is set (or it will do basic review)
- [ ] PR must be opened (webhook only triggers on `action: "opened"`)

### Review is slow
- Claude API can take 5-10 seconds
- GitHub will retry if timeout occurs
- Set timeout in `vercel.json` `functions.maxDuration`

## Advanced: Custom Review Format

Edit `app/api/webhook/github/route.ts` to:

```typescript
// Add conditional logic based on PR labels
if (pr.labels.some((l: any) => l.name === 'documentation')) {
  // Different review for docs
}

// Add file-specific reviews
const criticalFiles = prFiles.filter(f => 
  f.filename.includes('api') || f.filename.includes('db')
);

// Mention specific reviewers
body: `@maintainer-handle please review\n\n${review}`
```

## Security Best Practices

1. ✅ Webhook signature verification enabled
2. ✅ GitHub token stored in Vercel secrets (encrypted)
3. ✅ Webhook secret not committed to git
4. ✅ Only `repo` scope (no admin, delete, or personal data access)
5. ✅ HTTPS webhook endpoint (Vercel enforces)

## Cost

- **Per PR review**: ~$0.01 (Claude Sonnet)
- **100 PRs/month**: ~$1
- **GitHub Actions**: $0 (webhook is free)

## Next Steps

- [ ] Set up webhook
- [ ] Deploy to production
- [ ] Open a test PR
- [ ] Verify review appears
- [ ] Add to CI/CD pipeline
- [ ] Customize review template

## References

- GitHub Webhooks: https://docs.github.com/en/developers/webhooks-and-events/webhooks/about-webhooks
- Octokit.js: https://octokit.github.io/rest.js/
- Claude API: https://anthropic.com/docs
