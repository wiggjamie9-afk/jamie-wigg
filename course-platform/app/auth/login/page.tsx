"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/supabase-client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const { user, error: signInError } = await signIn(email, password);

    if (signInError) {
      setError(signInError.message || "Failed to sign in");
      setIsLoading(false);
      return;
    }

    if (user) {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-8">
          <div className="mb-8">
            <Link href="/" className="text-2xl font-bold text-white">
              CourseHub
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-white mb-6">Sign In</h1>

          {error && (
            <div className="mb-4 p-4 rounded bg-red-900/30 border border-red-700">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 rounded border border-slate-600 bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-slate-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 rounded border border-slate-600 bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-slate-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded transition"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-slate-400 text-sm mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="text-blue-400 hover:text-blue-300">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
