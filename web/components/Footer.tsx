import { brand } from "@/lib/brand";

export function Footer() {
  return (
    <footer className="relative mx-auto max-w-7xl px-6 pb-16 pt-12">
      <div className="hairline mb-10" />
      <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <span className="relative flex h-7 w-7 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-plasma-500/20 blur-md" />
            <svg viewBox="0 0 24 24" className="relative h-5 w-5 text-plasma-400" fill="none" stroke="currentColor" strokeWidth={1.6}>
              <path d="M2 12 L7 12 L9 6 L12 18 L15 9 L17 12 L22 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <div>
            <p className="font-display text-lg text-bone-50">{brand.name}</p>
            <p className="text-xs text-bone-200/40">{brand.tagline}.</p>
          </div>
        </div>
        <div className="flex items-center gap-6 text-xs text-bone-200/40">
          <span className="font-mono uppercase tracking-widest">handcrafted · v0.1</span>
          <a href="#" className="transition hover:text-bone-50">top ↑</a>
        </div>
      </div>
    </footer>
  );
}
