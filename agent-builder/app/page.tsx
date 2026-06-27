export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-4">Agent Builder</h1>
        <p className="text-xl text-gray-300 mb-8">
          Build and deploy AI agents in minutes
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a href="/content-engine" className="px-8 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition">
            Content Engine
          </a>
          <a href="/dashboard" className="px-8 py-3 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition">
            Dashboard
          </a>
        </div>
      </div>
    </main>
  );
}
