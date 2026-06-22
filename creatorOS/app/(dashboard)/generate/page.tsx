'use client';

import { useState } from 'react';
import { Sparkles, Video, Music, Image as ImageIcon, AlertCircle, CheckCircle } from 'lucide-react';
import { useContent } from '@/lib/hooks';
import { useAuth } from '@/lib/hooks';

export default function Generate() {
  const [contentType, setContentType] = useState<'video' | 'music' | 'image' | null>(null);
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState('60');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [localError, setLocalError] = useState('');

  const { user } = useAuth();
  const { generate, loading, error } = useContent();

  const handleGenerate = async () => {
    setLocalError('');
    setGeneratedContent(null);

    if (!user?.id) {
      setLocalError('You must be logged in to generate content');
      return;
    }

    if (!prompt.trim()) {
      setLocalError('Please enter a description for your content');
      return;
    }

    try {
      const options = contentType === 'video'
        ? { duration: parseInt(duration), aspectRatio }
        : undefined;

      const content = await generate(contentType as any, prompt, user.id, options);
      setGeneratedContent(content);
      setPrompt('');
    } catch (err: any) {
      setLocalError(err.message || 'Failed to generate content. Please try again.');
    }
  };

  const contentOptions = [
    { id: 'video', label: 'Video', icon: Video, desc: 'Generate promo or social videos' },
    { id: 'music', label: 'Music', icon: Music, desc: 'Generate royalty-free background music' },
    { id: 'image', label: 'Image', icon: ImageIcon, desc: 'Generate images and graphics' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Generate Content</h1>
        <p className="text-gray-600 mt-1">Create stunning content with AI in seconds</p>
      </div>

      {/* Content Type Selection */}
      {!contentType ? (
        <div className="grid md:grid-cols-3 gap-6">
          {contentOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setContentType(option.id as any)}
              className="bg-white rounded-lg border-2 border-gray-200 p-8 hover:border-brand-500 hover:shadow-lg transition text-left"
            >
              <option.icon className="w-12 h-12 text-brand-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900">{option.label}</h3>
              <p className="text-gray-600 text-sm mt-2">{option.desc}</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          {(error || localError) && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-gap-2">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-200 text-sm">{error || localError}</p>
            </div>
          )}

          {generatedContent && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-gap-2">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-green-200 text-sm font-medium">Content generated successfully!</p>
                <p className="text-green-300 text-xs mt-1">Your {contentType} is ready to use in the Schedule page.</p>
              </div>
            </div>
          )}

          <button
            onClick={() => {
              setContentType(null);
              setGeneratedContent(null);
            }}
            className="text-brand-600 hover:text-brand-700 font-medium mb-6"
          >
            ← Back to types
          </button>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Generate {contentType === 'video' ? 'Video' : contentType === 'music' ? 'Music' : 'Image'}
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe what you want to create
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={loading}
                placeholder={
                  contentType === 'video'
                    ? 'E.g., A fast-paced 60 second promotional video for a tech startup, upbeat music, modern design...'
                    : contentType === 'music'
                    ? 'E.g., Upbeat lo-fi hip hop track, 120 BPM, chill vibes...'
                    : 'E.g.: A minimalist cover art for a podcast, blue and white, modern design...'
                }
                className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-brand-500 min-h-32 disabled:bg-gray-50"
              />
            </div>

            {contentType === 'video' && (
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    disabled={loading}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-gray-50"
                  >
                    <option value="15">15 seconds</option>
                    <option value="30">30 seconds</option>
                    <option value="60">60 seconds</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Aspect Ratio</label>
                  <select
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value)}
                    disabled={loading}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-gray-50"
                  >
                    <option value="16:9">16:9 (Landscape)</option>
                    <option value="9:16">9:16 (Portrait)</option>
                    <option value="1:1">1:1 (Square)</option>
                  </select>
                </div>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={!prompt || loading || !!generatedContent}
              className="w-full bg-brand-500 hover:bg-brand-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              {loading ? 'Generating...' : generatedContent ? 'Generated!' : 'Generate'}
            </button>
          </div>

          {loading && (
            <div className="mt-8 p-8 bg-gray-50 rounded-lg border border-gray-200 text-center">
              <div className="animate-spin w-12 h-12 border-4 border-brand-200 border-t-brand-500 rounded-full mx-auto mb-4" />
              <p className="text-gray-600">Creating your {contentType}...</p>
              <p className="text-sm text-gray-500 mt-2">This usually takes 30-60 seconds</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
