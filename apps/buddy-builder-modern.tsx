/**
 * Buddy Builder — Modern Stack Implementation
 *
 * Tech Stack:
 * - React 19 with TypeScript 5.9
 * - shadcn/ui v2 (Radix UI + Tailwind)
 * - Zustand for state (tiny, auditable)
 * - React Query v5 for API calls
 * - Framer Motion 11 for animations
 *
 * Transparency: Every operation logged, costs tracked, prompts visible
 */

import React, { useState } from 'react';
import { create } from 'zustand';
import { useMutation, useQuery } from '@tanstack/react-query';

// ============ TYPES ============

interface Personality {
  name: string;
  emoji: string;
  role: string;
  traits: string[];
  purpose: string;
}

interface Variant {
  id: string;
  style: 'conservative' | 'bold' | 'playful';
  htmlCode: string;
  deployedAt: Date;
  stats: {
    messages: number;
    satisfaction: number;
    sentiment: 'positive' | 'neutral' | 'negative';
  };
}

interface App {
  id: string;
  personality: Personality;
  variants: Variant[];
  winner: Variant | null;
  created: Date;
  improvements: string[];
}

interface AICallLog {
  id: string;
  timestamp: Date;
  purpose: 'generate_variant' | 'analyze_performance' | 'generate_improvement';
  promptSent: string;
  inputTokens: number;
  outputTokens: number;
  responseReceived: string;
  cost: number;
  duration: number;
  cacheHit: boolean;
}

// ============ STATE MANAGEMENT ============

interface BuddyBuilderStore {
  // Creator state
  claudeApiKey: string;
  setClaudeApiKey: (key: string) => void;

  // Apps
  apps: App[];
  addApp: (app: App) => void;

  // Transparency logs
  aiCallLogs: AICallLog[];
  logAICall: (log: AICallLog) => void;

  // UI state
  currentScreen: 'create' | 'library' | 'analytics';
  setCurrentScreen: (screen: string) => void;
}

export const useBuddyStore = create<BuddyBuilderStore>((set) => ({
  claudeApiKey: localStorage.getItem('claudeApiKey') || '',
  setClaudeApiKey: (key) => {
    set({ claudeApiKey: key });
    localStorage.setItem('claudeApiKey', key);
  },

  apps: JSON.parse(localStorage.getItem('buddyApps') || '[]'),
  addApp: (app) =>
    set((state) => {
      const updated = [...state.apps, app];
      localStorage.setItem('buddyApps', JSON.stringify(updated));
      return { apps: updated };
    }),

  aiCallLogs: JSON.parse(localStorage.getItem('aiCallLogs') || '[]'),
  logAICall: (log) =>
    set((state) => {
      const updated = [...state.aiCallLogs, log];
      localStorage.setItem('aiCallLogs', JSON.stringify(updated));
      return { aiCallLogs: updated };
    }),

  currentScreen: 'create',
  setCurrentScreen: (screen) => set({ currentScreen: screen as any }),
}));

// ============ CLAUDE INTEGRATION (Transparent) ============

interface GenerateVariantsRequest {
  personality: Personality;
  claudeApiKey: string;
}

interface GenerateVariantsResponse {
  variants: Variant[];
  logs: AICallLog[];
}

async function generateVariants(
  req: GenerateVariantsRequest
): Promise<GenerateVariantsResponse> {
  const variants: Variant[] = [];
  const logs: AICallLog[] = [];

  const styles: Array<'conservative' | 'bold' | 'playful'> = [
    'conservative',
    'bold',
    'playful',
  ];

  for (const style of styles) {
    const startTime = performance.now();

    // BUILD PROMPT (Fully visible)
    const systemPrompt = buildSystemPrompt(req.personality, style);
    const userPrompt = buildUserPrompt(req.personality, style);

    console.log('=== CLAUDE API CALL ===');
    console.log('Style:', style);
    console.log('Prompt:', systemPrompt);
    console.log('User input:', userPrompt);

    // Make API call
    const startTokens = await estimateTokens(systemPrompt + userPrompt);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': req.claudeApiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    const data = await response.json();
    const endTime = performance.now();

    // EXTRACT RESPONSE DATA
    const htmlCode = data.content[0].text;
    const inputTokens = data.usage.input_tokens;
    const outputTokens = data.usage.output_tokens;

    // CALCULATE COST (Transparent)
    // Claude 3.5 Sonnet: $3 per 1M input, $15 per 1M output
    const inputCost = (inputTokens / 1_000_000) * 3;
    const outputCost = (outputTokens / 1_000_000) * 15;
    const totalCost = inputCost + outputCost;

    const duration = endTime - startTime;

    // LOG THE CALL (Transparent)
    const log: AICallLog = {
      id: `call_${Date.now()}_${style}`,
      timestamp: new Date(),
      purpose: 'generate_variant',
      promptSent: systemPrompt + '\n\n' + userPrompt,
      inputTokens,
      outputTokens,
      responseReceived: htmlCode.substring(0, 500) + '...', // Summary
      cost: totalCost,
      duration,
      cacheHit: data.usage?.cache_read_input_tokens > 0,
    };

    logs.push(log);

    console.log('=== RESPONSE ===');
    console.log('Duration:', duration, 'ms');
    console.log('Input tokens:', inputTokens);
    console.log('Output tokens:', outputTokens);
    console.log('Cost:', '$' + totalCost.toFixed(4));
    console.log('Cache hit:', log.cacheHit);

    // CREATE VARIANT
    variants.push({
      id: `variant_${Date.now()}_${style}`,
      style,
      htmlCode,
      deployedAt: new Date(),
      stats: {
        messages: 0,
        satisfaction: 0,
        sentiment: 'neutral',
      },
    });
  }

  return { variants, logs };
}

