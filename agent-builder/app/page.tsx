export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-4">Agent Builder</h1>
        <p className="text-xl text-gray-300 mb-8">
          Build and deploy AI agents in minutes
        </p>
        <button className="px-8 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition">
          Get Started
        </button>
      </div>
    </main>
  );
}
