import Link from 'next/link';
import { ArrowRight, Sparkles, Zap, TrendingUp, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700">
      {/* Navigation */}
      <nav className="border-b border-brand-700/50 bg-brand-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold text-white">CreatorOS</div>
          <div className="flex gap-4">
            <Link href="/login" className="text-brand-100 hover:text-white transition">
              Login
            </Link>
            <Link href="/signup" className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg transition">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 bg-brand-500/20 rounded-full border border-brand-500/40">
          <Sparkles className="w-4 h-4 text-brand-300" />
          <span className="text-brand-200 text-sm font-medium">Your AI-powered creator suite</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          Create. Schedule. Monetize.
          <br />
          <span className="bg-gradient-to-r from-brand-300 to-brand-500 bg-clip-text text-transparent">
            All with AI
          </span>
        </h1>

        <p className="text-xl text-brand-100 mb-12 max-w-2xl mx-auto">
          One platform for everything creators need. Generate stunning content, schedule across platforms,
          and earn more without the hustle.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link href="/signup" className="bg-brand-500 hover:bg-brand-600 text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition">
            Start Free <ArrowRight className="w-5 h-5" />
          </Link>
          <button className="border-2 border-brand-300 text-brand-100 hover:bg-brand-800/50 px-8 py-4 rounded-lg font-semibold transition">
            Watch Demo
          </button>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-4 gap-6 mt-20">
          {[
            { icon: Sparkles, title: 'AI Generation', desc: 'Create videos, music, graphics in seconds' },
            { icon: Zap, title: 'Smart Scheduling', desc: 'Post to all platforms simultaneously' },
            { icon: TrendingUp, title: 'Analytics', desc: 'AI-powered insights & recommendations' },
            { icon: Users, title: 'Monetization', desc: 'Multiple revenue streams built-in' },
          ].map((feature, i) => (
            <div key={i} className="bg-brand-800/50 backdrop-blur border border-brand-700/50 rounded-xl p-6 hover:border-brand-500/50 transition">
              <feature.icon className="w-8 h-8 text-brand-300 mb-4" />
              <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
              <p className="text-brand-200 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Simple, Transparent Pricing</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: 'Free', price: '$0', features: ['5 content generations/month', 'Basic scheduling', 'Community support'] },
            { name: 'Pro', price: '$49', features: ['Unlimited generations', 'Advanced scheduling', 'Analytics dashboard', 'Email support', 'Priority queue'], highlighted: true },
            { name: 'Studio', price: '$199', features: ['Everything in Pro', 'Team collaboration', 'Advanced monetization', 'API access', 'Dedicated support'] },
          ].map((plan, i) => (
            <div key={i} className={`rounded-xl p-8 border transition ${plan.highlighted ? 'bg-brand-500 border-brand-400 scale-105' : 'bg-brand-800/50 border-brand-700/50 hover:border-brand-500/50'}`}>
              <h3 className={`text-2xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-brand-100'}`}>
                {plan.name}
              </h3>
              <p className={`text-3xl font-bold mb-6 ${plan.highlighted ? 'text-white' : 'text-brand-300'}`}>
                {plan.price}
              </p>
              <ul className={`space-y-3 mb-8 ${plan.highlighted ? 'text-white' : 'text-brand-200'}`}>
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${plan.highlighted ? 'bg-white' : 'bg-brand-400'}`} />
                    {feature}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-2 rounded-lg font-semibold transition ${plan.highlighted ? 'bg-white text-brand-600 hover:bg-gray-100' : 'border border-brand-500 text-brand-100 hover:bg-brand-700'}`}>
                Get Started
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-brand-700/50 bg-brand-900/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-brand-300">
          <p>© 2025 CreatorOS. Built for creators, powered by AI.</p>
        </div>
      </footer>
    </div>
  );
}