function buildSystemPrompt(personality: Personality, style: string): string {
  const styleGuidance = {
    conservative:
      'Proven, reliable personality. Focus on stability and trust. Minimal experimental features.',
    bold: 'Amplified traits. More direct, confident, willing to take friendly risks. Experimental.',
    playful:
      'Lighter tone. More humor, warmth, accessibility. Conversational and approachable.',
  };

  return `You are an expert AI companion app architect.

Your task: Generate a complete, production-ready HTML file for an AI companion app.

PERSONALITY DEFINITION:
- Name: ${personality.name}
- Emoji: ${personality.emoji}
- Role: ${personality.role}
- Traits: ${personality.traits.join(', ')}
- Purpose: ${personality.purpose}

STYLE DIRECTIVE: ${styleGuidance[style as keyof typeof styleGuidance]}

REQUIREMENTS:
1. Single HTML file with inline CSS and JavaScript
2. Claude API integration (user provides their own key)
3. Chat interface that reflects personality
4. Sentiment tracking (keyword analysis)
5. Crisis detection for keywords: suicide, self-harm, kill myself, etc.
6. If crisis detected: show 988, Crisis Text Line, findahelpline.com
7. Analytics collection (tracked: messages, satisfaction, sentiment)
8. Offline capability (localStorage, works without internet)
9. Mobile responsive design
10. NO external dependencies (no CDN calls)
11. NO tracking pixels or hidden scripts
12. ALL code readable and auditable

OUTPUT: Complete HTML code, ready to deploy.`;
}

function buildUserPrompt(personality: Personality, style: string): string {
  return `Generate the HTML for the "${style}" variant of "${personality.name}".

Make it production-ready and immediately deployable.`;
}

async function estimateTokens(text: string): Promise<number> {
  // Claude tokenization approximation
  // Actual: 1 token ≈ 4 characters (rough estimate)
  return Math.ceil(text.length / 4);
}

// ============ COMPONENTS ============

interface CreateScreenProps {
  onGenerate: (personality: Personality) => void;
}

