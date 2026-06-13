'use client';

export default function Navigation() {
  return (
    <nav className="border-b border-accent/20 bg-base/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full bg-accent"
            style={{
              background:
                'linear-gradient(135deg, var(--color-accent) 0%, var(--color-base) 100%)',
            }}
          />
          <h1 className="text-lg font-serif font-bold">Events</h1>
        </div>
        <div className="text-sm opacity-60">Discover · Create · Connect</div>
      </div>
    </nav>
  );
}
