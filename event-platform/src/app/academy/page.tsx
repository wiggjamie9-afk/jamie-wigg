'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';

// RHYTHMIX Brand Colors
const BRAND = {
  primary: '#3B82F6',    // Blue
  accent: '#9333EA',     // Purple
  highlight: '#F97316',  // Orange
  success: '#10B981',
  error: '#EF4444',
};

export default function AcademyLanding() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to Lemonsqueezy enrollment API
    console.log('Email submitted:', email);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <main className="min-h-screen bg-base transition-colors duration-200">
      <Navigation />

      {/* HERO SECTION */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
            Build a $100K/year event platform
            <br />
            <span style={{ color: BRAND.accent }}>in 90 days</span>
          </h1>
          <p className="text-xl md:text-2xl opacity-75 mb-8 max-w-3xl mx-auto">
            The hands-on academy teaching AI automation, real-time sync, and monetization.
            Go from idea to first paying customer in 12 weeks.
          </p>

          {/* Email Capture */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8">
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800"
              />
              <button
                type="submit"
                style={{ backgroundColor: BRAND.accent }}
                className="px-6 py-3 text-white rounded-lg font-medium hover:opacity-90 transition"
              >
                {submitted ? '✓ Joined' : 'Enroll Now'}
              </button>
            </div>
          </form>

          <p className="text-sm opacity-60">
            Join 50+ founders already building their platforms
          </p>
        </div>

        {/* Social Proof */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <p style={{ color: BRAND.accent }} className="text-3xl font-bold">50+</p>
            <p className="text-sm opacity-75">Students building platforms</p>
          </div>
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <p style={{ color: BRAND.accent }} className="text-3xl font-bold">12 weeks</p>
            <p className="text-sm opacity-75">From zero to first customer</p>
          </div>
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <p style={{ color: BRAND.accent }} className="text-3xl font-bold">$1K-$10K</p>
            <p className="text-sm opacity-75">MRR by graduation</p>
          </div>
        </div>
      </section>

      {/* WHAT YOU'LL BUILD */}
      <section className="bg-white dark:bg-slate-800 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-serif font-bold mb-12 text-center">
            What you'll build
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Week 1-4: Foundation</h3>
              <ul className="space-y-2 text-sm opacity-75">
                <li>✓ Event platform UI (React, Tailwind)</li>
                <li>✓ Real-time database (Supabase + sync)</li>
                <li>✓ Deployment (Cloudflare)</li>
                <li>✓ First live platform</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Week 5-8: Intelligence</h3>
              <ul className="space-y-2 text-sm opacity-75">
                <li>✓ AI image generation (event posters)</li>
                <li>✓ Auto-captioning (video content)</li>
                <li>✓ Semantic search (find events by description)</li>
                <li>✓ Content automation</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Week 9-10: Mobile & Maps</h3>
              <ul className="space-y-2 text-sm opacity-75">
                <li>✓ iOS app (Capacitor native wrapper)</li>
                <li>✓ Location-based discovery (Leaflet maps)</li>
                <li>✓ Offline-first sync (PWA)</li>
                <li>✓ Push notifications</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Week 11-12: Revenue</h3>
              <ul className="space-y-2 text-sm opacity-75">
                <li>✓ Payment processing (Stripe)</li>
                <li>✓ Email automation (n8n)</li>
                <li>✓ Social media posting</li>
                <li>✓ First paying customers</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CURRICULUM */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-serif font-bold mb-12 text-center">
          The 28-module curriculum
        </h2>

        <div className="grid md:grid-cols-4 gap-4 mb-12">
          {[
            { week: '1-2', title: 'Foundation', modules: 4 },
            { week: '3-4', title: 'Frontend', modules: 4 },
            { week: '5-6', title: 'Backend', modules: 4 },
            { week: '7-8', title: 'AI & Automation', modules: 4 },
            { week: '9-10', title: 'Mobile & Maps', modules: 4 },
            { week: '11', title: 'Monetization', modules: 2 },
            { week: '12', title: 'Launch', modules: 2 },
          ].map((section) => (
            <div
              key={section.week}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <p style={{ color: BRAND.accent }} className="text-sm font-bold mb-2">
                Week {section.week}
              </p>
              <p className="font-bold mb-1">{section.title}</p>
              <p className="text-xs opacity-60">{section.modules} modules</p>
            </div>
          ))}
        </div>
      </section>

      {/* STUDENT SUCCESS STORIES */}
      <section className="bg-white dark:bg-slate-800 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-serif font-bold mb-12 text-center">
            Student success stories
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah (Event Organizer)',
                before: 'Managing events in spreadsheets',
                after: '$1.5K MRR selling platform licenses',
                quote: 'Week 4 and I had my first customer.',
              },
              {
                name: 'Alex (Junior Dev)',
                before: 'Bootcamp grad struggling to find jobs',
                after: '$85K offer from major tech company',
                quote: 'They loved that I shipped a real full-stack project.',
              },
              {
                name: 'Jordan (Founder)',
                before: 'Previous startup failed, wanted something small',
                after: '$3K MRR wedding planning platform',
                quote: 'Three months later I have paying customers.',
              },
            ].map((story) => (
              <div
                key={story.name}
                className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <p className="font-bold mb-2">{story.name}</p>
                <p className="text-sm mb-4">
                  <span className="opacity-60 block mb-1">Before:</span>
                  <span className="text-sm">{story.before}</span>
                </p>
                <p className="text-sm mb-4">
                  <span className="opacity-60 block mb-1">After:</span>
                  <span style={{ color: BRAND.accent }} className="font-bold">
                    {story.after}
                  </span>
                </p>
                <p className="text-sm italic opacity-75">"{story.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-serif font-bold mb-12 text-center">
          Simple pricing
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: 'Starter',
              price: '$297',
              desc: 'Self-paced',
              features: [
                '28 video modules',
                'Code templates + docs',
                'Community Discord access',
                'Email support (72hr response)',
              ],
            },
            {
              name: 'Pro',
              price: '$897',
              desc: 'Cohort-based',
              features: [
                'Everything in Starter',
                'Live group calls (Tue/Fri)',
                'Checkpoint feedback',
                'Launch support',
                'Career guidance',
              ],
              highlight: true,
            },
            {
              name: 'Premium',
              price: '$1,997',
              desc: '1-on-1 mentorship',
              features: [
                'Everything in Pro',
                'Personal mentor (weekly)',
                'Custom feature builds',
                'Priority support',
                '10% revenue share (lifetime)',
              ],
            },
          ].map((tier) => (
            <div
              key={tier.name}
              className={`p-8 rounded-lg border transition ${
                tier.highlight
                  ? 'border-2'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
              style={{
                borderColor: tier.highlight ? BRAND.accent : undefined,
                backgroundColor: tier.highlight ? `${BRAND.accent}15` : undefined,
              }}
            >
              <p className="font-bold mb-1">{tier.name}</p>
              <p style={{ color: BRAND.accent }} className="text-3xl font-bold mb-1">
                {tier.price}
              </p>
              <p className="text-sm opacity-60 mb-6">{tier.desc}</p>
              <ul className="space-y-3 text-sm mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <span style={{ color: BRAND.accent }}>✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                style={{ backgroundColor: BRAND.accent }}
                className="w-full px-4 py-2 text-white rounded-lg font-medium hover:opacity-90 transition"
              >
                Enroll in {tier.name}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center mt-8 text-sm opacity-60">
          30-day money-back guarantee. No questions asked.
        </p>
      </section>

      {/* FAQ */}
      <section className="bg-white dark:bg-slate-800 py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-serif font-bold mb-12 text-center">
            Frequently asked questions
          </h2>

          <div className="space-y-6">
            {[
              {
                q: 'Do I need coding experience?',
                a: 'No. We start from zero. If you can follow instructions and google errors, you can do this.',
              },
              {
                q: 'How long does it take?',
                a: '12 weeks for the full curriculum. Most students launch in week 11-12.',
              },
              {
                q: 'Can I customize for my niche?',
                a: 'Absolutely. The platform works for events, weddings, conferences, marathons, anything with attendees.',
              },
              {
                q: 'What if I get stuck?',
                a: 'Pro/Premium students get live support. Starter students use Discord community. Response time: 24-72hrs.',
              },
              {
                q: 'Do I own my code?',
                a: 'Yes. 100%. You own everything you build. You can sell it, keep it, or open-source it.',
              },
              {
                q: 'Is there a money-back guarantee?',
                a: '30 days, no questions asked. If you don\'t think it\'s worth it by day 30, we refund you fully.',
              },
            ].map((item, i) => (
              <div key={i} className="pb-6 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <p className="font-bold mb-2">{item.q}</p>
                <p className="text-sm opacity-75">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl font-serif font-bold mb-6">
          Ready to build your platform?
        </h2>
        <p className="text-lg opacity-75 mb-8">
          Join the next cohort starting next week. Spots are limited to 20 students.
        </p>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800"
            />
            <button
              type="submit"
              style={{ backgroundColor: BRAND.accent }}
              className="px-6 py-3 text-white rounded-lg font-medium hover:opacity-90 transition"
            >
              Enroll Now
            </button>
          </div>
        </form>

        <p className="text-xs opacity-60 mt-4">
          No credit card required. 30-day guarantee.
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm opacity-60">
          <p>© 2026 EventAI Academy. Built by Jamie Wigg.</p>
          <p className="mt-2">
            <a href="#" className="hover:opacity-100">
              Privacy
            </a>
            {' • '}
            <a href="#" className="hover:opacity-100">
              Terms
            </a>
            {' • '}
            <a href="mailto:wiggjamie9@gmail.com" className="hover:opacity-100">
              Contact
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
