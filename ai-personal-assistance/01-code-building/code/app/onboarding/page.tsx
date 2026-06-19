"use client";

import { useState } from "react";
import Link from "next/link";

type Step = 1 | 2 | 3 | 4;

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [sandboxName, setSandboxName] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [templateCode, setTemplateCode] = useState(`# Hello, World!
print("Welcome to Sandbox Runner")
print("Edit this code and run it!")`);

  const templates = {
    python: `# Hello, World!
print("Welcome to Sandbox Runner")
print("Edit this code and run it!")`,
    javascript: `// Hello, World!
console.log("Welcome to Sandbox Runner");
console.log("Edit this code and run it!");`,
    ruby: `# Hello, World!
puts "Welcome to Sandbox Runner"
puts "Edit this code and run it!"`,
    go: `package main
import "fmt"
func main() {
    fmt.Println("Welcome to Sandbox Runner")
    fmt.Println("Edit this code and run it!")
}`,
  };

  const handleLanguageChange = (lang: keyof typeof templates) => {
    setSelectedLanguage(lang);
    setTemplateCode(templates[lang]);
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((currentStep + 1) as Step);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">
              ◾
            </div>
            <h1 className="text-xl font-bold text-slate-100">Getting Started</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between mb-6">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`text-center ${
                  step <= currentStep ? "text-blue-400" : "text-slate-500"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 ${
                    step < currentStep
                      ? "bg-emerald-500 text-white"
                      : step === currentStep
                      ? "bg-blue-600 text-white"
                      : "bg-slate-700 text-slate-400"
                  }`}
                >
                  {step < currentStep ? "✓" : step}
                </div>
                <div className="text-xs font-medium">
                  {["Welcome", "Choose Language", "Configure", "Review"][step - 1]}
                </div>
              </div>
            ))}
          </div>

          <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
          {/* Step 1: Welcome */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-100 mb-2">Welcome to Sandbox Runner</h2>
                <p className="text-slate-400">
                  Let's get you set up with your first sandbox in just a few minutes.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4 p-4 rounded-lg bg-slate-900/50 border border-slate-700">
                  <div className="text-2xl">⚡</div>
                  <div>
                    <h3 className="font-semibold text-slate-100 mb-1">Fast Execution</h3>
                    <p className="text-sm text-slate-400">
                      Run code instantly in isolated environments without setup
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 rounded-lg bg-slate-900/50 border border-slate-700">
                  <div className="text-2xl">🔒</div>
                  <div>
                    <h3 className="font-semibold text-slate-100 mb-1">Secure & Isolated</h3>
                    <p className="text-sm text-slate-400">
                      Each sandbox runs in a secure container isolated from others
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 rounded-lg bg-slate-900/50 border border-slate-700">
                  <div className="text-2xl">🤖</div>
                  <div>
                    <h3 className="font-semibold text-slate-100 mb-1">AI Feedback</h3>
                    <p className="text-sm text-slate-400">
                      Get instant AI reviews of your code with suggestions
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Choose Language */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-100 mb-2">Choose Your Language</h2>
                <p className="text-slate-400">
                  Select a programming language to get started
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { lang: "python", name: "Python 3.12", icon: "🐍" },
                  { lang: "javascript", name: "Node.js 20", icon: "⚡" },
                  { lang: "ruby", name: "Ruby 3.2", icon: "💎" },
                  { lang: "go", name: "Go 1.21", icon: "🚀" },
                ].map((item) => (
                  <button
                    key={item.lang}
                    onClick={() => handleLanguageChange(item.lang as keyof typeof templates)}
                    className={`p-4 rounded-lg border-2 transition text-left ${
                      selectedLanguage === item.lang
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-slate-600 bg-slate-900/50 hover:border-slate-500"
                    }`}
                  >
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <h3 className="font-semibold text-slate-100">{item.name}</h3>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Configure */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-100 mb-2">Configure Your Sandbox</h2>
                <p className="text-slate-400">
                  Give your sandbox a name and we'll create it with a starter template
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Sandbox Name
                </label>
                <input
                  type="text"
                  value={sandboxName}
                  onChange={(e) => setSandboxName(e.target.value)}
                  placeholder="My First Sandbox"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Starter Template
                </label>
                <textarea
                  value={templateCode}
                  readOnly
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-600 rounded-lg text-slate-100 font-mono text-sm resize-none h-40 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <p className="text-xs text-slate-500 mt-2">
                  This is a starter template you can edit after creation
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-100 mb-2">You're All Set!</h2>
                <p className="text-slate-400">
                  Review your sandbox configuration below
                </p>
              </div>

              <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6 space-y-4">
                <div>
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Sandbox Name
                  </h3>
                  <p className="text-slate-100">{sandboxName || "My First Sandbox"}</p>
                </div>

                <div className="border-t border-slate-700 pt-4">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Language
                  </h3>
                  <p className="text-slate-100 capitalize">
                    {selectedLanguage === "javascript" ? "Node.js 20" : selectedLanguage}
                  </p>
                </div>

                <div className="border-t border-slate-700 pt-4">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Template Preview
                  </h3>
                  <pre className="bg-slate-950 p-3 rounded border border-slate-700 text-slate-300 text-xs overflow-x-auto">
                    {templateCode}
                  </pre>
                </div>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/50 rounded-lg p-4">
                <p className="text-emerald-400 text-sm">
                  ✓ Your sandbox will be created and you'll be redirected to the editor
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="px-6 py-2 rounded-lg border border-slate-600 hover:border-slate-500 disabled:opacity-50 disabled:cursor-not-allowed text-slate-300 font-medium transition"
          >
            ← Back
          </button>

          {currentStep === 4 ? (
            <Link
              href="/dashboard"
              className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition"
            >
              Go to Dashboard
            </Link>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
            >
              Next →
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
