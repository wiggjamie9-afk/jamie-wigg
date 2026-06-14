'use client';

import { useState } from 'react';
import { Code2, Send, AlertCircle, Zap } from 'lucide-react';

interface ReviewResult {
  review: string;
}

export default function Home() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState<ReviewResult | null>(null);
  const [error, setError] = useState('');
  const [isPro, setIsPro] = useState(false);

  const handleReview = async () => {
    if (!code.trim()) {
      setError('Please paste some code to review');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, isPro }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to review code');
      }

      const data = await response.json();
      setReview(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error reviewing code. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Code2 className="w-8 h-8 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">Code Reviewer</h1>
          </div>
          <p className="text-slate-300 text-lg mb-6">
            AI-powered code reviews using Claude & DeepSeek
          </p>
          <button
            onClick={() => setIsPro(!isPro)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
              isPro
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <Zap className="w-4 h-4" />
            {isPro ? 'Pro Mode (Claude)' : 'Free Mode (DeepSeek)'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2">
            <div className="bg-slate-700 rounded-lg p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <label className="text-white font-semibold">Paste Your Code</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-slate-600 text-white px-3 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python</option>
                  <option value="jsx">JSX/React</option>
                  <option value="css">CSS</option>
                </select>
              </div>

              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste your code here..."
                className="w-full h-96 bg-slate-800 text-slate-100 rounded border border-slate-600 p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              />

              <button
                onClick={handleReview}
                disabled={loading}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Send className="w-5 h-5" />
                {loading ? 'Reviewing...' : 'Review Code'}
              </button>

              {error && (
                <div className="mt-4 flex items-start gap-3 bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Review Results */}
          <div className="lg:col-span-1">
            {review ? (
              <div className="bg-slate-700 rounded-lg p-6 shadow-xl sticky top-8 max-h-96 overflow-y-auto">
                <div className="prose prose-invert max-w-none">
                  <div className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {review.review}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-700 rounded-lg p-6 shadow-xl text-center">
                <Code2 className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-300 mb-2">
                  Paste code and click review to get started
                </p>
                <p className="text-xs text-slate-400">
                  {isPro ? 'Using Claude Sonnet (better)' : 'Using DeepSeek (faster)'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
