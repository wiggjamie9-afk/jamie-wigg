'use client';

import { useState } from 'react';
import BillingCard from '@/components/BillingCard';
import APIKeysCard from '@/components/APIKeysCard';

interface APIKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string | null;
}

interface UserSettings {
  email: string;
  name: string;
  tier: 'starter' | 'pro' | 'addon';
  nextBillingDate: string;
  monthlyCost: number;
  apiKeys: APIKey[];
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'account' | 'billing' | 'api'>('account');
  const [settings] = useState<UserSettings>({
    email: 'user@example.com',
    name: 'John Doe',
    tier: 'pro',
    nextBillingDate: '2026-07-10',
    monthlyCost: 1500,
    apiKeys: [
      {
        id: 'key_1',
        name: 'Production',
        key: 'ab_sk_prod_1234567890abcdefghij',
        createdAt: '2026-05-15',
        lastUsed: '2026-06-10',
      },
      {
        id: 'key_2',
        name: 'Development',
        key: 'ab_sk_dev_abcdefghijklmnopqrst',
        createdAt: '2026-04-20',
        lastUsed: '2026-06-09',
      },
    ],
  });

  const [editName, setEditName] = useState(settings.name);
  const [isEditingName, setIsEditingName] = useState(false);

  const handleSaveName = () => {
    setIsEditingName(false);
    // In a real app, this would update the backend
  };

  const tabs = [
    { id: 'account', label: 'Account' },
    { id: 'billing', label: 'Billing & Subscription' },
    { id: 'api', label: 'API Keys' },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account, billing, and API keys</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Account Tab */}
        {activeTab === 'account' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Account Settings</h2>

              {/* Profile Info */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    {isEditingName ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={handleSaveName}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditName(settings.name);
                            setIsEditingName(false);
                          }}
                          className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <p className="text-gray-900 py-2">{editName}</p>
                        <button
                          onClick={() => setIsEditingName(true)}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <p className="text-gray-900 py-2">{settings.email}</p>
                    <p className="text-xs text-gray-500 mt-1">Contact support to change email address</p>
                  </div>
                </div>
              </div>

              {/* Account Tier */}
              <div className="border-t border-gray-200 pt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Tier</h3>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Current Plan</p>
                    <p className="text-3xl font-bold text-gray-900 capitalize">{settings.tier}</p>
                  </div>
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                    View Plans
                  </button>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="border-t border-gray-200 pt-8 mt-8">
                <h3 className="text-lg font-semibold text-red-700 mb-4">Danger Zone</h3>
                <button className="w-full px-4 py-3 border-2 border-red-200 text-red-700 rounded-lg hover:bg-red-50 transition font-medium">
                  Delete Account
                </button>
                <p className="text-sm text-gray-600 mt-2">
                  This action is permanent and cannot be undone. All your agents and data will be deleted.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Billing Tab */}
        {activeTab === 'billing' && (
          <div className="space-y-6">
            <BillingCard
              tier={settings.tier}
              nextBillingDate={settings.nextBillingDate}
              monthlyCost={settings.monthlyCost}
            />

            {/* Billing History */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Billing History</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Date</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Amount</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Status</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 text-gray-900">Jun 10, 2026</td>
                      <td className="px-4 py-3 text-gray-900">$1,500.00</td>
                      <td className="px-4 py-3">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          Paid
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-blue-600 hover:underline font-medium">Download</button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-gray-900">May 10, 2026</td>
                      <td className="px-4 py-3 text-gray-900">$1,500.00</td>
                      <td className="px-4 py-3">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          Paid
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-blue-600 hover:underline font-medium">Download</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* API Keys Tab */}
        {activeTab === 'api' && (
          <div className="space-y-6">
            <APIKeysCard apiKeys={settings.apiKeys} />

            {/* API Documentation */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">API Documentation</h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Get started with the Agent Builder API. Use your API keys to authenticate requests to configure and deploy agents.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="#docs"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium inline-block text-center"
                  >
                    View API Docs
                  </a>
                  <a
                    href="#examples"
                    className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition text-sm font-medium inline-block text-center"
                  >
                    Code Examples
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
