'use client';

import { DollarSign, CreditCard, Users, TrendingUp } from 'lucide-react';

export default function Monetize() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Monetize Your Content</h1>
        <p className="text-gray-600 mt-1">Turn your audience into revenue with multiple monetization options</p>
      </div>

      {/* Revenue Summary */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <DollarSign className="w-8 h-8 text-green-600 mb-4" />
          <p className="text-gray-600 text-sm">Total Earnings This Month</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">$1,240</p>
          <p className="text-green-600 text-sm mt-2">↑ 18% from last month</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <Users className="w-8 h-8 text-blue-600 mb-4" />
          <p className="text-gray-600 text-sm">Paying Supporters</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">47</p>
          <p className="text-blue-600 text-sm mt-2">↑ 5 new this week</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <TrendingUp className="w-8 h-8 text-purple-600 mb-4" />
          <p className="text-gray-600 text-sm">Avg Revenue Per Fan</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">$26.38</p>
          <p className="text-purple-600 text-sm mt-2">↑ 3% increase</p>
        </div>
      </div>

      {/* Monetization Options */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900">Available Monetization Methods</h2>

        {[
          {
            icon: CreditCard,
            title: 'Memberships',
            description: 'Offer exclusive content to paying members',
            status: 'active',
            earnings: '$240/mo',
            members: 24,
          },
          {
            icon: Users,
            title: 'Sponsored Content',
            description: 'Connect with brands and earn from sponsorships',
            status: 'available',
            earnings: '$500+ per deal',
            members: 0,
          },
          {
            icon: DollarSign,
            title: 'Tips & Donations',
            description: 'Let fans support you directly',
            status: 'active',
            earnings: '$60/mo',
            members: 18,
          },
          {
            icon: TrendingUp,
            title: 'Affiliate Marketing',
            description: 'Earn commissions on products you recommend',
            status: 'available',
            earnings: 'Not started',
            members: 0,
          },
        ].map((method, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <method.icon className="w-8 h-8 text-brand-500 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900">{method.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{method.description}</p>
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-4 ${
                  method.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {method.status === 'active' ? '✓ Active' : 'Available'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100">
              <div>
                <p className="text-sm text-gray-600">Monthly Earnings</p>
                <p className="font-bold text-gray-900 mt-1">{method.earnings}</p>
              </div>
              {method.members > 0 && (
                <div>
                  <p className="text-sm text-gray-600">Participants</p>
                  <p className="font-bold text-gray-900 mt-1">{method.members}</p>
                </div>
              )}
            </div>

            <button className="mt-6 w-full text-brand-600 hover:text-brand-700 font-medium text-sm border border-brand-600 hover:bg-brand-50 py-2 rounded-lg transition">
              {method.status === 'active' ? 'Manage' : 'Set Up'}
            </button>
          </div>
        ))}
      </div>

      {/* Monetization Tips */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">💡 Ways to Increase Revenue</h2>
        <ul className="space-y-2 text-gray-700">
          <li>• Post consistently — your audience is 40% more likely to support regular creators</li>
          <li>• Create behind-the-scenes content — fans pay 3x more for exclusive access</li>
          <li>• Build a Discord community — members feel more connected and willing to pay</li>
          <li>• Collaborate with other creators — cross-promotions attract new paying fans</li>
        </ul>
      </div>
    </div>
  );
}
