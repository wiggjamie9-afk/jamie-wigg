'use client';

import { useState } from 'react';

interface BillingCardProps {
  tier: 'starter' | 'pro' | 'addon';
  nextBillingDate: string;
  monthlyCost: number;
}

const tierInfo = {
  starter: { name: 'Starter', price: 500, features: ['Basic agent templates', 'Up to 5 agents', 'Community support'] },
  pro: { name: 'Pro', price: 1500, features: ['All templates', 'Unlimited agents', 'Priority support', 'Advanced analytics'] },
  addon: { name: 'Addon', price: 500, features: ['Additional agent slots', 'Extra API calls', 'Custom domain'] },
};

export default function BillingCard({ tier, nextBillingDate, monthlyCost }: BillingCardProps) {
  const [showUpgrade, setShowUpgrade] = useState(false);

  const tierDetails = tierInfo[tier];
  const nextDate = new Date(nextBillingDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Billing & Subscription</h2>

      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Current Plan</p>
            <p className="text-3xl font-bold text-gray-900">{tierDetails.name}</p>
            <p className="text-gray-600 mt-2">${tierDetails.price}/month</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Next Billing Date</p>
            <p className="text-lg font-semibold text-gray-900">{nextDate}</p>
            <p className="text-sm text-gray-600 mt-2">Auto-renewal enabled</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Included Features</h3>
        <ul className="space-y-2">
          {tierDetails.features.map((feature, idx) => (
            <li key={idx} className="flex items-center text-gray-700">
              <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-green-100 text-green-700 mr-3">
                ✓
              </span>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => setShowUpgrade(!showUpgrade)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
        >
          {tier === 'pro' ? 'Manage Plan' : 'Upgrade Plan'}
        </button>
        <button className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition text-sm font-medium">
          Download Invoice
        </button>
        <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm font-medium">
          Cancel Subscription
        </button>
      </div>

      {showUpgrade && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-gray-900 mb-3">Upgrade Options</h4>
          <div className="space-y-2">
            {Object.entries(tierInfo).map(([key, value]) => (
              <button
                key={key}
                className={`w-full text-left p-3 rounded-lg border-2 transition ${
                  tier === key ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <p className="font-semibold text-gray-900">{value.name}</p>
                <p className="text-sm text-gray-600">${value.price}/month</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
