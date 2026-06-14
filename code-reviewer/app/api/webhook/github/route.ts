import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import crypto from 'crypto';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

// Verify GitHub webhook signature
function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(digest, signature);
}

export async function POST(req: NextRequest) {
  try {
    // Verify webhook signature
    const payload = await req.text();
    const signature = req.headers.get('x-hub-signature-256');

    if (!WEBHOOK_SECRET || !signature) {
      console.warn('Missing webhook secret or signature');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!verifyWebhookSignature(payload, signature, WEBHOOK_SECRET)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(payload);

    // Only process PR opened events
    if (event.action !== 'opened' || !event.pull_request) {
      return NextResponse.json({ ok: true });
    }

    const pr = event.pull_request;
    const repo = event.repository;

    console.log(`Processing PR #${pr.number} in ${repo.full_name}`);

    // Get the PR diff
    const { data: prFiles } = await octokit.pulls.listFiles({
      owner: repo.owner.login,
      repo: repo.name,
      pull_number: pr.number,
    });

    if (!prFiles || prFiles.length === 0) {
      return NextResponse.json({ ok: true });
    }

    // Compile diffs from changed files
    const diffs = prFiles
      .filter((file) => file.patch) // Only files with actual changes
      .map((file) => `\n### ${file.filename}\n\`\`\`diff\n${file.patch}\n\`\`\``)
      .join('\n');

    if (!diffs) {
      return NextResponse.json({ ok: true });
    }

    // Review the code
    let review: string;
    if (ANTHROPIC_API_KEY) {
      review = await reviewWithClaude(diffs);
    } else {
      review = generateBasicReview(diffs);
    }

    // Post comment to PR
    await octokit.issues.createComment({
      owner: repo.owner.login,
      repo: repo.name,
      issue_number: pr.number,
      body: `**🤖 AI Code Review**\n\n${review}`,
    });

    console.log(`Posted review to PR #${pr.number}`);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Webhook failed' },
      { status: 500 }
    );
  }
}

async function reviewWithClaude(diff: string): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1500,
      messages: [
        {
          role: 'user',
          content: `Review this pull request diff for:
1. **Bugs & Security Issues** - Critical problems that need fixing
2. **Best Practices** - Code style, patterns, and conventions
3. **Performance** - Optimization opportunities
4. **Improvements** - Suggestions for better code

Keep feedback concise and actionable. Format with clear sections.

## Diff

${diff}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

function generateBasicReview(diff: string): string {
  const lines = diff.split('\n');
  const addedLines = lines.filter((l) => l.startsWith('+')).length;
  const removedLines = lines.filter((l) => l.startsWith('-')).length;
  const filesChanged = (diff.match(/### \//g) || []).length;

  return `
**Summary**
- Files changed: ${filesChanged}
- Lines added: ${addedLines}
- Lines removed: ${removedLines}

**Notes**
- Configure \`ANTHROPIC_API_KEY\` to enable detailed AI-powered reviews
- This is an automated basic review showing change statistics
- For detailed feedback, ensure Claude API is configured in your deployment

**Checklist**
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes
- [ ] Code follows project style guide
`;
}
