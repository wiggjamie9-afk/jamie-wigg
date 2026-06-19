"use client";

import { useState } from "react";
import Link from "next/link";

interface ExecutionResult {
  status: "idle" | "running" | "success" | "error";
  output?: string;
  error?: string;
  executionTime?: number;
}

export default function EditorPage({ params }: { params: { id: string } }) {
  const [code, setCode] = useState(`# Welcome to Sandbox Runner
# Edit this code and click "Run" to execute

print("Hello, World!")
print("Try changing this code...")
`);

  const [selectedFile, setSelectedFile] = useState("main.py");
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<ExecutionResult>({ status: "idle" });
  const [showAIReview, setShowAIReview] = useState(false);
  const [aiReview, setAiReview] = useState("");

  const handleRun = async () => {
    setIsRunning(true);
    setResult({ status: "running" });

    try {
      // Simulate execution delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setResult({
        status: "success",
        output: `Hello, World!\nTry changing this code...\n\n✓ Execution completed in 245ms`,
        executionTime: 245,
      });
    } catch (error) {
      setResult({
        status: "error",
        error: "Execution failed: " + String(error),
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleGetAIReview = async () => {
    setShowAIReview(true);
    setAiReview("Loading AI review...");

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setAiReview(`✓ AI Code Review

**Overall**: Good start! The code is clean and readable.

**Suggestions:**
1. Add error handling for edge cases
2. Consider adding type hints for better maintainability
3. Document your functions with docstrings

**Best Practices:**
- Code follows PEP 8 style guidelines ✓
- Functions are appropriately scoped ✓
- Variable names are descriptive ✓

**Performance:**
- Runtime is efficient for this workload ✓
- No obvious bottlenecks detected ✓
`);
    } catch (error) {
      setAiReview("Failed to get AI review: " + String(error));
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur">
        <div className="max-w-full mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-slate-400 hover:text-slate-300 transition">
              ← Back
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center font-bold text-white text-xs">
                ◾
              </div>
              <h1 className="text-lg font-bold text-slate-100">main.py</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">Sandbox: {params.id}</span>
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium transition flex items-center gap-2"
            >
              {isRunning ? (
                <>
                  <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                  Running...
                </>
              ) : (
                <>▶ Run</>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Files */}
        <div className="w-48 border-r border-slate-700 bg-slate-800/30 flex flex-col">
          <div className="px-4 py-3 border-b border-slate-700">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Files</h3>
          </div>

          <div className="flex-1 overflow-y-auto">
            {["main.py", "utils.py", "config.json", "README.md"].map((file) => (
              <button
                key={file}
                onClick={() => setSelectedFile(file)}
                className={`w-full text-left px-4 py-2 text-sm font-medium transition border-l-2 ${
                  selectedFile === file
                    ? "bg-slate-700/50 text-blue-400 border-blue-500"
                    : "text-slate-400 border-transparent hover:text-slate-300 hover:bg-slate-700/20"
                }`}
              >
                {file}
              </button>
            ))}
          </div>

          <div className="px-4 py-3 border-t border-slate-700 space-y-2">
            <button className="w-full px-3 py-1 text-xs rounded bg-slate-700 hover:bg-slate-600 text-slate-300 transition">
              + Add File
            </button>
          </div>
        </div>

        {/* Center - Code Editor */}
        <div className="flex-1 flex flex-col border-r border-slate-700">
          <div className="flex-1 overflow-hidden flex flex-col bg-slate-900">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 px-6 py-4 bg-slate-950 text-slate-100 font-mono text-sm resize-none focus:outline-none border-0"
              placeholder="Write your code here..."
              spellCheck="false"
            />
          </div>

          {/* Editor Footer */}
          <div className="border-t border-slate-700 bg-slate-800/30 px-6 py-2 text-xs text-slate-500 flex justify-between">
            <span>Lines: {code.split("\n").length}</span>
            <span>Language: Python 3.12</span>
          </div>
        </div>

        {/* Right Sidebar - Results & AI Review */}
        <div className="w-64 border-l border-slate-700 bg-slate-800/30 flex flex-col">
          {/* Tabs */}
          <div className="border-b border-slate-700 flex">
            <button
              onClick={() => setShowAIReview(false)}
              className={`flex-1 px-4 py-3 text-xs font-semibold uppercase tracking-wider transition border-b-2 ${
                !showAIReview
                  ? "text-blue-400 border-blue-500"
                  : "text-slate-400 border-transparent hover:text-slate-300"
              }`}
            >
              Output
            </button>
            <button
              onClick={() => setShowAIReview(true)}
              className={`flex-1 px-4 py-3 text-xs font-semibold uppercase tracking-wider transition border-b-2 ${
                showAIReview
                  ? "text-blue-400 border-blue-500"
                  : "text-slate-400 border-transparent hover:text-slate-300"
              }`}
            >
              AI Review
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {!showAIReview ? (
              // Output Tab
              <div>
                {result.status === "idle" && (
                  <div className="text-center py-8">
                    <div className="text-slate-500 text-sm">Run your code to see output</div>
                  </div>
                )}

                {result.status === "running" && (
                  <div className="space-y-2">
                    <div className="text-slate-400 text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                        Executing code...
                      </div>
                    </div>
                  </div>
                )}

                {result.status === "success" && (
                  <div className="space-y-3">
                    <div className="inline-block px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs font-medium">
                      ✓ Success
                    </div>
                    <pre className="bg-slate-950 border border-slate-700 rounded p-3 text-slate-300 text-xs overflow-x-auto">
                      {result.output}
                    </pre>
                    <button
                      onClick={handleGetAIReview}
                      className="w-full mt-3 px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium transition"
                    >
                      🤖 Get AI Review
                    </button>
                  </div>
                )}

                {result.status === "error" && (
                  <div className="space-y-2">
                    <div className="inline-block px-2 py-1 rounded bg-red-500/20 text-red-400 text-xs font-medium">
                      ✗ Error
                    </div>
                    <pre className="bg-slate-950 border border-red-900/50 rounded p-3 text-red-400 text-xs overflow-x-auto">
                      {result.error}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              // AI Review Tab
              <div>
                {aiReview === "Loading AI review..." ? (
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <div className="w-3 h-3 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                    Loading...
                  </div>
                ) : (
                  <div className="space-y-3 text-xs">
                    <pre className="text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">
                      {aiReview}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
