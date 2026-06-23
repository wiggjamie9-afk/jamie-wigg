import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email, name, source } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: 'CreatorOS <onboarding@creatorOS.dev>',
      to: email,
      subject: '🚀 Welcome to CreatorOS - Your AI Creator Platform',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; color: white; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 32px; font-weight: 800;">Welcome to CreatorOS</h1>
          </div>
          <div style="padding: 40px 20px; background: #f8f9ff;">
            <p style="margin: 0 0 20px 0; font-size: 16px;">Hi ${name || 'Creator'},</p>
            <p style="margin: 0 0 20px 0; font-size: 16px; color: #666;">You're on the early access list for CreatorOS—the all-in-one platform for AI-powered content creation, scheduling, and monetization.</p>

            <div style="margin: 30px 0; padding: 20px; background: white; border-left: 4px solid #667eea; border-radius: 4px;">
              <h3 style="margin: 0 0 15px 0; color: #667eea;">What's Coming:</h3>
              <ul style="margin: 0; padding-left: 20px; color: #666;">
                <li style="margin-bottom: 8px;">🎬 AI Video Generator - Create viral videos in 60 seconds</li>
                <li style="margin-bottom: 8px;">🎵 AI Music Generator - Unlimited royalty-free music</li>
                <li style="margin-bottom: 8px;">🖼️ AI Image Generator - Turn ideas into images instantly</li>
                <li style="margin-bottom: 8px;">📅 Social Media Scheduler - Post to 6 platforms at once</li>
              </ul>
            </div>

            <p style="margin: 0 0 20px 0; font-size: 16px; color: #666;">We'll notify you the moment early access opens. In the meantime, check out our tools and see what you can create.</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://creatorOS.dev" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 32px; border-radius: 50px; text-decoration: none; font-weight: 700; font-size: 14px;">Explore CreatorOS</a>
            </div>

            <p style="margin: 30px 0 0 0; font-size: 12px; color: #999; border-top: 1px solid #e0e0e0; padding-top: 20px;">
              You're receiving this because you signed up for CreatorOS early access from ${source || 'our site'}.<br/>
              Questions? Reply to this email.
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Welcome email sent! Check your inbox.',
        email
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Email signup error:', error);
    return NextResponse.json(
      { error: 'Failed to send email. Please try again.' },
      { status: 500 }
    );
  }
}
