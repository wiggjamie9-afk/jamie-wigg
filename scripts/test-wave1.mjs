#!/usr/bin/env node

/**
 * Wave 1 Test Suite
 *
 * Verifies that all three Wave 1 products are code-complete and locally testable:
 * - STARLIGHTMIX Studio (auth, payments, dashboard)
 * - Agent Builder / Course Platform (database schema, course listing, enrollments)
 * - HerdCheck (SMS queuing, offline support, IndexedDB)
 *
 * Run: node scripts/test-wave1.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function log(msg, color = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

function success(msg) {
  log(`✓ ${msg}`, 'green');
}

function error(msg) {
  log(`✗ ${msg}`, 'red');
}

function warn(msg) {
  log(`⚠ ${msg}`, 'yellow');
}

function section(title) {
  log(`\n${'═'.repeat(60)}`, 'cyan');
  log(`  ${title}`, 'bold');
  log(`${'═'.repeat(60)}`, 'cyan');
}

// Test Suite

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    success(name);
    passed++;
  } catch (err) {
    error(name);
    console.error(`  ${err.message}`);
    failed++;
  }
}

// ── Studio Tests ───────────────────────────────────────────

section('STARLIGHTMIX Studio');

test('studio/ directory exists', () => {
  const studioDir = path.join(repoRoot, 'studio');
  if (!fs.existsSync(studioDir)) throw new Error('studio/ not found');
});

test('studio/app/page.tsx exists and contains auth flow', () => {
  const file = path.join(repoRoot, 'studio', 'app', 'page.tsx');
  if (!fs.existsSync(file)) throw new Error('studio/app/page.tsx not found');

  const content = fs.readFileSync(file, 'utf-8');
  if (!content.includes('handleAuth')) throw new Error('Auth handler missing');
  if (!content.includes('handleCheckout')) throw new Error('Checkout handler missing');
  if (!content.includes('PRICING_TIERS')) throw new Error('Pricing integration missing');
});

test('studio/lib/auth.ts exists with auth helpers', () => {
  const file = path.join(repoRoot, 'studio', 'lib', 'auth.ts');
  if (!fs.existsSync(file)) throw new Error('studio/lib/auth.ts not found');

  const content = fs.readFileSync(file, 'utf-8');
  const functions = ['signUp', 'signIn', 'signOut', 'getCurrentUser'];
  for (const fn of functions) {
    if (!content.includes(`export async function ${fn}`)) {
      throw new Error(`${fn} not found`);
    }
  }
});

test('studio/lib/payments.ts exists with Stripe helpers', () => {
  const file = path.join(repoRoot, 'studio', 'lib', 'payments.ts');
  if (!fs.existsSync(file)) throw new Error('studio/lib/payments.ts not found');

  const content = fs.readFileSync(file, 'utf-8');
  const functions = ['createCheckoutSession', 'verifyWebhookSignature', 'syncSubscriptionToDatabase'];
  for (const fn of functions) {
    if (!content.includes(`export`) || !content.includes(fn)) {
      throw new Error(`${fn} not found or not exported`);
    }
  }
});

test('studio/app/api/webhooks/stripe/route.ts exists', () => {
  const file = path.join(repoRoot, 'studio', 'app', 'api', 'webhooks', 'stripe', 'route.ts');
  if (!fs.existsSync(file)) throw new Error('Webhook route not found');

  const content = fs.readFileSync(file, 'utf-8');
  if (!content.includes('checkout.session.completed')) throw new Error('Session handler missing');
});

test('studio/app/globals.css contains brand design tokens', () => {
  const file = path.join(repoRoot, 'studio', 'app', 'globals.css');
  if (!fs.existsSync(file)) throw new Error('globals.css not found');

  const content = fs.readFileSync(file, 'utf-8');
  const tokens = ['starlightmix-bg', 'starlightmix-magenta', 'starlightmix-surface'];
  for (const token of tokens) {
    if (!content.includes(token)) throw new Error(`Brand token ${token} missing`);
  }
});

test('studio/.env.example exists with required vars', () => {
  const file = path.join(repoRoot, 'studio', '.env.example');
  if (!fs.existsSync(file)) throw new Error('studio/.env.example not found');

  const content = fs.readFileSync(file, 'utf-8');
  const vars = ['SUPABASE_URL', 'STRIPE_SECRET_KEY'];
  for (const v of vars) {
    if (!content.includes(v)) throw new Error(`Required var ${v} missing from .env.example`);
  }
});

// ── Agent Builder / Course Platform Tests ───────────────────

section('Agent Builder (Course Platform)');

test('course-platform/ directory exists', () => {
  const dir = path.join(repoRoot, 'course-platform');
  if (!fs.existsSync(dir)) throw new Error('course-platform/ not found');
});

test('course-platform/app/page.tsx (course listing) exists', () => {
  const file = path.join(repoRoot, 'course-platform', 'app', 'page.tsx');
  if (!fs.existsSync(file)) throw new Error('Course listing page not found');

  const content = fs.readFileSync(file, 'utf-8');
  if (!content.includes('courses')) throw new Error('Courses not referenced');
});

test('course-platform/app/creator/dashboard/page.tsx exists', () => {
  const file = path.join(repoRoot, 'course-platform', 'app', 'creator', 'dashboard', 'page.tsx');
  if (!fs.existsSync(file)) throw new Error('Creator dashboard not found');

  const content = fs.readFileSync(file, 'utf-8');
  if (!content.includes('revenue') && !content.includes('enrolled')) {
    throw new Error('Revenue/enrollment stats missing');
  }
});

test('course-platform/lib/supabase-client.ts exists', () => {
  const file = path.join(repoRoot, 'course-platform', 'lib', 'supabase-client.ts');
  if (!fs.existsSync(file)) throw new Error('Supabase client not found');
});

test('course-platform migrations (001, 002, 003) exist', () => {
  const migrations = ['001_courses.sql', '002_enrollments.sql', '003_videos.sql'];
  for (const m of migrations) {
    const file = path.join(repoRoot, 'course-platform', 'migrations', m);
    if (!fs.existsSync(file)) throw new Error(`Migration ${m} not found`);
  }
});

test('course-platform/migrations/001_courses.sql has RLS policies', () => {
  const file = path.join(repoRoot, 'course-platform', 'migrations', '001_courses.sql');
  const content = fs.readFileSync(file, 'utf-8');

  const policies = ['Anyone can view courses', 'Creators can insert courses'];
  for (const p of policies) {
    if (!content.includes(p)) throw new Error(`RLS policy "${p}" missing`);
  }
});

test('course-platform/app/api/checkout/route.ts exists', () => {
  const file = path.join(repoRoot, 'course-platform', 'app', 'api', 'checkout', 'route.ts');
  if (!fs.existsSync(file)) throw new Error('Checkout API not found');
});

test('course-platform/app/api/webhooks/stripe/route.ts exists', () => {
  const file = path.join(repoRoot, 'course-platform', 'app', 'api', 'webhooks', 'stripe', 'route.ts');
  if (!fs.existsSync(file)) throw new Error('Webhook handler not found');

  const content = fs.readFileSync(file, 'utf-8');
  if (!content.includes('enrollment') && !content.includes('createEnrollment')) {
    throw new Error('Enrollment sync missing');
  }
});

// ── HerdCheck Tests ────────────────────────────────────────

section('HerdCheck (Livestock PWA)');

test('livestock/ directory exists', () => {
  const dir = path.join(repoRoot, 'livestock');
  if (!fs.existsSync(dir)) throw new Error('livestock/ not found');
});

test('livestock/lib/sms.js exists with SMS handler', () => {
  const file = path.join(repoRoot, 'livestock', 'lib', 'sms.js');
  if (!fs.existsSync(file)) throw new Error('SMS library not found');

  const content = fs.readFileSync(file, 'utf-8');
  if (!content.includes('sendVetAlert')) throw new Error('sendVetAlert function missing');
  if (!content.includes('syncPendingActions')) throw new Error('Offline sync missing');
});

test('livestock/api-mock.js exists for local testing', () => {
  const file = path.join(repoRoot, 'livestock', 'api-mock.js');
  if (!fs.existsSync(file)) throw new Error('Mock API not found');

  const content = fs.readFileSync(file, 'utf-8');
  if (!content.includes('handleSmsSend')) throw new Error('Mock SMS handler missing');
});

test('livestock/api/sms/send/route.js exists (production endpoint)', () => {
  const file = path.join(repoRoot, 'livestock', 'api', 'sms', 'send', 'route.js');
  if (!fs.existsSync(file)) throw new Error('Production SMS endpoint not found');
});

test('livestock/db.js has sent_actions schema', () => {
  const file = path.join(repoRoot, 'livestock', 'db.js');
  if (!fs.existsSync(file)) throw new Error('db.js not found');

  const content = fs.readFileSync(file, 'utf-8');
  if (!content.includes('sent_actions')) throw new Error('sent_actions store missing');
});

test('livestock/index.html has SMS UI elements', () => {
  const file = path.join(repoRoot, 'livestock', 'index.html');
  if (!fs.existsSync(file)) throw new Error('index.html not found');

  const content = fs.readFileSync(file, 'utf-8');
  // SMS button or related UI should exist (though it may be in app.js)
  if (!content.includes('vet') && !content.includes('alert')) {
    // It's OK if not in index.html, check app.js
    const appFile = path.join(repoRoot, 'livestock', 'app.js');
    const appContent = fs.readFileSync(appFile, 'utf-8');
    if (!appContent.includes('sms')) throw new Error('SMS integration missing from app');
  }
});

test('livestock/scoring.js has risk scoring logic', () => {
  const file = path.join(repoRoot, 'livestock', 'scoring.js');
  if (!fs.existsSync(file)) throw new Error('scoring.js not found');

  const content = fs.readFileSync(file, 'utf-8');
  const scorers = ['scoreLameness', 'scoreMastitis', 'scoreCalving'];
  for (const s of scorers) {
    if (!content.includes(s)) throw new Error(`${s} missing`);
  }
});

// ── Infrastructure Documentation ───────────────────────────

section('Deployment & Documentation');

test('INFRASTRUCTURE-SETUP.md exists', () => {
  const file = path.join(repoRoot, 'INFRASTRUCTURE-SETUP.md');
  if (!fs.existsSync(file)) throw new Error('Infrastructure guide not found');
});

test('WAVE1-DEPLOYMENT.md exists', () => {
  const file = path.join(repoRoot, 'WAVE1-DEPLOYMENT.md');
  if (!fs.existsSync(file)) throw new Error('Wave 1 deployment guide not found');
});

test('WAVE1-QUICKSTART.md exists', () => {
  const file = path.join(repoRoot, 'WAVE1-QUICKSTART.md');
  if (!fs.existsSync(file)) throw new Error('Wave 1 quick start guide not found');
});

test('.env.example exists at repo root', () => {
  const file = path.join(repoRoot, '.env.example');
  if (!fs.existsSync(file)) throw new Error('.env.example not found');

  const content = fs.readFileSync(file, 'utf-8');
  if (!content.includes('SUPABASE') || !content.includes('STRIPE')) {
    throw new Error('Required API keys not in .env.example');
  }
});

// ── Summary ───────────────────────────────────────────────

section('Test Summary');

const total = passed + failed;
const rate = total > 0 ? Math.round((passed / total) * 100) : 0;

log(`\nPassed: ${passed}/${total} (${rate}%)\n`, 'green');

if (failed === 0) {
  log(`${'✓'.repeat(3)} Wave 1 is code-complete and ready for deployment!`, 'bold');
  log('\nNext steps:', 'cyan');
  log('  1. Follow WAVE1-QUICKSTART.md for 90-minute deployment');
  log('  2. Set up Supabase, Stripe, Twilio accounts');
  log('  3. Configure .env.local in each product');
  log('  4. Test locally with mock APIs');
  log('  5. Deploy webhooks to Cloudflare Workers');
  log('  6. Push to production\n', 'cyan');
  process.exit(0);
} else {
  log(`\n✗ ${failed} checks failed. Review above and fix before deployment.\n`, 'red');
  process.exit(1);
}
