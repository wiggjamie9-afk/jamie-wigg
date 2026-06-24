import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// Email sequences (day 0, 3, 7, 14)
const emailSequences = [
  {
    day: 0,
    subject: '🚀 Welcome to CreatorOS — Your First Video Awaits',
    template: (name: string, referralCode: string) => `
      <h2>Hey ${name}!</h2>
      <p>You're in. CreatorOS is ready to change how you create content.</p>
      <p><strong>Next 3 steps:</strong></p>
      <ol>
        <li>Pick a tool (Video, Music, Scheduler, or Images)</li>
        <li>Generate your first piece of content</li>
        <li>Share it with your audience</li>
      </ol>
      <p style="margin-top: 30px; padding: 20px; background: #f0f0f0; border-radius: 8px;">
        <strong>💰 Earn $10 Per Friend</strong><br/>
        Your referral link: <code>https://creatorOS.dev?ref=${referralCode}</code><br/>
        Every friend who joins = $10 in your account
      </p>
      <p><a href="https://creatorOS.dev/dashboard" style="display: inline-block; background: #667eea; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Get Started Now</a></p>
    `,
  },
  {
    day: 3,
    subject: '✨ Your First Video is Ready — See What Others Created',
    template: (name: string) => `
      <h2>Hey ${name}!</h2>
      <p>3 creators have already generated their first videos. Here's what's possible:</p>
      <ul>
        <li>📹 60-second TikTok/Reels ready to post</li>
        <li>🎵 Royalty-free music (zero copyright strikes)</li>
        <li>📊 Auto-posted to 6 platforms simultaneously</li>
      </ul>
      <p><strong>What's stopping you?</strong> Go create something.</p>
      <p><a href="https://creatorOS.dev/dashboard" style="display: inline-block; background: #667eea; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Create Now</a></p>
    `,
  },
  {
    day: 7,
    subject: '💡 Pro Creators Use This — You Might Be Leaving Money on the Table',
    template: (name: string) => `
      <h2>Hey ${name}!</h2>
      <p>Here's what Pro users are doing:</p>
      <ul>
        <li>✅ Generating 10+ pieces of content per week</li>
        <li>✅ Auto-scheduling across 6 platforms</li>
        <li>✅ Tracking analytics & optimization</li>
        <li>✅ Earning $200-500/month from monetization</li>
      </ul>
      <p>Your Free plan is great for testing. But to really scale, you need Pro features.</p>
      <p><a href="https://creatorOS.dev/upgrade" style="display: inline-block; background: #28a745; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Upgrade to Pro ($49/mo)</a></p>
      <p style="margin-top: 20px; font-size: 12px; color: #666;">Not ready yet? No worries. Keep creating free content—we'll follow up in a week.</p>
    `,
  },
  {
    day: 14,
    subject: '🔥 Studio Tier Just Dropped — Team Collaboration + API Access',
    template: (name: string) => `
      <h2>Hey ${name}!</h2>
      <p>You've been with us 2 weeks. Time to level up.</p>
      <p><strong>Studio Tier ($199/mo) includes:</strong></p>
      <ul>
        <li>Unlimited team seats</li>
        <li>Private API (white-label CreatorOS)</li>
        <li>Advanced monetization tools</li>
        <li>Priority support</li>
      </ul>
      <p>Early adopters are building businesses with this. You could be next.</p>
      <p><a href="https://creatorOS.dev/studio" style="display: inline-block; background: #667eea; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Explore Studio</a></p>
    `,
  },
];

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    if (action === 'send-sequences') {
      // Get all users who signed up today (day 0)
      const today = new Date().toISOString().split('T')[0];
      const { data: newUsers } = await supabase
        .from('users')
        .select('id, email, name, referral_code, created_at')
        .gte('created_at', today);

      let sent = 0;
      let failed = 0;

      if (newUsers) {
        for (const user of newUsers) {
          try {
            const sequence = emailSequences[0]; // Day 0 email
            await resend.emails.send({
              from: 'CreatorOS <hello@creatorOS.dev>',
              to: user.email,
              subject: sequence.subject,
              html: sequence.template(user.name || 'Creator', user.referral_code),
            });
            sent++;
          } catch (err) {
            console.error(`Failed to send email to ${user.email}:`, err);
            failed++;
          }
        }
      }

      return NextResponse.json({
        success: true,
        sent,
        failed,
        message: `Sent ${sent} emails, ${failed} failed`,
      });
    }

    if (action === 'send-day-3') {
      // Find users who signed up 3 days ago
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

      const { data: users } = await supabase
        .from('users')
        .select('id, email, name')
        .eq(
          'created_at',
          `>=.${threeDaysAgo}`
        );

      let sent = 0;
      if (users) {
        for (const user of users) {
          await resend.emails.send({
            from: 'CreatorOS <hello@creatorOS.dev>',
            to: user.email,
            subject: emailSequences[1].subject,
            html: emailSequences[1].template(user.name || 'Creator'),
          });
          sent++;
        }
      }

      return NextResponse.json({ success: true, sent });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Email sequence error:', error);
    return NextResponse.json(
      { error: 'Failed to send email sequences' },
      { status: 500 }
    );
  }
}