export function CreateScreen({ onGenerate }: CreateScreenProps) {
  const [personality, setPersonality] = useState<Personality>({
    name: '',
    emoji: '🧘',
    role: '',
    traits: [],
    purpose: '',
  });

  const [traitsInput, setTraitsInput] = useState('');
  const { claudeApiKey } = useBuddyStore();

  const handleGeneratClick = () => {
    if (!personality.name || !personality.role || traitsInput.length === 0) {
      alert('Fill in Name, Role, and Traits');
      return;
    }

    const traits = traitsInput.split(',').map((t) => t.trim());

    onGenerate({
      ...personality,
      traits,
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Create Your Companion</h1>
      <p className="text-gray-400">
        Define personality → AI generates 3 variants → pick the best
      </p>

      <div className="grid grid-cols-2 gap-6">
        {/* LEFT: FORM */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Emoji</label>
            <div className="grid grid-cols-6 gap-2">
              {['🧘', '💼', '💪', '🎨', '📚', '🌸', '⭐', '😴'].map((e) => (
                <button
                  key={e}
                  onClick={() =>
                    setPersonality({ ...personality, emoji: e })
                  }
                  className={`text-2xl p-2 rounded border-2 transition ${
                    personality.emoji === e
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-gray-700'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Name</label>
            <input
              type="text"
              value={personality.name}
              onChange={(e) =>
                setPersonality({ ...personality, name: e.target.value })
              }
              placeholder="e.g., Anxiety Relief"
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Role</label>
            <input
              type="text"
              value={personality.role}
              onChange={(e) =>
                setPersonality({ ...personality, role: e.target.value })
              }
              placeholder="e.g., Calming Guide"
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Personality Traits (comma-separated)
            </label>
            <input
              type="text"
              value={traitsInput}
              onChange={(e) => setTraitsInput(e.target.value)}
              placeholder="e.g., compassionate, patient, grounding"
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              What They Help With
            </label>
            <input
              type="text"
              value={personality.purpose}
              onChange={(e) =>
                setPersonality({ ...personality, purpose: e.target.value })
              }
              placeholder="e.g., Managing anxiety with mindfulness"
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded"
            />
          </div>

          {claudeApiKey ? (
            <button
              onClick={handleGeneratClick}
              className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded font-semibold mt-4"
            >
              Generate 3 Variants
            </button>
          ) : (
            <div className="text-sm text-red-400">
              Set Claude API key in Settings to generate
            </div>
          )}
        </div>

        {/* RIGHT: PREVIEW */}
        <div className="bg-gray-900/50 p-4 rounded border border-gray-700">
          <div className="text-sm font-semibold text-gray-400 mb-4">
            Live Preview
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{personality.emoji}</span>
              <div>
                <div className="font-semibold">
                  {personality.name || 'Your Buddy'}
                </div>
                <div className="text-sm text-gray-400">
                  {personality.role || 'AI Companion'}
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-300 mt-4">
              {traitsInput.length > 0 && personality.purpose
                ? `${traitsInput} • ${personality.purpose}`
                : 'Define personality and purpose'}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-700 text-xs text-gray-400 space-y-1">
              <div>✓ AI generates 3 app variants</div>
              <div>✓ All deploy to web simultaneously</div>
              <div>✓ Real users test in parallel</div>
              <div>✓ Winner detected automatically</div>
              <div>✓ Auto-improves weekly</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ TRANSPARENCY PANEL ============

export function TransparencyPanel() {
  const { aiCallLogs } = useBuddyStore();

  const totalCost = aiCallLogs.reduce((sum, log) => sum + log.cost, 0);
  const totalTokens = aiCallLogs.reduce(
    (sum, log) => sum + log.inputTokens + log.outputTokens,
    0
  );

  return (
    <div className="bg-gray-900 p-4 rounded border border-gray-700 space-y-3">
      <div className="font-semibold">🔍 Transparency Panel</div>

      <div className="grid grid-cols-3 gap-2 text-sm">
        <div>
          <div className="text-gray-400">API Calls</div>
          <div className="font-semibold">{aiCallLogs.length}</div>
        </div>
        <div>
          <div className="text-gray-400">Total Tokens</div>
          <div className="font-semibold">{totalTokens.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-gray-400">Total Cost</div>
          <div className="font-semibold">${totalCost.toFixed(4)}</div>
        </div>
      </div>

      <div className="max-h-48 overflow-y-auto space-y-2">
        {aiCallLogs.slice(-5).map((log) => (
          <div key={log.id} className="text-xs bg-gray-800 p-2 rounded">
            <div className="font-semibold">{log.purpose}</div>
            <div className="text-gray-400 mt-1">
              {log.inputTokens + log.outputTokens} tokens • ${log.cost.toFixed(4)} •{' '}
              {log.duration.toFixed(0)}ms
              {log.cacheHit && ' (cache hit)'}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          const logsJson = JSON.stringify(aiCallLogs, null, 2);
          const blob = new Blob([logsJson], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `ai-call-logs-${Date.now()}.json`;
          a.click();
        }}
        className="w-full px-3 py-2 text-sm bg-purple-600 rounded hover:bg-purple-700"
      >
        📥 Download All Logs
      </button>
    </div>
  );
}

// ============ MAIN APP ============

export default function BuddyBuilderApp() {
  const { currentScreen, setCurrentScreen, addApp, logAICall, claudeApiKey } =
    useBuddyStore();

  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (personality: Personality) => {
    if (!claudeApiKey) {
      alert('Set Claude API key first');
      return;
    }

    setIsGenerating(true);

    try {
      const { variants, logs } = await generateVariants({
        personality,
        claudeApiKey,
      });

      // Log all calls to transparency panel
      logs.forEach((log) => logAICall(log));

      // Add app
      addApp({
        id: `app_${Date.now()}`,
        personality,
        variants,
        winner: null,
        created: new Date(),
        improvements: [],
      });

      alert(`✓ Generated 3 variants! Cost: $${logs.reduce((sum, l) => sum + l.cost, 0).toFixed(4)}`);
    } catch (error) {
      alert('Error: ' + (error as any).message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-white">
      <div className="grid grid-cols-4 gap-4 p-6">
        {/* SIDEBAR */}
        <div className="col-span-1 space-y-4">
          <div className="font-bold text-2xl bg-gradient-to-r from-yellow-400 to-pink-600 bg-clip-text text-transparent">
            Buddy Builder
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setCurrentScreen('create')}
              className={`w-full text-left px-4 py-2 rounded transition ${
                currentScreen === 'create'
                  ? 'bg-purple-600'
                  : 'hover:bg-gray-800'
              }`}
            >
              ➕ Create
            </button>
            <button
              onClick={() => setCurrentScreen('library')}
              className={`w-full text-left px-4 py-2 rounded transition ${
                currentScreen === 'library'
                  ? 'bg-purple-600'
                  : 'hover:bg-gray-800'
              }`}
            >
              📚 Library
            </button>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <TransparencyPanel />
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="col-span-3">
          {currentScreen === 'create' && (
            <CreateScreen onGenerate={handleGenerate} />
          )}

          {currentScreen === 'library' && (
            <div>
              <h1 className="text-3xl font-bold mb-4">Your Companions</h1>
              <div className="text-gray-400">Library view coming soon</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
