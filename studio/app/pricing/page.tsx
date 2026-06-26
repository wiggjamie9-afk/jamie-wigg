import Link from "next/link";

export const metadata = {
  title: "Pricing — STARLIGHTMIX Studio",
  description: "Choose your plan: Free, Pro, or Studio.",
};

export default function PricingPage() {
  const tiers = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Get started with AI music videos",
      features: [
        "1 video per day",
        "720p resolution",
        "5 visual themes",
        "30-day storage",
        "No watermark",
        "Community support",
      ],
      cta: "Start Free",
      ctaHref: "/new",
      highlighted: false,
    },
    {
      name: "Pro",
      price: "$19.99",
      period: "per month",
      description: "For content creators and musicians",
      features: [
        "10 videos per day",
        "1080p resolution",
        "50+ visual themes",
        "Unlimited storage",
        "Priority support",
        "Advanced audio effects",
        "Custom intro/outro",
        "Export to TikTok format",
      ],
      cta: "Start Pro Trial",
      ctaHref: "/new",
      highlighted: true,
    },
    {
      name: "Studio",
      price: "$99.99",
      period: "per month",
      description: "For production studios and agencies",
      features: [
        "Unlimited videos",
        "4K resolution",
        "Custom visual themes",
        "White-label option",
        "API access",
        "Batch processing",
        "24/7 priority support",
        "Custom integrations",
      ],
      cta: "Contact Sales",
      ctaHref: "mailto:jam@rhythmixapp.com.au?subject=Studio%20Plan%20Interest",
      highlighted: false,
    },
  ];

  return (
    <main id="main-content" className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="px-4 py-12 text-center sm:py-16">
        <h1 className="text-4xl font-bold text-white sm:text-5xl">
          Simple, Transparent Pricing
        </h1>
        <p className="mt-4 text-xl text-slate-300">
          Create unlimited AI music videos. Choose the plan that fits your needs.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative overflow-hidden rounded-2xl transition-all duration-300 ${
                tier.highlighted
                  ? "border-2 border-cyan-500 bg-slate-800 ring-2 ring-cyan-500 ring-offset-2 ring-offset-slate-900 lg:scale-105"
                  : "border border-slate-700 bg-slate-800"
              }`}
            >
              {tier.highlighted && (
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-500 to-purple-500"
                />
              )}

              <div className="p-8">
                {/* Tier Name & Popular Badge */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white">{tier.name}</h2>
                  {tier.highlighted && (
                    <p className="mt-2 inline-block rounded-full bg-cyan-500/20 px-3 py-1 text-sm font-semibold text-cyan-300">
                      Most Popular
                    </p>
                  )}
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-5xl font-bold text-white">
                      {tier.price}
                    </span>
                    {tier.period !== "forever" && (
                      <span className="ml-2 text-slate-400">/{tier.period}</span>
                    )}
                  </div>
                  <p className="mt-2 text-slate-400">{tier.description}</p>
                </div>

                {/* CTA Button */}
                <Link
                  href={tier.ctaHref}
                  className={`mb-8 block w-full rounded-lg px-6 py-3 text-center font-semibold transition-all duration-200 ${
                    tier.highlighted
                      ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:from-cyan-600 hover:to-purple-600"
                      : "border border-slate-600 text-slate-300 hover:border-slate-500 hover:text-white"
                  }`}
                >
                  {tier.cta}
                </Link>

                {/* Features */}
                <ul className="space-y-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <svg
                        aria-hidden="true"
                        className="mr-3 h-5 w-5 flex-shrink-0 text-cyan-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
        <div className="mt-8 space-y-6">
          <details className="group cursor-pointer rounded-lg border border-slate-700 p-6 bg-slate-800">
            <summary className="flex items-center justify-between font-semibold text-white">
              Can I cancel anytime?
              <span aria-hidden="true" className="transition group-open:rotate-180">▼</span>
            </summary>
            <p className="mt-4 text-slate-300">
              Yes, cancel your subscription anytime from your account settings. No
              cancellation fees.
            </p>
          </details>

          <details className="group cursor-pointer rounded-lg border border-slate-700 p-6 bg-slate-800">
            <summary className="flex items-center justify-between font-semibold text-white">
              What payment methods do you accept?
              <span aria-hidden="true" className="transition group-open:rotate-180">▼</span>
            </summary>
            <p className="mt-4 text-slate-300">
              We accept all major credit cards (Visa, Mastercard, Amex) via Stripe.
            </p>
          </details>

          <details className="group cursor-pointer rounded-lg border border-slate-700 p-6 bg-slate-800">
            <summary className="flex items-center justify-between font-semibold text-white">
              Do you offer team plans?
              <span aria-hidden="true" className="transition group-open:rotate-180">▼</span>
            </summary>
            <p className="mt-4 text-slate-300">
              Contact our sales team at jam@rhythmixapp.com.au for enterprise and team
              pricing.
            </p>
          </details>

          <details className="group cursor-pointer rounded-lg border border-slate-700 p-6 bg-slate-800">
            <summary className="flex items-center justify-between font-semibold text-white">
              Can I upgrade or downgrade anytime?
              <span aria-hidden="true" className="transition group-open:rotate-180">▼</span>
            </summary>
            <p className="mt-4 text-slate-300">
              Yes, changes take effect immediately and we'll prorate your billing.
            </p>
          </details>
        </div>
      </div>

      {/* CTA Footer */}
      <div className="border-t border-slate-700 bg-slate-800 px-4 py-12 text-center sm:px-6 lg:px-8">
        <h3 className="text-2xl font-bold text-white">Ready to create?</h3>
        <p className="mt-2 text-slate-300">
          Start with Free or try Pro risk-free for 7 days.
        </p>
        <Link
          href="/new"
          className="mt-6 inline-block rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 px-8 py-3 font-semibold text-white transition-all duration-200 hover:from-cyan-600 hover:to-purple-600"
        >
          Launch Studio
        </Link>
      </div>
    </main>
  );
}
