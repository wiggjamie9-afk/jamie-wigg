import { NextRequest, NextResponse } from 'next/server';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const { code, isPro, language } = await req.json();

    if (!code || !code.trim()) {
      return NextResponse.json(
        { error: 'Code is required' },
        { status: 400 }
      );
    }

    // Route based on code length and pro status
    const useExpensive = code.length > 1000 || isPro;

    let review: string;

    if (useExpensive && ANTHROPIC_API_KEY) {
      // Use Claude for premium/long reviews (best quality)
      review = await reviewWithClaude(code, language);
    } else if (DEEPSEEK_API_KEY) {
      // Use Deepseek for free tier (cheaper, still good)
      review = await reviewWithDeepseek(code, language);
    } else {
      // Fallback to basic analysis if no API keys
      review = generateBasicReview(code, language);
    }

    return NextResponse.json({ review });
  } catch (error) {
    console.error('Review error:', error);
    return NextResponse.json(
      { error: 'Review failed: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}

async function reviewWithClaude(code: string, language: string): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: `You are an expert code reviewer. Review this ${language} code for:
1. Bugs and potential issues
2. Performance problems
3. Code style and best practices
4. Security vulnerabilities
5. Improvements

Keep review concise but thorough. Format with clear sections.

Code:
\`\`\`${language}
${code}
\`\`\``,
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

async function reviewWithDeepseek(code: string, language: string): Promise<string> {
  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'user',
          content: `Quick code review of this ${language} code (focus on critical issues):

\`\`\`${language}
${code}
\`\`\`

Provide concise feedback on bugs, performance, best practices, and improvements.`,
        },
      ],
      max_tokens: 800,
    }),
  });

  if (!response.ok) {
    throw new Error(`DeepSeek API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

function generateBasicReview(code: string, language: string): string {
  const lines = code.split('\n');
  const issues: string[] = [];
  const suggestions: string[] = [];

  // Basic pattern matching
  const hasComments = /\/\/|\/\*|\*\/|#/.test(code);
  const hasConsoleLog = /console\.(log|error|warn|info)/.test(code);
  const hasVarKeyword = /\bvar\s+/.test(code);
  const linesTooLong = lines.filter((l) => l.length > 100).length;

  if (!hasComments) issues.push('Missing comments or documentation');
  if (hasConsoleLog) issues.push('Console.log statements should be removed or use proper logging');
  if (hasVarKeyword) issues.push('Use const/let instead of var');
  if (linesTooLong > 0) issues.push(`${linesTooLong} lines exceed 100 characters`);

  if (suggestions.length === 0) {
    suggestions.push('Add unit tests');
    suggestions.push('Consider adding JSDoc/documentation comments');
  }

  return `Code Review Summary (Basic Analysis - API keys not configured):

Issues Found:
${issues.length > 0 ? issues.map((i) => `- ${i}`).join('\n') : '- No major issues detected'}

Suggestions:
${suggestions.map((s) => `- ${s}`).join('\n')}

Note: For more detailed reviews, configure ANTHROPIC_API_KEY or DEEPSEEK_API_KEY in your environment.`;
}
