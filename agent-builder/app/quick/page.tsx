import Link from "next/link";
import { AgentForm } from "@/components/AgentForm";

export const metadata = {
  title: "Quick Builder — Agent Builder",
  description: "Configure a single agent's model, tools, and prompt, then export the config.",
};

export default function QuickBuilderPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="border-b border-gray-200 bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quick Builder</h1>
            <p className="text-gray-600 mt-1">
              Configure an agent&apos;s model, tools, and prompt — then export the config.
            </p>
          </div>
          <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
            ← Home
          </Link>
        </div>
      </header>

      <main className="py-12">
        <AgentForm />
      </main>

      <footer className="border-t border-gray-200 bg-white mt-20">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center text-gray-600 text-sm">
          <p>Quick Builder · Configure, visualize, and export a single agent</p>
        </div>
      </footer>
    </div>
  );
}
