'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/hooks';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signup, loading, error } = useAuth();
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    setSuccess(false);

    try {
      await signup(email, password, name);
      setSuccess(true);
    } catch (err: any) {
      setLocalError(err.message || 'Signup failed');
    }
  };

  if (success) {
    return (
      <div className="bg-brand-800/50 backdrop-blur border border-brand-700/50 rounded-xl p-8 text-center">
        <div className="mb-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <p className="text-green-200">✓ Account created successfully!</p>
        </div>
        <p className="text-brand-200 mb-6">Please check your email to verify your account.</p>
        <Link
          href="/login"
          className="text-brand-400 hover:text-brand-300 font-semibold"
        >
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-brand-800/50 backdrop-blur border border-brand-700/50 rounded-xl p-8">
      {(error || localError) && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-gap-2">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-200 text-sm">{error || localError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-brand-100 text-sm font-medium mb-2">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-3 w-5 h-5 text-brand-400" />
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-brand-900/50 border border-brand-600/50 rounded-lg pl-10 pr-4 py-2 text-white placeholder-brand-500 focus:outline-none focus:border-brand-500"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label className="block text-brand-100 text-sm font-medium mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-5 h-5 text-brand-400" />
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-brand-900/50 border border-brand-600/50 rounded-lg pl-10 pr-4 py-2 text-white placeholder-brand-500 focus:outline-none focus:border-brand-500"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label className="block text-brand-100 text-sm font-medium mb-2">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 w-5 h-5 text-brand-400" />
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-brand-900/50 border border-brand-600/50 rounded-lg pl-10 pr-4 py-2 text-white placeholder-brand-500 focus:outline-none focus:border-brand-500"
              required
              disabled={loading}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-500 hover:bg-brand-600 disabled:bg-brand-700 text-white font-semibold py-2 rounded-lg transition mt-6"
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-brand-700/50">
        <p className="text-brand-300 text-center">
          Already have an account?{' '}
          <Link href="/login" className="text-brand-400 hover:text-brand-300 font-semibold">
            Sign in
          </Link>
        </p>
      </div>

      <p className="text-xs text-brand-400 text-center mt-6">
        By signing up, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  );
}
