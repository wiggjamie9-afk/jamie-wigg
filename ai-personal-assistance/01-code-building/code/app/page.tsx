import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">
              ◾
            </div>
            <h1 className="text-xl font-bold text-slate-100">Sandbox Runner</h1>
          </div>
          <Link
            href="/auth/signup"
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
          >
            Try Free
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="max-w-3xl text-center">
          <h2 className="text-5xl font-bold text-slate-100 mb-6 leading-tight">
            Run Code Safely in Seconds
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Isolated sandboxes. No setup. AI feedback on your code.
          </p>
          <div className="bg-slate-800 rounded-lg p-6 mb-12 border border-slate-700 text-left">
            <pre className="text-sm text-slate-300 overflow-x-auto">
              <code>{`import asyncio
from opensandbox import Sandbox

async def main():
    sandbox = await Sandbox.create("python:3.12")
    result = await sandbox.commands.run("print('hello')")
    print(result.logs.stdout[0].text)

asyncio.run(main())`}</code>
            </pre>
          </div>

          <div className="flex gap-4 justify-center mb-16">
            <Link
              href="/onboarding"
              className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
            >
              Get Started Free
            </Link>
            <Link
              href="/auth/login"
              className="px-8 py-3 rounded-lg border border-slate-600 hover:border-slate-500 text-slate-300 font-semibold transition"
            >
              Sign In
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-20">
            <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-semibold text-slate-100 mb-2">No Setup</h3>
              <p className="text-sm text-slate-400">Run Python, Node, Ruby, Go, Rust — no Docker on your machine</p>
            </div>
            <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700">
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="font-semibold text-slate-100 mb-2">Isolated</h3>
              <p className="text-sm text-slate-400">Each sandbox is sandboxed. Run untrusted code safely</p>
            </div>
            <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700">
              <div className="text-3xl mb-3">🤖</div>
              <h3 className="font-semibold text-slate-100 mb-2">AI Review</h3>
              <p className="text-sm text-slate-400">Get instant feedback on architecture, errors, best practices</p>
            </div>
            <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700">
              <div className="text-3xl mb-3">📁</div>
              <h3 className="font-semibold text-slate-100 mb-2">File I/O</h3>
              <p className="text-sm text-slate-400">Read and write files in your sandbox</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-800/30 py-6 px-6">
        <div className="max-w-6xl mx-auto text-center text-sm text-slate-400">
          <p>Built with OpenSandbox + Claude API</p>
        </div>
      </footer>
    </div>
  );
}
